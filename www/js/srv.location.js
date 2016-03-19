var app = angular.module('locationServices', []);

// locationServices
// Exposes our GPS to our App
app.factory('locationServices', function ($q) {
  console.log('locationServices Loaded.');

  return {
    getCurrentPosition: function () {
      var deferred = $q.defer();

      navigator.geolocation.getCurrentPosition(function (position) {
        deferred.resolve(position);
      }, function () {
        deferred.reject();
      });

      return deferred.promise;
    }
  };
});
