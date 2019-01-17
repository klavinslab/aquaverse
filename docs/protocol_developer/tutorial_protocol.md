# Tutorial: Creating A Protocol

This is an introduction to writing protocols for Aquarium in the Krill domain specific language.
We try to introduce the most common (and recommended) patterns in Krill, but this is not a comprehensive reference.
See the [API documentation](http://klavinslab.org/aquarium/api/) for more details on the functions that Krill provides.

_This document is evolving, please share feedback._

---

## An Aquarium Protocol

A protocol in Aquarium defines an action that can be planned by a researcher designing an experiment.
In the lab, the protocol translates to a series of steps that are to be performed to complete the action.

If you are coming from a background where you have written or worked from a typical paper protocol, an Aquarium protocol is more detailed.
The protocol may correspond to a single step of a paper protocol – such as streaking an agar plate with E. coli – but elaborates the details needed to ensure the protocol is performed as consistently as possible.
When deciding what protocols to make, a rule of thumb is that a protocol should be something that can be done in one session at the bench.

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

To understand better what is happening, you should
<a href="#" onclick="select('Getting Started','Installation')">
set up an Aquarium instance on your personal machine
</a>
to follow along.
Our advice is that you **not** use your lab's server to learn.

### Creating a Protocol

Start by using the <a href="#" onclick="select('Protocols', 'Developer Tools')">Aquarium developer tools</a> to create our protocol:

1.  Starting from the developer tab, click the **New** button in the upper right corner.

2.  Change the operation type name to `StreakPlate`, the category to `tutorial`, and click the **Save** button.

3.  Click **Protocol**, replace the template code in our example, and click the **Save** button at the bottom right.

### Running a Protocol from the Developer Test Tab

The simplest way to run our protocol is by using testing in the Developer Tab.
(See the <a href="#" onclick="select('Protocols', 'Developer Tools')">Aquarium developer tools page</a> for more details.)

1.  Click **Test**

2.  Click the **Generate Operations** button to generate instances of the operation type with random inputs.

3.  Click the **Test** button to run the operation(s) with the inputs and show the trace with any output

When the test finishes, you should see a backtrace – the execution history – with each of the page titles displayed.

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

Relevant documentation:

- <a href="#" onclick="select('Protocols', 'Developer Tools')">Aquarium developer tools</a>
- <a href="#" onclick="select('Researchers', 'Designing Plans')">Managing Jobs</a>
- <a href="#" onclick="select('Lab Management', 'Managing Jobs')">Managing Jobs</a>
- <a href="#" onclick="select('Lab Management', 'Running Jobs')">Running Jobs</a>

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

4. Click the **Update** button to save these changes.

### Using Inputs and Outputs

Now that we have reorganized the protocol to access the operations, and the inputs and outputs are declared, we can refer to the `glycerol_stock` input as `operation.input('glycerol_stock').item`.
Output objects are created by calling `operations.make`, and so we add this call to the `main` method.
Once that is done, the output object can be accessed as `operation.output('plate').item`.
Because these are long expressions, we can assign the references of these objects to variables `input_stock` and `output_plate`, and use them to refer to the item in the code.
For now, the protocol uses the IDs for each item in the show blocks to make the instructions more specific.

```ruby
class Protocol
  def main
    operations.retrieve  # locate required items and display instructions to get them
    operations.make      # create items for the outputs

    operations.each do |operation|
      operation_task(operation)
    end
    operations.store    # put everything away
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

2. Go back to the **Sample Type Definitions** page, and if necessary select **Plasmid** on the left.
   Under **Containers** on the Plasmid sample type page, click the **Add** button to create a new object type.
   Type `Plasmid Glycerol Stock` in the name field, `dummy object type` in the description field, select `Plasmid` in the as the sample type and then click **Create Object Type**.

3. Repeat step 2, except name the object type `Plasmid Plate`.

Return to the definition tab for the `StreakPlate` protocol, and add the types to the input and output.
For both, set the sample type to `Plasmid`.
For the input `glycerol_stock` set the "container" to the object type `Plasmid Glycerol Stock`.
For the output `plate`, set the "container" to the object type `Plasmid Plate`.
Then click the **Update** button to make sure the changes are saved.

We still need an example `Plasmid` sample to run our protocol.

1. If we look at the page for the `Plasmid` sample type, there is a line that says `There are 0 Plasmids in the inventory`.
   Click on the `Plasmids` link to open the **Samples** page.
   Click **New**, click `Plasmid`.
   Then set the sample name to `dummy_plasmid`, the description to `dummy plasmid sample`, and project to `tutorial`.
   Finally, click **Save**.

2. At the right of the newly created sample type, click **Actions**.
   Choose **New Item** and **Plasmid Glycerol Stock**.

Now you should be able to run/test the protocol, and the input and output items should identified by a LIMS ID.

## Provisioning and storing

Provisioning is the task of gathering the resources that are needed for a protocol.

Aquarium is able to generate instructions for provisioning without you having to write special instructions.
You may have noticed that we snuck some code into the previous example without explaining it:

```ruby
def main
    operations.retrieve  # locate required items and display instructions to get them
    operations.make      # create items for the outputs

    operations.each do |operation|
      operation_task(operation)
    end
    operations.store    # put everything away
end
```

The command `operations.make` creates the items for outputs of the operations, and must be run for a protocol that creates new items.
But, The other two commands `operations.retrieve` and `operations.store` manage the tasks of getting and storing items that are used.

If you generate and run a test for the protocol, the first two screens in the backtrace should show instructions to gather inputs.
The first, which displays the text

> **Gather the Following Additional Item(s)**<br>
> Item 2 at Bench

(you may have a different item number) is generated by the `operations.retrieve` command.
And, the second, which shows the text

> **Get the glycerol stock and a fresh agar plate**<br>
> Get the glycerol stock 2<br>
> Get a fresh agar plate and label it 3

is generated by the first show block in `operation_task`.

There is duplicated information displayed here, but `operations.retrieve` also marks the items as in use, which helps avoid conflicts over resources in the lab.
We want to use Aquarium item management where possible, so we will drop the instruction to get the glycerol stock from the show block.

The `operations.store` command is similar, but here we actually have an omission in our protocol, because it is not clear what it means to "put back" an item that was created by the protocol.
The glycerol stock should go back to its original location (another detail we need to determine later), but we actually want to put the plate into an incubator.
So, for the output plate, we add a line `output_plate.move('incubator')` to the end of `operation_task` where `'incubator'` is a location that we need to add to Aquarium.
Now, when `operations.store` is run, Aquarium will instruct the technician to move the plate to the incubator.
As a result, we can remove the last show block with the title `Store the glycerol stock and the streaked plate`.

All of these changes give the protocol

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

## Learning more

The StreakPlate protocol we've constructed in this tutorial is pretty basic in that it follows the naive task list that we started with.
But, Aquarium allows us to build protocols that help determine how efficiently the lab performs certain tasks, and we haven't yet considered how the protocol is used in the lab.
To learn more, move on to the
<a href="#" onclick="select('Protocols', 'Improving a Protocol')">tutorial on improving protocols</a>,
which demonstrates how we would modify the StreakPlate protocol to interleave operations.

You can also go deeper into topics covered in this tutorial with these pages:

- <a href="#" onclick="select('Protocols', 'Show Blocks')">Show blocks</a>
- <a href="#" onclick="select('Protocols', 'Locations')">Locations</a>
- <a href="#" onclick="select('Protocols', 'Operations')">Working with operations</a>
