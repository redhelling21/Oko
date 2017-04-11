angApp.
controller('GalleryCtrl', ['$scope','angularGridInstance', function($scope, angularGridInstance) {
    const {ipcRenderer} = require('electron');
    $scope.tiles = [];

    ipcRenderer.on('scan-folders-reply', (event, arg) => {
      console.log("folder reply");
      var paths = arg.paths;
      var temp = [];
      var i = 0;
      paths.forEach(function(value){
        //var css={
        //    'background-image': "url('file:///" + value.replace(/\\/g,"/") + "')"
        //}
        temp.push({
            path: value,
            id: i
            //style: css
        });
        i++;
      });
      $scope.tiles = temp;
      $scope.page = 0;
      $scope.clearShots();
      $scope.shots = $scope.tiles;

      $scope.$apply();
      $scope.refresh();
      console.log("fin update");
    });
        $scope.refresh = function(){
            angularGridInstance.gallery.refresh();
        }

      $scope.card = {};
      $scope.card.title = 'test';
      $scope.page = 0;
      $scope.loadingMore = false;
      $scope.shots = []
      

      $scope.clearShots = function(){
        var size = $scope.shots.length;
        for(i = 0; i<size;i++){
            $scope.shots(size - 1 - i, 1)
        }
      }
}]);
