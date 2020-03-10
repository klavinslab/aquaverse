# Protocol Style Guide

## Headings

* Since we don't have a git like system for version control, we want to create a record of who worked on what 
* If you are writing a new protocol, include your name and the date at the top. 
`Written by Grace Hopper -- Date`
* If you are making significant changes a protocol, please also note your name and the date.
`Revised by Ada Lovelace -- Date`
* If you are making a major revision, add a note about what was revised. 
`Revised by Marie Tharp -- Date -- Added new section, Deleted xyz, Changed important thing`

## Docs 
* Include a short description of what the protocol is for.
* If it's part of a longer series, include what procedures generally come before or after. 

## Important notes. 
* Not sure where to put these now -- don't really work in the docs, but it would be nice to not have huge commented out notes.

## Cleaning up the Cruft 
* Leaving in commented code can make protocols difficult to read/edit. 
* If you are removing text, don't just comment it out. If you think someone might want to use it again, you can make a note at the top of the protocol withthe verison number in which you removed it.

## Repeat some points from the general Ruby style guide?

* Also -- we can only use rubocop for changing the aquarium code -- not for protocols I assume? -- if you use Nemo?
* The most relevant things from that lengthy document. 
* I know we have rubocop, and the ruby style guide, but pointing out the conventions we're sticking with could be useful. 
`https://github.com/rubocop-hq/ruby-style-guide`

## Best Practices for Comments and Titles 
solograph can parse the yard documentation 
* What is the purpose of comments? 
    * Do we want to follow the yard/rdoc style we're already using within the aquarium code itself?
    * Right now we have comments that say things like " # This method tells the technician to set up the power supply." followed by a show block with title "set up power supply". 

* Can be useful for explaining details of a calculation, that kind of thing. 

* Related -- What is the purpose of titles?
    * Titles should not contain actual protocol steps 
    * (e.g. "prep thing" and then the steps, rather then "Add 20ml of x to y".)  

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
* Ones that use units library -- well, ones that site it anyway!: 
* Cloning/Run Gel', 'Cloning/Assemble Golden Gate','Cloning/Stitch by Overlap Extension',
* Yeast/Streak Plate', 'Yeast/Fragment Analyzing', 'Yeast/Yeast Mating', Yeast/Y-PER DNA Extraction',
* 'Next Gen Prep/Digest Genomic DNA', 'Next Gen Prep/Yeast Plasmid Extraction',  'Next Gen Prep/Run Pre-poured Gel',
* 'Next Gen Prep/KAPA Pure Beads',  'High Throughput Culturing/Make Glycerol Stock Plates'] 
* Use ones we already have (e.g. Units library).
* Use libraries rather than copy pasting code from libraries into protocol.
* If you're pasting a lot from another protocol, make a library. 
* Put libraries where they belong (i.e., if it's a general library, it shouldn't be in a specific section)
* If you're largely referring to code from libraries in one category, your protocol should probably be in that category too.


