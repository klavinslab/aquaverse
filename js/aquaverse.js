var stack = [];

(function() {

  let w = angular.module(
          'aquaverse',
          [ 'ngMaterial', 'ngAnimate' ],
          [ '$rootScopeProvider', function($rootScopeProvider) {
         }]);

    w.controller('aquaverseCtrl', [ '$scope', '$http', '$sce', '$mdMedia', '$mdSidenav', '$compile',
                         function (  $scope,   $http,   $sce,   $mdMedia,   $mdSidenav,   $compile ) {

    $scope.copyright = $sce.trustAsHtml(config.copyright);
    $scope.navigation = config.navigation; // Link to navigation var
    $scope.tagline = $sce.trustAsHtml(config.tagline); // Link to tagline var
    $scope.title = config.title;
    $scope.state = {};

    let conv = new showdown.Converter({tables:true});

    var curr = location.href.split("?");

      if (curr.length > 1) {
        var url = curr[1].split("&");
        var section = url[0].split("=")[1];
        section = decodeURI(section);
        var content = url[1].split("=")[1];
        content = decodeURI(content);
      }

    $scope.easy_select = function(category, name, push=true) {
      for ( var i=0; i<$scope.navigation.length; i++ ) {
        if ( $scope.navigation[i].category == category ) {
          for ( var j=0; j<$scope.navigation[i].contents.length; j++ ) {
            if ( $scope.navigation[i].contents[j].name == name ) {
              $scope.select($scope.navigation[i], $scope.navigation[i].contents[j],push);
              return;
            }
          }
        }
      }
    }

    $scope.select = function(section,content,push=true) {

      section.open = true;

      if ( $scope.state.section != section || $scope.state.active_content != content ) {

        if ( typeof(gtag) != "undefined" ) {
          gtag('event', 'select', {
            'event_category': content.name,
            'event_label': section.category,
            'event_value': 1
          });
        }

        if ( content.type != "external-link" ) {
          $scope.state.section = section;
          $scope.state.active_content = content;
          if ( push ) {
            history.pushState({section: $scope.state.section, active_content: $scope.state.active_content }, "State", "");
          }
        }

        switch(content.type) {
          case "local-md":
            $http.get(content.path)
                 .then(response => {
                    $('#main-md').empty().html(conv.makeHtml(response.data));
                    if ( config.nextprev ) {
                      $('#main-md').append($compile(`<div ng-include="'prevnext.html'"></div>`)($scope));
                    }
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

      }

      if ( !$mdMedia('gt-sm') ) {
        $mdSidenav('sidenav').close();
      }

    }

    $scope.redraw = function() {
      $("#main-container").hide();
      setTimeout(() => {
        $("#main-container").show();
      }, 1);
    }

    function section_index(sec) {
      for ( var i=0; i<$scope.navigation.length; i++ ) {
        if ( $scope.navigation[i].category == sec ) {
          return i;
        }
      }
      return -1;
    }

    function content_index(contents, name) {
      for ( var i=0; i<contents.length; i++ ) {
        if ( contents[i].name == name ) {
          return i;
        }
      }
      return -1;
    }

    function nav_indices() {
       if ( $scope.state.section && $scope.state.active_content ) {
         let i = section_index($scope.state.section.category),
             j = content_index($scope.navigation[i].contents,$scope.state.active_content.name);
         return [i,j];
       } else {
         return [0,0];
       }
    }

    $scope.next = function() {
       let ni = nav_indices(), i = ni[0], j = ni[1];
       if ( j < $scope.navigation[i].contents.length - 1 ) {
         j++;
       } else {
         j = 0;
         i++;
       }
       $scope.select($scope.navigation[i], $scope.navigation[i].contents[j])
    }

    $scope.prev = function() {
       let ni = nav_indices(), i = ni[0], j = ni[1];
       if ( j > 0 ) {
         j--;
       } else {
         i--;
         j = $scope.navigation[i].contents.length - 1;
       }
       $scope.select($scope.navigation[i], $scope.navigation[i].contents[j])
    }

    $scope.has_prev = function() {
       let ni = nav_indices(), i = ni[0], j = ni[1];
       return i > 0 || j > 0;
    }

    $scope.has_next = function() {
       let ni = nav_indices(), i = ni[0], j = ni[1];
       return i < $scope.navigation.length - 1 || j < $scope.navigation[i].contents.length - 1;
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
      if (curr.length > 1) {
        for (var i = 0; i < $scope.navigation.length; i++) {
          if ($scope.navigation[i].category == section) {
            section = $scope.navigation[i];
            for (var j = 0; j < $scope.navigation[i].contents.length; j++) {
              if ($scope.navigation[i].contents[j].name == content) {
                content = $scope.navigation[i].contents[j];
              }
            }
          }
        }
        $scope.select(section, content, false);
        $scope.state.active_content = content;
        $scope.state.section = section;

      } else {
        $scope.select(
          $scope.navigation[0],
          $scope.navigation[0].contents[0],
          false
        );
      }
      history.replaceState($scope.state, "State", "");
      $scope.$apply();
    });

    window.onpopstate = function(event) {
      if ( event.state ) {
        $scope.easy_select(event.state.section.category, event.state.active_content.name, false);
        event.preventDefault;
        $scope.$apply();
      }
    };

    if ( config.get_releases ) {
      $http.get("https://api.github.com/repos/klavinslab/aquarium/releases")
           .then(response => {
             $scope.releases = response.data;
             $scope.releases.sort(function(a,b) {
                 return new Date(b.published_at) - new Date(a.published_at);
             })
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

select = easy_select;

// This function undoes the body scroll resulting from a local href link event
$(function() {
  let b = $("body")
  b.click(event => setTimeout(() => b.scrollTop(0), 10));
});
// This function undoes the body scroll resulting from a local href link event
$(function() {
  let b = $("body");
  b.click(event => setTimeout(() => b.scrollTop(0), 10));
});
