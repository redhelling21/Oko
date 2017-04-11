angApp.
controller('GalleryCtrl', ['$scope', 'angularGridInstance', function($scope, angularGridInstance) {
    const {
        ipcRenderer
    } = require('electron');
    $scope.tiles = [];
    $scope.shots = []
    ipcRenderer.on('scan-folders-reply', (event, arg) => {
        console.log("folder reply");
        var paths = arg.paths;
        var temp = [];
        var i = 0;
        paths.forEach(function(value) {
            temp.push({
                path: value,
                id: i
            });
            i++;
        });
        $scope.tiles = temp;
        $scope.clearShots();
        $scope.shots = $scope.tiles;
        $scope.$apply();
        $scope.refresh();
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
}]);
