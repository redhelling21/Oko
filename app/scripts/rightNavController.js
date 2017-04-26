angApp.
controller('RightNavCtrl', function($scope){
	const {ipcRenderer} = require('electron');
	$scope.title = "Oko";
	$scope.editTags = false;

	$scope.saveDetails = function(){
		var arg = [];
		$scope.editTags = false;
		arg.push($scope.$parent.imgDetailsToShow);
		ipcRenderer.send('save-datas', arg);
	}

	$scope.toggleEdit = function(){
		$scope.editTags = true;
	}
	$scope.addTag = function(tag){
		if(!$scope.$parent.imgDetailsToShow.tags.includes(tag)){
			$scope.$parent.imgDetailsToShow.tags.push(tag);
		}
	}
});
