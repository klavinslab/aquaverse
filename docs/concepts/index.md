# Aquarium Concepts

Aquarium data structures are intended to capture every aspect of a lab's structure. At the lowest level is the LIMS, which defines the types of samples and containers your lab users, as well as helps you manage the data associations and the locations of all of your items.
On top of that are operations, which specify how a set of input items are transformed into a set of output items, as well as how exactly to perform that transformation.
Finally, Aquarium's execution environment manages how operations are batched together and how technicians are instructed to do the individual steps or the operation's protocol.
Here, we describe each of these aspects of Aquarium in a bit more detail to give you a flavor of what Aquarium does.
More details can be found in the rest of the documentation, index by the sidebar to this page.

## Inventory System

Aquarium protocols manipulate items in the LIMS inventory.
An _item_ represents a physical entity in the lab.
For instance, this diagram represents a GFP-tagged plasmid in a glycerol stock in a Eppendorf tube located in a freezer.

<img src="docs/concepts/images/items.png"
     alt="an item is a sample in a container at a location"
     style="max-width: 150px"
     width="100%">

Each item has three components representing these details: the sample, the object type, and the location.
For the example in the diagram, these are

- the plasmid puc19-GFP (the sample),
- a glycerol stock in an Eppendorf tube (the object type), and
- a freezer (the location).

A _sample_ is effectively the class of entity for which the item is an instance, and has a _sample type_.
Here the sample is puc19-GFP, which has sample type of plasmid.

<img src="docs/concepts/images/samples.png"
     alt="the sample for plasmid puc-19GFP is an instance of the plasmid sample type"
     style="max-width: 300px"
     width="100%">

An item _location_ in Aquarium is a hierarchical description of where the item can be found.
For instance, the UW BIOFAB location `M20.1.5.49` is a location in a box in a -20C freezer as illustrated by this diagram:

<img src="docs/concepts/images/location.png"
     alt="Locations are hierarchical"
     style="max-width: 300px"
     width="100%">

## Operations and Plans

A protocol performed in Aquarium is represented as an _operation_.
Concretely, an operation is defined by an _operation type_ that indicates how the operation will be performed, and is defined by a protocol script that takes inputs and produces outputs.
This diagram illustrates an operation type for bacterial transformation, which takes DNA and competent cells as inputs and performs a transformation to produce transformed cells.

<img src="docs/concepts/images/operation-type.png"
     alt="an operation type is the definition of how samples are used in a protocol"
     style="max-width: 400px"
     width="100%">

One of the key details of this operation type is that can be given different types of inputs as long as they are consistent with the type in the operation type.
In the diagram, the DNA input could be either a Maxiprep of Plasmid Library or a Miniprep of Plasmid Library.
The type of the output depends on the types of the inputs.

An _operation_ is a particular instance of an operation type with concrete inputs and outputs.
This is illustrated in this diagram, which shows the bacterial transformation operation where the inputs are identified with particular items that exist in the inventory.

<img src="docs/concepts/images/operation.png"
     alt="an operation is an instance of an operation type with specified items as inputs and outputs"
     style="max-width: 400px"
     width="100%">

An operation occurs in a _plan_, which is a set of operations with linked inputs and outputs.
The diagram shows the output of the bacterial transformation operation linked to an input of a colony PCR operation.

## Execution Environment

When plans are executed in Aquarium, similar operations are batched together as a _job_.
These operations may come from different plans of different researchers as illustrated here where three distinct plans have shared operations.

<img src="docs/concepts/images/planned-operations.png"
     alt=""
     style="max-width: 300px"
     width="100%">

Operations that are ready at the same time can be grouped into jobs by the manager.
The operations are batched into four jobs.
The manager can batch operations in to jobs as needed – in this case, the manager chose to create jobs 2 and 3 separately even though the operations have the same operation type.

<img src="docs/concepts/images/batched-jobs.png"
     alt=""
     style="max-width: 400px"
     width="100%">

Jobs are then scheduled and assigned to a technician to perform.

<img src="docs/concepts/images/scheduled-jobs.png"
     alt=""
     style="max-width: 400px"
     width="100%">

## Operation States

After a plan is launched, the operations in the plan move through several states:

- _waiting_ – the operation is waiting for a predecessor in the plan to complete
- _pending_ – the operation is ready to be scheduled by a manager
- _scheduled_ – the job of the operation is ready to be started by a technician
- _running_ – the job of the operation is being run by a technician
- _complete_ – the jot of the operation has finished without error

In addition, operations may have other states depending on the definition of the operation type.
The most common relates to evaluation of the precondition of an operation.
Each operation type has a precondition that must be true before an operation of that type can transition into pending.
Most preconditions are trivially true, meaning they can always be run, but some have more complex preconditions that may fail.
If the precondition of an operation fails, then the operation is put into the _delayed_ state.

Less common is the _deferred_ state.
This arises when an operation has a predecessor operation that has an _on-the-fly_ operation type.
An operation type is marked as being _on-the-fly_ if the number of operations of that type is used to determine the number of operations of a dependent operation type.
An example is running a gel: to run a gel, you need to pour a gel.
The operation type `Pour Gel` must be on-the-fly because it is not clear how many gels to pour until a job is formed of corresponding `Run Gel` operations.
Because of this relationship, the `Run Gel` operations must be batched before the `Pour Gel` operations can start, and will be _deferred_ until the `Pour Gel` operations complete.
