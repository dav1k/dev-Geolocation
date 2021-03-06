// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('dev-Geolocation', [
  'ionic',
  'firebase',

  'InitCtrl',
  'QueryCtrl',
  'MapCtrl',

  'locationServices',
  'geoFireServices'
]);


// firebase URL
app.constant('firebaseURL', 'https://devgeofire001.firebaseio.com/');


app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

  .state('tabs.init', {
    url: '/init',
    views: {
      'tab-init': {
        templateUrl: 'templates/tab-init.html',
        controller: 'InitCtrl'
      }
    }
  })

  .state('tabs.query', {
    url: '/query',
    views: {
      'tab-query': {
        templateUrl: 'templates/tab-query.html',
        controller: 'QueryCtrl'
      }
    }
  })

  .state('tabs.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/tab/init');
});
