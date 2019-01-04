# Protocol Tutorial

This is an introduction to writing protocols for Aquarium in the Krill domain specific language.
We try to introduce the most common (and recommended) patterns in Krill, but this is not a comprehensive reference.
See the [API documentation](http://klavinslab.org/aquarium/api/) for more details on the functions that Krill provides.

---

## An Aquarium Protocol

A protocol in Aquarium defines an action that can be planned by a researcher designing an experiment.
In the lab, the protocol translates to a series of steps that are to be performed to complete the action.

If you are coming from a background where you have written or worked from a typical paper protocol, an Aquarium protocol is more detailed.
The protocol may correspond to a single step of a paper protocol – such as streaking an agar plate with e. coli – but elaborates the details needed to ensure the protocol is performed as consistently as possible.
When deciding what protocols to make, a rule of thumb is that a protocol should be something that can be done in one session at the bench though see **BLAH** for more detailed discussion.

## An Initial Protocol

Let's look more closely at streaking a plate.
Most protocols first provision what is needed, perform the action of the protocol, and finally store or discard the items used or created.
From this perspective, our protocol for streaking plate has the top-level steps:

1. Get the glycerol stock and a fresh agar plate.
2. Streak the plate
3. Store the glycerol stock and the streaked plate.

For our initial protocol, we will just have a series of screens with these steps as titles:

```ruby
# A simple Aquarium protocol for streaking an agar plate from an
# e. coli glycerol stock
class Protocol
  def main
    # Display provisioning instructions
    show do
      title 'Get the glycerol stock and a fresh agar plate'
    end

    # Display instructions for streaking the plate
    show do
      title 'Streak the plate'
    end

    # Display instructions for storing items when done
    show do
      title 'Store the glycerol stock and the streaked plate'
    end
  end
end
```

Some of this is just Ruby boilerplate (code that is always used) including the Ruby class named `Protocol` with the method `main` method, but the `show` blocks define the screens that are displayed.

Let's try running this protocol in Aquarium to understand better how this works.

## Running the Protocol

To understand better what is happening, you should [set up an Aquarium instance on your personal machine](link-to-installation) to follow along.
Our advice is that you **not** use your lab's server to learn.

### Creating a Protocol

1.  Starting from the developer tab, click the **New** button in the upper right corner.

2.  Change the operation type name to `StreakPlate`, the category to `tutorial`, and click the **Save** button.

3.  Click **Protocol**, replace the template code in our example, and click the **Save** button at the bottom right.

### Running a Protocol from the Developer Test Tab

The simplest way to run our protocol is by using testing in the Developer Tab.

1.  Click **Test**

2.  Click the **Generate Operations** button to generate instances of the operation type with random inputs.

3.  Click the **Test** button to run the operation(s) with the inputs and show the trace with any output

When the test finishes, you should see a backtrace with each of the page titles displayed.

### Running a Deployed Protocol

To run the protocol so that it will show you the screens as the technician will see them:

1.  In the Developer **Def** view, click the **Deployed** checkbox

2.  Click the **Designer** tab at the top of the page, click _Design_, and then choose your category under _Operation Types_

3.  Click the operation type name `StreakPlate` to add the operation to the plan

4.  Save the plan, and then click **Launch**. You'll have to select and confirm your budget, and click _Submit_

5.  Select the **Manager** tab, and click your category in the list on the left.

6.  Click the pending job for `StreakPlate`, click the _All_ button and click _Schedule_

7.  Click the pending ID under **Jobs**

8.  Click _Start_

9.  Use the buttons in the Technician view to move through the protocol.

    Click **OK** will move to the next slide.
    After the last page, the protocol will end.

## Refining the protocol

The initial protocol is not very detailed, but it shows the basic framework of what the protocol should ultimately do.
To build the protocol, we can refine each of the steps individually, by adding detail.
Refining the steps that _get_ and _store_ items requires that we make (or have made) decisions about how things are stored in the lab, so let's postpone those decisions.
Instead, let's elaborate what we mean to streak the plate to these steps:

1. Spot the plate from the glycerol stock
2. Allow the spots on the plate to dry
3. Streak-out the spotted plate with the pipette

Eventually, we will want to add even more detail about how to do each of these steps, but for now we can add these to `Streak the plate` show block:

```ruby
# A simple Aquarium protocol for streaking a plate from an e. coli
# glycerol stock
class Protocol
  def main
    # Display provisioning instructions
    show do
      title 'Get the glycerol stock and a fresh agar plate'
    end

    # Display instructions for streaking the plate
    show do
      title 'Streak the plate'
      check 'Spot the plate from the glycerol stock'
      check 'Allow the spots on the plate to dry'
      check 'Streak-out the spotted plate with the pipette'
    end

    # Display instructions for storing/disposing of items
    show do
      title 'Store the glycerol stock and the streaked plate'
    end
  end
end
```

Because the new steps occur in the second show block preceded by `check`, the second page of the protocol now shows a check-list containing the new steps.
For this page, the technician must check each box in order to be able to click **OK** to indicate they are done with the page.

When creating a new protocol, we wont just refine individual steps that we had added before, but may realize that we've left out steps, or that what we've done only works in special cases and needs to be changed.
For instance, we probably want to give instructions to setup and clean-up the workspace.
However, we can postpone decisions until we absolutely need to make them, and should try to add or change one thing at a time to avoid mistakes.
So, we can postpone making decisions about setup/clean-up until we know more about how the protocol will be performed and what resources are required.

## How Aquarium Works: The Basics

The idea behind Aquarium is that a researcher can create a plan consisting of operations, each of which is carried out in the lab using the protocol for that operation.
Each operation takes some inputs and generates outputs, and the plan links operations so that an input of one operation is an output of another.

When a plan is run, operations for which inputs are available (and whose preconditions are true) can be run, and are shown as _pending_ on the manager screen.
The manager then selects a set of operations to be scheduled together as a _job_, and a technician follows the protocol to handle that batch of operations.

## A Protocol that can be used

So, our protocol is not really using Aquarium the way that it is intended:

1. there are no explicit inputs and outputs, and
2. it is not organized around servicing operations.

Let's deal with each of these, starting with operations.

### Handling Operations

The way that a protocol accesses the operations in the job is to use the name `operations`.
This identifier refers to a list of operations that can be visited one at a time like this

```ruby
operations.each do |operation|
  operation_task(operation)
end
```

So, let's refactor our code so that the `main` method does exactly this, and the `operation_task` method consists of the show blocks from before

```ruby
class Protocol
  def main
    operations.each do |operation|
      operation_task(operation)
    end
  end

  # Perform the Streak Plate protocol for a single operation
  #
  # @param operation [Operation] the operation to be executed
  def operation_task(operation)
    # Display provisioning instructions
    show do
      title 'Get the glycerol stock and a fresh agar plate'
    end

    # Display instructions for streaking the plate
    show do
      title 'Streak the plate'
      check 'Spot the plate from the glycerol stock'
      check 'Allow the spots on the plate to dry'
      check 'Streak-out the spotted plate with the pipette'
    end

    # Display instructions for storing/disposing of items
    show do
      title 'Store the glycerol stock and the streaked plate'
    end
  end
end
```

Now, if you run a plan with a single operation, it should behave as before.
(But, what happens if you add two or more operations?)

### Declaring Inputs and Outputs

We are going to add an input named `glycerol_stock` and an output named `plate`.

1. Select the **Def** (definition) tab on the Aquarium Developer page for the `StreakPlate` protocol.

2. Click the **Add Input** button, and then type `glycerol_stock` in the name field and `plasmid` in the routing ID field.

3. Click the **Add Output** button, and type `plate` in the name field and `plasmid` in the routing ID field.

### Using Inputs and Outputs

Now that we have reorganized the protocol to access the operations, and the inputs and outputs are declared, we can refer to the `glycerol_stock` input as `operation.input('glycerol_stock').item`.
Output objects are created by calling `operations.make`, and so we add this call to the `main` method.
Once that is done, the output object can be accessed as `operation.output('plate').item`.
Because these are long expressions, we can assign the references of these objects to variables `input_stock` and `output_plate`, and use them to refer to the item in the code.
For now, the protocol uses the IDs for each item in the show blocks to make the instructions more specific.

```ruby
class Protocol
  def main
    operations.make
    operations.retrieve
    operations.each do |operation|
      operation_task(operation)
    end
    operations.store
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
      title 'Get the glycerol stock and a fresh agar plate'
      check "Get the glycerol stock  #{input_stock.id}"
      check "Get a fresh agar plate and label it #{output_plate.id}"
    end

    # Display instructions for streaking the plate
    show do
      title 'Streak the plate'
      check "Spot the plate #{output_plate.id} from the glycerol stock #{input_stock.id}"
      check 'Allow the spots on the plate to dry'
      check "Streak-out the spotted plate #{output_plate.id} with the pipette"
    end

    # Display instructions for storing/disposing of items
    show do
      title 'Store the glycerol stock and the streaked plate'
      check "Return the glycerol stock #{input_stock.id}"
      check "Store the streaked plate #{output_plate.id}"
    end
  end
end
```

A couple of details were changed here.
One is that we expanded the first and final blocks to include separate steps that refer to the input and output objects.
And, the other is that we use Ruby string interpolation to include the object-specific information, as in

```ruby
check "Get the glycerol stock  #{input_stock.id}"
```

Double-quotes are required for Ruby String interpolation.
But, we use single-quotes unless String interpolation is used, which is a Ruby convention.

### Adding Types and Items

Unfortunately, the protocol is now broken – you will get an error if you try to test it because the type of the input is not defined (this is the `sample type` on the definition tab).

1. Click the "hamburger" menu at the top left, and select **Sample Type Definitions**.
   Click the **New** button to create a new sample type.
   Type `Plasmid` into the name field, `dummy sample type` in the description field, and click the **Save** button.

2. Under **Containers** on the Plasmid sample type page, click the **Add** button to create a new object type.
   Type `Plasmid Glycerol Stock` in the name field, `dummy object type` in the description field, `Plasmid` in the Unit field and then click **Create Object Type**.
   (The unit field links the object type to the sample type.)

3. Repeat step 2, except name the object type `Plasmid Plate`.

Return to the definition tab for the `StreakPlate` protocol, and add the types to the input and output.
For both, set the sample type to `Plasmid`.
For the input `glycerol_stock` set the "container" to the object type `Plasmid Glycerol Stock`.
For the output `plate`, set the "container" to the object type `Plasmid Plate`.

We still need an example `Plasmid` sample to run our protocol.

1. If we look at the page for the `Plasmid` sample type, there is a line that says `There are 0 Plasmids in the inventory`.
   Click on the `Plasmids` link to open the **Samples** page.
   Click **New**, click `Plasmid`.
   Then set the sample name to `dummy_plasmid`, the description to `dummy plasmid sample`, and project to `tutorial`.
   Finally, click **Save**.

2. At the right of the newly created sample type, click **Actions**.
   Choose **New Item** and **Plasmid Glycerol Stock**.

Now you should be able to run/test the protocol, and the input and output items are identified by a LIMS ID.

## Provisioning

****\*\*\*\*****here****\*\*\*\*****

Provisioning is the task of gathering the resources that are needed for a protocol.

### Gathering and Storing Items

```ruby
def main
  operations.make
  operations.retrieve
  operations.each do |operation|
    operation_task(operation)
  end
  operations.store
end
```

### Provisioning New Items

agar plates may exist or may need to request they be built.
either way plate needs to be given the item number assigned for output.

## Factoring out common work

If you run a plan with more than one `StreakPlate` operation, you'll see that the way that we have written our protocol repeats some common work that doesn't have to be repeated.
Provisioning and storing items are the primary example, but we could even interleave the steps of the second show block where plates are streaked because there is a delay as the plates dry.

```ruby
class Protocol
  def main
    operations.make
    operations.retrieve
    get_plates(operations.length)
    operations.each do |operation|
      operation_task(operation)
    end
    store_plates(operations)
    operations.store
  end

  # Provision a fresh agar plate for each operation in the given list.
  #
  # @param operations [OperationList] the list of operations
  def get_plates(operations)
    count = operations.length
    id_list = operations.map { |operation| operation.output("Plate").item.id }
    show do
      title "Get fresh agar plates"
      check "Please get #{count} agar plates"
    end
  end

  def return_and_store(operations)
    # Display instructions for storing/disposing of items
    show do
      title 'Store the glycerol stock and the streaked plate'
      check "Return the glycerol stock #{input_stock.id}"
      check "Store the streaked plate #{output_plate.id}"
    end
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
      title 'Get the glycerol stock'
      check "Get the glycerol stock  #{input_stock.id}"
    end

    # Display instructions for streaking the plate
    show do
      title 'Streak the plate'
      check "Spot the plate #{output_plate.id} from the glycerol stock #{input_stock.id}"
      check 'Allow the spots on the plate to dry'
      check "Streak-out the spotted plate #{output_plate.id} with the pipette"
    end
  end
end
```

## Locations

## Old Text

### Provisioning Items

Most protocols are performed at the bench, and can be thought of in three phases in which the technician (1) gets the necessary items, (2) does the protocol steps, and (3) disposes of or puts away any items.
One approach to this first and last step is to use a pair of functions, `take` and `release`to provision a list of items. The `take` function instructs the technician to collect a list of items, and the `release` function instructs them to return the items.

For instance, Kapa HF Master Mix is a required ingredient for making PCR Fragments. The following code would instruct the technician to bring an Enzyme Stock containing Kapa HF Master Mix to bench at the `take` command. Then when the protocol is finished, `release` instructs the technician to put the item back.

From `Cloning/Make PCR Fragment`

```ruby
def main
  ...

  kapa_stock_item = Sample.find_by_name('Kapa HF Master Mix').in('Enzyme Stock')
  take [kapa_stock_item], interactive: true,  method: 'boxes'

  ...
ensure
  release [kapa_stock_item], interactive: true
end
```

`take` and `release` require a list of items as the first argument, which is why we wrap `kapa_stock_item` in brackets.

## Working With Items in Operations

Each instance of a protocol is contained within an `Operation`.
An `Operation` is created by the user in the Aquarium planner as an specific instance of an `OperationType` and then batched together with other `Operations` of the same type into a `Job`, which is then performed by the technician.

As an example: Suppose you have created an `OperationType` with the name "E. coli Transformation." You’ve written all the code you need, and now you’re read to run it.
An `Operation` would be a specific instance of "E. coli Transformation" (the `OperationType`), and a `Job` would be several "E. coli Transformation" `Operations` that have been submitted and are ready to run through the "E. coli Transformation" Protocol as a batch.

There are two ways to retrieve items within a protocol, and the two methods are called `retrieve` and `take`.
Both of them instruct the technician to retrieve items.

`retrieve` is used on what’s called an `OperationList`, which is exactly what it sounds like — a list of `Operations` being used in a specific job.
`retrieve` has two main purposes. First, it will fetch all of the input `Items` associated with each `Operation` in the `OperationsList` it is called on, enabling us to interact with these items in the protocol code. Next, it will generate show blocks for the tech to instruct them where to go to collect all of these input items, preparing them for the protocol.

Inside a protocol, the `OperationsList` representing all `Operations` in the current `Job` is referred to by the symbol `operations`
To perform a `retrieve`, you would write the following code:

```ruby
class Protocol
  def main
    operations.retrieve
    …
  end
end
```

`take`, on the other hand, takes an argument that’s an array of items, which makes it ideal for retrieving items that aren’t included as explicit inputs in the definition of an operation — e.g., master mix for a PCR, which isn’t something the user should need to explicitly select.

To perform a `take`, you would write something like the following code:

```ruby
class Protocol
  def main
    sample = Sample.find_by_name("pMOD8")
    items_to_retrieve = Item.where(sample_id: sample.id)
    take items_to_retrieve
    …
  end
end
```

This code first finds the sample "pMOD", and then finds all the items that are associated with that sample.
The technician is then instructed to retrieve all of them.

Another important thing both `retrieve` and `take` do is "touch" the item, which allows us to keep a record of all the items used in a job.
This is extremely useful for troubleshooting.

To put items away, you can use `release` (which is used in conjunction with `take` and takes the same arguments) and/or `operations.store` (which is used in conjunction with `operations.retrieve`).

`make` is another important method used on an `OperationsList`. It is used in the same way as `retrieve`, but instead of fetching the existing input `Items` of each `Operation`, it generates new `Items` for the _outputs_ of each `Operation`. `make` does not show instructions to the user on how to create those `Items`... that's what the rest of the protocol is for!

## Managing Operations

Protocols also manage how a batch of operations using the protocol will be performed.
A protocol is able to refer to a batch of operation using the symbol `operations`.

A simple protocol will apply the same tasks to each operation.
For instance, this protocol [DOES SOMETHING]

```ruby
class Protocol
  def main
    operations.each do |operation|
      operation_task(operation)
    end
  end

  def operation_task(operation)
    show do
        title 'MAKE A REALISH EXAMPLE'
    end
  end
end
```

The `operation_task` helper function defines the tasks for an operation.
Organizing the code this way separates the part of the protocol that operates over all operations from the part that operates over an individual operation.

This _single operation_ idiom is useful, but there may be other scenarios where a _grouped operation_ idiom is better.

```ruby
class Protocol
  def main
    groups1, groups2 = make_groups(operations)

    operation_group_1_task(group1)
    operation_group_2_task(group2)
  end

  def make_groups(operations)
  end

  def operation_group_1_task(operation_group)
    show do
        title 'MAKE A REALISH EXAMPLE'
    end
  end

  def operation_group_2_task(operation_group)
    show do
        title 'MAKE A REALISH EXAMPLE'
    end
  end
end
```

## Protocol Patterns

Most protocol tasks fall into one of three categories:

- Tasks that take input items and use them to create output items,
- Tasks that modify their input items, and
- Tasks that measure their input items, producing files.

### Protocols that Create New Items

The most common form of protocol takes input items and generates output items.
Such protocols will follow these general steps:

1.  Tell the technician to get the input items.
2.  Create IDs for the output items.
3.  Give the technician instructions for how to make the output items.
4.  Tell the technician to put everything away.

We saw earlier that we can write protocols that do these steps at a detailed level, but Aquarium provides functions that will do them over the inputs and outputs of the batched operations.
So, we can write the protocol to manage these tasks relative to the batched operations, which is simpler.

A protocol is able to refer to it's batch of operation using the symbol `operations`, and calls `operations.retrieve`, `operations.make` and `operations.store` to perform the steps above.

As an example, the following protocol illustrates this pattern for [DOING SOMETHING].

```ruby
def main
  # 1. Locate required items and display instructions to get them
  operations.retrieve
  # 2. Create inventory items for the outputs
  operations.make

  operations.each do |operation|
    # 3. Instructions how to perform steps to produce results
    operation_task(operation)
  end

ensure
    # 4. Put everything away
    operations.store
end
```

The use of `ensure` in this example makes certain that `operations.store` is called even if an exception is raised by the call to `operation_task`.

[Accessing Inputs and Outputs]

```ruby
def operation_task(op)
  show do
    title 'MAKE A REALISH EXAMPLE'
  end
end
```

### Protocols that Measure Items

Another common protocol uses an instrument to measure a sample.
Instruments frequently save the measurements to a file, and so the protocol consists of instructions for first taking the measurement, and then uploading the file(s).

TODO [data associations]

### Protocols that Modify Items

TODO [handling time: timers vs scheduling]

## Writing a Protocol

To use a semi-realistic example, let’s write a simple version of the "E. coli Transformation" protocol from above.
I won’t be going in-depth about all the methods being used, but I’ll leave categorizing each method with the
[Method Reference](https://klavinslab.org/aquarium/api/index.html %}) as an exercise for the reader.

Before writing a protocol, it’s always important to ask questions about how you want to structure it, such as:

- Who’s going to be using it?
- Will operations be "batched" together for this protocol? (The answer to this one is usually 'yes'.)
- What input/output structures do I want to use? Items, Collections, an array of items, etc. \* To figure this one out, it’s best to first ask yourself, "What are the pros/cons of doing it a specific way? Which operation types will be wired into this, which operation types will be successors?" A protocol is rarely intended to be used as a standalone — it’s almost always a part of a larger workflow, so it’s important to figure out how you’re going to structure the entire workflow instead of going in all gung-ho, guns a blazin’.

Once you’ve figured out how you’re going to structure it, outlining the protocol is useful.
An outline for the Transform E. Coli protocol is something like the following:

- Check if there are enough comp cells to perform the protocol
- Instruct technician to retrieve cold items needed for transformation
- Label the comp cells
- Electroporate and rescue
- Incubate transformants
- Put away items

First, define what the inputs and outputs are going to be.
This is a transformation protocol — the inputs are going to be comp cells and a plasmid.
Comp cells are best represented as a batch, a plasmid as an item.
The output is going to be a transformed _E. coli_ aliquot — also a plasmid.
So:

![input1](docs/protocol_developer/images/tutorial_images/19_input_1.png)

![input2](docs/protocol_developer/images/tutorial_images/20_input_2.png)

The "Plasmid" input represents the plasmid — I recommend you take a moment to get over that shocking revelation because there’s something even _more_ shocking coming: The "Comp Cells" input represents the comp cells.

"Plasmid" has multiple sample type / container combinations, because a plasmid can be held in many different containers and you want to give the user as much flexibility as possible. "Comp Cell" only has one sample type / container combination because you only want to use _E. coli_ comp cells, which are all held in the same type of container — a batch.

![output](docs/protocol_developer/images/tutorial_images/21_outputs.png)

The output is "Transformed E Coli" with container "Transformed E. coli Aliquot," which will be plated after some incubation period.

This is the first section of the code, going through and trying to figure out whether or not there are enough comp cells for the operation:

```ruby
def operation_task(op)
  comp_cells = op.input("Comp Cells")
  # If current batch is empty
  if comp_cells.collection.empty?
    old_batch = comp_cells.collection

    # Find replacement batches
    comp_cell_id = comp_cells.object_type.id
    all_batches = Collection.where(object_type_id: comp_cell_id).keep_if { |b| !b.empty? }
    batches_of_cells = all_batches.select { |b| b.include? comp_cells.sample && !b.deleted? }.sort { |x| x.num_samples }
    batches_of_cells.reject! { |b| b == old_batch } # debug specific rejection to force replacement
    ...
end
```

This looks like a lot, so let’s break it down.
To understand what’s happening here, the first thing you have to do is understand how a `Collection` is represented in Aquarium.

A `Collection` is represented as a matrix, and looks like the following:

![collections](docs/protocol_developer/images/tutorial_images/22_collections_example.png)

Each part of the collection is filled with a "7," which is the sample ID for DH5&alpha;.
In the database, it’s stored like this:

```ruby
[[7,7,7,7,7,7,7,7,7]…[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]]
```

where "-1" indicates an empty slot.

Because a `Collection` is represented thusly, numerous array methods are used to sort through all collections in Aquarium and find the ones that we’re interested in, which is what all that code above is doing.

```ruby
       # Error if not enough
       if batches_of_cells.empty?
         op.error :not_enough_comp_cells, "There were not enough comp cells of  #{comp_cells.sample.name} to complete the operation."
       else
```

This lets the user know there weren’t enough comp cells of the correct strain (through `comp_cells.sample.name`, which retrieves the sample name of that input) and errors the operation out.

```ruby
        # Set input to new batch
          comp_cells.set collection: batches_of_cells.last

          # Display warning
          op.associate :comp_cell_batch_replaced, "There were not enough comp cells for this operation.               Replaced batch #{old_batch.id} with batch #{op.input(CELLS).collection.id}"
        end
      end
  end
```

This code sets a new comp cell batch as the "input" (through comp_cells.set) if there are other batches available and lets the user know know through a data association (`op.associate`, which takes in two arguments: the key and upload; here, "comp cell batch replaced" and the message letting the user know a new comp cell was used, respectively).

Data associations are a great tool to pass information through Aquarium.
You can upload messages, measurements, pictures, files, passive-aggressive notes — it’s all good.
Operations, samples, items, etc. all have data associations, which means it’s very easy to attach and retrieve information from all of these.

You also want to detract the comp cell aliquots used from the batch, so the online inventory is accurate.
To do so, there’s a `remove_one` method included in a library, which is used like so:

```ruby
operations.running.each { |op| comp_cells.collection.remove_one comp_cells.sample }
```

Now that any potential operations without sufficient comp cells have errored out, it's time to do a `retrieve` and `make`.

```ruby
operations.running.retrieve(only: ['Plasmid'])
operations.running.make
```

`retrieve` has an optional argument -- you can choose which inputs you want the tech to retrieve using 'only', which takes in an array argument.

```ruby
# Prepare electroporator
show do
  title 'Prepare bench'
  note 'If the electroporator is off (no numbers displayed), turn it on using the ON/STDBY button.'
  note 'Set the voltage to 1250V by clicking the up and down buttons.'
  note ' Click the time constant button to show 0.0.'
  image 'Actions/Transformation/initialize_electroporator.jpg'

  check "Retrieve and label #{operations.running.length} 1.5 mL tubes with the following ids: #{operations.running.collect { |op| "#{op.output("Transformed E Coli").item.id}"}.join(',')}"
  check 'Set your 3 pipettors to be 2 uL, 42 uL, and 300 uL'
  check 'Prepare 10 uL, 100 uL, and 1000 uL pipette tips.'
  check 'Grab a Bench SOC liquid aliquot (sterile) and loosen the cap.'
end
```

This is a show block, letting the tech know to prepare the electroporator and label the tubes. `operations.running` returns a list of all the un-errored operations, and because it returns an `OperationList`, you can use the built-in ruby enumerators on it (e.g., `collect`, `join`, etc.).

Something to get used to, if you haven’t used Ruby before, is method chaining — the practice of putting multiple methods in one line, e.g., `operations.running.collect { … }.join`.
This is the same thing as doing:
`take`, on the other hand, takes an argument that’s an array of items, which makes it ideal for retrieving items that aren’t included as explicit inputs in the definition of an operation — e.g., master mix for a PCR, which isn’t something the user should need to explicitly select.

The next part is to label all the tubes:

```ruby
# Label comp cells
  show do
    title 'Label aliquots'
    aliquotsLabeled = 0
    operations.group_by { |op| op.input("Comp Cells").item }.each do |batch, grouped_ops|
      if grouped_ops.size == 1
        check "Label the electrocompetent aliquot of #{grouped_ops.first.input("Comp Cells").sample.name} as #{aliquotsLabeled + 1}."
      else
        check "Label each electrocompetent aliquot of #{grouped_ops.first.input("Comp Cells").sample.name} from #{aliquotsLabeled + 1}-#{grouped_ops.size + aliquotsLabeled}."
      end
      aliquotsLabeled += grouped_ops.size
    end
    note 'If still frozen, wait till the cells have thawed to a slushy consistency.'
    warning 'Transformation efficiency depends on keeping electrocompetent cells ice-cold until electroporation.'
    warning 'Do not wait too long'
    image 'Actions/Transformation/thawed_electrocompotent_cells.jpg'
  end
```

There’s a new option here — `image`, which allows you to insert an image into the show blocks.

The reason this section of code uses `group_by` (a Ruby method) is to group all the operations by the batch ID being used.
So, each batch will be separated.
Suppose you have ten operations; the first five use batch 1234, the next four use batch 4567, and the last one uses 78910.
This is what the "groups" would look like:

batch 1234: operations 1, 2, 3, 4, 5
batch 4567: operations 6, 7, 8, 9
batch 78910: operation 10

The tech would be told to label the first four comp cells from "1-5"; the `aliquotsLabelled` variable would go up by 5, so the next time the loop is run, it would tell the tech to label the next four comp cells "6-9"; once more, `aliquotsLabelled` would go up (this time by four), and, finally, the tech would be told to label the last comp cell as "10."

Note: If you use this code in the tester interface with randomly generated operations, comp cell inputs will all be generated as part of a single batch, no matter how many operations you have. With this in mind, the expected output on the tester will actually be the tech being told to label all 10 comp cells from 1-10 in a single step.

Now, we need to write the instructions for the actual transformation:

```ruby
1        index = 0
2        show do
3            title 'Add plasmid to electrocompetent aliquot, electroporate and rescue '
4            note 'Repeat for each row in the table:'
5            check 'Pipette 2 uL plasmid/gibson result into labeled electrocompetent aliquot, swirl the tip to mix and place back on the aluminum rack after mixing.'
6           check 'Transfer 42 uL of e-comp cells to electrocuvette with P100'
7           check 'Slide into electroporator, press PULSE button twice, and QUICKLY add 300 uL of SOC'
8            check 'pipette cells up and down 3 times, then transfer 300 uL to appropriate 1.5 mL tube with P1000'
9           table operations.running.start_table
10                .input_item('Plasmid')
11                .custom_column(heading: 'Electrocompetent Aliquot') { index = index + 1 }
12                .output_item('Transformed E Coli', checkable: true)
13                .end_table
14        end
```

This uses a new Aquarium object — `Table`.
The table looks like this:

![table](docs/protocol_developer/images/tutorial_images/23_table.png)

I’m going to break down the block of code that displays this table, because the rest of the show block is pretty standard.

The `table` (in line 9) is analogous to `note`, `check`, `warning`, etc. in that it’s used as a flag to display the following argument in a certain way.
Without using `table`, your table won’t show up.

Method chaining can be either on the same line, or on multiple lines, too.
So the block of code that says:

```ruby
operations.running.start_table
  .input_item('Plasmid')
  .custom_column(heading: 'Electrocompetent Aliquot') { index = index + 1 }
  .output_item('Transformed E Coli', checkable: true)
  .end_table
```

Is the same thing as `operations.running.start_table.input_item('Plasmid').custom_column(heading: 'Electrocompetent Aliquot') { index = index + 1 }.output_item('Transformed E Coli', checkable: true).end_table`, except a) that doesn’t fit on one line and b) it’s much, much more confusing.
As such, for clarity’s sake, it’s split onto multiple lines.

