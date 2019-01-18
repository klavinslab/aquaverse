# Location Wizards

A Location Wizard manages the locations of items within the lab.
For example, primers might be stored in a -20C freezer in 81 slot freezer boxes stored on shelves that contain 16 boxes.
A wizard for this scheme would have locations of the form M20.x.y.z where x is the shelf (or hotel as we call them in the Klavins lab), y is the box, and z is the slot in the box.

<img src="docs/concepts/images/location.png"
     style="max-width: 300px"
     width="100%"
     alt="Locations are hierarchical">

A wizard tracks all locations with the specified form.
When a new item is made, the wizard finds the lowest available location for that item relative to the lexicographic order.
(Here the lexicographic order is W.x.y.z < W.X.Y.Z if x < X, or x=X and y<Y, or x=X and y=Y, and z<Z.)
If all available locations are taken, the wizard computes the next new location and puts the item there.

## Defining a New Wizard

The interface for creating a new `LocationWizard` can be found under the navigation menu in the upper left of Aquarium.

<img src="docs/manager/images/location_images/1_nav_menu-1.png"
     style="max-width: 300px"
     width="100%"
     alt="Open the system menu">

<img src="docs/manager/images/location_images/2_nav_menu-2.png"
     style="max-width: 200px"
     width="100%"
     alt="Select Locations Wizards in the system menu">

There, at the bottom of the page, you can click **New Wizard**.
The wizard name should be short, such as `M20` as it will be used as the first part of the location.
The description can be a sentence or so.
The field names are used to remind the user what each field means.
In the example above, we would use "Hotel", "Box", and "Slot".
The capacity for the second two fields can be a finite, positive number.
In the above example, we would use 16 for the Box field and 81 for the Slot field.
The first field is always assumed to have infinite capacity (meaning you can go buy more freezers as you need them).

## Associating a Wizard with an Object Type

A location wizard can be added to either an existing object type or a new object type, by entering the name of the wizard in the **Location Prefix** field on the object type page.
All new items with that object type will use the wizard with that name, if there is one defined.
Note that multiple object types can use the same wizard.
For example, we store _Primer Aliquots_, _Primer Stocks_, _Plasmid Stocks_, etc. in the same type of freezer box.

## Moving Items

In both the sample page and the item page, you can enter in a new location for an item.
If the location has the form of a wizard location, then it must be empty for you to move the item there, otherwise Aquarium will not let you move it.
You can also set the location to some other string, such as _Bench_.
Doing so will take the item out of the wizard's control.
You can also put it back under wizard control by moving it to an empty location of the form managed by the associated wizard.
