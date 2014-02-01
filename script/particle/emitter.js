(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  
  var Emitter = Asteroids.Emitter = function(options) {
    this.rate = options.rate || 80;
    this.pos = options.pos || { x: 0, y: 0 };
    this.angle = options.angle || 90;
    this.angle = Math.degToRad(this.angle);
    this.ctx = options.ctx;
    
    this.particles = [];
  };

  Emitter.prototype.emit = function() {
    if ((Math.random() * 100) < this.rate) {
      this.particles.push(new Asteroids.Particle({
        pos: $.extend({}, this.pos),
        vel: { x:  (Math.sin(this.angle + Math.degToRad(90)) * 6) + (Math.random() * 3 - 1.5),
               y: (-Math.cos(this.angle + Math.degToRad(90)) * 6) + (Math.random() * 3 - 1.5)
        },
        color: '#cecece',
        radius: Math.random() * 5 + 5,
        lifespan: 25 + Math.random() * 5, 
        friction: 0.8
      }));
    }
  };

  Emitter.prototype.particleStep = function () {
    var emitter = this;

    if (this.particles.length > 0) {
      this.particles.forEach(function(particle) {
        particle.decay();
        particle.move();
        particle.drawBg(emitter.ctx);
      });
      this.particles.forEach(function(particle, idx) {
        particle.drawFg(emitter.ctx);
        if (particle.lifespan <= 0) {
          emitter.particles.splice(idx, 1);
        }
      });
    }
  };

})(this);