`start_table` is the method that starts the table. `input_item` adds a column that displays the input item associated with the input "Plasmid." `custom_column` takes in two arguments: One for what heading should be displayed, and the other is a block that determines what will be displayed in each row of the column.
In this case, it’s `index`, which is way to number things 1–n, where n is the number of operations.

`output_item` is exactly like `input_item`, but instead references the output. `end_table` is what signals the end of the table, and to display a table, `end_table` is necessary because that is what returns the fully-formed table.

There are many table methods — refer to the more in depth [Table Method Documentation]({{ site.baseurl }}{% link _docs/protocol_developer/table.md %}) for a full overview.

The next step is to incubate the transformants:

```ruby
        show do
            title 'Incubate transformants'
            check 'Grab a glass flask'
            check 'Place E. coli transformants inside flask laying sideways and place flask into shaking 37 C incubator.'
            #Open google timer in new window
            note "<a href=\'https://www.google.com/search?q=30%20minute%20timer\' target=\'_blank\'>Use a 30 minute Google timer</a> to set a reminder to retrieve the transformants, at which point you will start the \'Plate Transformed Cells\' protocol."
            image 'Actions/Transformation/37_c_shaker_incubator.jpg'
            note 'While the transformants incubate, finish this protocol by completing the remaining tasks.'
        end
```

This also opens up a Google timer for one hour, which is useful.

The last step the tech needs to do is clean up, so:

```ruby
        show do
            title 'Clean up'
            check 'Put all cuvettes into biohazardous waste.'
            check 'Discard empty electrocompetent aliquot tubes into waste bin.'
            check 'Return the styrofoam ice block and the aluminum tube rack.'
            image 'Actions/Transformation/dump_dirty_cuvettes.jpg'
        end
```

We also need to move all the output transformations to the 37C shaker, and we need to do so manually:

```ruby
        operations.running.each do |op|
            op.output("Transformed E Coli").item.move '37C shaker'
        end
```

And that’s it! Not too bad.
Make sure you have the correct number of `end`s, and you can start testing this protocol out on Aquarium immediately.

TIP: While writing a protocol, if you find yourself thinking, "Gosh, I wish there were a method I could use that would do (insert tedious thing here)," chances are, there is — look through the in-depth Aquarium documentation or search for a ruby method through Google.
If there _isn’t_, you can make one yourself and stick it in a library.

## Building Libraries

[saving work with shared functions - include, extend, direct call]

[simplifying with kinds of ducks: using classes]

[things that go awry: show blocks in libraries]
