# Running Aquarium

## Quick Guide

| If you want to                      | Use this                                                                                          |
| :---------------------------------- | :------------------------------------------------------------------------------------------------ |
| Try out Aquarium                    | [local deployment](http://aquariumbio.github.io/aquarium-local/)                                  |
| Develop and test Aquarium protocols | [local deployment](http://aquariumbio.github.io/aquarium-local/)                                  |
| Run Aquarium on your own server     | [server-deployment](https://github.com/aquariumbio/aquarium-multiple-deployment) (also see below) |
| Do Aquarium development             | [developer documentation](http://aquariumbio.github.io/aquarium/development/)                     |

## About Deployment

The best way to try out Aquarium is to start with a [local deployment](http://aquariumbio.github.io/aquarium-local/).
We built the local deployment scripts so that we could do protocol development and testing on our personal machines rather than using a server.
They also use the Docker image that we maintain, so that you don't have to build the system.
So, it is a good place to experience Aquarium for the first time.

To run Aquarium for a lab, you need a production deployment.
A production deployment requires a server connected to a network with ports open in the firewall so that Aquarium can be reached.
This server could be a computer that you control, it could be a virtual machine in a university computing center, or it could be a virtual machine in a cloud service.
Depending on your scenario, you may need help to get the system setup and accessible to members of your lab.

For users who want to install Aquarium on a locally controlled machine, we recommend using the [server-deployment](https://github.com/aquariumbio/aquarium-multiple-deployment).
The server deployment scripts that allow you to use a Docker image that we manage, and also allow you to use your own host name with https for more secure access.
_You need to be able to open ports in your system firewall for Aquarium to be accessible from other computers._

We can only provide limited support.
We do currently manage Aquarium deployments at AWS and TACC (UT Austin) for our own lab, and grant-funded collaborators.

## Custom Deployments

Most users should be using either the [local deployment](http://aquariumbio.github.io/aquarium-local/) or the [server-deployment](https://github.com/aquariumbio/aquarium-multiple-deployment), which address most user needs.

For users who need a customized deployment, we suggest you adapt the Docker Compose scripts in these repositories to fit your configuration.
These scripts use the Docker image [aquariumbio/aquarium](https://hub.docker.com/repository/docker/aquariumbio/aquarium) along with a set of images for supporting services.

An Aquarium deployment consists of the Aquarium service, a database, an object-store, an image server, and a web-server.
A deployment may also have an email service.

<img src="docs/installation/images/aquarium-config.png"
     alt="An Aquarium deployment also includes a database, object-store and web-server"
     width="30%">

These services can be provided in different ways depending on your objectives and level of support.
For example, we run Aquarium on our laptops for protocol development.
And, so use the [local](http://aquariumbio.github.io/aquarium-local/) configuration, which includes a fully-contained Docker container using nginx as the web-server, MySQL as the database service, and minio for both object-store and image server; but without an email service.

<img src="docs/installation/images/local-aquarium.png"
     alt="The local Aquarium deployment uses minio for the object-store and mysql as the database"
     width="30%">

It is also possible to use these same local services for a production deployment.
The [server](https://github.com/aquariumbio/aquarium-multiple-deployment) configuration is similar to the local-deployment, but allows one or more instances of Aquarium to be run as named sites.

<img src="docs/installation/images/multi-aquarium.png"
     alt="The multi-Aquarium deployment uses nginx-proxy to route traffic to named Aquarium instances paired with a minio service."
     width="75%">

In this case, the [nginx-proxy](https://github.com/jwilder/nginx-proxy) service dynamically manages the reverse proxy for running Aquarium services and their corresponding minio services.
The nginx-proxy service also enables using https, which cannot be done with the local-deployment configuration.

Another alternative is to use external services instead of local ones.
For instance, Aquarium deployments at TACC (UT Austin) use a single, separate minio service.
And, the UW BIOFAB runs Aquarium on Amazon Web Services using AWS RDS for the database service, AWS S3 as the object-store service, [nginx](http://nginx.org) as the web server, an image server, and AWS SES as the email service.

<img src="docs/installation/images/aws-aquarium.png"
     alt="An Aquarium deployment on AWS can use S3 as the object-store, and RDS for the database service"
     width="50%">

This configuration takes advantage of existing AWS services with managed data backups.
