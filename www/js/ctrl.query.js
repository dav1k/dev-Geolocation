var app = angular.module('QueryCtrl', []);

app.controller('QueryCtrl', function($scope, locationServices, geoFireServices) {
  console.log("QueryCtrl Loaded.");

  $scope.showDelete = false;
  $scope.disableResetButton = true;
  $scope.objectsInQuery = [];

  $scope.$on("GEOQUERY:KEY_ENTERED", function (event, key, location, distance) {
    $scope.objectsInQuery.push({
      'key': key,
      'location': location,
      'distance': distance
    });

    if ($scope.objectsInQuery.length >= 1) {
      $scope.disableResetButton = false;
    } else {
      $scope.disableResetButton = true;
    }

    $scope.$apply();

    // console.log($scope.objectsInQuery);
  });

  $scope.$on("GEOQUERY:KEY_EXITED", function (event, key, location, distance) {
    // console.log("callback exited", key);
  });


  // Delete Location Data
  $scope.deleteEntry = function (location) {
    console.log("Delete", location.key);

    geoFireServices.removeLocation(location.key);
  };

  // Reset GPS log
  $scope.resetData = function () {
    angular.forEach($scope.objectsInQuery, function (value, key) {
      geoFireServices.removeLocation(value.key);
    });
    $scope.objectsInQuery = [];
  };



});
