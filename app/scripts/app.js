const remote = require('electron').remote;

var angApp = angular.module('myApp', ['ngMaterial', 'angularGrid']);
angApp.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange')
        .dark();
});
angApp.filter('unsafe', function($sce) {
    return $sce.trustAsHtml;
});
angApp.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                var scale = 0;
                if (this.naturalWidth < this.naturalHeight) {
                    scale = 300 / this.naturalWidth;
                } else {
                    scale = 300 / this.naturalHeight;
                }
                /*var css = {
                    'height': (this.naturalHeight*scale) + 'px',
                    'width': (this.naturalWidth*scale) + 'px',
                    'position': 'absolute',
                    'top': '-9999px',
                    'bottom': '-9999px',
                    'left': '-9999px',
                    'right': '-9999px',
                    'margin': 'auto'
                }
                var css_parent = {
                    'min-height': (this.naturalHeight*scale > 400 ? 400 : this.naturalHeight*scale) + 'px'
                }
                angular.element(this).css(css);
                angular.element(this).parent().css(css_parent);*/
                attrs.$set('data-actual-width', this.naturalWidth * scale);
                attrs.$set('data-actual-height', this.naturalHeight * scale);
            });
        }
    };
});
