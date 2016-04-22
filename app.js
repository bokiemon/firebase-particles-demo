var app = angular.module("myApp", ["firebase"]);

	app.controller("MyController", ["$scope", "$firebaseArray", "$firebaseObject",
	function($scope, $firebaseArray, $firebaseObject){
			
    $scope.lifespan = 255.0;
    $scope.min_x = -1;
    $scope.max_x = 1;
    $scope.min_y = -1;
    $scope.max_y = 0;
    $scope.ellipse_size = 12;

    var ref = new Firebase("https://firebillsplit.firebaseio.com");
			//$scope.messages = $firebaseArray(ref);
    //$scope.particles = $firebaseArray(ref.child("particle_sys").$getRecord("particle_1"));
    $scope.messages = $firebaseArray(ref.child("chats"));
    $scope.particles = $firebaseObject(ref.child("particle_sys").child("particle_1"));

    $scope.particles.$watch(function(){
      $scope.lifespan = $scope.particles.lifespan;
      $scope.min_x = $scope.particles.min_x;
      $scope.max_x =$scope.particles.max_x;
      $scope.min_y = $scope.particles.min_y;
      $scope.max_y =$scope.particles.max_y;
      $scope.ellipse_size = $scope.particles.ellipse_size;
      $scope.speed = $scope.speed;
    });
    
    $scope.addMessage = function (e) {
      if(e.keyCode == 13 && $scope.msg){
        var name = $scope.name || 'anonymous';
        $scope.messages.$add({from: name, body: $scope.msg});
        $scope.msg = '';
      }
    };

    var Particle = function(position, phant) {
      this.phant = phant;
      this.acceleration = this.phant.createVector(0, $scope.speed);
      this.velocity = this.phant.createVector(this.phant.random($scope.min_x,$scope.max_x), this.phant.random($scope.min_y, $scope.max_y));
      this.position = position.copy();
      this.lifespan = $scope.lifespan;
    }

    Particle.prototype.run = function() {
      this.update();
      this.display();
    }

    Particle.prototype.update = function() {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.lifespan -= 2;
    }

    Particle.prototype.display = function() {
      this.phant.stroke(200, this.lifespan);
      this.phant.strokeWeight(2);
      this.phant.fill(127, this.lifespan);
      this.phant.ellipse(this.position.x, this.position.y, $scope.ellipse_size, $scope.ellipse_size);
    }

    Particle.prototype.isDead = function() {
      return this.lifespan < 0;
    }

    var ParticleSystem = function(position) {
      this.origin = position.copy();
      this.particles = [];
    }

    ParticleSystem.prototype.addParticle = function(phant) {
      this.particles.push(new Particle(this.origin, phant));
    }

    ParticleSystem.prototype.run = function () {
      for(var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        p.run();
        if(p.isDead()){
          this.particles.splice(i,1);
        }
      }
    }

    $scope.sketch = function(phant) {
      phant.setup = function() {
        var canvasWidth = document.getElementById("body").offsetWidth;
        var canvasHeight = document.getElementById("body").offsetHeight;
        phant.createCanvas(canvasWidth, canvasHeight);
        $scope.system = new ParticleSystem(phant.createVector( canvasWidth / 2, canvasHeight / 2));
      }
      phant.draw = function () {
        //phant.background(51);
        $scope.system.addParticle(phant);
        $scope.system.run();
        //phant.ellipse($scope.radius,50,80,80);
      }
    }

    $scope.myP5 = new p5($scope.sketch, 'body');

		}]);