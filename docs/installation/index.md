# Running Aquarium

## Local Deployment

Use a local deployment for protocol development and testing, or trying out the system.
See [local deployment](https:github.com/klavinslab/aquarium-local) for instructions.

If you are doing Aquarium development, see the developer documentation in the
[Aquarium repository](https://github.com/klavinslab/aquarium) for instructions.

## Production Deployment

Use a production deployment to run Aquarium for use by a lab.
There are three strategies for deploying Aquarium:

1. use the Docker image [aquariumbio/aquarium](https://hub.docker.com/repository/docker/aquariumbio/aquarium),
2. build your own Docker image, and
3. run Aquarium without Docker.

The first strategy should work in most scenarios, and is what is covered in this document.
Choose the second if you need to modify Aquarium in ways that we haven't yet allowed through the interface; see the developer documentation in the [Aquarium repository](https://github.com/klavinslab/aquarium).
The third is for people who want to bring Aquarium to life by the sweat of their brow –– the Dockerfile in the [Aquarium repository](https://github.com/klavinslab/aquarium) may be useful as a guide.

### Deployment basics

A basic Aquarium deployment consists of the Aquarium service, a database, an object-store, an image server, and a web-server.
A deployment may also have an email service.

<img src="docs/installation/images/aquarium-config.png"
     alt="An Aquarium deployment also includes a database, object-store and web-server"
     width="30%">

These services can be provided in different ways depending on your objectives and level of support.
For instance, for protocol development, we run Aquarium on our laptops.
And, so, in this case, the [local deployment](http://klavinslab.org/aquarium-local/) configuration builds a fully-contained Docker container using nginx as the web-server, MySQL as the database service, and minio for both object-store and image server; but without an email service.

<img src="docs/installation/images/local-aquarium.png"
     alt="The local Aquarium deployment uses minio for the object-store and mysql as the database"
     width="30%">

### Deployment with Local Services

It is also possible to use these same local services for production deployment.
The [multi-deployment](https://github.com/klavinslab/aquarium-multiple-deployment) configuration is similar to the local-deployment, but allows one or more instances of Aquarium to be run as named sites.

<img src="docs/installation/images/multi-aquarium.png"
     alt="The multi-Aquarium deployment uses nginx-proxy to route traffic to named Aquarium instances paired with a minio service."
     width="75%">

In this case, the [nginx-proxy](https://github.com/jwilder/nginx-proxy) service dynamically manages the reverse proxy for running Aquarium services and their corresponding minio services.
The nginx-proxy service also enables using https, which cannot be done with the local-deployment configuration.

### Deployment with External Services

Another alternative is to use external services instead of local ones.
For instance, the Aquarium deployments that inspired the multi-deployment configuration, use a single, separate minio service.
And, the UW BIOFAB runs Aquarium on Amazon Web Services using AWS RDS for the database service, AWS S3 as the object-store service, [nginx](http://nginx.org) as the web server, an image server, and AWS SES as the email service.

<img src="docs/installation/images/aws-aquarium.png"
     alt="An Aquarium deployment on AWS can use S3 as the object-store, and RDS for the database service"
     width="50%">

This configuration takes advantage of existing AWS services with managed data backups.
