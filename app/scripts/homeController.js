angApp.
controller('HomeCtrl', function($scope){
	var window = remote.getCurrentWindow();
    $scope.title = "Oko";
    $scope.multiSelect = false;
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
