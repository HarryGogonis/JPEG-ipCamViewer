angular.module('myApp')
.controller('AllCameraController', function($scope, $state, $timeout, CameraService) {
    //TODO move to factory
    $scope.cameras = CameraService.getAllCamera();
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

.controller('SettingsController', function($scope, $ionicModal, $ionicPopup, CameraService) {
    $scope.cameras = CameraService.read();

    var newCamera;
    var oldCamera = {};

    // Create modal from template
    $ionicModal.fromTemplateUrl('edit-camera.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function(camera) {
       if (camera) {
            oldCamera = camera;
            $scope.data = angular.copy(camera);
            newCamera = false;
        } else {
            $scope.data = {};
            newCamera = true;
        }
        $scope.modal.isOpen = true;
        $scope.modal.show();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.isOpen = false;
    };

    $scope.saveCamera = function() {
        //TODO check for null values, 
        // Add default camera title
        var camera = $scope.data;
        if (camera) {
            if (newCamera) {
                CameraService.insertCamera(camera);
            } else {
                CameraService.updateCamera(oldCamera, camera);
            }
        }
        $scope.cameras = CameraService.read();
        $scope.closeModal();
    }

    $scope.deleteCamera = function() {
        console.log(newCamera);
        console.log($scope.data);
        if (!newCamera && $scope.data) {
            CameraService.deleteCamera($scope.data);
        }
        $scope.cameras = CameraService.read();
        $scope.closeModal();
    }

    $scope.isEditing = function() {
        return !newCamera;
    }

    //Cleanup the modal when done
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if ($scope.modal.isOpen) {
            event.preventDefault();
        }
    });
})
