Importing Workflows
===

_New in v2.5.0!_

Importing workflows allows you to add capabilities to your instance of Aquarium.
A workflow consists of a set of Operation Types, Protocols, Code Libraries, Sample Type definitions and Container definitions.
Workflows are stored in files ending with .aq.
You can find workflows to import on in the Community &gt; Workflows section of this website.
When you import a workflow, Aquarium attempts to be conservative about changing existing workflows already installed.
For example, Aquarium will not overwrite your Sample Type or Containers with Sample Types and/or Containers of the same name.
You can also configure what to do if there are existing Operation Types with the same names as the ones you are importing.

**Good Practice:** Make a back up of your Aquarium database before important a workflow. At this time, there is no easy
  un-import feature in Aquarium.

Viewing Workflow Information
---

To import a workflow, go to "Import Workflows" available in the drop down menu at the top left in the Aquarium tool bar.
Next, click "LOAD" and choose a file ending in .aq from your local computer, which will load the workflow into the user interface.
In particular, the operation types, libraries and inventory definitions that will be added to your instance of Aquarium will be shown.

Controlling the Import
---

On the left sidebar, choose how you want to import the workflow.
- Check DEPLOY if you would like all new operation types to automatically be deployed after being imported.
      If you do not choose this option, you will have to navigate to each new operation type in the Developer tab and
      click "Deploy" there.
- Choose what you want to happen when Aquarium finds an operation type with the same name and in the same category
      as one you are important. Aquarium can "Fail", meaning the import does not occur. Aquarium cam "Skip" importing the
      particular operation type. Or if you choose "Rename Existing", Aquarium will rename and re-catagorize existing operation types.

Finalizing the Import
---

Finally, once you are happy with the options, click "IMPORT". If the import is successful, Aquarium will let you know. Otherwise,
Aquarium will describe problems it encountered while importing. One common problem is that existing Sample Type or Container types
have the same names as the ones you are importing, but have some fields defined differently. If you are certain it is okay to do so,
you can change those fields to match the incoming definitions, and then attempt the import again.
