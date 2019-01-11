# Docker Installation

We have provided Docker configuration scripts to run a self-contained instance of Aquarium.
This configuration is intended to support protocol development or evaluation, and supports all Aquarium services except for email notifications.

Just to be clear: _this configuration was developed for use by a single user on a single machine such as a laptop, and was not developed for deployments on a local server or the cloud_.
We currently suggest a
<a href="#" onclick="select('Getting Started','Manual Installation')">
manual installation
</a>
for production lab deployments.

## Running Aquarium with Docker

To run Aquarium in production with Docker on your computer:

1.  Install [Docker](https://www.docker.com/get-started) on your computer.

2.  <a href="#" onclick="select('Getting Started','Getting Aquarium')">
    Get the Aquarium source
    </a>

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

## Stopping Aquarium in Docker

To halt the Aquarium services, first type `ctrl-c` in the terminal to stop the running containers, then remove the containers by running

```bash
docker-compose down
```

## Updating/Migrating Aquarium

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

## Changing the Database

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