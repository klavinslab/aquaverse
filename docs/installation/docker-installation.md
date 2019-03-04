# Docker Installation

The latest release provides Docker configuration scripts that enable you to run a self-contained instance of Aquarium.
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

3.  Build the docker images. Change into the `aquarium` directory

    ```bash
    cd aquarium
    ```

    and run the command

    ```bash
    docker-compose build
    ```

4.  Start the container. On non-Windows platforms (e.g. MacOS or Linux), run the command

    ```bash
    docker-compose up
    ```

    to start the services for Aquarium.

    > **Important**:
    > The first run initializes the database, and so will be slower than subsequent runs.
    > This can take longer than you think is reasonable, but let it finish unmolested.

    On Windows, instead use the command

    ```bash
    docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.windows.yml up
    ```

5.  Check that everything is working. Once all of the services for Aquarium have started, visit `localhost` with the Chrome browser to find the Aquarium login page.
    If running Aquarium inside the Docker toolbox VM, the address will be instead be `192.168.99.100`.
    When started using the default database, aquarium has a single user with login `neptune` and password `aquarium`.

    If you get errors during startup after doing a build, you may need to run

    ```bash
    docker-compose pull --ignore-pull-failures
    docker-compose build --no-cache
    ```

    And, if that doesn't work, let us know.

## Stopping Aquarium in Docker

To halt the Aquarium services, first type `ctrl-c` in the terminal to stop the running containers, then remove the containers by running

```bash
docker-compose down
```

## Updating/Migrating Aquarium

Whenever a new version of Aquarium is released, first run

```bash
docker-compose down --rmi all -v --remove-orphans
```

to remove existing Docker configuration.
Then run

```bash
git pull
git checkout v2.5.1
```

to get the latest code. Replace `v2.5.1` with whatever the tag of the latest release is.
Then run

```bash
docker-compose build
```

to rebuild the Docker images.

If there are any necessary `rake` tasks (see the release notes of the new version) run

```bash
docker-compose up -d
docker-compose exec app /bin/sh
```

which stars Aquarium and the database sever. Then run the rake tasks.
For instance, to migrate the database, do:

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

You can use a different database dump by renaming it to this file with

```bash
mv docker/mysql_init/dump.sql docker/mysql_init/dump-backup.sql
mv my_dump.sql docker/mysql_init/dump.sql
```

then removing the contents of the `docker/db` directory

```bash
rm -rf docker/db/*
```

and finally restarting Aquarium with `docker-compose` as before.
If Aquarium has been updated since the database dump was generated, it is a good idea to run database migrations as described above.

> **Important**: If you swap in a large database dump, the database has to be reinitialized.
> And the larger the database, the longer the initialization will take.
> _Let the initialization finish._
