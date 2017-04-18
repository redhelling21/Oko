angApp.
controller('MainNavCtrl', function($scope, $mdDialog, $mdSidenav) {
    const dialog = remote.dialog;
    const {ipcRenderer} = require('electron');
    const fs = remote.require('fs');
    $scope.showSettings = function(ev) {
        $mdDialog.show({
            controller: 'SettingsCtrl',
            templateUrl: 'views/settings.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false
        })
        .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });
    };
    $scope.selectFolderToExplore = function(ev) {
        dialog.showOpenDialog(remote.getCurrentWindow(), {
            defaultPath: 'c:/',
            properties: ['openDirectory']
        }, function(fileNames) {
            if (fileNames === undefined) return;
            var fileName = fileNames[0];
            ipcRenderer.send('scan-folders', fileName);
        })
    };

    $scope.toggleMultiSelect = function(){
        $scope.$parent.multiSelect = !$scope.$parent.multiSelect;
    }

    $scope.toggleFilterNav = function(){
        if($mdSidenav('filternav').isOpen()){
            $mdSidenav('filternav').close();
        }else{
            $mdSidenav('sortnav').close();
            $mdSidenav('filternav').toggle();
        }
    }

    $scope.toggleSortNav = function(){
        if($mdSidenav('sortnav').isOpen()){
            $mdSidenav('sortnav').close();
        }else{
            $mdSidenav('filternav').close();
            $mdSidenav('sortnav').toggle();
        }
    }
});
