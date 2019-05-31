# Tutorial: Improving a Protocol

This is an extension of <a href="#" onclick="select('Protocols', 'Creating a Protocol')">the tutorial on writing protocols</a>.
If you haven't gone through that tutorial, you may want to start there.

_This document is evolving, please share feedback._

## The StreakPlate Protocol

In the previous tutorial, we constructed a Streak Plate protocol from this simple protocol outline

    1. Get the glycerol stock and a fresh agar plate.
    2. Streak the plate
    3. Store the glycerol stock and the streaked plate.

That protocol showed how to use stepwise refinement with the Krill protocol language to construct a protocol that executes a set of streak plate operations and tracks the glycerol stocks and the resulting streaked agar plates.
The resulting protocol code is

```ruby
class Protocol
  def main
    operations.retrieve  # locate required items and display instructions to get them
    operations.make      # create items for the outputs

    operations.each do |operation|
      operation_task(operation)
    end

    operations.store    # move everything where it belongs
  end

  # Perform the Streak Plate protocol for a single operation
  #
  # @param operation [Operation] the operation to be executed
  def operation_task(operation)
    # Declare references to input/output objects
    input_stock = operation.input('glycerol_stock').item
    output_plate = operation.output('plate').item
    # Display provisioning instructions
    show do
      title 'Get a fresh agar plate'
      check "Get a fresh agar plate and label it #{output_plate.id}"
    end

    # Display instructions for streaking the plate
    show do
      title 'Streak the plate'
      check "Spot the plate #{output_plate.id} from the glycerol stock #{input_stock.id}"
      check 'Allow the spots on the plate to dry'
      check "Streak-out the spotted plate #{output_plate.id} with the pipette"
    end

    # Move the plate to the incubator
    output_plate.move('incubator')
  end
end
```

## Redesigning the protocol

If you run a plan with more than one `StreakPlate` operation, you'll see that the way that we have written our protocol repeats some common steps.
The protocol we have now is essentially

    For each operation:
       1. Get the glycerol stock and a fresh agar plate.
       2. Streak the plate
       3. Store the glycerol stock and the streaked plate.

Imagine running this for several operations that happen to use same glycerol stock.
The protocol would tell the technician to go get the glycerol stock, streak the plate, put the glycerol stock back, and then go get the glycerol stock again to do the next operation.
The technician is going to very quickly start optimizing the steps, and not follow the protocol, a situation we want to avoid.

The strategy to deal with this is be to group the operations by glycerol stock, so that the technician can get each glycerol stock and then streak all the plates requested for that stock.
Another optimization is to get all the necessary plates before starting to avoid getting a single plate for each iteration.

    1. Get one fresh agar plate for each operation
    2. For each glycerol stock
       1. Get glycerol stock
       2. For each operation using the glycerol stock, label a plate and spot from glycerol stock
       3. Allow plates to dry
       4. Streak each plate
       5. Store glycerol stock
    3. Store the plates

Now that we have a sketch of our revised protocol, we can gradually transform the existing protocol code to match the new design.

### Reorganizing the protocol code

Step 2 of the new protocol operates on batches of operations in a way that is a revision of the current `main` method.
So, before we change the `main` method, let's start by moving the body of the `main` method to a new `streak_from_glycerol_stock` method.

```ruby
# Performs the streak plate protocol for a list of operations that all use the
# given glycerol stock.
#
# @param glycerol_stock [Item] the glycerol stock
# @param operations     [OperationList] the list of operations
def streak_from_glycerol_stock(glycerol_stock, operations)
  operations.retrieve  # locate required items and display instructions to get them
  operations.make      # create items for the outputs

  operations.each do |operation|
    operation_task(operation)
  end

  operations.store    # move everything where it belongs
end
```

With the main method is now empty, we add comments for the top-level steps of our new protocol, so that we have placeholders to refine the protocol:

```ruby
def main
# 1. Get agar plate for each operation
# 2. For each glycerol stock, streak plates
# 3. Store the plates
end
```

As we saw in the first tutorial, we can define any of these steps in whatever order we want.

Most the work is done in step 2, so let's start by figuring out how the protocol will use the new `streak_from_glycerol_stock` method.
The method takes a glycerol stock and a list of operations that use the glycerol stock as an input.
This means we need to reorganize the operations by the `glycerol_stock` input, which we can do with a call to `operations.group_by`:

