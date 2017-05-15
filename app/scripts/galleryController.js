angApp.
controller('GalleryCtrl', ['$scope', 'angularGridInstance', '$mdToast', '$timeout', '$window', function($scope, $mdToast, angularGridInstance, $timeout, $window) {
    const ipcRenderer = require('electron').ipcRenderer;

    var tiles = [];
    $scope.shots = [];
    $scope.selectedImgs = [];
    $scope.page = 0;
    var fullyLoaded = false;


    $scope.filterTags = [];

    $scope.addFilterTag = function(tag){
        console.log("tag : " + tag);
        var index = $scope.filterTags.indexOf(tag);
        console.log("index : " + index);
        if(index === -1){
            $scope.filterTags = $scope.filterTags.concat(tag);
        }else{
            $scope.filterTags.splice(index);
        }
        console.log("filtertag : " + $scope.filterTags);
    };

    $scope.tagButtonColor = function(tag){
        console.log("Style updated");
        if($scope.filterTags.indexOf(tag) !== -1){
            return {"background-color": "blue"};
        }else{
            return {"background-color": "green"};
        }
    }


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
        tiles = temp;
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
            if(($scope.page + 1)*50 >= tiles.length ){
                $scope.shots = tiles;
                $scope.fullyLoaded = true;
            }else{
                for(var i = $scope.page * 50; i < ($scope.page + 1)*50; i++){
                    $scope.shots.push(tiles[i]);
                }
            }
            $scope.page++;
            $scope.$apply();
            $scope.refresh();
        }
    };

    $scope.activeImg = function(shot){
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
        var indexG = $scope.shots.indexOf(shot);
        var el = document.getElementById('ul-gallery');
        if(el.attributes['lg-uid'] != null && $window.lgData[el.attributes['lg-uid'].value] != null){
            $window.lgData[el.attributes['lg-uid'].value].destroy(true);
        }
        lightGallery(el, {
            dynamic: true,
            download : false,
            index: indexG,
            dynamicEl: $scope.shots.map(function(shot) {return {'src': shot.path};})
        });
        //console.log($window.lgData[el.attributes['lg-uid'].value]);
    };
}
]);
