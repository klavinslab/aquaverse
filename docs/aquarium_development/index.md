# Aquarium Development Guide

These guidelines are intended for those working directly on Aquarium, though some details are shared with protocol development.

---

<!-- TOC -->

- [Aquarium Development Guide](#aquarium-development-guide)
    - [Getting Started](#getting-started)
    - [Running Aquarium](#running-aquarium)
        - [Initial steps](#initial-steps)
        - [Commands](#commands)
    - [Testing Aquarium](#testing-aquarium)
    - [Editing Aquarium](#editing-aquarium)
        - [Documenting changes](#documenting-changes)
        - [Formatting Aquarium code](#formatting-aquarium-code)
        - [Documenting Aquarium Ruby Code](#documenting-aquarium-ruby-code)
    - [Making an Aquarium Release](#making-an-aquarium-release)
    - [Docker configuration](#docker-configuration)
        - [Images](#images)
        - [Database](#database)
        - [Compose files](#compose-files)
        - [Local web server](#local-web-server)

<!-- /TOC -->

## Getting Started

Follow the Aquarium [installation]({{ site.baseurl }}{% link _docs/installation/index.md %}) instructions to get a local copy of the Aquarium git repository.

## Running Aquarium

To run Aquarium in development mode using the Docker configuration in a Unix&trade;-like environment, do the following.

### Initial steps

1. If you have previously run Aquarium in production mode, run

   ```bash
   rm -rf docker/db/*
   ```

   _WARNING_: this will destroy any changes you have made to the database in production mode.
   If you want to save these, you will have to create a database dump.

2. Make the `develop-compose.sh` script executable

   ```bash
   chmod u+x develop-compose.sh
   ```

   This script helps shorten the command you have to write.
   Instead of starting each command with

   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml
   ```

   you only have to start with the script name

   ```bash
   ./develop-compose.sh
   ```

### Commands

1. Build the docker images with

   ```bash
   ./develop-compose.sh build
   ```

   This should only be necessary the first time you run Aquarium in development mode.
   However, it may be needed any time you change the Aquarium configuration.
   In situations where dependencies change, you will also want to run `build` with the `--no-cache` option.

2. Start Aquarium with

   ```bash
   ./develop-compose.sh up
   ```

   This command starts services for Aquarium, Krill, MySQL, minio and nginx, which are needed to run Aquarium.
   
   To stop the services, type `ctrl-c` followed by

   ```bash
   docker-compose down
   ```

3. To run commands inside the Aquarium Ruby environment, precede each with

   ```bash
   ./develop-compose.sh run --rm app
   ```

   Specifically, you can run a shell within the Aquarium container with the command

   ```bash
   ./develop-compose.sh run --rm app /bin/sh
   ```

   where you can run `rake` or even the rails console.

4. To create a database dump, you'll need to start Aquarium, determine the container name for the `db` service using `docker ps`, copy the root database password from `docker-compose.override.yml`, and then run the command 

   ```bash
   docker exec <container-name> sh -c 'exec mysqldump --all-databases -uroot -p"<root-password>"' > /some/path/on/your/host/all-databases.sql
   ```

   replacing `<container-name>` and `<root-password>` with your values.

## Testing Aquarium

## Editing Aquarium

### Documenting changes

### Formatting Aquarium code

### Documenting Aquarium Ruby Code

Aquarium Ruby methods and classes should be documented with [Yardoc](http://www.rubydoc.info/gems/yard/file/docs/GettingStarted.md) regardless of whether they are public.

For instance, a function would be documented as

```ruby
# Display the instructions for centerfuging the given tubes.
#
# @param tubes [Array] the array of items representing tubes
def centerfuge_instructions(tubes)
  ...
end
```

unless a hash argument is used, in which case the comment would look like

```ruby
# Copy the data associations from the source item to the target item.
#
# @param args [Hash] the arguments indicating source and target items
# @option args [String] :source  the source item
# @option args [String] :target  the target item
def copy_associations(args)
  ...
end
```

Note that an argument with a default value is _not_ an option, and should just be listed using the `@param` tag.

Here are some ([borrowed](http://blog.joda.org/2012/11/javadoc-coding-standards.html)) style guidelines for documentation:

- Write your comments to be read from the source file.
  So, add formatting that is helpful to the programmer reading your code.
- The first sentence of the should be short, clear and to the point.
  Use the third person, e.g., "Returns the item ID for..."
- If documenting a class, use "this" to refer to an instance of the class.
- Aim for one (short) sentence per line.
  Each should end with a period.
- Use `@param` for all parameters, `@return` for return values, and `@raise` for exceptions raised.
  List these in that order.
- Put a single blank line after the first sentence, and then one after each paragraph.
  (If this doesn't give you a line before the first `@param` add one.)
- Write `@param` and `@raise` as a phrase starting with a lowercase letter and almost always the word "the", but with no period.
- Write `@raise` as a conditional phrase beginning with "if".
  Again, don't end the phrase with a period.

See also these yard [examples](https://gist.github.com/chetan/1827484)

The return value of a function should be documented using the `@return` tag, and any exception raised by a function should be documented with the `@raise` tag.
But, there are many more [tags](http://www.rubydoc.info/gems/yard/file/docs/Tags.md#Tag_List) available, and you should feel free to use them.

Running the command

```bash
yardoc
```

will generate the documentation and write it to the directory `docs/api`.
This location is determined by the file `.yardopts` in the project repository.
This file also limits the API to code used in Krill the protocol development language.

## Making an Aquarium Release

1.  (make sure Rails tests pass)
2.  Run `rubocop`, fix anything broken. Once done run `rubocop --auto-gen-config`.
3.  Update API documentation by running `yard`
4.  (make sure JS tests pass)
5.  Make sure JS linting passes
6.  Update the version number in `config/initializers/version.rb` to the new version number.
7.  (Update change log)
8.  Create a tag for the new version:
    ```bash
    git tag -a v$NEWVERSION -m "Aquarium version $NEWVERSION"
    git push --tags
    ```
9.  [Create a release on github](https://help.github.com/articles/creating-releases/).
    Visit the [Aquarium releases page](https://github.com/klavinslab/aquarium/releases).
    Click "Tags".
    Click "add release notes" for the new tag, use the change log as the release notes.
    Click "publish release".

## Docker configuration

The Aquarium Docker configuration is determined by these files:

```bash
aquarium
|-- Dockerfile                  # defines the image for Aquarium
|-- docker
|   |-- aquarium                # Aquarium configuration files
|   |-- aquarium-entrypoint.sh  # entrypoint for running Aquarium
|   |-- db                      # directory to store database files
|   |-- krill-entrypoint.sh     # entrypoint for running Krill
|   |-- mysql_init              # database dump to initialize database
|   |-- nginx.development.conf  # nginx configuration for development server
|   |-- nginx.production.conf   # nginx configuration for production server
|   `-- s3                      # directory for minio files
|-- docker-compose.dev.yml      # development compose file
|-- docker-compose.override.yml # production compose file
|-- docker-compose.windows.yml  # windows compose file
`-- docker-compose.yml          # base compose file
```

### Images

The `Dockerfile` configures Aquarium images `basebuilder`, `devbuilder` and `prodbuilder`.
The `devbuilder` and `prodbuilder` images are configured to allow Aquarium to be run as a local instance in the development and production environments, while the `basebuilder` image contains the configuration common to both.

The `basebuilder` configuration copies rails configuration files from the `docker/aquarium` directory into the correct place in the image; and adds the `docker/aquarium-entrypoint.sh` and `docker/krill-entrypoint.sh` scripts for starting the Aquarium services.
The configuration also ensures that the `docker/db` and `docker/s3` directories needed for the database and [minio](https://minio.io) S3 server are created on the host as required by the compose files.
The `devbuilder` and `prodbuilder` configurations build an image with environment specific files.

### Database

The `docker/mysql_init` directory contains the database dump that is used to initialize the database when it is run the first time.
The MySQL service is configured to use the `docker/db` directory to store its files, and removing the contents of this directory (`rm -rf docker/db/*`) will cause the database to initialize the next time the service is started.

The contents of the `docker/db` directory also need to be removed when changing between running in production and development environments.
If you want to save the contents of the database, you will have to perform a database dump from within the `app` container.

### Compose files

The docker-compose files are defined to allow Aquarium to be run locally in production or development modes and on Windows.
Specifically, the files are meant to be combined as follows:

- `docker-compose.yml` and `docker-compose.override.yml` runs production,
- `docker-compose.yml` and `docker-compose.dev.yml` runs development, and
- adding `docker-compose.windows.yml` allows MySQL to run on Windows.

The order of the files is significant since the later files add or replace definitions from the base file.

Note that the command for the first combination

```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml up
```

is equivalent to the simpler command

```bash
docker-compose up
```

Running in production is the default configuration, because the most common usage of a local installation is by someone doing protocol development who will want to mirror the production server of the lab.

The `docker-compose build` command needs to be run with the same file arguments as you are intending to run Aquarium.

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
```

This is the same for running a command within the service with `docker-compose run`, such as

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml run --rm app /bin/sh
```

which runs a shell within the container running Aquarium in the development environment.

### Local web server

Access to the servers run by docker-compose is handled by nginx.

Note that Aquarium allows files to be downloaded by returning a pre-authenticated link to the S3 server.
It is currently expected that the host for these URLs will be inaccessible.
This can, in principle, be resolved by redirecting the S3 host internally, but this still needs to be done.
For the desperate, it should also be possible to create a local DNS with the internal name defined.
