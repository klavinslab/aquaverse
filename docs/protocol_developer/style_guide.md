# Protocol Style Guide

## The Audience 

Protocols will be written (and possibly adapted by) other programmers; maintaining a consistent style will make it easier to read and adapt protocols. 

## Nemo 

Working on protocols will be a lot easier using the VS Code [Nemo Extension](https://github.com/klavinslab/nemo), which allows you to work in a regular text editor and then push the code to Aquarium 
This will also allow you to use rubocop(with solograph), which will help with keeping a consistent style.
[Rubocop]https://rubocop.readthedocs.io/en/latest/

Some of things Rubocop will check for:

We will mainly (with a few exceptions) follow the guidelines described in the rubocop [Ruby Style Guide]
`https://github.com/rubocop-hq/ruby-style-guide`, or, in a more readable [version]`https://rubystyle.guide/`

* Naming: snake_case for method/function names: e.g. `sort_cells` instead of `sortCells` and 
* Indentation: use spaces (not tabs). Two spaces per tab. 
* One empty line between methods
* Line Length: Keep under 80 characters in a line. 
    - This issue shows up quite a bit for show blocks, where it is natural to make long strings for instructions.
    - It is possible to write a string across multiple lines using a backslash to break up lines:

```
check 'Put on new gloves and bring a new tip box (green: 10 - 100 µL), a pipettor (10 - 100 µL),'\
       'and an Eppendorf tube rack to the M80 area.'
```


## Headings

Since we don't have a git like system for version control, we want to create a record of who worked on a protocol. We also want a record of any major changes.
To that end, we'll want to add some information at the top of the page. 
* If you're starting a new protocol: 
* Include your name and the date at the top. 
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

## Docs 
* Include a short description of what the protocol is for.
* `Runs a selected gel through gel electrophoresis` 
* If it's part of a longer series, include what procedures generally come before or after. 
* e.g. `Runs after Pour Gel and is a precursor to Extract Fragment.`

## Important notes. 
* Not sure where to put these now -- don't really work in the docs, but it would be nice to not have huge commented out notes.



## Best Practices for Comments and Titles 
solograph can parse the yard documentation 

* What is the purpose of comments? 
    * Comments should do >>>>>
    * Comments should not just repeat what is in the title, or the name of the method. (Why not What).
    ```
    This method tells the technician to set up the power supply
    ``` 
    * We'll follow the yard/rdoc style we're already using within the aquarium code 
    * "# This method tells the technician to set up the power supply."

* Can be useful for explaining details of a calculation, that kind of thing. 

## Cleaning up the Cruft 
* Leaving in commented code can make protocols difficult to read/edit. 
* If you are removing text, don't just comment it out. If you think someone might want to use it again, you can make a note at the top of the protocol withthe verison number in which you removed it.

## Show block titles 
* Titles should describe the overall purpose of the block. They should not contain specific details. 
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

## Protocol Structure 
## Dividing into methods

* Ideally, the main method of the protocol will only call methods, either built in aquarium methods (`retrieve`, `store`) or else methods you define.

* If the title of the method isn't self-explanatory, you might want to comment on what it does when you call it (though ideally, it'd be self explantory).
* The main method should be at the top of the class, defined methods underneath. 
* `prepare_stripwells` `save_order_data`
* Good example protocol: Cloning/Make Glycerol Stock 

## Calling methods 

* Ruby style is usually to leave out parentheses in method calls unless they're are arguments. 
* For our purposes, it would be better if methods were called with parentheses regardless of whether or not they take arguements.
`get_protocol_feedback()`
`gather_enzymes(composition: composition)`
* Ruby style (and our style) is to use parens in method definitions if you have parameters:  
* `def image_gel gel, image_name` as opposed to `def image_gel(gel, image_name)`
* Arguments -- always use keyword arguments?

## Libraries
We have code in some protocols that can probably be used in another. However, we don't want to do to much copypasting.
If you find you are going to copy paste quite a bit from an existing protocol, make a library instead and import it.

* Use ones we already have (e.g. Units library). (Link to some other yet to exist document)

* Ones that use units library -- well, ones that site it anyway!: 
* Cloning/Run Gel', 'Cloning/Assemble Golden Gate','Cloning/Stitch by Overlap Extension',
* Yeast/Streak Plate', 'Yeast/Fragment Analyzing', 'Yeast/Yeast Mating', Yeast/Y-PER DNA Extraction',
* 'Next Gen Prep/Digest Genomic DNA', 'Next Gen Prep/Yeast Plasmid Extraction',  'Next Gen Prep/Run Pre-poured Gel',
* 'Next Gen Prep/KAPA Pure Beads',  'High Throughput Culturing/Make Glycerol Stock Plates'] 
* Use libraries rather than copy pasting code from libraries into protocol.
* If you're pasting a lot from another protocol, make a library. 
* Put libraries where they belong (i.e., if it's a general library, it shouldn't be in a specific section)
* If you're largely referring to code from libraries in one category, your protocol should probably be in that category too.


