var config = {
  tagline: "The Laboratory</br>Operating System",
  documentation_url: "http://localhost:4000/aquarium",
  get_releases: true,
  workflows: [
    "/klavinslab/test-workflow"
  ],
  navigation: [

    {
      category: "Overview",
      contents: [
        { name: "About", type: "local-html", path: "about.html" },
        { name: "Licence", type: "local-md", path: "license.md"  },
        { name: "Releases", type: "local-html", path: "releases.html"  },
        { name: "Contributors", type: "local-md", path: "contributors.md"  },
      ]
    },

    {
      category: "Getting Started",
      contents: [
        { name: "Installation", type: "aquarium-doc", path: "/installation" },
        { name: "Basic Concepts", type: "aquarium-doc", path: "/concepts" }
      ]
    },

    {
      category: "Community",
      contents: [
        { name: "Workflows", type: "local-html", path: "workflows.html" },
        { name: "Sharing", type: "aquarium-doc", path: "/sharing" }
      ]
    },

    {
      category: "Researchers",
      contents: [
        { name: "Defining Samples", type: "aquarium-doc", path: "/lims" },
        { name: "Designing Plans", type: "aquarium-doc", path: "/designer" }
      ]
    },

    {
      category: "Lab Management",
      contents: [
        { name: "Managing Jobs", type: "aquarium-doc", path: "/manager" },
        { name: "Running Jobs", type: "aquarium-doc", path: "/technician" },
        { name: "Managing Users", type: "aquarium-doc", path: "/users" },
        { name: "Inventory Definitions", type: "aquarium-doc", path: "/protocol_developer/types/"},
        { name: "Location Wizards", type: "aquarium-doc", path: "/protocol_developer/location/" },
      ]
    },

    {
      category: "Protocols",
      contents: [
        { name: "Developer Tools", type: "aquarium-doc", path: "/protocol_developer/tools/" },
        { name: "Protocol Tutorial", type: "aquarium-doc", path: "/protocol_tutorial/" },
        { name: "Show Blocks", type: "aquarium-doc", path: "/protocol_developer/show/" },
        { name: "Data Associations", type: "aquarium-doc", path: "/protocol_developer/associations/" },
        { name: "Building Tables", type: "aquarium-doc", path: "/protocol_developer/table/" },
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
