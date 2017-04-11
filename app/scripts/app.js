const remote = require('electron').remote;

var angApp = angular.module('myApp', ['ngMaterial', 'angularGrid']);
angApp.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange')
        .dark();
});
angApp.filter('unsafe', function($sce) { return $sce.trustAsHtml; });