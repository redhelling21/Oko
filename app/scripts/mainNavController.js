angApp.
controller('MainNavCtrl', function($scope, $mdDialog){
	$scope.showSettings = function(ev) {
        $mdDialog.show({
            controller: 'SettingsCtrl',
          templateUrl: 'views/settings.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false
  })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
          $scope.status = 'You cancelled the dialog.';
      });
    };
});