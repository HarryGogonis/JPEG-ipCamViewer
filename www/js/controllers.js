angular.module('myApp')

.controller('AllCameraController', function($scope, $state, CameraService) {
    //TODO move to factory
    $scope.cameras = CameraService.cameras;

    $scope.openCamera = function(id)
    {
        $state.transitionTo('camera', {cam: id});
    };

    $scope.reload = function()
    {   
        // Reload page
        $state.transitionTo($state.current, $state.$current.params,
            { reload: true, inherit: true, notify: true });//reload
    };

})

.controller('SingleCameraController', function($scope, $stateParams, $interval, $timeout, CameraService) {
 //TODO move to factory
    $scope.camera  = CameraService.getCamera($stateParams.cam); 
    var url =  CameraService.getCameraUrl($scope.camera);

    $scope.updateUrl = function(){
        $scope.url = url + '&t=' + new Date().getTime();
        console.log($scope.url)
        timeout = $timeout($scope.updateUrl,1000);
    }
    var timeout = $timeout($scope.updateUrl,1000);

})

.controller('SettingsController', function($scope) {

})
