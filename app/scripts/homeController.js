angApp.
controller('HomeCtrl', function($scope, $mdToast){
	var window = remote.getCurrentWindow();
	const {ipcRenderer} = require('electron');
    $scope.title = "Oko";
    $scope.multiSelect = false;
    $scope.imgDetailsToShow = {path: "assets/png/Empty_set_blue.png"};
    $scope.closeW = function(){
    	window.close();
    }
    $scope.maxW = function(){
    	if (!window.isMaximized()) {
           window.maximize();
        } else {
           window.unmaximize();
        }
    }
    $scope.reduceW = function(){
    	window.minimize();
    }
});
