angApp.
controller('GalleryCtrl', ['$scope', 'angularGridInstance', function($scope, angularGridInstance) {
    const {
        ipcRenderer
    } = require('electron');
    $scope.tiles = [];
    $scope.shots = []
    $scope.page = 0;
    ipcRenderer.on('scan-folders-reply', (event, arg) => {
        console.log("folder reply");
        var paths = arg.paths;
        var temp = [];
        var i = 0;
        paths.forEach(function(value) {
            temp.push({
                path: value,
                id: i,
                hasTags: false,
                hasStars: false,
                hasGeo: false
            });
            i++;
        });
        $scope.tiles = temp;
        $scope.clearShots();
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

        console.log("fin clear");
    }
    
    $scope.loadMore = function(){
        console.log("loadmore");
        if(($scope.page + 1)*50 >= $scope.tiles.length ){
            $scope.shots = $scope.tiles;
        }else{
            for(var i = $scope.page * 50; i < ($scope.page + 1)*50; i++){
                $scope.shots.push($scope.tiles[i]);
            }
        }

        $scope.page++;
        $scope.$apply();
        $scope.refresh();
    };
}
]);
