# Production Deployment

These instructions are for you if your goal is to run Aquarium in production mode with many users.

There are essentially three strategies for deploying Aquarium:

1. use the Docker image [aquariumbio/aquarium](https://hub.docker.com/repository/docker/aquariumbio/aquarium),
2. build your own Docker image from the [Aquarium repository](https://github.com/klavinslab/aquarium), and
3. run Aquarium without Docker.

The first strategy should work in most scenarios, and is what is covered in this document.
You might choose to do the second if you need to modify Aquarium in ways that we haven't otherwise allowed for yet, and is supported by the developer documentation.
The third is for zealots who should feel free to use the Aquarium Dockerfile as a guide.


## Deployment Alternatives

An basic Aquarium deployment consists of the Aquarium service, a database, an object-store, an image server, and a web-server.
A deployments may also have an email service.

<img src="docs/installation/images/aquarium-config.png"
     alt="An Aquarium deployment also includes a database, object-store and web-server"
     width="30%">

(Note that it is also necessary to run a Krill service, but this service is not shown here.)

These services can be provided in different ways depending on your objectives and level of support.
As an example, the UW BIOFAB runs Aquarium on Amazon Web Services using AWS RDS for the database service, AWS S3 as the object-store service,  [nginx](http://nginx.org) as the web server, an image server, and AWS SES as the email service.

<img src="docs/installation/images/aws-aquarium.png"
     alt="An Aquarium deployment on AWS can use S3 as the object-store, and RDS for the database service"
     width="50%">

This configuration takes advantage of existing AWS services with managed data backups.

For protocol development, we want run Aquarium on our laptops.
For this purpose, the [local deployment](http://klavinslab.org/aquarium-local/) builds a fully-contained Docker container using nginx as the web-server, MySQL as the database service, and minio for both object-store and image server; but no email service.

<img src="docs/installation/images/local-aquarium.png"
     alt="The local Aquarium deployment uses minio for the object-store and mysql as the database"
     width="50%">

It is also possible to use these same local services for production deployment.
The [multi-deployment](https://github.com/klavinslab/aquarium-multiple-deployment) configuration is similar to the local-deployment, but allows one or more instances of Aquarium to be run as named sites.

<img src="docs/installation/images/multi-aquarium.png"
     alt="An Aquarium deployment also includes a database, object-store and web-server"
     width="75%">

In this case, the [nginx-proxy](https://github.com/jwilder/nginx-proxy) dynamically manages the web proxy for running Aquarium services and their corresponding minio services.
The nginx-proxy service also enables using https.

## Configuring Aquarium

Details for related systems can be set using environment variables:

**Database**:
The database is configured to use MySQL by default with the hostname configured for [local deployment](http://klavinslab.org/aquarium-local/).

| Variable | Description | Default |
|----------|-------------|---------|
| DB_NAME | the name of the database | `production` |
| DB_USER | the database user | `aquarium` |
| DB_PASSWORD | the password of the user | – |
| DB_ADAPTER | the database adapter name | `mysql2` |
| DB_HOST | the network address of the database | `db` |
| DB_PORT | the network port of the database | `3306` |

**Email**:
To use the AWS SES set the `EMAIL_SERVICE` to `AWS` along with 

| Variable | Description | Default |
|----------|-------------|---------|
| AWS_REGION | the region for the AWS server | – |
| AWS_ACCESS_KEY_ID | the access key id for your account | – |
| AWS_SECRET_ACCESS_KEY | the access key for your account | – |

**Krill**:
Set the environment variable `KRILL_HOST`

| Variable | Description | Default |
|----------|-------------|---------|
| KRILL_HOST | the hostname for the krill server | `krill` |
| KRILL_PORT | the port served by the krill server | 3500 |

**S3**:
Aquarium is configured to use either AWS S3 or minio, and is set to use minio by default with the hostname configured for [local deployment](http://klavinslab.org/aquarium-local/).

To use minio set the following variables

| Variable | Description | Default |
|----------|-------------|---------|
| S3_PROTOCOL | network protocol for S3 service | `http` |
| S3_HOST | network address of the S3 service | `localhost:9000` |
| S3_REGION | name of S3 region | `us-west-1` |
| S3_BUCKET_NAME | name of S3 bucket | `development` |
| S3_ACCESS_KEY_ID | the access key id for the minio service | – |
| S3_SECRET_ACCESS_KEY | the access key for the minio service | – |

For the local deployment, the minio service is named `s3`, but it is necessary to redirect `localhost:9000` in order to use the minio docker image.

To use AWS S3 set the variable `S3_SERVICE` to `AWS` along with the following variables

| Variable | Description | Default |
|----------|-------------|---------|
| S3_REGION | name of S3 region | – |
| S3_BUCKET_NAME | name of S3 bucket | – |
| S3_ACCESS_KEY_ID | the access key id for your account | – |
| S3_SECRET_ACCESS_KEY | the access key for your account | – |

**Timezone**: 
Set the variable `TZ` to the desired timezone for your instance.
This should match the timezone for your database.

### Config file

Some of configuration can be done using a file `instance.yml` with keys for the values you want to set.
For instance, to change the name of the instance to `Wonder Lab` use the file

```yaml
default: &default
  instance_name: Wonder Lab

production:
  <<: *default

development:
  <<: *default
```

And, then map the Aquarium path `/aquarium/config/instance.yml` to this file.
For instance, in the docker-compose.yml file, add the following line to the `volumes` for
the aquarium service:

```
  - ./instance.yml:/aquarium/config/instance.yml
```

The following values can be set using this file or environment variables:

| Config key | Environment Variable |  Default |
|----------|-------------|---------|
| lab_name | LAB_NAME | `Your Lab` |
| lab_email_address | LAB_EMAIL_ADDRESS | – |
| logo_path | LOGO_PATH | `aquarium-logo.png` |
| image_uri | IMAGE_URI | *S3_PROTOCOL*`://`*S3_HOST*`/images/` |



## Running Aquarium