```ruby
operations.group_by {|operation| operation.input('glycerol_stock').item }
```

This call to the `group_by` method will produce a Ruby hash map that organizes the operations by the glycerol stock item they take as input.
The useful part is that the hash map allows us to visit each of the groups separately.
However, the details of the method call involve some Ruby cleverness that is a little unclear unless you know what is going on, so to make the code a little more readable, we can wrap this method call in a method named to say what is happening:

```ruby
# Group the operations in the list by the `glycerol_stock` input.
# Returns a hash map with the glycerol stock items as keys and lists of
# operations as values
#
# @param operations [OperationList]  the list of operations
# @return [Hash]  a map from glycerol stock item to list of operations
def group_by_glycerol_stock(operations)
  operations.group_by {|operation| operation.input('glycerol_stock').item }
end
```

Now, we can do something like this

```ruby
ops_by_stock = group_by_glycerol_stock(operations)
ops_by_stock.each do |glycerol_stock, group|
  # do something with the operations in the group
end
```

where, for this protocol, we want to call the `streak_from_glycerol_stock` method.

The `main` method now looks like

```ruby
def main
  # 1. Get one agar plate for each operation
  # 2. For each glycerol stock, streak plates
  ops_by_stock = group_by_glycerol_stock(operations)
  ops_by_stock.each do |glycerol_stock, group|
    streak_from_glycerol_stock(glycerol_stock, group)
  end
  # 3. Store the plates
end
```

For step 1, the technician just needs to get enough plates to complete all of the operations.
We can do this with a simple show block, but we'll wrap it in a method like this:

```ruby
# Provision a fresh agar plate for each operation in the given list.
  #
  # @param operations [OperationList] the list of operations
  def get_plates(count)
    show do
      title "Get fresh agar plates"
      check "Please get #{count} agar plates"
    end
  end
```

and add the call to the main method

```ruby
def main
  # 1. Get one agar plate for each operation
  get_plates(operations.length)

  # 2. For each glycerol stock, streak plates
  ops_by_stock = group_by_glycerol_stock(operations)
  ops_by_stock.each do |glycerol_stock, group|
    streak_from_glycerol_stock(glycerol_stock, group)
  end

  # 3. Store the plates
end
```

Now we only have step 3 that we haven't considered.
We could do this step with a call to `operations.store`.
All of the changes so far give us the protocol

```ruby
class Protocol
  def main
    # 1. Get one agar plate for each operation
    get_plates(operations.length)

    # 2. For each glycerol stock, streak plates
    ops_by_stock = group_by_glycerol_stock(operations)
    ops_by_stock.each do |glycerol_stock, group|
      streak_from_glycerol_stock(glycerol_stock, group)
    end

    # 3. Store the plates
  end

  # Provision the indicated number of fresh agar plates
  #
  # @param count [Integer] the number of plates
  def get_plates(count)
    show do
      title "Get fresh agar plates"
      check "Please get #{count} agar plates"
    end
  end

  # Group the operations in the list by the `glycerol_stock` input.
  # Returns a hash map with the glycerol stock items as keys and lists of
  # operations as values
  #
  # @param operations [OperationList]  the list of operations
  # @return [Hash]  a map from glycerol stock item to list of operations
  def group_by_glycerol_stock(operations)
    operations.group_by {|operation| operation.input('glycerol_stock').item }
  end

  # Performs the streak plate protocol for a list of operations that all use the
  # given glycerol stock.
  #
  # @param glycerol_stock [Item] the glycerol stock
  # @param operations     [OperationList] the list of operations
  def streak_from_glycerol_stock(glycerol_stock, operations)
    operations.retrieve  # locate required items and display instructions to get them
    operations.make      # create items for the outputs

    operations.each do |operation|
      operation_task(operation)
    end

    operations.store    # move everything where it belongs
  end

  # Perform the Streak Plate protocol for a single operation
  #
  # @param operation [Operation] the operation to be executed
  def operation_task(operation)
    # Declare references to input/output objects
    input_stock = operation.input('glycerol_stock').item
    output_plate = operation.output('plate').item
    # Display provisioning instructions
    show do
      title 'Get a fresh agar plate'
      check "Get a fresh agar plate and label it #{output_plate.id}"
    end

    # Display instructions for streaking the plate
    show do
      title 'Streak the plate'
      check "Spot the plate #{output_plate.id} from the glycerol stock #{input_stock.id}"
      check 'Allow the spots on the plate to dry'
      check "Streak-out the spotted plate #{output_plate.id} with the pipette"
    end

    # Move the plate to the incubator
    output_plate.move('incubator')
  end
end
```

