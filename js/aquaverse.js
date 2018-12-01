(function() {

  let w = angular.module(
          'aquaverse',
          [ 'ngMaterial', 'ngAnimate' ],
          [ '$rootScopeProvider', function($rootScopeProvider) {
         }]);

    w.controller('aquaverseCtrl', [ '$scope', '$http', '$sce', '$mdMedia', '$mdSidenav',
                         function (  $scope,   $http,   $sce,   $mdMedia,   $mdSidenav ) {

    $scope.navigation = navigation; // Link to navigation var
    $scope.tagline = $sce.trustAsHtml(tagline); // Link to tagline var

    $scope.select = function(section,content) {

      $scope.state.section = section;
      $scope.state.active_content = content;

      switch(content.type) {
        case "local-md":
          $http.get(content.path)
               .then(response => {
                  var md = window.markdownit().set({html: true})
                  $('#main-md').empty().html(md.render(response.data));
                  highlight_code();
                });
          break;
        case "local-html":
          $http.get(content.path)
               .then(response => {
                  $('#main-html').empty().html(response.data);
                });
          break;
        case "aquarium-doc":
          $scope.state.iframe_url = $sce.trustAsResourceUrl(
            documentation_url + content.path
          );
          break;
        case "local-webpage":
          $scope.state.iframe_url = $sce.trustAsResourceUrl(
            content.path
          );
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

    for ( var i in $scope.navigation ) {
      $scope.navigation[i].open = true;
    }

    $scope.state = {
      section: $scope.navigation[0],
      active_content: $scope.navigation[0].contents[0]
    };

    $(function() {
      $scope.select($scope.navigation[0],$scope.navigation[0].contents[0]);
    });

  }]);

})();
