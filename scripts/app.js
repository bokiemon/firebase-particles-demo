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

    /**
     * The particle's config object. 
     * Stores the configuration values of a particle.
     */
    $scope.particleConfig = {};
    
    //How quickly a particle fades out.
    $scope.particleConfig.lifespan = 255.0;
    //Left most value a particle can go on the x-axis.
    $scope.particleConfig.min_x = -1;
    //Right most value a particle can go on the x-axis.
    $scope.particleConfig.max_x = 1;
    //Min value a particle can go on the y-axis. 
    $scope.particleConfig.min_y = -1;
    //Down most value a particle can go on the y-axis.
    $scope.particleConfig.max_y = 0;
    //The size of a particle's radius.
    $scope.particleConfig.ellipse_size = 12;
    //The speed of projection of a particle.
    $scope.particleConfig.speed = 0.05;
    
    //store a reference to the firebase endpoint.
    var ref = new Firebase("https://firebillsplit.firebaseio.com");

    //retrieve the properties for the particle system
    var syncObject = $firebaseObject(ref.child("particle_sys").child("particle_1"));

    /*
     * bind the Firebase object to the variable "particleConfig" with AngularFire 3-way binding. 
     * Any update made to the particleConfig object will be sync to Firebase.
     */
    syncObject.$bindTo($scope, "particleConfig");

    /** Shows the drawer when user clicks on the "drawer" button at the top left of the UI. */
    $scope.onDrawerButtonClick = function() {
      $scope.drawerVisible = $scope.drawerVisible == "is-visible" ? "" : "is-visible";
    }

    /** 
     * Sketch function for R5
     * @param {object|R5} phant - a reference to the R5 object.
     */
    $scope.sketch = function(phant) {

      var img;
      var canvasWidth;
      var canvasHeight;

      /*
       * Load the image before starting the rendering loop.
       * This function is called only once.
       */
      phant.preload = function() {
        img = phant.loadImage("imgs/androidfy_400.png");
      }

      /** Create a H5 canvas programatically and start the particle system. */
      phant.setup = function() {
        
        canvasWidth = document.getElementById("body").offsetWidth;
        canvasHeight = document.getElementById("body").offsetHeight;

        //Create the canvas and particle system.
        phant.createCanvas(canvasWidth, canvasHeight);
        $scope.system = new ParticleSystem(phant.createVector(canvasWidth / 2, 
          canvasHeight / 3), $scope);
      }

      /** Render the background, image and update particles during each rendering loop. */
      phant.draw = function () {
        
        phant.background(51);
        phant.image(img, canvasWidth / 3.6, canvasHeight / 3.7);
        $scope.system.addParticle(phant);
        $scope.system.run();
      }
    }

    /** Init function for angular module*/
    $scope.init = function() {
      $scope.myP5 = new p5($scope.sketch, 'body');
    }
  
}]);