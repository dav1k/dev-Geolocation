var app = angular.module('MapCtrl', []);

app.controller('MapCtrl', function($scope, $q, $interval, $filter, $timeout, firebaseURL, locationServices, geoFireServices) {
  console.log("MapCtrl Loaded.");

  var map;

  var currentLocation = [37.785326, -122.405696];
  var radius = 1.0; // in km

  // GeoQuery
  var firebaseRef = new Firebase(firebaseURL);
  var geoFire = new GeoFire(firebaseRef);
  var objectsInQuery = {};
  var drawQueryRange;

  var geoQuery = geoFire.query({
    center: currentLocation,
    radius: radius
  });

  // Update Query Criteria & Drawn Range
  var updateCriteria = function(center, radius) {
    console.log("Query Updated.");
    geoQuery.updateCriteria({
      center: center,
      radius: radius
    });

    // Adjust Query Drawn Range
    drawQueryRange.setCenter(new google.maps.LatLng({
      lat: center[0],
      lng: center[1]
    }));
  };

  // Upon Keys inside Query Range
  geoQuery.on("key_entered", function(key, location, distance) {
    // console.log(key, location, distance);
    var object = {
      key: key,
      location: location,
      distance: distance
    };
    // console.log(object);
    objectsInQuery[key] = object;

    // Draw Marker
    object.marker = drawMarker(object);
  });

  // Upon Keys leaving/exiting Query Range
  geoQuery.on("key_exited", function(key, location, distance) {
    var object = objectsInQuery[key];

    // Remove Marker
    object.marker.setMap(null);

    // Delete Object from Array
    delete objectsInQuery[key];
  });

  // Update location
  locationServices.getCurrentPosition()
    .then(function(position) {
      currentLocation = [position.coords.latitude, position.coords.longitude];
      newMapCenter(currentLocation);
    });


  // Google Maps
  var initMap = function() {
    var mapCenter = new google.maps.LatLng(currentLocation[0], currentLocation[1]);

    map = new google.maps.Map(document.getElementById('map'), {
      center: mapCenter,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Color Range
    drawQueryRange = new google.maps.Circle({
      strokeColor: "#0185ff",
      strokeOpacity: 0.7,
      strokeWeight: 1,
      fillColor: "#00e0ff",
      fillOpacity: 0.05,
      map: map,
      center: mapCenter,
      radius: ((radius) * 1000), // change Units m:KM
      draggable: false
    });

    map.addListener('dragend', function() {
      center = [map.getCenter().lat(), map.getCenter().lng()];
      console.log("Center dragged to new position.", center);
      updateCriteria(center, radius);
    });
  };

  var newMapCenter = function(mapCenter) {
    console.log("Re-centering Map");
    map.setCenter({
      lat: mapCenter[0],
      lng: mapCenter[1]
    });
    updateCriteria(mapCenter, radius);
  };

  var drawMarker = function(object) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng({
        lat: object.location[0],
        lng: object.location[1]
      }),
      map: map
    });
    return marker;
  };

  // START!
  initMap();
  $scope.map = map;

});
