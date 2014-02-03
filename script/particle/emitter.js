(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  
  var Emitter = Asteroids.Emitter = function(options) {
    this.rate = options.rate;
    this.sputter = options.sputter || 0;
    this.pos = options.pos || { x: 0, y: 0 };
    this.angle = options.angle || 90;
    this.angle = Math.degToRad(this.angle);
    this.ctx = options.ctx;
    this.vel = options.vel;
    this.radius = options.radius;
    this.lifespan = options.lifespan;
    this.color = options.color;
    
    this.particles = [];
  };

  Emitter.prototype.emit = function() {
    if ((Math.random() * 100) > this.sputter) {
      var rateWobble = Math.round(Math.random() * this.rate.wobble);

      if (Math.random() > 0.5) {
        var numParticles = this.rate.num - rateWobble;
      } else {
        var numParticles = this.rate.num + rateWobble;
      }


      for (var i = 0; i < numParticles; i++) {
        var vel = {};
        vel.x = (Math.sin(this.angle + Math.degToRad(90)) * this.vel.x) + (Math.random() * this.vel.wobble - this.vel.wobble/2);
        vel.y = (Math.sin(this.angle + Math.degToRad(90)) * this.vel.y) + (Math.random() * this.vel.wobble - this.vel.wobble/2);
        vel.friction = this.vel.friction;

        var radius
        this.particles.push(new Asteroids.Particle({
          pos: $.extend({}, this.pos),
          vel: vel,
          radius: Math.random() * this.radius.radius + this.radius.wobble,
          radiusDecay: this.radius.decay,
          lifespan: this.lifespan.lifespan + Math.random() * this.lifespan.wobble,
          color: this.color
        }));
      }
    }
  };

  Emitter.prototype.particleStep = function () {
    var emitter = this;

    if (this.particles.length > 0) {
      this.particles.forEach(function(particle, idx) {
        particle.decay();
        particle.move();
        particle.draw(emitter.ctx);
        if (particle.lifespan <= 0) {
          emitter.particles.splice(idx, 1);
        }
      });
    }
  };

  Emitter.wobbleValues = function(vals) {
    wobbledVals = {};

    for (var key in vals) {
      if (typeof vals[key] === 'object') continue;

      switch (vals.wobble.weight) {
      case -1:
        wobbledVals[key] = vals[key] - Math.random() * vals.wobble.amt;
        break;
      case 0:
        var amt = vals.wobble.amt;
        wobbledVals[key] = vals[key] + (Math.random() * amt) - (amt * 2);
        break;
      case 1:
        wobbledVals[key] = vals[key] + Math.random() * vals.wobble.amt;
        break;
      }
    }

    return wobbledVals;
  };

  var emitterOpts = {
    rate: { num: null, wobble: null },
    sputter: 0,
    pos: { x: 0, y: 0 },
    angle: 0,
    particleOpts: {
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0, friction: 1, wobble: 0 },
      color: {},
      lifespan: 1000,
      lifeline: { option: null, status: null }
    }
  }

})(this);
