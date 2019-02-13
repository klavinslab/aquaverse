# Technician

When using Aquarium, a technicians primarily interacts with protocols, each of which will have their own details.
Aquarium tracks which users run which jobs as technicians, so technicians should login separately to use this feature.

## Running a Job

A job is scheduled from the <a href='#' onclick="select('Lab Management', 'Managing Jobs')">manager interface</a>,
and results in a screen like this on the **Manager Tab**:

<img src="docs/technician/images/scheduled-job.png"
       alt="the manager view showing a scheduled job"
       width="100%">

Clicking on a pending job opens the technician interface for that job.
This page has a **start** button that will start the job.

<img src="docs/technician/images/technician-start.png"
       alt="the technician view showing how to start a scheduled job"
       style="max-width: 300px"
       width="100%">

At this point, the protocol runs and displays instructions on the screen.
When done with the instructions on the page, clicking **OK** at the top of the page will move the protocol to the next screen.

<img src="docs/technician/images/running-job.png"
       alt="the technician view showing a protocol step"
       width="100%">

If you jumped ahead before finishing, you can move back with the arrows, or by selecting the protocol steps by clicking the names in the **Steps** list to the left.

This simple protocol only has one screen, so clicking **OK** results in the completion page being displayed.

<img src="docs/technician/images/complete-protocol.png"
       alt="the technician view showing a protocol step"
       width="100%">

This page shows the different operations types that the user has previously completed.

## Attaching files

Protocols that expect files to be uploaded and attached are written to ask for them in the normal display, but there will be times where it is useful to add files that aren't asked for by the protocol.
The **uploads** tab makes it possible to upload and attach files to the parts of a job, either the operations of the job or the plans to which those operations belong.

To attach files, click the **uploads** tab, select whether to associate the uploaded files to the operations or plans of the jobs, and click **Upload New Files**.

<img src="docs/technician/images/uploads-list.png"
       alt="the technician upload tab allows adding files to a job or operations"
       style="max-width: 300px"
       width="100%">

This will take you through a dialog to select the files to be uploaded.

## Running a timer

Protocols can start timers directly, but some may also simply say to start a timer.
In this situation, click on the **timer** tab, set the duration for the timer, choose the alarm chime (we highly recommend using "Chewbacca"), and click the run button.

<img src="docs/technician/images/timer.png"
       alt="the technician timer tab allows timing a task or delay"
       style="max-width: 300px"
       width="100%">
