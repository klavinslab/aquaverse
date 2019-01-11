# Show Blocks

A show block is used to display instructions for the technician.

This document discusses the basic features of show blocks.
Refer to the [API documentation](http://klavinslab.org/aquarium/api/Krill/ShowBlock.html) for more details.

---

## "Hello Technician"

A show block is used to give instructions to the technician running the protocol.
Show blocks are created and displayed in the technician view with the `show` method.
`show` takes a single argument: a code block.
This code block contains the contents that are intended to be shown to the technician.
This might take the form of instructions with how to proceed with a protocol, or of user input fields to collect sample measurements for storing in the lab database.
Each call to `show` constitutes a new slide in the technician view that will be shown while running the protocol.
Lets create a simple protocol with a show block that says "Hello World"

```ruby
class Protocol
  def main
    show do
        note "Hello World"
    end
  end
end
```

When run from the technician view this protocol has a single step:

<div style="width:75%">
  <img src="docs/protocol_developer/images/show_images/1_hello_world-1.png"
       alt="the show block displays Hello World">
</div>

Making a protocol with multiple steps is as simple as calling `show` multiple times

```ruby
class Protocol
  def main
    show do
        note "Hello"
    end

    show do
        note "World"
    end
  end
end
```

The above code produces a protocol with two steps.
The first displays "Hello":

<div style="width:75%">
  <img src="docs/protocol_developer/images/show_images/2_hello_world-2.png"
       alt="the show block displays Hello">
</div>

And, the second displays "World":

<div style="width:75%">
  <img src="docs/protocol_developer/images/show_images/3_hello_world-3.png"
       alt="the show block displays World">
</div>

You may have noticed that naked strings cannot be placed directly into show blocks.
Any object intended for display to the technician must be in the block as an argument of a show block instance method.
`note` is such an instance method. It takes a String and displays it directly on the technician view slide as a single line.
`title` is another which does the same thing, except the String will be displayed as a header.

Many show blocks are composed mostly of a single `title` call, and one or more `note` calls that liberally use string insertion. For instance, here is a show block that asks the technician to grab some amount of 1.5mL tubes

```ruby
    show do
      title "Grab 1.5 mL tubes"
      note "Grab #{operations.length} 1.5 mL tubes"
    end
```

When run in a protocol with 5 operations, the technician would see the following instruction

<div style="width:75%">
  <img src="docs/protocol_developer/images/show_images/4_serious_example.png"
       alt="the show block displays instructions to grab five tubes">
</div>

## Show Block Methods

For a comprehensive list of methods that are available for use in show blocks, see the
[API documentation on show blocks](https://klavinslab.org/aquarium/api/Krill/ShowBlock.html)

The most commonly used show block methods are the following:

- `title` to display the header for a slide
- `note` to display a line of text on the slide
- `check` to display a checkbox with a line of text
- `warning` to display a bold line of text that is highlighted yellow
- `image` to display an image
- `table` to display the contents of a 2d array or a `Table` object as a table
  <a href="#" onclick="select('Protocols', 'Building Tables')">Table Documentation</a>
  for more details on how to generate and display `Tables` to the technician.
- `get` displays a field that allows the technician to provide a value.

## Dynamic Show Blocks

As already mentioned, we can achieve somewhat dynamic show blocks by inserting ruby expressions into the Strings displayed by `note` using the ruby String insertion `#{}`.
It is also possible to use complex ruby code within the code blocks of the `show` method to programmatically decide how show block methods will be executed.

For instance, we could modify our earlier show block to give different instructions depending on the amount of `Operations` the protocol is run with

```ruby
    show do
      title "Grab 1.5 mL tubes"
      if operations.length > 50
        note "Go to the storeroom and bring back #{operations.length} 1.5 mL tubes to bench"
      end
      note "Grab #{operations.length} 1.5 mL tubes from bench"
    end
```

Running this on the technician view, we would see an additional line of instruction being offered when the protocol is run with 51 or more `Operations`

We can achieve powerful emergent behavior by using ruby code inside show blocks. Another example, using loops

```ruby
    show do
      title "Grab 1.5 mL tubes"
      operations.each do |op|
        check "Grab a tube for operation: #{op.id}"
      end
    end
```

Here is the output on the Technician view for the latter example with 5 `Operations`

<div style="width:75%">
  <img src="docs/protocol_developer/images/show_images/5_dynamic_example.png"
       alt="the show block displays instructions to grab five specific tubes">
</div>

## Getting Technician Input

There are two show block methods that are used to retrieve input from the technician: `get` and `select`. They work in the same way, except that `get` allows the technician to enter a String response, and `select` has the technician select an item from a dropdown menu.

`get` provides a textbox for the technician to enter a String. Its first parameter is the type of input, as "number", or "text", and it also requires the `var:` option to hold a valid key name, as the key that will be later used to access the inputted data. Here is the code for a simple show block that prompts the technician for a response

```ruby
show do
    title "Please Respond"
    note "What is your first name?"
    get "text", var: :tech_name
end
```

This would display the following slide to the technician

<div style="width:75%">
  <img src="docs/protocol_developer/images/show_images/6_input_block-1.png"
       alt="the show block asks for technician input">
</div>

We can customize the textbox further with the `label:` and `default:` options

```ruby
show do
    title "Please Respond"
    note "What is your first name?"
    get "text", var: :tech_name, label: "Enter name", default: "Joe Schmo"
end
```

Now our textbox is a bit more informative

<div style="width:75%">
  <img src="docs/protocol_developer/images/show_images/7_input_block-2.png"
       alt="the show block asks for technician input">
</div>

Any input data from a show block is returned by the call to `show` that created the block as a `ShowResponse` object. The name that we entered as the option for `:var` will be what we use to request that piece of data from the ShowResponse.

In order to access the name entered by the technician, we capture ShowResponse in a variable called `responses`, and then request data for the key `:tech_name`

```ruby
responses = show do
    title "Please Respond"
    note "What is your first name?"
    get "text", var: :tech_name, label: "Enter name", default: "Joe Schmo"
end

responses.get_response(:tech_name) #=> "Joe Schmo"
```

`select` has almost the same interface as get, except instead of giving a type as the first parameter, we must provide an array of selection options. For example, we might want to prompt the tech to report the status of a bacterial plate – whether it is normal, a lawn, or contaminated

_Example from `Cloning/Check Plate`_

```ruby
responses = show do
    title "Report Plate status"

    operations.each do |op|
        plate = op.input("Plate").item
        select ["normal", "contamination", "lawn"], var: "status-#{plate.id}", label: "For plate #{plate}, choose whether there is contamination, a lawn, or whether it's normal."
    end
end
```

Notice that this time we are storing data for each `Operation`, so we must parameterize the `var:` option, otherwise all the selections would be stored under the same key in the data hash.

Here is what the slide would appear to the technician as

<div style="width:75%">
  <img src="docs/protocol_developer/images/show_images/8_input_block-3.png"
       alt="the show block asks for technician input for each operation">
</div>

To use the data stored in the Check Plate example, we have to parameterize our hash access in the same way as we did while storing the data

```ruby
operations.each do |op|
    plate = op.input("Plate").item
    responses.get_response("status-#{plate.id}") #=> <selection response for that Plate>
end
```

The `ShowResponse` also can give the timestamp of when the show block was shown and responded to by the tech with the `timestamp` method. This returns a Unix time value.

```ruby
responses.timestamp #=> <current time in seconds since 1970>
```

Another convenient way to collect information relating to each `Operation` in an `OperationList` is to accept technician responses through a input `Table` on the `OperationsList`.
See the <a href="#" onclick="select('Protocols', 'Building Tables')">Table Documentation</a>Table Documentation</a> on getting User for more details.
