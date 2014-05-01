var app = angular.module("watermark",['uiSlider']);

app.controller('WaterMark', function($scope) {
    $scope.position = "top right";
    $scope.opacity = 99;
    $scope.img = "img.jpg";
    $scope.init = function(){
        wmark.init({
            "position": $scope.position, 
            "opacity": $scope.opacity, 
            "className": "watermark",
            "path": "/logo-new.png"
        });
    }
    $scope.currencyFormatting = function(value) { return value.toString() + " $" }

    $scope.waterApply = function(){
       list = ["top","left","right","bottom"]
       var listSpilt = $scope.position.split(" ");
       var count = 0;
       for(i=0;i<2;i++){
        if(list.indexOf(listSpilt[i])>-1){
            count++;
        }
       }

       if(count==2){
         wmark.apply({
            "img" :$scope.img,
            "position":$scope.position,
            "opacity":$scope.opacity,
        });
       }
      
    };
      
})