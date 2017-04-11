angApp.
controller('GalleryCtrl', function($scope, $q) {
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
      $scope.loadMoreShots();
      $scope.$apply();
      console.log("fin update");
    });


      $scope.card = {};
      $scope.card.title = 'test';
      $scope.page = 0;
      $scope.loadingMore = false;
      $scope.shots = []

      $scope.loadMoreShots = function() {
        $scope.page++;
        // var deferred = $q.defer();
        $scope.loadingMore = true;
        var temp = $scope.shots;
        if($scope.page * 25 >= $scope.tiles.length){
            $scope.shots = $scope.tiles;
        }else{
            for (i = $scope.page*25; i < ($scope.page + 1)*25; i++) {
                temp.push($scope.tiles[i]);
            }
            $scope.shots = temp;
        }
        $scope.loadingMore = false;
      };
      $scope.loadMoreShots();



});
