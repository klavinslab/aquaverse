# Protocol Concepts: Locations

This is the documentation for interacting with the location of items to facilitate effective retrieval and storage in Aquarium protocols.
See <a href="#" onclick="select('Lab Management','Location Wizards')">Location Wizards</a> for details on configuring lab locations.

For an item `plasmid`, the expression

```ruby
plasmid.location
```

returns the location of the item.

To move the item to an empty location `W.1.2.3` (`W` is a location wizard) do

```ruby
plasmid.move_to('W.1.2.3')
```

which will set the location and save the item.
If the move fails, you will see error messages with the standard Rails `ActiveRecord` error interface with

```ruby
plasmid.errors.full_messages.join(', ')
```

You should also run `plasmid.reload` after this and other location calls to make sure that all associations are updated.

To set the location of the item to something out of the scope of the wizard, do

```ruby
plasmid.location = 'Bench'
```

And, to return the item to a wizard location, do:

```ruby
plasmid.location = 'W.1.2.3'
```

Note that you should only use the above if the item is not being managed by the wizard.
If `plasmid` is managed by a wizard and you do `plasmid.location = 'W.1.2.3'`, then the old location for `plasmid` will not be released.

If you do not have a particular location in mind, it is probably better to do

```ruby
plasmid.store
plasmid.reload
```

in which case the wizard will find the lowest available location.
Use `plasmid.location` to see where the item was stored.

To delete an item, do

```ruby
plasmid.mark_as_deleted
```

which does not remove the item, but just removes any location information (i.e. the item isn't _anywhere_, so it must not exist).
You can check to see if an item is deleted with

```ruby
plasmid.deleted?
```

and you can restore the item by doing `plasmid.store`, which will put it in a wizard-managed location again.
