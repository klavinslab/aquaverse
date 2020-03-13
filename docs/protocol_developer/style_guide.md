# Protocol Style Guide

## Who are you writing for?

Protocols will be written (and possibly adapted by) other programmers; maintaining a consistent style will make it easier to read and adapt protocols.

## What is Nemo and why would I use it?

The VS Code [Nemo Extension](https://github.com/klavinslab/nemo) allows you to work in a regular text editor and then push the code to Aquarium 
This also allows you to use [Rubocop](https://rubocop.readthedocs.io/en/latest/), a linter and ruby style formatter. This will help with keeping a consistent style.

## Rubocop and Ruby Style

We will mainly (with a few exceptions) follow the guidelines described in the rubocop [Ruby Style Guide](https://github.com/rubocop-hq/ruby-style-guide), or, [more readable version](https://rubystyle.guide/) here.

### Naming

* Use snake_case for variable, method, and function names: e.g. `sort_cells` instead of `sortCells`  
* Use CamelCase for class and module names `module StripwellMethods`

### Spacing

* Use spaces (not tabs). Two spaces per tab.
* Leave one empty line between method definitions.
* Don't leave extra white space at the end of lines.
* Keep lines under under 80 characters.
- This issue comes up quite a bit for show blocks, where it is natural to make long strings for instructions.
- It is possible to write a string across multiple lines using a backslash to break up lines:
```
check 'Put on new gloves and bring a new tip box (green: 10 - 100 µL), a pipettor (10 - 100 µL),' \
      ' and an Eppendorf tube rack to the M80 area.'
```

### Defining and Calling methods

* Ruby style is to leave out parentheses in method calls unless the method is being called with arguments.
* For our purposes, always use parentheses regardless of whether or not the method takes arguements.
`get_protocol_feedback()` instead of `get_protocol_feedback`

* Use parentheses in method definitions that take parameters:
 ```
    def image_gel(gel, image_name)
        do something with gel and image_name
    end
 ```

* Ruby will allow you to set paramenters without using parentheses, but it's difficult to read.
``` 
    def image_gel gel, image_name
        do something with gel and image_name
    end
```

* Keyword arguments are preferred. You can set them with or without defaults. 

```
    def set_primers(forward_primer:, reverse_primer:, samples: 1)
      do something with forward_primer and reverse_primer  
    end
```

* When you call the methods, you will assign values to the parameters like this: 
```
set_primers(forward_primer: 123, reverse_primer: 456) 
```
forward_primer will be set to 123, reverse_primer will be set to 456, samples will be set to 0) 

or this: 
```
set_primers(forward_primer: 123, reverse_primer: 456, samples: 12) 
```

forward_primer will be set to 123, reverse_primer will be set to 456, samples will be set to 12) 

## Headings

Since we don't have a git like system for version control, we want to create and maintain a record of who worked on a protocol as well as a record of any major changes.
* If you are starting a new protocol, write your name and the date at the top of the page.
```
# Extract Fragment Protocol
# Written By Ayesha Saleem 2018-01-12
```
* If you are making significant changes, note your name, the date, and what was changed.
```
# Extract Fragment Protocol
# Written By Ayesha Saleem 2018-01-12
# Revision: Justin Vrana, 2018-07-21 (refactored collection removal proceedure, added plasimd stock dilution)
# Revision: Orlando do Lange, 2019-09-12 (Added precondition for when an input is a Ligation product)
``` 

## What to include in the Docs section of a protocol 

* Include a short description of what the protocol is for.
```
Runs a selected gel through gel electrophoresis
``` 

* If the protocol is part of a larger series, include what procedures generally come before or after.
```
Runs after Pour Gel and is a precursor to Extract Fragment.
```

## When to Comment (and when not to) 

### Documenting with Yarddoc 

We use [YARD](https://www.rubydoc.info/gems/yard/file/docs/GettingStarted.md) to generate documentation. More often, though, people will be reading the comments along with your code, so readability is important.

To document methods and classes for use with YARD, the first line of the comment should briefly describe the purpose of the method and should be written in the third person. This should be followed by a blank line. If the method takes parameters, returns something, or raises exceptions, that line will be followed by information about those things.

```
# Perform the Streak Plate Protocol for a single operation
#
# @param operation [Operation] the operation to be executed
def operation_task(operation)
    Method Body
end
```
 
### Scientific Comments

You will sometimes want to add comment that gives technical details about a procedure or calculation.
* Within a method

        ```
        # Set the masses of DNA to be used for each operation. 
        
        ratio = op.input("Insert:Backbone").val
        total_ng = op.input("Total_DNA_ng").val

        ... many more lines omitted here 

        op.output("Plasmid").item.associate :concentration, (total_ng / total_µl)
        ```

* In line 

        ```
        BUFFER_VOL = 10 # vol of buffer in each ligase buffer aliquot
        (though in this case you could just call the variable BUFFER_VOL_PER_ALIQUOT
        ```

### TODO Comments

* If there is something you need to come back to later, or fix upon getting updated information, you can make a comment starting with #TODO

### Comments to Remove

* Leaving in commented code makes protocols difficult to read/edit.
* If you are removing text, don't just comment it out. If you think someone might want to use it again, you can make a note at the top of the protocol with the version number from which you removed it. We keep records of all versions in our database.
* If you are starting a new protocol, please delete the boilerplate at the top (the text that starts with "This is a default...")
* If you made comments to help yourself while writing (e.g., marking which 'end' goes with what), please remove those as well. 

## Protocol Structure

### Constants

* Define at the top in screaming snake case: DNA_AMOUNT = 500 #ng

### Dividing into methods

Ideally, the main method of the protocol will only call methods, either built-in aquarium methods (`retrieve`, `store`) or else methods you define.

* The main method should be at the top of the class, defined methods underneath.
* If the title of a method isn't self-explanatory, you might want to comment on what it does when you call it (though ideally, it'd be self explantory, e.g. `prepare_stripwells`, `save_order_data`).

## Show Block Titles
* Titles should describe the overall purpose of the block. They should not contain specific instructions for technicians.
``` 
show do
    title   'Wash Columns'
    check   'Add 2ul PE buffer and wait 5 minutes'
end
```
not:
```
show do
    title   'Wash columns with 2ul PE buffer'
    check   'Add buffer and wait five minutes'
end
```

## Libraries
We have code in some protocols that can probably be used in others. We would like to minimize duplicated code. One way we can do this is by using libraries. If you are going to reuse a substantial amount of code, either make a library for it, or add it to one of our existing libraries.

* If you are creating a new library, put it in the correct category (i.e., if you're protocol is in plantwork, your library should probably be as well.)

