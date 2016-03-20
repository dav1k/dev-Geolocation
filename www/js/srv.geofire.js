var app = angular.module('geoFireServices', []);

app.factory('geoFireServices', function($q, $rootScope, $firebase, firebaseURL, locationServices) {

  console.log("geoFireServices Loaded.");

  // Init Firebase & Geofire
  var geoFire = new GeoFire(new Firebase(firebaseURL));
  var objectsInQuery = [];

  var currentLocation = [37.785326, -122.405696];
  var geoQuery = geoFire.query({
    center: currentLocation,
    radius: 20
  });



  // Query Callbacks
  var onReadyRegistration = geoQuery.on("ready", function() {
    // console.log("GeoQuery has loaded and fired all other events for inital data.");
  });

  var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
    console.log(key + " entered query at " + location + " (" + distance + " km from center)");

    objectsInQuery.push({
      'key': key,
      'location': location,
      'distance': distance
    });

    // Broadcast to app
    $rootScope.$broadcast("GEOQUERY:KEY_ENTERED");
  });


  var onKeyExitedRegistration = geoQuery.on("key_exited", function(key, location, distance) {
    console.log(key + " exited query at " + location + " (" + distance + " km from center)");

    $rootScope.$broadcast("GEOQUERY:KEY_EXITED");
  });

  var onKeyMovedRegistration = geoQuery.on("key_moved", function (key, location, distance) {
    console.log(key + " moved within query to " + location + " (" + distance + " km from center)");

    $rootScope.$broadcast("GEOQUERY:KEY_MOVED");
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
      console.log("Upload: ", location);

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

    updateQuery: function() {
      return objectsInQuery;
    },

    queryData: objectsInQuery

  };
});
