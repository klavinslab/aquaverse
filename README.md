# Aquaverse: Main Aquarium Web Page

This web page renders through github pages at [http://www.aquarium.bio](http://www.aquarium.bio).

## Customizing the menu

Documentation is mainly stored in the docs directory, with images in subdirectories.
The menu on the left sidebar is editable via the js/definitions.js file, which defines
a config global variable with an array valued field called "navigation". Each entry
in the navigation array looks something like

```javascript
    {
      category: "Overview",
      contents: [
        { name: "About", type: "local-html", path: "about.html" },
        { name: "License", type: "local-md", path: "license.md"  },
        { name: "Releases", type: "local-html", path: "releases.html"  },
        { name: "Contributors", type: "local-md", path: "contributors.md"  },
        { name: "API", type: "external-link", path: "http://klavinslab.org/aquarium/api/" },
      ]
    }
```

which should be pretty clear how to edit.

## Links in Files Documentation

To insert an image in a document, use either an md image tag like the following

```markdown
    [Plan Designer](docs/designer/images/designer-overview.png)
```

or an html image tag, as in

```html
<img src="docs/designer/images/designer-overview.png"
     alt="Plan Designer"
     style="max-width: 400px"
     width="100%">
```

which allows you to add css styling to the tag.

To link to a section in the same document, you can use a relative tag. For example,
if you have a subsection specified with

```markdown
    ## My Section
```

you would refer to it with

```markdown
[My Section](#mysection)
```

where the tag is all lowercase and the spaces have been removed.

To link to another page of the documentation, as specified in js/definitions.js,
use a hyperlink of the following form:

```html
<a href="#" onclick="select('Lab Management','Inventory Definitions')">
  Inventory Definitions
</a>
```
