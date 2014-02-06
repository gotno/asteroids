(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  
  var Emitter = Asteroids.Emitter = function(options) {
    var pointOpts = options.point;
    Asteroids.Point.call(this, pointOpts);

    this.eOpts = options.emitter;
    this.cold = false;
    this.throttle = this.eOpts.throttle || false;
    this.lifespan = this.eOpts.lifespan || -1;

    this.pOpts = options.particles;
    
    this.ctx = options.ctx;
    this.particles = [];
  };
  Emitter.inherits(Asteroids.Point);
  

  Emitter.prototype.emit = function() {
    var eOpts = this.eOpts,
        pOpts = this.pOpts;

    if (Math.random() * 100 > eOpts.sputter) {
      var numParticles = Emitter.wobbleValues(eOpts.rate).num;

      for (var i = 0; i < numParticles; i++) {
        var vel = {};
        var wVel = Emitter.wobbleValues(eOpts.vel);
        vel.x =  Math.sin(this.angle) * wVel.x;
        vel.y = -Math.cos(this.angle) * wVel.y;
        vel.decay = pOpts.vel.decay;

        var radius = Emitter.wobbleValues(eOpts.radius);
        radius.decay = pOpts.radius.decay;

        var lifespan = Emitter.wobbleValues(eOpts.lifespan);
        lifespan.span = Math.round(lifespan.span);

        this.particles.push(new Asteroids.Particle({
          pos: $.extend({}, this.pos),
          vel: vel,
          angle: pOpts.angle,
          rotationSpeed: pOpts.rotationSpeed,
          radius: radius,
          lifespan: lifespan,
          lifeline: pOpts.lifeline,
          layers: pOpts.layers
        }));
      }
    }
  };

  Emitter.prototype.particleStep = function () {
    if (this.lifespan !== 0) {
      if (this.throttle) this.emit();
      this.lifespan--;
    } else if (this.lifespan === 0) {
      this.throttle = false;
    }

    var emitter = this;

    if (this.particles.length > 0) {
      this.cold = false;

      for (var i = 0; i < this.pOpts.layers.length; i++) {
        this.particles.forEach(function(particle, idx) {
          particle.decay();
          particle.move();
          particle.draw(i, emitter.ctx);

          if (i == emitter.pOpts.layers.length - 1) {
            emitter.possibleDeath(idx);
          }
        });
      }
    } else {
      this.cold = true;
    }
  };

  Emitter.prototype.possibleDeath = function(idx) {
    var particle = this.particles[idx];
    var attr = particle.lifeline.attr;
    var val = particle.lifeline.val;

    if (particle[attr][val] == particle.lifeline.trigger) {
      delete this.particles[idx];
      this.particles.splice(idx, 1);
      return true;
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
        wobbledVals[key] = vals[key]; 
        wobbledVals[key] += ((Math.random() * amt) - (Math.random() * amt));
        break;
      case 1:
        wobbledVals[key] = vals[key] + Math.random() * vals.wobble.amt;
        break;
      }
    }

    return wobbledVals;
  };
})(this);
