angApp.
controller('RightNavCtrl', function($scope){
	const {ipcRenderer} = require('electron');
	$scope.title = "Oko";
	$scope.chips_readonly = true;
	$scope.chips_removable = false;

	$scope.saveDetails = function(){
		var arg = [];
		$scope.chips_readonly = true;
		$scope.chips_removable = false;
		arg.push($scope.$parent.imgDetailsToShow);
		ipcRenderer.send('save-datas', arg);
	}

	$scope.toggleEdit = function(){
		$scope.chips_readonly = false;
		$scope.chips_removable = true;
	}
});
