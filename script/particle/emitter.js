(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  
  var Emitter = Asteroids.Emitter = function(options) {
    // rate, pos, angle
    this.particles = [];
  };

  Emitter.prototype.emit = function() {
    this.particles.push(new Effects.Particle(options));
  }
})(this);
