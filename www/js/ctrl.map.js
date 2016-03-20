var app = angular.module('MapCtrl', []);

app.controller('MapCtrl', function ($scope, $q, $interval, $filter, $timeout, locationServices, geoFireServices) {
  console.log("MapCtrl Loaded.");

  var currentLocation;
  var objectsInQuery = [];

  locationServices.getCurrentPosition()
    .then(function (position) {
      currentLocation = {
        'latitude': position.coords.latitude,
        'longitude': position.coords.longitude
      };

      geoFireServices.updateQuery(currentLocation, 20);

      // Build Query
      $scope.$on("GEOQUERY:KEY_ENTERED", function (event, key, location, distance) {
        objectsInQuery.push({
          key: key,
          location: location,
          distance: distance
        });

        // console.log("key: ", key);
      });

      // init Google Maps
      var mapOptions = {
        'center': new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude),
        'zoom': 18,
        'mapTypeId': google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      google.maps.event.addListener($scope.map, 'center_changed', function () {
        $timeout(function () {
          // console.log('moved');
          console.log($scope.map.getCenter().lat(), $scope.map.getCenter().lng());
        }, 1000 * 3);
      });

      // Create Markers
      google.maps.event.addListenerOnce($scope.map, 'idle', function () {
        angular.forEach(objectsInQuery, function (result, index) {
          // Design Marker
          var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(result.location[0], result.location[1])
          });

          // Design InfoWindow
          var infoWindow = new google.maps.InfoWindow({
            content: result.key
          });

          // Create Click Listener
          google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open($scope.map, marker);
          });
        });
      });
    });
});
