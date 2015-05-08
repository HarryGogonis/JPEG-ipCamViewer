// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('myApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('all', {
            url: '/all',
            templateUrl: 'all.html',
            controller: 'AllCameraController as AllCtrl',
            cache: false
    })
    .state('camera', {
        url: 'camera/:cam',
        templateUrl: 'single.html',
        controller: 'SingleCameraController as CamCtrl',
        cache: false,
        resolve: {
            cam: function($stateParams, CameraService) {
                return CameraService.getCamera($stateParams.cam)
            }
        }
     })
    .state('settings', {
        url: '/settings',
        templateUrl: 'settings.html',
        controller: 'SettingsController as SettingsCtrl'
    });

    $urlRouterProvider.otherwise("/all");
})

.run(function($ionicPlatform, $window, CameraService) {

    var wipeOnLoad = true;

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        if(wipeOnLoad) {
            $window.localStorage.clear();
        }
     });

  CameraService.read();
})
