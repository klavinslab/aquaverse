# Recommendations for Installing and Running Aquarium

We recommend that labs doing protocol development run at least two instances: a nursery server and a production server.
A _nursery_ server is shared within the lab for the purposes of trying out protocols under development, while the _production_ server actually controls the lab.
We use this arrangement in the Klavins lab to run the UW BIOFAB so that protocols can be evaluated without affecting the actual lab inventory.
In addition to these lab servers, each protocol developer should run a local instance.

The reason for using different instances of Aquarium is that protocol testing can be disruptive to the lab.
First, protocols may change the underlying database, which depending on the effects, could change the status of items that are in use in the lab.
And, second, errors in protocols being tested can affect lab system performance and disrupt protocols underway.
So, our strong recommendation is that protocol testing _should not_ be done on a production server.

Aquarium has been built to be used in a Unix&trade; environment.
The experience of some of our lab mates is that the Windows Subsystem for Linux is sufficient to run Aquarium locally when used with the Docker Toolbox VM on Windows.

Installation topics:

- <a href="#" onclick="select('Getting Started','Getting Aquarium')">
    Getting Aquarium
  </a>
- <a href="#" onclick="select('Getting Started','Docker Installation')">
    Docker Installation
  </a>
- <a href="#" onclick="select('Getting Started','Manual Installation')">
    Manual Installation
  </a>
- <a href="#" onclick="select('Getting Started','Configuration')">
    Configuration
  </a>
