angApp.
controller('GalleryCtrl', ['$scope', 'angularGridInstance', function($scope, angularGridInstance) {
    const {ipcRenderer} = require('electron');

    $scope.tiles = [];
    $scope.shots = [];
    $scope.selectedImgs = [];
    $scope.page = 0;
    $scope.fullyLoaded = false;

    ipcRenderer.on('scan-folders-reply', (event, arg) => {
        var paths = arg;
        var temp = [];
        var i = 0;
        paths.forEach(function(value) {
            temp.push({
                path: value,
                id: i,
                hasTags: false,
                hasStars: false,
                hasGeo: false,
                isSelected: false
            });
            i++;
        });
        $scope.tiles = temp;
        $scope.clearShots();
        $scope.fullyLoaded = false;
        $scope.loadMore();
    });

    $scope.refresh = function() {
        angularGridInstance.gallery.refresh();
    }

    $scope.clearShots = function() {
        for (var j = 0; j < $scope.shots.length; j++) {
            $scope.shots.splice(j, 1);
            angularGridInstance.gallery.refresh();
        }
    }

    $scope.loadMore = function(){
        if(!$scope.fullyLoaded){
            if(($scope.page + 1)*50 >= $scope.tiles.length ){
                $scope.shots = $scope.tiles;
                $scope.fullyLoaded = true;
            }else{
                for(var i = $scope.page * 50; i < ($scope.page + 1)*50; i++){
                    $scope.shots.push($scope.tiles[i]);
                }
            }
            $scope.page++;
            $scope.$apply();
            $scope.refresh();
        }
    };

    $scope.selectImg = function(shot){
        var idx = $scope.selectedImgs.indexOf(shot.id);
        if (idx > -1) {
          list.splice(idx, 1);
        }
        else {
          list.push(shot.id);
        }
    }
}
]);
