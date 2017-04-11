angApp.
controller('GalleryCtrl', function($scope, $q) {
    const {ipcRenderer} = require('electron');
    $scope.tiles = [];

    $scope.onImgLoad = function (event) {
        var scale = 0;
        if($event.currentTarget.naturalWidth > $event.currentTarget.naturalHeight){
            scale = 500/$event.currentTarget.naturalWidth;
        }else{
            scale = 500/$event.currentTarget.naturalHeight;
        }
        console.log(scale);
        var css = {
            'max-height': '500px',
            'max-width': '500px',
            'height': ($event.currentTarget.naturalHeight*scale) + 'px',
            'width': ($event.currentTarget.naturalHeight*scale) + 'px'
        }
        $event.currentTarget.css(css);
    }

    function loadPic(src) {
        var img = new Image();
        img.addEventListener("load", function(){
            return img;
        });
        img.src = src;
    }

    ipcRenderer.on('scan-folders-reply', (event, arg) => {
      console.log("folder reply");
      var paths = arg.paths;
      var temp = [];
      var i = 0;
      paths.forEach(function(value){
        

        var img = loadPic(value);

        var scale = 0;
        if(img.naturalWidth > img.naturalHeight){
            scale = 500/img.naturalWidth;
        }else{
            scale = 500/img.naturalHeight;
        }
        console.log(scale);
        var css = {
            'max-height': '500px',
            'max-width': '500px',
            'height': (img.naturalHeight*scale) + 'px',
            'width': (img.naturalHeight*scale) + 'px'
        }

        temp.push({
            path: value,
            height: img.naturalHeight*scale,
            width: img.naturalWidth*scale,
            style: css,
            id: i
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
