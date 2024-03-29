var config = {
  tagline: "The Laboratory</br>Operating System",
  get_releases: true,
  workflows: [
    "/klavinslab/test-workflow",
    "/aquariumbio/sample-models",
    "/aquariumbio/pcr-models",
    "/aquariumbio/yeast-display"
  ],
  copyright:
    "Aquarium Web Page and Documentation Copyright © 2018 University of Washington",
  nextprev: true,
  navigation: [
    {
      category: "Overview",
      contents: [
        { name: "About", type: "local-html", path: "about.html" },
        { name: "License", type: "local-md", path: "license.md" },
        { name: "Releases", type: "local-html", path: "releases.html" },
        { name: "Contributors", type: "local-md", path: "contributors.md" },
        { name: "How to cite", type: "local-md", path: "cite.md" }
      ]
    },

    {
      category: "Getting Started",
      contents: [
        {
          name: "Basic Concepts",
          type: "local-md",
          path: "docs/concepts/index.md"
        },
        {
          name: "Installation",
          type: "local-md",
          path: "docs/installation/index.md"
        }
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
        {
          name: "Managing Inventory",
          type: "local-md",
          path: "docs/lims/index.md"
        },
        {
          name: "Designing Plans",
          type: "local-md",
          path: "docs/designer/index.md"
        }
      ]
    },

    {
      category: "Lab Management",
      contents: [
        {
          name: "Managing Jobs",
          type: "local-md",
          path: "docs/manager/index.md"
        },
        {
          name: "Running Jobs",
          type: "local-md",
          path: "docs/technician/index.md"
        },
        {
          name: "Managing Users",
          type: "local-md",
          path: "docs/users/index.md"
        },
        {
          name: "Inventory Definitions",
          type: "local-md",
          path: "docs/manager/inventory_definitions.md"
        },
        {
          name: "Location Wizards",
          type: "local-md",
          path: "docs/manager/location_wizards.md"
        }
      ]
    },

    {
      category: "Protocols",
      contents: [
        {
          name: "Creating a Protocol",
          type: "local-md",
          path: "docs/protocol_developer/tutorial_protocol.md"
        },
        {
          name: "Improving a Protocol",
          type: "local-md",
          path: "docs/protocol_developer/tutorial_operations.md"
        },
        {
          name: "Show Blocks",
          type: "local-md",
          path: "docs/protocol_developer/show.md"
        },
        {
          name: "Data Associations",
          type: "local-md",
          path: "docs/protocol_developer/associations.md"
        },
        {
          name: "Locations",
          type: "local-md",
          path: "docs/protocol_developer/location.md"
        },
        {
          name: "Operations",
          type: "local-md",
          path: "docs/protocol_developer/operation.md"
        },
        {
          name: "Tables",
          type: "local-md",
          path: "docs/protocol_developer/table.md"
        },
        {
          name: "Developer Tools",
          type: "local-md",
          path: "docs/protocol_developer/tools.md"
        },
        {
          name: "Protocol Style Guide",
          type: "local-md",
          path: "docs/protocol_developer/style_guide.md"
        },
        {
          name: "Detailed API Reference",
          type: "local-md",
          path: "api.md"
        }
      ]
    },

    {
      category: "Power Users",
      contents: [
        { name: "Python API", type: "local-html", path: "trident.html" }
      ]
    }
  ]
};
