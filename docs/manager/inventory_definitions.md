# Defining Types

Sample types are used to organize the kinds of samples that may occur in an Aquarium instance.
Examples of sample types are plasmid, yeast strain, and media.
Sample types define fields that samples of the type will have, and can refer to other sample types.

An object type represents the form in which an item of a sample is handled.
For instance, it may be a container (e.g., a 1L bottle), or the state of a sample (e.g., Plasmid Glycerol Stock).

We suggest first checking the
<a href="#" onclick="select('Community','Workflows')">community workflows</a>
for workflows using sample types that you will use in your lab.
Importing the workflows will also import the definitions that you will use in your lab, allowing you to avoid having to create all of the types.

## Defining Sample Types

To add a new sample type, click the system ("hamburger") menu at the top left of the Aquarium page and select **Sample Type Definitions**.
Click **New**.

A sample type must at a minimum have a name, and should have a description.
Complete sample types will also have fields that will be used in the creation of new samples.
For instance, the UW BIOFAB definition of _Yeast Strain_ has fields including `parent`, `plasmid`, and `plasmid markers`.
A field may hold a sample, string, url or number, be required, or be an array.
If the field is a sample, you need to specify the sample type (click **Add Option**); and if the field is a string or number you can give a list of valid values.

To edit an existing sample type, click **Edit** next to the sample type to get the same interface to update the type.
Note that non-additive changes (changing types or deleting fields) could have an adverse effect on the system.

## Defining Object Types

To add a new object type associated with a sample type, open the sample type page, and select **Add**.
Alternatively, click the system ("hamburger") menu at the top left of the Aquarium page, and select **Containers**.

Using the fields on the sample container page, add the name and description.
Then specify the minimum and maximum number of instances of the object type, the cost of each, the dimensions if a collection, how the object should be released, the sample type, and descriptions of release, safety, cleanup, data and vendor information.

You can assign a location wizard to the object type by putting the name of the wizard in the **Location Prefix** field.
