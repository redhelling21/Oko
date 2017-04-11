const remote = require('electron').remote;

var angApp = angular.module('myApp', ['ngMaterial', 'angularGrid']);
angApp.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange')
        .dark();
});
angApp.filter('unsafe', function($sce) { return $sce.trustAsHtml; });
angApp.directive('sbLoad', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        var fn = $parse(attrs.sbLoad);
        elem.on('load', function (event) {
          scope.$apply(function() {
            fn(scope, { $event: event });
          });
        });
      }
    };
  }]);
angApp.config(function($mdIconProvider) {
    $mdIconProvider
      .icon("world", "assets/svg/placeholder.svg", 64)
      .icon("tags", "assets/svg/tags.svg", 64)
      .icon("star", "assets/svg/star.svg", 64);
});