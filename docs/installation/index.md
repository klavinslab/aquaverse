# Recommendations for Installing and Running Aquarium

We recommend that labs doing protocol development run at least two instances of Aquarium.
The UW BIOFAB uses a staging server and a production server with each protocol developer running a local instance on a laptop.
A _staging_ server is shared within the lab for the purposes of trying out protocols before shifting them to production, while the _production_ server actually controls the lab.
We have traditionally used this arrangement in the Klavins lab to run the UW BIOFAB so that protocols can be evaluated without affecting the UW BIOFAB's inventory.
It should also be possible to have the production server with individuals each using their own local instance for protocol development or evaluation.

Using different instances of Aquarium is important because protocol testing can be disruptive.
First, protocols may change the underlying database, which depending on the effects, could change the status of items that are in use in the lab.
And, second, errors in protocols being tested can affect lab system performance and disrupt protocols underway.
So, we highly recommend that protocol testing _not_ be done on a production server.

Aquarium was developed to be used in a Unix&trade; environment.
We have done just enough experimentation to know that the Windows Subsystem for Linux is sufficient to run Aquarium locally when used with the Docker Toolbox VM on Windows.
We include instructions and scripts here based on that limited experience.

Installation topics:
- [Local Deployment](http://klavinslab.org/aquarium-local/)
- <a href="#" onclick="select('Getting Started','Production Deployment')">
    Production Deployment
  </a>
- <a href="#" onclick="select('Getting Started','Configuration')">
    Configuration
  </a>
