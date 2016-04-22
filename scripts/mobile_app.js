/**
 * Author: Bok Thye Yeow (bok@google.com)
 * Date: 22/04/2016
 * An AngularFire + Firebase + R5.js demo
 * This is a very quick and dirty demo and does not have production ready code.
 */

//Application's Angular module
var app = angular.module("app", ["firebase"]);

	app.controller("MainController", ["$scope", "$firebaseArray", "$firebaseObject",
	function($scope, $firebaseArray, $firebaseObject){
		
    $scope.drawerVisible = "";	

    $scope.particleConfig = {};
    
    $scope.particleConfig.lifespan = 255.0;
    $scope.particleConfig.min_x = -1;
    $scope.particleConfig.max_x = 1;
    $scope.particleConfig.min_y = -1;
    $scope.particleConfig.max_y = 0;
    $scope.particleConfig.ellipse_size = 12;
    $scope.particleConfig.speed = 0.05;
    
    var ref = new Firebase("https://firebillsplit.firebaseio.com");
    var syncObject = $firebaseObject(ref.child("particle_sys").child("particle_1"));
    syncObject.$bindTo($scope, "particleConfig");

}]);