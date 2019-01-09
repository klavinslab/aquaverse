# Installing and Running Aquarium

We recommend that labs doing protocol development run at least two instances: a nursery server and a production server.
A _nursery_ server is shared within the lab for the purposes of trying out protocols under development, while the _production_ server actually controls the lab.
We use this arrangement in the Klavins lab to run the UW BIOFAB so that protocols can be evaluated without affecting the actual lab inventory.
In addition to these lab servers, each protocol developer should run a local instance.

The reason for using different instances of Aquarium is that protocol testing can be disruptive to the lab.
First, protocols may change the underlying database, which depending on the effects, could change the status of items that are in use in the lab.
And, second, errors in protocols being tested can affect lab system performance and disrupt protocols underway.
So, our strong recommendation is that protocol testing _should not_ be done on a production server.

## Getting Aquarium

Regardless of how you choose to install and run Aquarium you will need to obtain the Aquarium source.
If you use a non-Windows system, do this by using [git](https://git-scm.com) with the command

```bash
git clone https://github.com/klavinslab/aquarium.git
```

On Windows use

```bash
git clone https://github.com/klavinslab/aquarium.git --config core.autocrlf=input
```

By default, this gives you the repository containing the bleeding edge version of Aquarium, and you will want to choose the Aquarium version you will use.
The most definitive way to find the latest release is to visit the [latest Aquarium release](https://github.com/klavinslab/aquarium/releases/latest) page at Github, take note of the tag number (e.g., v2.5.0), and then checkout that version.
For instance, if the tag is `v2.5.0` use the command

```bash
cd aquarium
git checkout v2.5.0
```

(If you are doing Aquarium development, see the [git tagging documentation](https://git-scm.com/book/en/v2/Git-Basics-Tagging) for details on working with git tags.)

## Docker Installation

We have provided Docker configuration scripts to run a self-contained instance of Aquarium.
This configuration is intended to support protocol development or evaluation, and is nearly complete, though it does not have the services needed for email notifications.

Note we assume a Unix&trade;-like environment, though our experience is that the Windows Subsystem for Linux is sufficient to run Aquarium locally when used with the Docker Toolbox VM on Windows.

Just to be clear: _this configuration was developed for use by a single user on a single machine such as a laptop, and was not developed for deployments on a local server or the cloud_.
We currently suggest a [manual installation](#manualinstallationinstructions) for cloud deployments.

### Running Aquarium with Docker

To run Aquarium in production with Docker on your computer:

1.  Install [Docker](https://www.docker.com/get-started) on your computer.

2.  [Get the Aquarium source](#gettingaquarium).

3.  To build the docker images, change into the `aquarium` directory

    ```bash
    cd aquarium
    ```

    and run the command

    ```bash
    docker-compose build
    ```

4.  To start aquarium on non-Windows platforms, run the command

    ```bash
    docker-compose up
    ```

    which starts the services for Aquarium.

    > **Important**:
    > The first run initializes the database, and so will be slower than subsequent runs.
    > This can take longer than you think is reasonable, but let it finish unmolested.

    On Windows, instead use the command

    ```bash
    docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.windows.yml up
    ```

    Once all of the services for Aquarium have started, visit `localhost` with the Chrome browser to find the Aquarium login page.
    If running Aquarium inside the Docker toolbox VM, the address will be instead be `192.168.99.100`.
    When started using the default database, aquarium has a single user with login `neptune` and password `aquarium`.

### Stopping Aquarium in Docker

To halt the Aquarium services, first type `ctrl-c` in the terminal to stop the running containers, then remove the containers by running

```bash
docker-compose down
```

### Updating Aquarium

When a new version of Aquarium comes available, run

```bash
git pull
docker-compose build
```

to get and build the new version.
And if there are any necessary `rake` tasks run

```bash
docker-compose up -d
docker-compose exec app /bin/sh
```

to start Aquarium and the database, and then run the rake tasks.
For instance, migrating the database:

```bash
rake db:migrate RAILS_ENV=production
```

After you've run all of the rake tasks, exit from the connection and shutdown Aquarium with

```bash
exit
docker-compose down
```

And, finally, restart Aquarium with `docker-compose up` as before.

### Configuring the Instance

The Aquarium Docker image uses configuration files located in `docker/aquarium` instead of the corresponding files in the `config` directory.
So, if you want to tweak the configuration of your Aquarium Docker installation, change these files.

Specific configuration:

1.  An Aquarium instance has a name, which you see on the login page and the upper left-hand corner of each page.
    By default, the name is **Your Lab**.
    You can change this to something you prefer by replacing the string assigned to the `instance_name` in `docker/aquarium/aquarium.rb`.
    For instance, for a local instance on your laptop, you might change the instance name to **LOCAL** by changing the string at the end of the line:

    ```ruby
    Bioturk::Application.config.instance_name = 'LOCAL'
    ```

2.  The **Aq** logo that is on the Aquarium landing page can also be replaced.
    Do this by adding your logo file to `app/assets/images` and change the line setting `logo_path`

    ```ruby
    Bioturk::Application.config.logo_path = 'aquarium-logo.png'
    ```

    to use your file name.
    Run `docker-compose build` after making this change to ensure the file is included in the Docker image.

3.  Aquarium uses a minio S3 service as configured in the `docker-compose` files, and files uploaded to Aquarium are directly accessible in the directory `docker/s3`.
    In addition, the minio console is available at `http:localhost:9000` using the minio credentials from the `docker-compose.yml` file.
    You can modify which S3 service is used by changing the paperclip settings in `docker/aquarium/production.rb`.
    For instance, to use AWS S3 change the assignment to `config.paperclip_defaults` to

    ```ruby
    config.paperclip_defaults = {
      storage: :s3,
      s3_host_name: "s3-#{ENV['AWS_REGION']}.amazonaws.com",
      s3_permissions: :private,
      s3_credentials: {
        bucket: ENV.fetch('S3_BUCKET_NAME'),
        access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID'),
        secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY'),
        s3_region: ENV.fetch('AWS_REGION')
      }
    }
    ```

    To use this configuration, set the used environment variables in the `environment` clause of the `app` service in `docker-compose.override.yml`.

4.  The Docker configuration does _not_ provide an email server container, meaning that email notifications will not work unless explicitly configured.
    See the comments in `docker/aquarium/production.rb` for more information.

### Changing the Database

Aquarium database files are stored in `docker/db`, which allows the database to persist between runs.
If this directory is empty, such as the first time Aquarium is run, the database is initialized from the database dump `docker/mysql_init/dump.sql`.

You can use a different database dump by renaming it to this file

```bash
mv my_dump.sql docker/mysql_init/dump.sql
```

and then removing the contents of the `docker/db` directory

```bash
rm -rf docker/db/*
```

and restarting Aquarium with `docker-compose` as before.

> **Important**: If you swap in a large database dump, the database has to be reinitialized.
> And the larger the database, the longer the initialization will take.
> _Let the initialization finish._

## Manual Installation

If your goal is to run Aquarium in production mode with many users, you should install and run Aquarium manually.
This requires first installing Ruby, Rails, MySQL, and, depending on the deployment, a web server.
The UW BIOFAB, for example, runs Aquarium on an Amazon Web Services EC2 instance using the web server [nginx](http://nginx.org) and the MySQL database running on a separate RDBMS instance.
Of course, you can also install a personal instance manually if you prefer.

We discuss some of the considerations for running Aquarium below, but your deployment may require fine-tuning beyond what we describe.

### Installing Aquarium

Aquarium can be installed manually on a machine with a Unix&trade;-like environment with the following steps.

1.  Ensure you have  on your machine and have installed

    - [Ruby](https://www.ruby-lang.org/en/) version 2.3.7
    - [npm](https://www.npmjs.com/get-npm)
      <br>

2.  Also, make sure that you have a [MySQL](https://www.mysql.com) server installed.

    When installing Aquarium on AWS you can use RDS, and, similarly, for another cloud service, you should be able to use the database service available there.

3.  [Get the aquarium source](#getaquarium).

4.  Configure Aquarium by first creating the `aquarium/config/initializers/aquarium.rb` file

    ```bash
    cd aquarium/config/initializers
    cp aquarium_template.notrb aquarium.rb
    ```

    and then editing `aquarium.rb` to set the URLs and email address.

5.  Configure the Aquarium database settings.
    First, create the `aquarium/config/database.yml` file with

    ```bash
    cd ..  # aquarium/config
    cp database_template.yml database.yml
    ```

    You should change the _production_ mode configuration to point to your database server.
    And, in this case, you don't need to worry about the remainder of the `database.yml` file.

6.  If you are installing on a server, e.g., other than your computer, copy the `aquarium` directory to the server, and open a command-line shell in that directory.

7.  In the `aquarium` directory, install the Ruby gems required by Aquarium with

    ```bash
    gem update --system
    gem install bundler
    bundle install --jobs 20 --retry 5
    ```

    Note: if the MySQL database is not installed or not properly installed/configured, you may get errors during this step.

8.  Install Javascript libraries used by Aquarium with the command

    ```bash
    npm install -g bower@latest
    bower install --config.interactive=false --force
    ```

9.  Initialize the production database with

    ```bash
    RAILS_ENV=production rake db:schema:load
    ```

10. Pre-compile the assets:

    ```bash
    RAILS_ENV=production bundle exec rake assets:precompile
    ```

### Running Aquarium Locally

If you have installed Aquarium on your local computer, start Aquarium by running

```bash
RAILS_ENV=production rails s
```

and start the Krill server with the command

```bash
rails runner "Krill::Server.new.run(3500)"
```

then go to `http://localhost:3000/` to find the login page.

### Running Aquarium on a Server

Running on a server requires additional configuration that is not covered here, since there are many reasonable alternatives.

As mentioned above, the UW BIOFAB runs Aquarium on an Amazon Web Services EC2 instance and uses AWS S3, RDS and SES services.
Relevant configuration files to these details are `config/database.yml`, `config/initializers/aquarium.rb` and `config/environments/production.rb`.

In addition, Aquarium is run using [puma](http://puma.io), but the web pages are served by [nginx](http://nginx.org) acting as a reverse proxy server that also serves static pages.
These details are similar to the Docker production environment, and you may find it useful to refer to the files

- `docker/aquarium/production_puma.rb`
- `docker/nginx.production.conf`

for puma and nginx configuration.
Additionally, the entrypoint files

- `docker/aquarium-entrypoint.sh`
- `docker/krill-entrypoint.sh`

illustrate how Aquarium and Krill are started.

