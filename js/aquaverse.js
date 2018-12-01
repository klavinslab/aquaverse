(function() {

  let w = angular.module(
          'aquaverse',
          [ 'ngMaterial', 'ngAnimate' ],
          [ '$rootScopeProvider', function($rootScopeProvider) {
         }]);

    w.controller('aquaverseCtrl', [ '$scope', '$http', '$sce', '$mdMedia', '$mdSidenav',
                         function (  $scope,   $http,   $sce,   $mdMedia,   $mdSidenav ) {

    let documentation_url = "http://localhost:4000/aquarium";

    $scope.navigation = [

      {
        category: "Overview",
        contents: [
          { name: "About", local: "about.md"},
          { name: "Licence" }
        ]
      },

      {
        category: "Getting Started",
        contents: [
          { name: "Installation", path: "/installation" },
          { name: "Basic Concepts", path: "/concepts" }
        ]
      },

      {
        category: "Researcher Interface",
        contents: [
          { name: "Defining Samples" },
          { name: "Designing Plans", path: "/designer" }
        ]
      },

      {
        category: "Lab Management",
        contents: [
          { name: "Managing Jobs", path: "/manager" },
          { name: "Running Jobs", path: "/technician" },
          { name: "Managing Users", path: "/users" },
          { name: "Budgets and Costs", path: "/budget_manager" },
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

    $scope.select = function(section,content) {
      $scope.state.section = section;
      $scope.state.active_content = content;
      if ( content.path ) {
        $scope.state.iframe_url = $sce.trustAsResourceUrl(
          documentation_url + content.path
        );
        console.log($scope.state.iframe_url)
      } else {
        $scope.state.iframe_url = null;
      }
      if ( !$mdMedia('gt-sm') ) {
        $mdSidenav('sidenav').close();
      }
    }

    $scope.link_class = function(section,content) {
      let c = "";
      if ( $scope.state.section == section &&
           $scope.state.active_content == content ) {
        c += "active-content";
      } else {
        c += "inactive-content";
      }
      return c;
    }

    $scope.open_sidenav = function() {
      $mdSidenav('sidenav').open()
    }

    $scope.navigation[0].open = true;

    $scope.state = {
      section: $scope.navigation[0],
      active_content: $scope.navigation[0].contents[0]
    };

    $scope.select($scope.navigation[0],$scope.navigation[0].contents[0]);

  }]);

})();
