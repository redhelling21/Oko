angApp.
controller('GalleryCtrl', function($scope) {
    const {ipcRenderer} = require('electron');
    $scope.tiles = [];
    ipcRenderer.on('scan-folders-reply', (event, arg) => {
      console.log("folder reply");
      var paths = arg.paths;
      var temp = [];
      paths.forEach(function(value){
        temp.push({
            path: value
        });
      });
      $scope.tiles = temp;
      $scope.$apply();
      console.log("fin update");
    });
});
