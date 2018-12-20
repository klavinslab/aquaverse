var stack = [];

(function() {

  let w = angular.module(
          'aquaverse',
          [ 'ngMaterial', 'ngAnimate' ],
          [ '$rootScopeProvider', function($rootScopeProvider) {
         }]);

    w.controller('aquaverseCtrl', [ '$scope', '$http', '$sce', '$mdMedia', '$mdSidenav',
                         function (  $scope,   $http,   $sce,   $mdMedia,   $mdSidenav ) {

    $scope.copyright = config.copyright;
    $scope.navigation = config.navigation; // Link to navigation var
    $scope.tagline = $sce.trustAsHtml(config.tagline); // Link to tagline var
    $scope.title = config.title;
    $scope.state = {};

    let conv = new showdown.Converter({tables:true});

    $scope.easy_select = function(category, name) {
      for ( var i=0; i<$scope.navigation.length; i++ ) {
        if ( $scope.navigation[i].category == category ) {
          for ( var j=0; j<$scope.navigation[i].contents.length; j++ ) {
            if ( $scope.navigation[i].contents[j].name == name ) {
              $scope.select($scope.navigation[i], $scope.navigation[i].contents[j]);
              return;
            }
          }
        }
      }
    }

    $scope.select = function(section,content) {

      if ( content.type != "external-link" ) {
        $scope.state.section = section;
        $scope.state.active_content = content;
      }

      switch(content.type) {
        case "local-md":
          $http.get(content.path)
               .then(response => {
                  $('#main-md').empty().html(conv.makeHtml(response.data));
                  if ( config.copyright ) {
                    $('#main-md').append(`<div class='copyright'>${config.copyright}</div>`);
                  }
                  highlight_code();
                  $('#main-md').scrollTop(0);
                });
          break;
        case "local-webpage":
          $scope.state.iframe_url = $sce.trustAsResourceUrl(
            content.path
          );
          break;
        case "local-html":
          break;
        case "external-link":
          window.open(content.path);
          break;

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

    $(function() {
      $scope.navigation[0].open = true;
      $scope.select($scope.navigation[0],$scope.navigation[0].contents[0]);
      $scope.$apply();
    });

    if ( config.get_releases ) {
      $http.get("https://api.github.com/repos/klavinslab/aquarium/releases")
           .then(response => {
             $scope.releases = response.data;
             for ( var n in $scope.releases ) {
               $scope.releases[n].md = $sce.trustAsHtml(conv.makeHtml($scope.releases[n].body));
               highlight_code();
             }
           })
           .catch(error => console.log("Github did not return release array. Probably too many requests."))
    }

    if ( config.workflows ) {
      get_workflow_configs($http)
        .then(configs => $scope.workflows = configs);
    }

  }]);

})();

function easy_select(x,y) {
  let el = angular.element($('#aquaverseCtrl'));
  if (el) {
    el.scope().easy_select(x,y);
    el.scope().$apply();
  }
}
