var app = angular.module('geoFireServices', []);

app.factory('geoFireServices', function($q, $rootScope, $firebase, firebaseURL, locationServices) {

  console.log("geoFireServices Loaded.");

  // Init Firebase & Geofire
  var geoFire = new GeoFire(new Firebase(firebaseURL));

  var currentLocation = [37.785326, -122.405696];
  var geoQuery = geoFire.query({
    center: currentLocation,
    radius: 20
  });

  // Query Callbacks
  var onReadyRegistration = geoQuery.on("ready", function() {
    $rootScope.$broadcast("GEOQUERY:READY");
  });
  var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
    $rootScope.$broadcast("GEOQUERY:KEY_ENTERED", key, location, distance);
  });
  var onKeyExitedRegistration = geoQuery.on("key_exited", function(key, location, distance) {
    $rootScope.$broadcast("GEOQUERY:KEY_EXITED", key, location, distance);
  });
  var onKeyMovedRegistration = geoQuery.on("key_moved", function(key, location, distance) {
    $rootScope.$broadcast("GEOQUERY:KEY_MOVED", key, location, distance);
  });

  // Grab Current Location
  locationServices.getCurrentPosition().then(function(position) {
    currentLocation = position;

    console.log("Current Location updated.");
    geoQuery.updateCriteria({
      center: [position.coords.latitude, position.coords.longitude],
      radius: 20
    });
  });

  // Service Hooks & Data
  return {
    uploadLocation: function(key, location) {
      geoFire.set(key, [location.latitude, location.longitude])
        .then(function() {
          console.log("Upload successful.");
        }, function(error) {
          console.error("Error: " + error);
        });
    },

    removeLocation: function(key) {
      geoFire.remove(key).then(function() {
        console.log(key + " was removed from GeoFire.");
      }, function(error) {
        console.error("Error: " + error);
      });
    },

    updateQuery: function(center, radius) {
      geoQuery.updateCriteria({
        center: [center.latitude, center.longitude],
        radius: radius
      });
    },
  };
});
