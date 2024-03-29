# User Management

## Create an Administrative Account

If you are running Aquarium with Docker, the user `neptune` (with password initially set to `aquarium`) has administrative privilege and can be used to create other accounts.

Otherwise, you will need to create an administrative user with the commands

```bash
cd aquarium
RAILS_ENV=production rails c
load 'script/init.rb'
make_user "Your Name", "your login", "your password", admin: true
```

## Adding users in Aquarium

Once you have an account you can create other users by choosing `Users` in the menu at the top left of the Aquarium page:

<img src="docs/users/images/settings-menu.png"
    alt="choosing users"
    style="max-width: 200px"
    width="100%">

Then enter the user information and click **New User**

<img src="docs/users/images/new-user.png"
    alt="creating user"
    style="max-width: 200px"
    width="100%">

This will bring you to the user information page where user contact information should be entered:

<img src="docs/users/images/new-user-page.png"
    alt="new user page"
    width="100%">

The exclamation points on this page indicate that the user hasn't provided contact information, and has not agreed to usage terms.
The user will need to login separately to agree to the usage terms.

A user must have administrative privilege to access the protocol development tools.
For this, choose **Groups** from the settings menu, choose the group, and then click add:

<img src="docs/users/images/add-to-group.png"
    alt="add user to group"
    width="100%">

Also, a user must have an associated budget to run any workflows.

## Creating a Group

To create a group, choose **Groups** from the settings menu.
Click the **New Group** button, fill out the name and description fields, and click **Save**.
This will open the new group and allow you to add existing users as members by clicking **Add Member**.

## Changing Password

To change your password, select **Users** from the settings menu, click the name of the user whose password you want to change, and then click **Change Password** in the list on the left.
Then enter the new password and click **ALL**.

Only administrative users are able to change the password of other users.

## Retiring Users

To be able to retire users, you first need to create a group named `retired`.

Open **Users** from the settings menu, then click the **retire** link to the right of the user name, and confirm that you want to retire the user.
The user will now be listed in the `retired` group.