Add `operations.store` on the line after the step 3 comment in `main` and then run the protocol on the test tab.
This gives two screens with the text

> **Return the Following Additional Item(s)**<br>
> Item 23 at Bench<br>
> Item 24 at incubator

The first screen comes from the `operations.store` in `streak_from_glycerol_stock` and the second from the one in `main`.
We definitely don't need both to move both items – let's have `streak_from_glycerol_stock` return the glycerol stock, and then move all of the plates to the incubator when the protocol ends.
To do this change the calls to `operations.store`.
In `streak_from_glycerol_stock`, change `operations.store` to

```ruby
operations.store(interactive: true, io: 'input', method: 'boxes')
```

which will print instructions to return the glycerol stock.
And, in `main`, change `operations.store` to

```ruby
operations.store(interactive:true, io: 'output', method: 'boxes')
```

which will print instructions to move all of the plates to the incubator.

So, finally, our protocol code is this

```ruby
class Protocol
  def main
    # 1. Get one agar plate for each operation
    get_plates(operations.length)

    # 2. For each glycerol stock, streak plates
    ops_by_stock = group_by_glycerol_stock(operations)
    ops_by_stock.each do |glycerol_stock, group|
      streak_from_glycerol_stock(glycerol_stock, group)
    end

    # 3. Store the plates
    operations.store(interactive:true, io: 'output', method: 'boxes')
  end

  # Provision a fresh agar plate for each operation in the given list.
  #
  # @param operations [OperationList] the list of operations
  def get_plates(count)
    show do
      title "Get fresh agar plates"
      check "Please get #{count} agar plates"
    end
  end

  # Group the operations in the list by the `glycerol_stock` input.
  # Returns a hash map with the glycerol stock items as keys and lists of
  # operations as values
  #
  # @param operations [OperationList]  the list of operations
  # @return [Hash]  a map from glycerol stock item to list of operations
  def group_by_glycerol_stock(operations)
    operations.group_by {|operation| operation.input('glycerol_stock').item }
  end

  # Performs the streak plate protocol for a list of operations that all use the
  # given glycerol stock.
  #
  # @param glycerol_stock [Item] the glycerol stock
  # @param operations     [OperationList] the list of operations
  def streak_from_glycerol_stock(glycerol_stock, operations)
    operations.retrieve  # locate required items and display instructions to get them
    operations.make      # create items for the outputs

    operations.each do |operation|
      operation_task(operation)
    end

    # return the glycerol stock
    operations.store(interactive: true, io: 'input', method: 'boxes')
  end

  # Perform the Streak Plate protocol for a single operation
  #
  # @param operation [Operation] the operation to be executed
  def operation_task(operation)
    # Declare references to input/output objects
    input_stock = operation.input('glycerol_stock').item
    output_plate = operation.output('plate').item
    # Display provisioning instructions
    show do
      title 'Get a fresh agar plate'
      check "Get a fresh agar plate and label it #{output_plate.id}"
    end

    # Display instructions for streaking the plate
    show do
      title 'Streak the plate'
      check "Spot the plate #{output_plate.id} from the glycerol stock #{input_stock.id}"
      check 'Allow the spots on the plate to dry'
      check "Streak-out the spotted plate #{output_plate.id} with the pipette"
    end

    # Move the plate to the incubator
    output_plate.move('incubator')
  end
end
```

### Interleaving operations

We now have our protocol code structured in the same way as our new protocol

    1. Get one fresh agar plate for each operation
    2. For each glycerol stock
       1. Get glycerol stock
       2. For each operation using the glycerol stock, label a plate and spot from glycerol stock
       3. Allow plates to dry
       4. Streak each plate
       5. Store glycerol stock
    3. Store the plates

However, the `operation_task` method that does steps 2.2-2.4 is organized differently; it deals with each operation one by one instead of interleaving the steps.

Let's start by changing `streak_from_glycerol_stock` to remove the `each` that visits each operation one-at-a-time, and replace it by comments with the steps from our new protocol:

