angular.module('myApp')

.factory('CameraService', function($window) {
    var cameras = {}

    var write = function () {
        $window.localStorage['cameras'] = JSON.stringify(cameras);
    }

    var read = function () {
        cameras = JSON.parse($window.localStorage['cameras'] || '{}');
        return cameras;
    }

    var getUrl = function(camera)
    {
        if (!camera) return null
        if (camera.use_custom && camera.custom_url) return camera.custom_url;
        if (camera.manf === "Generic" || camera.custom_url)
            return camera.custom_url;
        if (camera.manf === "Foscam") 
            return "http://" + camera.host + ":" + camera.port +
                "/snapshot.cgi?user=" + camera.user +
                "&pwd=" + camera.pwd;        
    }

    var getAllCamera = function() {
        var allCameras = read();
        allCameras = _.each(allCameras, function(camera) {
            console.log(camera)
            console.log(getUrl(camera))
            camera.url = getUrl(camera);
            return camera;
        });
        console.log(allCameras);
        return allCameras;
    }

    var insertCamera = function(camera) {
        var allKeys = _.keys(cameras) 
        console.log(allKeys)
        if (allKeys.length > 0) {
            id = parseInt(allKeys[_.size(cameras)-1]) + 1
        }
        else
            id = 0
        console.log(id)
        cameras[id] = camera
        console.log(cameras)
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
        console.log(allKeys)
        var index = allKeys[n]
        console.log(index)
        return cameras[index]
    }


    return {
        getAllCamera: getAllCamera,
        getCamera: getNthCamera,
        getCameraUrl: getUrl,
        insertCamera: insertCamera,
        updateCamera: updateCamera,
        deleteCamera: deleteCamera,
        read: read
    }
})