# Manual Installation

If your goal is to run Aquarium in production mode with many users, we recommend that you install Aquarium manually.
You can also install a personal instance manually if you prefer it over using the Docker configuration.

A manual installation requires first installing Ruby, Rails, MySQL, and, depending on the deployment, a web server.
The UW BIOFAB, for example, runs Aquarium on an Amazon Web Services EC2 instance using the web server [nginx](http://nginx.org), a MySQL database running on a separate RDS instance,
data stored in an AWS S3 bucket, and email handled through AWS SES.

## Installing Aquarium

Aquarium can be installed manually on a machine with a Unix&trade;-like environment with the following steps.

1.  Ensure you have  on your machine and have installed

    - [Ruby](https://www.ruby-lang.org/) version 2.6.3
    - [yarn](https://yarnpkg.com/)
      <br>

2.  Also, make sure that you have a [MySQL](https://www.mysql.com) server installed somewhere and an empty database created in it for use by Aquarium.

    When installing Aquarium on AWS you can use RDS, and, similarly, for another cloud service, you should be able to use the database service available there.

3.  <a href="#" onclick="select('Getting Started','Getting Aquarium')">
    Get the Aquarium source
    </a>

4.  Configure Aquarium by first creating the `aquarium/config/initializers/aquarium.rb` file

    ```bash
    cd aquarium/config/initializers
    cp aquarium_template.notrb aquarium.rb
    ```

    and then editing `aquarium.rb` to set the following values

    | Variable | Description |
    |----------|-------------|
    | `Bioturk::Application.config.instance_name` | The name that will appear on the navigation bar |
    | `Bioturk::Application.config.logo_path` | The directory path for your logo (default is Aquarium logo) |
    | `Bioturk::Application.config.image_server_interface` | The URL for your image server |
    | `Bioturk::Application.config.krill_hostname` | The URL for the Krill server. Use `localhost` if on the same server. |
    | `Bioturk::Application.config.email_from_address` | The sender email address for notifications |


5.  Configure the Aquarium database settings.
    First, create the `aquarium/config/database.yml` file with

    ```bash
    cd aquarium/config
    cp database_template.yml database.yml
    ```

    You should change the _production_ mode configuration to point to your database server.
    And, in this case, you don't need to worry about the remainder of the `database.yml` file.

6.  If you are installing on a server, e.g., other than your computer, copy the `aquarium` directory to the server, and open a command-line shell in that directory.

7. Install the Javascript libraries used by Aquarium with 

   ```bash
   yarn install --modules-folder public/node_modules && yarn cache clean
   ```

8.  Install the Ruby gems required by Aquarium with

    ```bash
    gem update --system
    gem install bundler --version '< 2.0' && \
        bundle install --jobs 20 --retry 5
    ```

    Note: if the MySQL database is not installed or not properly installed/configured, you may get errors during this step.

9.  Initialize the production database with

    ```bash
    RAILS_ENV=production rake db:schema:load
    ```

10. Pre-compile the assets:

    ```bash
    RAILS_ENV=production bundle exec rake assets:precompile
    ```

## Running Aquarium Locally

If you have installed Aquarium on your local computer, start Aquarium by running

```bash
RAILS_ENV=production rails s
```

and start the Krill server with the command

```bash
rails runner "Krill::Server.new.run(3500)"
```

then go to `http://localhost:3000/` to find the login page.

## Running Aquarium on a Server

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
