(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Particle = Asteroids.Particle = function(options) {
    var tempRadius = options.radius;
    options.radius = options.radius.radius;

    Asteroids.MovingObject.call(this, options);

    this.radius = tempRadius;
    this.lifespan = options.lifespan;
    this.lifeline = options.lifeline;
    this.layers = options.layers;
  };

  Particle.inherits(Asteroids.MovingObject);

  Particle.prototype.decay = function () {
    this.lifespan--;
    //Particle.decayValues(this.vel);
    this.vel.x *= this.vel.decay.amt;
    this.vel.y *= this.vel.decay.amt;
    Particle.decayValues(this.radius);
  };

  Particle.prototype.draw = function (layer, ctx) {
    var layer = this.layers[layer];

    ctx.fillStyle = layer.color;

    ctx.beginPath();

    var radius = this.radius.radius + layer.radiusOffset;
    if (radius < 0) radius = 0;

    ctx.arc(this.pos.x,
            this.pos.y,
            radius,
            0,
            2 * Math.PI);

    ctx.fill();
  };

  Particle.decayValues = function(vals) {
    for (var key in vals) {
      if (typeof vals[key] === 'object') continue;

      switch (vals.decay.weight) {
      case -1:
        if (vals[key] > vals.decay.limit) {
          vals[key] -= vals.decay.amt;
        } else {
          vals[key] = vals.decay.limit;
        }
        break;
      case 0:
        if (vals[key] < vals.decay.limit + .5) {
          vals[key] = vals.decay.limit;
        } else {
          vals[key] *= vals.decay.amt;
        }
        break;
      case 1:
        if (vals[key] > vals.decay.limit) {
          vals[key] += vals.decay.amt;
        } else {
          vals[key] = vals.decay.limit;
        }
        break;
      default:
        vals[key] *= vals.decay.amt;
        if (vals[key] > vals.decay.limit) {
          vals[key] = vals.decay.limit;
        }
      }
    }
  };
})(this);
