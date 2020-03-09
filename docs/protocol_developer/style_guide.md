# Headings -- Create a record of who worked on what 

* If you are writing a new protocol, include your name and the date at the top. 
`Written by Grace Hopper -- Date`
* If you are editing a protocol, please also note your name and the date.
`Revised by Ada Lovelace -- Date`
* If you are making a major revision, add a note about what was revised. 
`Revised by Marie Tharp -- Date -- Added new section, Deleted xyz, Changed important thing`

* Short description of what it does -- if this is lengthy -- add to docs instead. How are we meant to be using docs? 
* Important notes. 

# Best Practices for Comments and Titles 
* what is the doc section for -- it's not used a lot -- it should probably have the description of what the protocol is for, special notes, etc.

* What is the purpose of comments? 
Do we want to follow the yard/rdoc style we're already using within the aquarium code itself?
    * Right now we have comments that say things like " # This method tells the technician to set up the power supply." followed by a show block with title "set up power supply". 
* Can be useful for explaining details of a calculation, that kind of thing. 
* Delete sections of commented out code -- if you might want it later you can always mark that you took it out at certain revision #.
    * This is a readability issue in som of the protocols -- so much commented out code. 
* Related -- What is the purpose of titles?
    * Titles should not contain actual protocol steps (e.g. "prep thing" and then the steps, rather then "Add 20ml of x to y".)  

# Dividing into methods

* Ideally, the main method of the protocol will only call methods, either built in aquarium methods (`retrieve`, `store`) or else methods you define.
* If the title of the method isn't self-explanatory, you might want to comment on what it does when you call it (though ideally, it'd be self explantory).
* `prepare_stripwells` `save_order_data`
* Good example: Cloning/Make Glycerol Stock 

* What can go in a method should (i.e. don't make a 250 line if statement).
* Steps first, method definitions later (i.e. consistency in format) 

# Calling methods 

* Ruby style is usually to leave out parentheses in method definitions/calls unless they are needed. 
* For our purposes, it would be better if methods were called with parentheses regardless of whether or not they take arguements.
`get_protocol_feedback()`

* Use parens even though Ruby says not to. 
* Use them with parameters too (I find it hard to read when you have something like `def image_gel gel, image_name` as opposed to `def image_gel(gel, image_name)`
* Arguments -- always use keyword arguments?

# Repeat some points from the general Ruby style guide?

* Also -- we can only use rubocop for changing the aquarium code -- not for protocols I assume? 
* The most relevant things from that lengthy document. 
* I know we have rubocop, and the ruby style guide, but pointing out the conventions we're sticking with could be useful. 
`https://github.com/rubocop-hq/ruby-style-guide`

# Libraries
* Use ones we already have (e.g. Units library).
* Use libraries rather than copy pasting code from libraries into protocol.
* If you're pasting a lot from another protocol, make a library. 
* Put libraries where they belong (i.e., if it's a general library, it shouldn't be in a specific section)
* If you're largely referring to code from libraries in one category, your protocol should probably be in that category too.