```ruby
# Performs the streak plate protocol for a list of operations that all use the
# given glycerol stock.
#
# @param glycerol_stock [Item] the glycerol stock
# @param operations     [OperationList] the list of operations
def streak_from_glycerol_stock(glycerol_stock, operations)
  operations.retrieve  # locate required items and display instructions to get them
  operations.make      # create items for the outputs

  # 2. Label a plate and spot from glycerol stock
  # 3. Allow plates to dry
  # 4. Streak each plate

  # return the glycerol stock
  operations.store(interactive: true, io: 'input', method: 'boxes')
end
```

To figure out what we need to do to refine these version, let's look at the `operation_task` method.

```ruby
# Perform the Streak Plate protocol for a single operation
#
# @param operation [Operation] the operation to be executed
def operation_task(operation)
  # Declare references to input/output objects
  input_stock = operation.input('glycerol_stock').item
  output_plate = operation.output('plate').item
  # Display provisioning instructions
  show do
    title 'Get a fresh agar plate'
    check "Get a fresh agar plate and label it #{output_plate.id}"
  end

  # Display instructions for streaking the plate
  show do
    title 'Streak the plate'
    check "Spot the plate #{output_plate.id} from the glycerol stock #{input_stock.id}"
    check 'Allow the spots on the plate to dry'
    check "Streak-out the spotted plate #{output_plate.id} with the pipette"
  end

  # Move the plate to the incubator
  output_plate.move('incubator')
end
```

Our goal is to reorganize these steps so that they are performed for all of the operations before moving on to the next step.
We can do this by making new methods that deal with each of these new steps, but we need to make sure that each `check` directive ends up in the show blocks that we add.

The first new step we are adding will grab an agar plate, label it, and spot it from the glycerol stock.
This pulls the step from the first show block, and the first step of the second in the `operation_task` method into one place:

```ruby
# Spots the plate from the glycerol stock.
#
# Gets an agar plate and labels it as the given plate, and then spots the plate
# from the glycerol stock.
#
# @param plate [Item] the item for the plasmid plate
# @param glycerol_stock [Item] the item for the glycerol stock
def spot_plate(plate, glycerol_stock)
  show do
    title "Spot a plate from #{glycerol_stock}"
    check "Get a fresh agar plate and label it #{plate.id}"
    check "Spot the plate #{plate.id} from the glycerol stock #{glycerol_stock.id}"
  end
end

# Spots all of the output plates with the glycerol stocks.
#
# Gets new agar plates, labels and spots them from the glycerol stock.
#
# @param operations [OperationsList] the operations
# @param glycerol_stock [Item] the glycerol stock
def spot_plates(operations, glycerol_stock)
  operations.each do |operation|
    spot_plate(operation.output('plate').item, glycerol_stock)
  end
end
```

The second new step just let's the plates dry:

```ruby
# Dry the spotted plates
#
# @param operations [OperationList] the list of operations
def dry_plates(operations)
  show do
    title 'Dry Plates'
    check 'Allow the spots on the plates to dry'
  end
end
```

And, the third streaks out each spotted plate:

```ruby
# Streak-out the spotted plates that are outputs for each operation.
#
# @param operations [OperationList] the list of operations
def streak_plates(operations)
  operations.each do |operation|
    plate = operation.output('plate').item
    show do
      title 'Streak the plate'
      check "Streak-out the spotted plate #{plate.id} with the pipette"
    end
  end
end
```

Let's check that we haven't lost anything.
We had four different `check`-directives before, and each occurs in the new code.
However, we neglected the `output_plate.move('incubator')` command, which we can put into its own method:

```ruby
# Move all of the plates for the operations to the incubator.
#
# @param operations [OperationList] the list of operations
def move_plates(operations)
  operations.each do |operation|
    plate = operation.output('plate').item
    plate.move('incubator')
  end
end
```

And, then we call it at the end of `streak_from_glycerol_stock`.

All of these changes give us the new protocol below

