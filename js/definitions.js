var tagline = "The Laboratory</br>Operating System";
var documentation_url = "http://localhost:4000/aquarium";

var navigation = [

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
    category: "Researcher Interface",
    contents: [
      { name: "Defining Samples" },
      { name: "Designing Plans", type: "aquarium-doc", path: "/designer" }
    ]
  },

  {
    category: "Lab Management",
    contents: [
      { name: "Managing Jobs", type: "aquarium-doc", path: "/manager" },
      { name: "Running Jobs", type: "aquarium-doc", path: "/technician" },
      { name: "Managing Users", type: "aquarium-doc", path: "/users" },
      { name: "Budgets and Costs", type: "aquarium-doc", path: "/budget_manager" },
      { name: "Inventory Definitions" },
      { name: "Location Wizards" },
    ]
  },

  {
    category: "Protocols",
    contents: [
      { name: "Community Workflows" },
      { name: "Developer Tools" },
      { name: "Protocol Tutorial" },
      { name: "Show Blocks" },
      { name: "Data Associations" },
      { name: "Building Tables" },
      { name: "Detailed API Reference" },
    ]
  },

  {
    category: "Power Users",
    contents: [
      { name: "Python and Trident" },
      { name: "Contributing" }
    ]
  }

];
