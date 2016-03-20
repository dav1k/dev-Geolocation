var app = angular.module('InitCtrl', []);

app.controller('InitCtrl', function($scope, $interval, $filter, locationServices, geoFireServices) {
  console.log("InitCtrl Loaded.");

  // Data Log
  $scope.log = geoFireServices.objectsInQuery;

  // Init Button States
  $scope.disableStartButton = false;
  $scope.hideResetButton = true;
  if ($scope.log.length >= 1) {
    $scope.hideResetButton = false;
  }

  // Button: Start GPS
  $scope.beginTracking = function() {
    console.log("Tracking Begins");

    $scope.disableStartButton = true;
    var counter = 0;

    $scope.heartbeat = $interval(function() {
      var positionCache = [];

      // Determine Location
      locationServices.getCurrentPosition()
        .then(function(position) {
          var data = {
            'number': counter,
            'time': $filter('date')(new Date(), 'HH:mm:ss'),
            'position': {
              'latitude': position.coords.latitude,
              'longitude': position.coords.longitude
            }
          };

          // Upload to GeoFire
          geoFireServices.uploadLocation('Tick' + counter, {
            'latitude': data.position.latitude,
            'longitude': data.position.longitude
          });

          // Determine Reset Status
          if ($scope.log.length >= 1) {
            $scope.hideResetButton = false;
          } else {
            $scope.hideResetButton = true;
          }
        }, function(error) {
          console.error("Location Error");
          console.error("Error: " + error);
        });

      // Incrementer
      counter++;
    }, 1000 * 5); // 5 second intervals
  };

  // Button: Stop GPS
  $scope.stopTracking = function() {
    console.log("Tracking Stopped.");

    if (angular.isDefined($scope.heartbeat)) {
      $interval.cancel($scope.heartbeat);
      $scope.disableStartButton = false;
    }
  };

  // Button: Reset GPS Data
  $scope.resetData = function() {
    console.log("Reseting GPS Log Data");

    angular.forEach($scope.log, function (value, key) {
      geoFireServices.removeLocation(value.$id);
    });
  };
});
