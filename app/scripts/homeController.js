angApp.
controller('HomeCtrl', function($scope, $mdToast){
	var window = remote.getCurrentWindow();
	const {ipcRenderer} = require('electron');
    $scope.title = "Oko";
    $scope.multiSelect = false;
    $scope.imgDetailsToShow = null;
    $scope.imgMultiDetailsToShow = [];
    $scope.existingTags = new Set();
    $scope.lastTags = [];
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

    $scope.getSetAsArr = function (set) {
	    var arr = [];
	    set.forEach(function (value) {
	        arr.push(value);
	    });
    return arr;
};
});
