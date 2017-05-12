angApp.
controller('GalleryCtrl', ['$scope', 'angularGridInstance', '$mdToast', '$timeout', function($scope, $mdToast, angularGridInstance, $timeout) {
    const ipcRenderer = require('electron').ipcRenderer;

    $scope.tiles = [];
    $scope.shots = [];
    $scope.selectedImgs = [];
    $scope.page = 0;
    $scope.fullyLoaded = false;

    ipcRenderer.on('scan-folders-reply', function(event, arg){
        var images = arg, temp = [], i = 0, hasTags, hasStars, hasGeo, hasMetas, image;
        $scope.$parent.existingTags.clear();
        images.forEach(function(value) {
            image = {
                path: value.path,
                id: i,
                hasChanged: false,
                isActive: false,
                tags: [],
                showTags: false
            };
            image.hasMetas = (value.metadata !== null);
            if(image.hasMetas){
                image.hasTags = (value.metadata.hasOwnProperty('Subject'));
                if(image.hasTags){
                    image.tags = image.tags.concat(value.metadata.Subject);
                    image.tags.forEach(function(value) {
                        $scope.$parent.existingTags.add(value);
                    });
                }
                image.hasStars = false;
                image.hasGeo = false;
            }else{
                image.hasTags = false;
                image.hasStars = false;
                image.hasGeo = false;
            }
            temp.push(image);
            i++;
        });
        console.log($scope.$parent.existingTags);
        $scope.tiles = temp;
        $scope.shots = [];
        $scope.fullyLoaded = false;
        $scope.page = 0;
        $scope.loadMore();
    });

    ipcRenderer.on('write-datas-reply', function(event, arg){
        $mdToast.show(
            $mdToast.simple()
                .textContent('Datas saved !')
                .position("top right")
                .hideDelay(1500)
        );
    });

    $scope.refresh = function() {
        angularGridInstance.gallery.refresh();
    };

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

    $scope.activeImg = function(shot){
        if($scope.alreadyClicked){
            console.log("Douc");
            $scope.alreadyClicked = false;
        }else{
            $scope.alreadClicked = true;
            $timeout(function(){
                $scope.alreadyClicked = false;
            }, 100)
        }
        if($scope.$parent.multiSelect !== true){
            $scope.shots.forEach(function(value){
                value.isActive = false;
            });
            shot.isActive = true;
            $scope.$parent.imgDetailsToShow = shot;
        }else{
            if(shot.isSelected){
                shot.isActive = false;
            }else{
                shot.isActive = true;
            }
        }
    };

    $scope.displayImg = function(shot){
        console.log("DOUBLE CLICK");
    }
}
]);
