# Running Aquarium

## Quick Guide

| If you want to                      | Use this                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| Try out Aquarium                    | [local deployment](http://aquariumbio.github.io/aquarium-local/)                                  |
| Develop and test Aquarium protocols | [local deployment](http://aquariumbio.github.io/aquarium-local/)                                  |
| Run Aquarium on your own server     | [server-deployment](https://github.com/aquariumbio/aquarium-multiple-deployment) (also see below) |
| Run Aquarium on a cloud service     | Contact us                                                                                        |
| Do Aquarium development             | [developer documentation](http://aquariumbio.github.io/aquarium/development/)                     |

## About Deployment

The best way to try out Aquarium is to start with a [local deployment](http://aquariumbio.github.io/aquarium-local/).
We actually built these scripts so that we could do protocol development and testing on our personal machines rather than using a server.

To run Aquarium for a lab, you need a production deployment.
This requires a server connected to a network with ports open in the firewall so that Aquarium can be reached.
This server could be a computer that you control, it could be a virtual machine in a university computing center, or it could be a virtual machine in a cloud service.
Depending on your scenario, you may need to involve the system administrator or consult and IT specialist.

For users who want to install Aquarium on a locally controlled machine, we recommend using the [server-deployment](https://github.com/aquariumbio/aquarium-multiple-deployment).
These instructions provide scripts that allow you to use a Docker image that we manage, and also allow you to use your own host name with https for more secure access.
_You need to be able to open ports in your system firewall for Aquarium to be accessible from other computers._

Users who want to install Aquarium on a cloud service, should contact us for guidance since we don't currently provide scripts for this.
We also manage Aquarium deployments at AWS and TACC (UT Austin) for our own lab, and grant-funded collaborators.

## Custom Deployments

Most users should be using either the [local deployment](http://aquariumbio.github.io/aquarium-local/) or the [server-deployment](https://github.com/aquariumbio/aquarium-multiple-deployment), which address most user needs.

For users who need a customized deployment, there are two strategies for deploying Aquarium:

1. Use the Docker image [aquariumbio/aquarium](https://hub.docker.com/repository/docker/aquariumbio/aquarium).
   Use this strategy if you want to customize the other services that Aquarium uses.
   In this case, the easiest approach would be to start with the deployment scripts we provide and modify them based on information about configurations below.

2. Build your own Docker image.
   Use this strategy if you need to modify Aquarium in ways that we haven't yet allowed through the interface; see the [developer documentation](http://aquariumbio.github.io/aquarium/development/).

   This approach makes sense if you are modifying Aquarium for a research project, otherwise we are open to community contributions and you should feel free to make a pull request so that your work can also be used by others.

It is possible to run Aquarium without Docker, but we don't recommend it and are unable to provide support for those who attempt it.

## Configuring Aquarium Deployments

A basic Aquarium deployment consists of the Aquarium service, a database, an object-store, an image server, and a web-server.
A deployment may also have an email service.

<img src="docs/installation/images/aquarium-config.png"
     alt="An Aquarium deployment also includes a database, object-store and web-server"
     width="30%">

These services can be provided in different ways depending on your objectives and level of support.
For instance, for protocol development, we run Aquarium on our laptops.
And, so, in this case, the [local deployment](http://aquariumbio.github.io/aquarium-local/) configuration builds a fully-contained Docker container using nginx as the web-server, MySQL as the database service, and minio for both object-store and image server; but without an email service.

<img src="docs/installation/images/local-aquarium.png"
     alt="The local Aquarium deployment uses minio for the object-store and mysql as the database"
     width="30%">

### Deployment with Local Services

It is also possible to use these same local services for a production deployment.
The [server-deployment](https://github.com/aquariumbio/aquarium-multiple-deployment) configuration is similar to the local-deployment, but allows one or more instances of Aquarium to be run as named sites.

<img src="docs/installation/images/multi-aquarium.png"
     alt="The multi-Aquarium deployment uses nginx-proxy to route traffic to named Aquarium instances paired with a minio service."
     width="75%">

In this case, the [nginx-proxy](https://github.com/jwilder/nginx-proxy) service dynamically manages the reverse proxy for running Aquarium services and their corresponding minio services.
The nginx-proxy service also enables using https, which cannot be done with the local-deployment configuration.

### Deployment with External Services

Another alternative is to use external services instead of local ones.
For instance, Aquarium deployments at TACC (UT Austin) use a single, separate minio service.
And, the UW BIOFAB runs Aquarium on Amazon Web Services using AWS RDS for the database service, AWS S3 as the object-store service, [nginx](http://nginx.org) as the web server, an image server, and AWS SES as the email service.

<img src="docs/installation/images/aws-aquarium.png"
     alt="An Aquarium deployment on AWS can use S3 as the object-store, and RDS for the database service"
     width="50%">

This configuration takes advantage of existing AWS services with managed data backups.
