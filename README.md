dev-Geolocation
================
This is a developmental mobile app to help design a Geolocation system that works to provide GPS tracking via mobile devices (with user permissions of course!) and to take the resulting data and upload it to a database for other parts of the app to utilize; especially to query quick with said data.

The app is built using AngularJS, ngCordova, Cordova's Geolocation plugin and the Ionic mobile framework. The backend is using Firebase & GeoFire BaaS.

## Command Line Installations
A log of the commands to startup this project.

```bash
$ ionic start <projectName> <templateName>
$ ionic setup sass
$ ionic plugin add cordova-plugin-geolocation
$ bower install ngCordova
$ bower install firebase
$ bower install geofire
```
