angular.module('myApp')

.factory('CameraService', function($window, $q, CameraDatabase) {
    var apiVersion = 1;
    var cameras = {}

    var write = function () {
        $window.localStorage['cameras'] = JSON.stringify(cameras);
    }

    var read = function () {
        cameras = JSON.parse($window.localStorage['cameras'] || '{}');
        return cameras;
    }

    var wipe = function() {
        console.log('wiping storage');
        cameras = {};
        $window.localStorage.clear();
        $window.localStorage['seed'] = false;
    }

    var seed = function() {
        var s = {
            custom_url: "http://trackfield.webcam.oregonstate.edu/mjpg/video.mjpg",
            title: "Example",
            jpg: false,
            use_custom: true
        }
        insertCamera(s);
    }

    var isNewAPI = function() {
        if (!$window.localStorage['api_version']) {
            $window.localStorage['api_version'] = apiVersion; 
            return false;
        }
        return $window.localStorage['api_version'] != apiVersion;
    }

    var getUrl = function(camera)
    {
        if (!camera) return null
        if (camera.use_custom && camera.custom_url) return camera.custom_url;
        pattern = CameraDatabase.getUrlPattern(camera.manf, camera.model, camera.user, camera.pwd);
        return "http://" + camera.host + ":" + camera.port + pattern;
                
    }

    var getAllCamera = function() {
        var allCameras = read();
        allCameras = _.each(allCameras, function(camera) {
            camera.url = getUrl(camera);
            return camera;
        });
        return allCameras;
    }

    var insertCamera = function(camera) {
        var allKeys = _.keys(cameras) 
        if (allKeys.length > 0) {
            id = parseInt(allKeys[_.size(cameras)-1]) + 1
        }
        else
            id = 0
        cameras[id] = camera
        write()
    }

    var updateCamera = function(oldCamera, newCamera) {
        id = _.findKey(cameras, oldCamera)
        cameras[id] = newCamera
        write()
    }

    var deleteCamera = function(camera) {
        id = _.findKey(cameras, camera)
        cameras = _.omit(cameras, id)
        write()
    }

    var getNthCamera = function(n) {
        var allKeys = _.keys(cameras) 
        var index = allKeys[n]
        return cameras[index]
    }

    var testCameraConnection = function(camera, success, failure) {
        var isImage = function(src) {
            var deferred = $q.defer();
            var image = new Image();
            image.onerror = function() {
                deferred.resolve(false);
            };
            image.onload = function() {
                deferred.resolve(true);
            };
            image.src = src;
            return deferred.promise;
        }
        var url = getUrl(camera)
        isImage(url).then(success,failure);
    }

    return {
        getAllCamera: getAllCamera,
        getCamera: getNthCamera,
        getCameraUrl: getUrl,
        testCameraConnection : testCameraConnection,
        insertCamera: insertCamera,
        updateCamera: updateCamera,
        deleteCamera: deleteCamera,
        read: read,
        seed: seed,
        isNewAPI: isNewAPI,
        wipe: wipe
    }
})

.factory('CameraDatabase', function($window) {
    var cameras = {
        "Foscam" : {
            "18905W" : "/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=[USERNAME]&pwd=[PASSWORD]",
            "18906W" : "/snapshot.jpg?user=[USERNAME]&pwd=[PASSWORD]",
            "18918W" : "/snapshot.cgi?user=[USERNAME]&pwd=[PASSWORD]"
        }
    }

    var getUrlPattern = function(manf, model, user, pass) {
        model = model || "Generic";  
        user = user || "";
        pass = pass || "";   
        pattern = cameras[manf][model] || "";
        pattern = pattern.replace("[USERNAME]", user).replace("[PASSWORD]", pass);
        return pattern;
    }

    return {
        getAllManf: function() { return _.keys(cameras) },
        getModelByManf: function(manf) { return _.keys(cameras[manf]) },
        getUrlPattern: getUrlPattern
    }

})
