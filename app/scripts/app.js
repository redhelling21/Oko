var angApp = angular.module('myApp', ['ngMaterial']);
angApp.config(function($mdThemingProvider){
    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('orange')
    .dark();
});
