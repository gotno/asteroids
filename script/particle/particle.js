(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Particle = Asteroids.Particle = function(options) {
    Asteroids.MovingObject.call(this, options);

    this.lifespan = options.lifespan || 30;
    this.radiusDecay = options.radiusDecay;
  };

  Particle.inherits(Asteroids.MovingObject);

  Particle.prototype.decay = function () {
    this.lifespan--;
    this.vel.x *= this.vel.friction;
    this.vel.y *= this.vel.friction;
    this.radius *= this.radiusDecay;
  };

  Particle.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();

    ctx.arc(this.pos.x,
            this.pos.y,
            this.radius,
            0,
            2 * Math.PI);

    ctx.fill();
  };
  
  var particleOpts = {
    pos: { x: 0, y: 0 },
    vel: { x: 0, y: 0, friction: 1, wobble: 0 },
    color: {},
    lifespan: 1000,
    lifeline: { option: null, status: null }
  };
})(this);
