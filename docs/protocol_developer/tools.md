# Developer Tools

Aquarium has a Developer tab that provides an integrated development environment (IDE) for creating and editing new protocols. Specifically, to define a new protocol, a developers creates an _operation type_ that includes the code for the protocol along with several other components, described below.

## Working in Aquarium

The Developer tab provides the IDE for developing new operation types in Aquarium.
Clicking on the Developer tab in Aquarium brings you to a view similar to the one pictured below.
On the left is a list of operation types and libraries in your instance of Aquarium organized by category,
and the right pane is the operation type definition view.
When you open the tab, the definition for the first operation type in the first category is displayed; in this case, the `Make PCR Fragment` operation type from the UW BIOFAB's `Cloning` category.

<img src="docs/protocol_developer/images/developer_tab.png"
     alt="developer tab"
     max-width="100%">

Within each category, the libraries and operation types defined in that category are listed.
Clicking on the name of a library or operation type will open its definition in the view on the right.

<img src="docs/protocol_developer/images/category_list.png"
     alt="category list"
     style="max-width: 200px">

Clicking on `New` creates a new operation type (`New Lib` creates a new library), and opens the definition view.
This allows you to set the operation type and category type names.

<img src="docs/protocol_developer/images/definition_tab.png"
     alt="definition tab"
     max-width="400px">

Clicking on the **Protocol** tab opens the protocol editor.
For a new operation type, a default protocol is added to the editor when you first open it.
[Keyboard shortcuts](https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts) are available.

<img src="docs/protocol_developer/images/protocol_tab.png"
     alt="protocol tab"
     max-width="400px">

Be sure to click **Save** at the bottom of the page before switching from the Developer tab.

Clicking on the **Pre** tab shows the precondition for the operation type in a new editor.
A default precondition that always returns `true` is created for new operation types.

<img src="docs/protocol_developer/images/pre_tab.png"
     alt="precondition tab"
     style="max-width: 500px">

The **Cost** tab shows the cost model for the operation type, which is function taking an `Operation`.
This function returns a hash with costs associated with the `labor` and `materials` keys.
The default function added for new operation types returns zero for both.

<img src="docs/protocol_developer/images/cost_tab.png"
     alt="cost tab"
     style="max-width: 500px">

The **Docs** tab shows another editor, but this time for documentation, written in Markdown, for the operation type.
This documentation will be displayed to the user when the click on operations of this type in the Designer.
The documentation will also be used to generate workflow documentation if you publish your workflow
with Aquarium's <a href="#" onclick="select('Community','Exporting')">Export</a> tool.

<img src="docs/protocol_developer/images/doc_tab.png"
     alt="docs tab"
     style="max-width: 500px">

The **Timing** tab indicates when the operation type should be run in the lab.

<img src="docs/protocol_developer/images/timing_tab.png"
     alt="timing tab"
    style="max-width: 500px">

The **Test** tab provides a way to run a quick test with the protocol.
To run a test, specify the `Batch Size`, the number of operations to batch, click **Generate Operations** and then **Test**.
This will generate random inputs for the operations and run the protocol.

<img src="docs/protocol_developer/images/test_tab.png"
     alt="test tab"
     style="max-width: 500px">

We recommend that you not use the test tab on a production server, because it will slow the server down,
and use up item numbers.

## Working with External Tools

Because Aquarium protocols are written in a Ruby DSL, you can edit protocols outside of Aquarium and copy them in.

If you use the VS Code Extension, [Nemo](https://github.com/klavinslab/nemo), you can work in VS Code and pull and push protocols directly from/to aquarium.
This allows you to use tools such as [Rubocop](https://rubocop.readthedocs.io/en/latest/) to check for issues in your protocol code.

If you would like to use a different text editor, you will need to cut and paste the whole protocol or library code between the Aquarium developer's page and your text editor.