```ruby
class Protocol
  def main
    # 1. Get one agar plate for each operation
    get_plates(operations.length)

    # 2. For each glycerol stock, streak plates
    ops_by_stock = group_by_glycerol_stock(operations)
    ops_by_stock.each do |glycerol_stock, group|
      streak_from_glycerol_stock(glycerol_stock, group)
    end

    # 3. Store the plates
    operations.store(interactive:true, io: 'output', method: 'boxes')
  end

  # Provision a fresh agar plate for each operation in the given list.
  #
  # @param operations [OperationList] the list of operations
  def get_plates(count)
    show do
      title "Get fresh agar plates"
      check "Please get #{count} agar plates"
    end
  end

  # Group the operations in the list by the `glycerol_stock` input.
  # Returns a hash map with the glycerol stock items as keys and lists of
  # operations as values
  #
  # @param operations [OperationList]  the list of operations
  # @return [Hash]  a map from glycerol stock item to list of operations
  def group_by_glycerol_stock(operations)
    operations.group_by {|operation| operation.input('glycerol_stock').item }
  end

  # Performs the streak plate protocol for a list of operations that all use the
  # given glycerol stock.
  #
  # @param glycerol_stock [Item] the glycerol stock
  # @param operations     [OperationList] the list of operations
  def streak_from_glycerol_stock(glycerol_stock, operations)
    operations.retrieve  # locate required items and display instructions to get them
    operations.make      # create items for the outputs

    # 2. Label a plate and spot from glycerol stock
    spot_plates(operations, glycerol_stock)
    # 3. Allow plates to dry
    dry_plates(operations)
    # 4. Streak each plate
    streak_plates(operations)

    # return the glycerol stock
    operations.store(interactive: true, io: 'input', method: 'boxes')
    # Move the plate to the incubator
    move_plates(operations)
  end

  # Spots the plate from the glycerol stock.
  #
  # Gets an agar plate and labels it as the given plate, and then spots the plate
  # from the glycerol stock.
  #
  # @param plate [Item] the item for the plasmid plate
  # @param glycerol_stock [Item] the item for the glycerol stock
  def spot_plate(plate, glycerol_stock)
    show do
      title "Spot a plate from #{glycerol_stock}"
      check "Get a fresh agar plate and label it #{plate.id}"
      check "Spot the plate #{plate.id} from the glycerol stock #{glycerol_stock.id}"
    end
  end

  # Spots all of the output plates with the glycerol stocks.
  #
  # Gets new agar plates, labels and spots them from the glycerol stock.
  #
  # @param operations [OperationsList] the operations
  # @param glycerol_stock [Item] the glycerol stock
  def spot_plates(operations, glycerol_stock)
    operations.each do |operation|
      spot_plate(operation.output('plate').item, glycerol_stock)
    end
  end

  # Dries spotted plates
  #
  # @param operations [OperationList] the operations to create plates
  def dry_plates(operations)
    show do
      title 'Dry Plates'
      check 'Allow the spots on the plates to dry'
    end
  end

  # Streaks-out spotted plates
  #
  # @param operations [OperationList] the operations creating plates
  def streak_plates(operations)
    operations.each do |operation|
      plate = operation.output('plate').item
      show do
        title 'Streak the plate'
        check "Streak-out the spotted plate #{plate.id} with the pipette"
      end
    end
  end

  # Move all of the plates for the operations to the incubator.
  #
  # @param operations [OperationList] the list of operations
  def move_plates(operations)
    operations.each do |operation|
      plate = operation.output('plate').item
      plate.move('incubator')
    end
  end
end
```

## Refining the Interactions

Before we can see what changes we might want to make, we really need some new samples and items.
So, add another `dummy_plasmid` item on the Samples tab.

We want to test a scenario where we have more than one operation with the same glycerol stock.
Since the developer test tab will generate new items for each operation, running a test is not going to show us what we want to see.
(There are ways to deal with this by writing `debug` code in the protocol, but we will leave that for another time.)
So, click on the Designer tab and create a new plan with three `StreakPlate` operations, and set the input of all three to `dummy_plasmid`.
We have two `dummy_plasmid` items in the inventory; make sure that two of the operations use the same item as the input, and the other uses the unused item.
Save the plan as `StreakPlate mixed input` just to distinguish it from other runs, and then launch the plan.
The steps will be a little different than what you saw before, because there are now three operations, just be sure to select all of them before scheduling.

What you should observe is that the protocol asks you to get one glycerol stock, spots two plates, returns the glycerol stock, and then has you do the steps for the other glycerol stock.
The key detail is that there is one page per streak plate (really, per operation) for each step.
As a user, this is a bit tedious, so let's make each step that does something per operation use a single page.
One way to do this is by using a table in `spot_plates`

```ruby
def spot_plates(operations, glycerol_stock)
  show do
    title "Spot a plate from #{glycerol_stock}"
    note "Get a fresh agar plate and label it with the plate ID and spot it from the glycerol stock #{glycerol_stock}"
    table operations.start_table
                    .output_item('plate', heading: 'Plate ID', checkable: true)
                    .input_item('glycerol_stock', heading: 'Streak From')
                    .end_table
  end
end
```

