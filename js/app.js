// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('CaptureCtrl', function($scope ,CameraSrv ,$ionicActionSheet, $ionicLoading, $ionicPlatform, $cordovaCamera) {

  $ionicPlatform.ready(function() {

    $scope.showAnalyzeButton = false;

    var self = this;

    this.showLoading = function() {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
    };

    this.hideLoading = function(){
      $ionicLoading.hide();
    };

    this.getPicture = function(index){

      CameraSrv.getPicture()
        .then(function(imageData) {
          var image = document.getElementById('pic');
          image.src = "data:image/jpeg;base64," + imageData;
          $scope.showAnalyzeButton = true;
        })
        .catch(function(err) {
          console.log(err);
        });
    };
  });

  

  $scope.showActionSheet = function(){
    var hideSheet = $ionicActionSheet.show({
      buttons: [
       { text: 'Choose Photo' },
       { text: 'Take Photo' }
      ],
      cancelText: 'Cancel',
      cancel: function() {
        console.log('cancel');
      },
      buttonClicked: function(index) {
        getPicture(index);
       return true;
      }
    });
  };

  $scope.showActionSheet();

  $scope.testOcrad = function(){
    self.showLoading();
    OCRAD(document.getElementById("pic"), function(text){
      self.hideLoading();
      console.log(text);
      alert(text);
    });
  } ; 

})


.factory('CameraSrv', ['$rootScope', '$q', '$window',function($rootScope, $q, $window) {

  return {
    getPicture: function(options) {

      var deferred = $q.defer();

      if (!$window.Camera) {

        // create file input without appending to DOM
        var fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');

        fileInput.onchange = function() {
          var file = fileInput.files[0];
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = function () {
            $rootScope.$apply(function() {
              // strip beginning from string
              var encodedData = reader.result.replace(/data:image\/jpeg;base64,/, '');
              deferred.resolve(encodedData);
            });
          };
        };

        fileInput.click();
      } 
      else {
        var sourceType = index === 0 ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA;
        
        // set some default options
        var defaultOptions = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: sourceType,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation:true
        };
        
        // allow overriding the default options
        options = angular.extend(defaultOptions, options);

        // success callback
        var success = function(imageData) {
          $rootScope.$apply(function() {
            deferred.resolve(imageData);
          });
        };

        // fail callback
        var fail = function(message) {
          $rootScope.$apply(function() {
            deferred.reject(message);
          });
        };

        // open camera via cordova
        navigator.camera.getPicture(success, fail, options);
      }

      // return a promise
      return deferred.promise;
    }
  };

}]);
