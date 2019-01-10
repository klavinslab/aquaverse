# Configuring Your Instance

There are several details that can be configured in Aquarium should you want.
These include such things as the name of your instance, the logo displayed on the Aquarium landing page, or the S3 service used to handle files.

What files you change depends on how you installed Aquarium.
For Docker installations, you will change the configuration files located in `docker/aquarium`, while for a manual installation the files are located in the `config` directory or subdirectories.

## Setting the instance name

An Aquarium instance has a name that you see on the login page and the upper left-hand corner of each page.
By default, the name is **Your Lab**.
You can change this to something you prefer by replacing the string assigned to the `instance_name` in `aquarium.rb`.
For instance, for a local instance on your laptop, you might change the instance name to **LOCAL** by changing the string at the end of the line:

```ruby
Bioturk::Application.config.instance_name = 'LOCAL'
```

For Docker installation, change `docker/aquarium/aquarium.rb`.
For manual installation, change `config/initializers/aquarium.rb`.

## Setting the instance logo

The **Aq** block logo that is on the Aquarium landing page can also be replaced.
To do this add your logo file to `app/assets/images`, and change the line setting `logo_path` in `aquarium.rb`

```ruby
Bioturk::Application.config.logo_path = 'aquarium-logo.png'
```

to use your file name instead of `aquarium-logo.png`.

For Docker installation, change `docker/aquarium/aquarium.rb`, and run `docker-compose build` to add the file to the image.
For manual installation, change `config/initializers/aquarium.rb`.

## Changing the S3 service

The S3 service used by Aquarium is set in `production.rb` by assigning to `config.paperclip_defaults`.

The Docker configuration of Aquarium uses a minio S3 service as configured in the `docker-compose` files, and files uploaded to Aquarium are directly accessible in the directory `docker/s3`.
In addition, the minio console is available at `http:localhost:9000` using the minio credentials from the `docker-compose.yml` file.

For a manual configuration, you will want to change these settings to an S3 service.
To use AWS S3, you can change the assignment to `config.paperclip_defaults` in `production.rb` to

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

Alternatively, for a minio server set `config.paperclip_defaults` in `production.rb` to

```ruby
  config.paperclip_defaults = {
    storage: :s3,
    s3_protocol: 'http',
    s3_permissions: 'private',
    s3_region: ENV.fetch('S3_REGION'), 
    s3_credentials: {
      bucket: ENV.fetch('S3_BUCKET_NAME'),
      access_key_id: ENV.fetch('S3_KEY'),
      secret_access_key: ENV.fetch('S3_SECRET_ACCESS_KEY')
    },
    s3_host_name: "#{ENV['S3_HOSTNAME']}:9000",
    s3_options: {
      endpoint: "http://#{ENV['S3_HOSTNAME']}:9000",
      force_path_style: true
    }
  }
  ```

This assumes the environment variables used are set.

For Docker configuration, modify `docker/aquarium/production.rb`, and set the environment variables in the `environment` clause of the `app` service in `docker-compose.override.yml`.
See [Environment Variables in Compose](https://docs.docker.com/compose/environment-variables/)
For manual configuration, modify `config/environments/production.rb` and the environment variables have to be set in the environmennt where Aquarium is run.

## Configuring the email service

Aquarium is currently only able to use the AWS SES for email notifications.
This ability is enabled by this configuration at the end of `production.rb`:

```ruby
AWS.config(
  region: ENV.fetch('AWS_REGION'),
  simple_email_service_endpoint: "email.#{ENV.fetch('AWS_REGION')}.amazonaws.com",
  simple_email_service_region: ENV.fetch('AWS_REGION'),
  ses: { region: ENV.fetch('AWS_REGION') },
  access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID'),
  secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY')
)
```

which requires most of the same environment variables for AWS S3.

The Docker configuration does _not_ provide an email server container, meaning that email notifications will not work unless explicitly configured in `docker/aquarium/production.rb`.
For manual configuration, modify `config/environments/production.rb`.

## Configuring the database

The database used in the included configuration files is MySQL.
Changing to a different database management system requires changes to the `database.yml` and `Gemfile`, but is standard Rails configuration.

For a manual configuration modify `config/database.yml`.
Changing the Docker configuration is more complex, and we'll just say that it would require changing the `docker-compose` files and leave it as an exercise for the persistent.
