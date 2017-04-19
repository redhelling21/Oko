angApp.
controller('HomeCtrl', function($scope){
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

    ipcRenderer.on('write-datas-reply', (event, arg) => {
    	$mdToast.show(
	    	$mdToast.simple()
		        .textContent('Datas saved !')
		        .position("top right")
		        .hideDelay(1500)
		);
    });
});
