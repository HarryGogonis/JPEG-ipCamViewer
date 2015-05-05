angular.module('myApp')

.controller('AllCameraController', function($scope, $state, $timeout, CameraService) {
    //TODO move to factory
    $scope.cameras = CameraService.cameras;

    $scope.openCamera = function(id)
    {
        $state.transitionTo('camera', {cam: id});
    };

    $scope.reload = function()
    {   
        $timeout(function(){
            $scope.getCameraUrl = function(camera) {
                return CameraService.getCameraUrl(camera) + '&t=' + new Date().getTime();
            };
        },100);
    };
    $scope.reload();

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

})

.controller('SettingsController', function($scope, CameraService) {
    $scope.cameras = CameraService.cameras;
})
