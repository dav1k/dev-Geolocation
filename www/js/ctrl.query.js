var app = angular.module('QueryCtrl', []);

app.controller('QueryCtrl', function($scope, locationServices, geoFireServices) {
  console.log("QueryCtrl Loaded.");

  $scope.showDelete = false;
  $scope.disableResetButton = true;
  // $scope.queryData = $rootScope.queryData;
  $scope.queryData = geoFireServices.queryData

  // $scope.$on("GEOQUERY:KEY_ENTERED", function (event, key, location, distance) {
  //   // console.log(key);
  //   $scope.queryData.push({
  //     key: key,
  //     location: location,
  //     distance: distance
  //   });
  //   $scope.$digest();
  //
  //   if ($scope.queryData.length >= 1) {
  //     $scope.disableResetButton = false;
  //   } else {
  //     $scope.disableResetButton = true;
  //   }
  // });

  $scope.$on("GEOQUERY:UPDATED", function () {
    $scope.$digest();
  });


  $scope.test = function () {
    // $scope.$digest();
  };



  // Delete Data Points from Geofire
  $scope.deleteEntry = function (location) {
    // console.log(location);
    geoFireServices.removeLocation(location.key);
  };
});
