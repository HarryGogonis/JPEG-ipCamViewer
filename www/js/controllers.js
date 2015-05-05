angular.module('myApp')

.controller('AllCameraController', function($scope, $state, $timeout, CameraService) {
    //TODO move to factory
    $scope.cameras = CameraService.cameras;
    $scope.getCameraUrl = CameraService.getCameraUrl;

    $scope.openCamera = function(id)
    {
        $state.transitionTo('camera', {cam: id});
    };

    // Reload the image on all cameras
    $scope.reload = function()
    {   
        $timeout.cancel();
        $timeout(function(){
            //$scope.cameras = CameraService.cameras;
            $scope.getCameraUrl = function(camera) {
                return CameraService.getCameraUrl(camera) + '&t=' + new Date().getTime();
            };
        });
    };
})

.controller('SingleCameraController', function($scope, $stateParams, $timeout, CameraService) {
 //TODO move to factory
    $scope.camera  = CameraService.getCamera($stateParams.cam); 
    var url =  CameraService.getCameraUrl($scope.camera);
    $scope.url = url;

    $scope.updateUrl = function(){
        $scope.url = url + '&t=' + new Date().getTime();
        timeout = $timeout($scope.updateUrl,1000);
    }
    var timeout = $timeout($scope.updateUrl,1000);

    $scope.$on("$destroy", function(event) {
        $timeout.cancel( timeout );
    });

})

.controller('SettingsController', function($scope, CameraService) {
    $scope.cameras = CameraService.cameras;
})
