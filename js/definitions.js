var config = {
  tagline: "The Laboratory</br>Operating System",
  get_releases: true,
  workflows: [
    "/klavinslab/test-workflow"
  ],
  copyright: "Aquarium Web Page and Documentation Copyright © 2018 University of Washington",
  navigation: [

    {
      category: "Overview",
      contents: [
        { name: "About", type: "local-html", path: "about.html" },
        { name: "License", type: "local-md", path: "license.md"  },
        { name: "Releases", type: "local-html", path: "releases.html"  },
        { name: "Contributors", type: "local-md", path: "contributors.md"  },
        { name: "How to cite", type: "local-md", path: "cite.md"  },
      ]
    },

    {
      category: "Getting Started",
      contents: [
        { name: "Installation", type: "local-md", path: "docs/installation/index.md" },
        { name: "Basic Concepts", type: "local-md", path: "docs//concepts/index.md" }
      ]
    },

    {
      category: "Community",
      contents: [
        { name: "Workflows", type: "local-html", path: "workflows.html" },
        { name: "Importing", type: "local-md", path: "docs/sharing/import.md" },
        { name: "Exporting", type: "local-md", path: "docs/sharing/export.md" }
      ]
    },

    {
      category: "Researchers",
      contents: [
        { name: "Managing Inventory", type: "local-md", path: "docs/lims/index.md" },
        { name: "Designing Plans", type: "local-md", path: "docs/designer/index.md" }
      ]
    },

    {
      category: "Lab Management",
      contents: [
        { name: "Managing Jobs", type: "local-md", path: "docs/manager/index.md" },
        { name: "Running Jobs", type: "local-md", path: "docs/technician/index.md" },
        { name: "Managing Users", type: "local-md", path: "docs/users/index.md" },
        { name: "Inventory Definitions", type: "local-md", path: "docs/protocol_developer/types.md"},
        { name: "Location Wizards", type: "local-md", path: "docs/protocol_developer/location.md" },
      ]
    },

    {
      category: "Protocols",
      contents: [
        { name: "Developer Tools", type: "local-md", path: "docs/protocol_developer/tools.md" },
        { name: "Protocol Tutorial", type: "local-md", path: "docs/protocol_developer/protocol_tutorial.md" },
        { name: "Show Blocks", type: "local-md", path: "docs/protocol_developer/show.md" },
        { name: "Data Associations", type: "local-md", path: "docs/protocol_developer/associations.md" },
        { name: "Building Tables", type: "local-md", path: "docs/protocol_developer/table.md" },
        { name: "Detailed API Reference", type: "external-link", path: "http://klavinslab.org/aquarium/api/" },
      ]
    },

    {
      category: "Power Users",
      contents: [
        { name: "Python and Trident", type: "local-html", path: "trident.html" }
      ]
    }

  ]

};
