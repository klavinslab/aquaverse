# Manager

_This document assumes that you have read the <a href="#" onclick="select('Getting Started', 'Basic Concepts')">Aquarium Concepts</a> document_.

A manager uses Aquarium to select which operations are run together as a job; to monitor and control jobs; and to help users with problematic plans.

## The Manager Tab

The manager tab provides the information needed to manage lab operations as illustrated by this (redacted) screenshot of the manager tab for the UW BIOFAB production server.

<img src="docs/manager/images/manager-view.png"
     width="100%"
     alt="the manager view showing jobs">

This screenshot shows that there are five `Run Gel` operations (in the `Cloning` category) that are **pending**, or ready to execute.
(See [Starting a job](#scenariostartingajob) below for details on how run a job using these five operations.)

The controls at the left of the screen allow the manager to determine which operations are displayed on the right.
At the top left are display controls that include:

- **Switch User** – filter operations by user,
- **Active Jobs** – filter operations by jobs that are active, and
- **Activity Reports** – display job activity by date

At the bottom left are the categories of the operation types available on this Aquarium instance.
The categories that currently have operations appear in black, and the rest are greyed-out.
The middle panel shows the operation status for the currently selected category.
Clicking on a number for a particular operation type and operation state shows the operations in the operations list panel to the right.

It is also possible to display completed operations by clicking the slider at the top of the operation status panel.

## Scenario: Monitoring lab activity

<img style="float:left; max-width:100px"
     src="docs/manager/images/category-list.png"
     alt="manager controls allow selecting the category to display"
     width="100%"
     hspace=20>

The left panel of the manager tab has two parts.
At the top are buttons that allow the manager to common tasks: switching to another user, displaying active jobs, and generating reports of activity.
At the bottom are buttons that control which categories of jobs are displayed in the right panel.
This example shows three categories _cloning_, _manager_ and _tutorial\_neptune_ with the tutorial selected.
(These are the categories from the protocol development tutorial; in practice, there will be many more.)

Once the category is selected, operation types will be displayed in the panel to the right of the buttons.
Unless the **Completed** slider is clicked, these will be operation types with currently active operations, otherwise those with completed operations will also be shown.
This example shows one operation type with an operation that is **pending**, which is the state of an operation that is ready to be performed by a technician.

<img src="docs/manager/images/selected-category.png"
     alt="manager view of selected category"
     width="100%">

The operation states are explained in the <a href="#" onclick="select('Getting Started', 'Basic Concepts')">Aquarium Concepts</a> document.

## Scenario: Starting a job

From the Manager Tab, clicking the number in the pending spot will display all of the operations of the selected type and state.
These represent all of the jobs that can be selected and run as a job.

<img src="docs/manager/images/selected-operation.png"
     alt="manager view of selected operation"
     width="100%">

Selecting the operations to be part of a job, and then clicking **run** starts the job.

<img src="docs/manager/images/scheduled-job.png"
     alt="manager view of selected operation"
     width="100%">

Clicking the job id in this window will open the technician view that shows the job ready to start:

<img src="docs/manager/images/technician-start.png"
     alt="technician view showing button to start a job"
     style="max-width: 300px"
     width="100%">

And, once the technician has started the job, the status will update in the operation status panel.

<img src="docs/manager/images/updated-status.png"
     alt="manager view showing job running after technician started job"
     style="max-width: 300px"
     width="100%">
