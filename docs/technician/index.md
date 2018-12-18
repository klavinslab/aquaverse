
# Technician

When using Aquarium, a technicians primarily interacts with protocols, each of which will have their own details.

Aquarium does track which users runs which jobs as a technician, so technicians should login separately rather than using someone else's login.

## Running a Job

A job is scheduled from the <a href='#' onclick="easy_select('Lab Management', 'Managing Jobs')">manager interface</a>,
and results in a screen like this on the **Manager Tab**:

![jobs](docs/technician/images/scheduled-job.png)

Clicking on a pending job opens the technician interface for that job.
This page has a **start** button that will start the job.

![technician-start](docs/technician/images/technician-start.png)

At this point, the protocol runs and displays instructions on the screen.
When done with the instructions on the page, clicking **OK** at the top of the page will move the protocol to the next screen.

![running-job](docs/technician/images/running-job.png)

If you jumped ahead before finishing, you can move back with the arrows, or by selecting the protocol steps by clicking the names in the **Steps** list to the left.

This simple protocol only has one screen, so clicking **OK** results in the completion page being displayed.

![complete run](docs/technician/images/complete-protocol.png)

This page shows the different operations types that the user has previously completed.

## Technician Interface Features

![ops-list](docs/technician/images/ops-list.png)
![timer](docs/technician/images/timer.png)
![uploads-list](docs/technician/images/uploads-list.png)
