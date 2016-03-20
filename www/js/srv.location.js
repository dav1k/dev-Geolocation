var app = angular.module('locationServices', []);

// locationServices
// Exposes our GPS to our App
// Added $timeout: this stores the position for 3s
// This helps if the app is pounding the service
// to improve responsiveness

app.factory('locationServices', function($q, $timeout) {
  console.log('locationServices Loaded.');

  var currentPositionCache;
  var cacheDelay = 1000 * 3; // 3 seconds

  return {
    getCurrentPosition: function() {
      if (!currentPositionCache) {
        var deferred = $q.defer();

        navigator.geolocation.getCurrentPosition(function(position) {
          deferred.resolve(currentPositionCache = position);

          // Clear Cache
          $timeout(function() {
            currentPositionCache = undefined;
          }, cacheDelay);


        }, function() {
          deferred.reject();
        });
        return deferred.promise;
      }
      return $q.when(currentPositionCache);
    }
  };
});