Now all of the required new plates are listed, and each has to be clicked before the technician can move on.
Also, the glycerol stock is identified in the table just to be clear.
Notice we no longer call `spot_plate(plate, glycerol_stock)` and can get rid of it.
We can do the same with `streak_plates`

```ruby
def streak_plates(operations)
  show do
    title 'Streak the plate'
    check "Streak-out each spotted plate with the pipette"
    table operations.start_table
                    .output_item('plate', heading: 'Plate ID', checkable: true)
                    .end_table
  end
end
```

The full protocol is now

```ruby
class Protocol
  def main
    # 1. Get one agar plate for each operation
    get_plates(operations.length)

    # 2. For each glycerol stock, streak plates
    ops_by_stock = group_by_glycerol_stock(operations)
    ops_by_stock.each do |glycerol_stock, group|
      streak_from_glycerol_stock(glycerol_stock, group)
    end

    # 3. Store the plates
    operations.store(interactive:true, io: 'output', method: 'boxes')
  end

  # Provision a fresh agar plate for each operation in the given list.
  #
  # @param operations [OperationList] the list of operations
  def get_plates(count)
    show do
      title "Get fresh agar plates"
      check "Please get #{count} agar plates"
    end
  end

  # Group the operations in the list by the `glycerol_stock` input.
  # Returns a hash map with the glycerol stock items as keys and lists of
  # operations as values
  #
  # @param operations [OperationList]  the list of operations
  # @return [Hash]  a map from glycerol stock item to list of operations
  def group_by_glycerol_stock(operations)
    operations.group_by {|operation| operation.input('glycerol_stock').item }
  end

  # Performs the streak plate protocol for a list of operations that all use the
  # given glycerol stock.
  #
  # @param glycerol_stock [Item] the glycerol stock
  # @param operations     [OperationList] the list of operations
  def streak_from_glycerol_stock(glycerol_stock, operations)
    operations.retrieve  # locate required items and display instructions to get them
    operations.make      # create items for the outputs

    # 2. Label a plate and spot from glycerol stock
    spot_plates(operations, glycerol_stock)
    # 3. Allow plates to dry
    dry_plates(operations)
    # 4. Streak each plate
    streak_plates(operations)

    # return the glycerol stock
    operations.store(interactive: true, io: 'input', method: 'boxes')
    # Move the plate to the incubator
    move_plates(operations)
  end

  # Spots all of the output plates with the glycerol stocks.
  #
  # Gets new agar plates, labels and spots them from the glycerol stock.
  #
  # @param operations [OperationsList] the operations
  # @param glycerol_stock [Item] the glycerol stock
  def spot_plates(operations, glycerol_stock)
    show do
      title "Spot a plate from #{glycerol_stock}"
      note "Get a fresh agar plate and label it with the plate ID and spot it from the glycerol stock #{glycerol_stock}"
      table operations.start_table
                      .output_item('plate', heading: 'Plate ID', checkable: true)
                      .input_item('glycerol_stock', heading: 'Streak From')
                      .end_table
    end
  end

  # Dries spotted plates
  #
  # @param operations [OperationList] the operations to create plates
  def dry_plates(operations)
    show do
      title 'Dry Plates'
      check 'Allow the spots on the plates to dry'
    end
  end

  # Streaks-out spotted plates
  #
  # @param operations [OperationList] the operations creating plates
  def streak_plates(operations)
    show do
      title 'Streak the plate'
      note "Streak-out each spotted plate with the pipette"
      table operations.start_table
                      .output_item('plate', heading: 'Plate ID', checkable: true)
                      .end_table
    end
  end

  # Move all of the plates for the operations to the incubator.
  #
  # @param operations [OperationList] the list of operations
  def move_plates(operations)
    operations.each do |operation|
      plate = operation.output('plate').item
      plate.move('incubator')
    end
  end
end
```

## Learning More

You can go deeper into topics covered in this tutorial with these pages:

- <a href="#" onclick="select('Protocols', 'Operations')">Working with operations</a>
- <a href="#" onclick="select('Protocols', 'Building Tables')">Tables</a>

Referring to the <a href="#" onclick="select('Protocols', 'Detailed API Reference')">API Reference</a> may also be helpful.
