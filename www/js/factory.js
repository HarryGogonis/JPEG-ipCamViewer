angular.module('myApp')

.factory('CameraService', function() {
    var getUrl = function(camera)
    {
        if (!camera) return
        if (camera.manf === "Generic" || camera.custom_url)
            return camera.custom_url;
        if (camera.manf === "Foscam") 
            return camera.host + ":" + camera.port +
                "/snapshot.cgi?user=" + camera.user +
                "&pwd=" + camera.pwd;
        
        return camera.custom_url;
    }

   var cameras = [
        {
            title: 'Yard',
            manf: "Foscam",
            model: null,
            host: "http://192.168.1.200",
            port: 8080,
            user: 'admin',
            pwd: '222222',
            custom_url: null,
            url: function() { return getUrl(this); }
        },
        {
            title: 'Loft Inside',
            manf: "Generic",
            custom_url: "http://192.168.1.201:8081/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=admin&pwd=222222",
            url: function() { return getUrl(this); }
        },
        {
            title: 'Loft Outside',
            manf: "Generic",
            custom_url: "http://192.168.1.202:8082/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=admin&pwd=222222",
            url: function() { return getUrl(this); }
        }
    ]

    return {
        cameras: cameras,
        getCamera: function(index) {
            return cameras[index]
        },
        getCameraUrl: function(camera) {
            return getUrl(camera)
        }
    }
})