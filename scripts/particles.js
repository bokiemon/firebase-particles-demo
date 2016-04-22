/**
 * Author: Bok Thye Yeow (bok@google.com)
 * Date: 22/04/2016
 * An AngularFire + Firebase + R5.js demo
 * This is a very quick and dirty demo and does not have production ready code.
 */

/**
 * Represents a Particle class.
 * This code is from R5 particle example code with slight modification.
 * @constructor
 * @param {object|Vector} position - The initial particle position.
 * @param {phant | R5} phant - A reference to the R5 object.
 */
var Particle = function(position, phant, scope) {
    this.scope = scope;
    this.phant = phant;
    this.acceleration = this.phant.createVector(0, this.scope.particleConfig.speed);
    this.velocity = this.phant.createVector(
      this.phant.random(this.scope.particleConfig.min_x, this.scope.particleConfig.max_x), 
      this.phant.random(this.scope.particleConfig.min_y, this.scope.particleConfig.max_y));
    this.position = position.copy();
    this.lifespan = this.scope.particleConfig.lifespan;
  }

/**
 * Called each rendering loop. 
 */
Particle.prototype.run = function() {
  this.update();
  this.display();
}

/**
 * Update the velocity, position and lifespan of a particle.
 */
Particle.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
}

/**
 * Render the particle with the newly updated properties to the canvas.
 */
Particle.prototype.display = function() {
  this.phant.stroke(200, this.lifespan);
  this.phant.strokeWeight(0);
  this.phant.fill(255, 205, 0, this.lifespan);
  this.phant.ellipse(this.position.x, this.position.y, 
    this.scope.particleConfig.ellipse_size, this.scope.particleConfig.ellipse_size);
}

/**
 * Helper function to determine if a particle has faded out.
 * @returns {Boolean}
 */
Particle.prototype.isDead = function() {
  return this.lifespan < 0;
}

/**
 * Represents a particle system.
 * @param {object | Vector} position - The initial position of the particle system.
 */
var ParticleSystem = function(position, scope) {
  this.scope = scope;
  this.origin = position.copy();
  /** Store all particle references in an array */
  this.particles = [];
}

/**
 * Add a new particle to be rendered to canvas to the array.
 * @param {object:|R5} phant - reference to the R5 object.
 */
ParticleSystem.prototype.addParticle = function(phant) {
  this.particles.push(new Particle(this.origin, phant, this.scope));
}

/**
 * During each render loop, remove particle if it has faded out or update their properties otherwise.
 */
ParticleSystem.prototype.run = function () {
  for(var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];
    p.run();
    if(p.isDead()){
      this.particles.splice(i,1);
    }
  }
}