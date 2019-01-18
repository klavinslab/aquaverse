# Recommendations for Installing and Running Aquarium

We recommend that labs doing protocol development run at least two instances of Aquarium: a nursery server and a production server.
A _nursery_ server is shared within the lab for the purposes of trying out protocols under development, while the _production_ server actually controls the lab.
We use this arrangement in the Klavins lab to run the UW BIOFAB so that protocols can be evaluated without affecting the UW BIOFAB's inventory.
In addition to these lab servers, each protocol developer should run a local instance, for example on their laptop.

In more detail, using different instances of Aquarium is important because protocol testing can be disruptive.
First, protocols may change the underlying database, which depending on the effects, could change the status of items that are in use in the lab.
And, second, errors in protocols being tested can affect lab system performance and disrupt protocols underway.
We highly recommend that protocol testing _not_ be done on a production server.

Aquarium was developed to be used in a Unix&trade; environment.
We have done just enough experimentation to know that the Windows Subsystem for Linux is sufficient to run Aquarium locally when used with the Docker Toolbox VM on Windows.
We include instructions and scripts here based on that limited experience.

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
