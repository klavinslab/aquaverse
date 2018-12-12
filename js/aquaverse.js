(function() {

  let w = angular.module(
          'aquaverse',
          [ 'ngMaterial', 'ngAnimate' ],
          [ '$rootScopeProvider', function($rootScopeProvider) {
         }]);

    w.controller('aquaverseCtrl', [ '$scope', '$http', '$sce', '$mdMedia', '$mdSidenav',
                         function (  $scope,   $http,   $sce,   $mdMedia,   $mdSidenav ) {

    $scope.navigation = config.navigation; // Link to navigation var
    $scope.tagline = $sce.trustAsHtml(config.tagline); // Link to tagline var
    $scope.title = config.title;
    $scope.state = {};

    $scope.select = function(section,content) {

      if ( content.type != "external-link" ) {
        $scope.state.section = section;
        $scope.state.active_content = content;
      }

      switch(content.type) {
        case "local-md":
          $http.get(content.path)
               .then(response => {
                  let md = window.markdownit().set({html: true})
                  $('#main-md').empty().html(md.render(response.data));
                  highlight_code();
                });
          break;
        case "aquarium-doc":
          $scope.state.iframe_url = $sce.trustAsResourceUrl(
            config.documentation_url + content.path
          );
          break;
        case "local-webpage":
          $scope.state.iframe_url = $sce.trustAsResourceUrl(
            content.path
          );
          break;
        case "local-html":
          // Nothing to do here. HTML uses ng-include
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
    });

    if ( config.get_releases ) {
      $http.get("https://api.github.com/repos/klavinslab/aquarium/releases")
           .then(response => {
             $scope.releases = response.data;
             for ( var n in $scope.releases ) {
               let md = window.markdownit().set({html: true});
               $scope.releases[n].md = $sce.trustAsHtml(md.render($scope.releases[n].body))
             }
           });
    }

    if ( config.workflows ) {
      get_workflow_configs($http)
        .then(configs => $scope.workflows = configs);
    }

  }]);

})();
