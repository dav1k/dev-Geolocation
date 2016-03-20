var app = angular.module('QueryCtrl', []);

app.controller('QueryCtrl', function($scope, locationServices, geoFireServices, $firebaseArray, firebaseURL) {
  console.log("QueryCtrl Loaded.");

  $scope.showDelete = false;
  $scope.disableResetButton = false;
  $scope.objectsInQuery = [];

  var ref = new Firebase(firebaseURL);

  $scope.objectsInQuery = $firebaseArray(ref);

  console.log($scope.objectsInQuery);

});
