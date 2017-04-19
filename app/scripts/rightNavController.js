angApp.
controller('RightNavCtrl', function($scope){
	const {ipcRenderer} = require('electron');
	$scope.title = "Oko";
	$scope.chips_readonly = false;
	$scope.chips_removable = true;

	$scope.saveDetails = function(){
		var arg = [];
		arg.push($scope.$parent.imgDetailsToShow);
		ipcRenderer.send('save-datas', arg);
	}
});
