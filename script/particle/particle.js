(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Particle = Asteroids.Particle = function(options) {
    Asteroids.MovingObject.call(this, options);

    this.lifespan = options.lifespan || 30;
    this.friction = options.friction || 1
  };

  Particle.inherits(Asteroids.MovingObject);

  Particle.prototype.decay = function () {
    this.lifespan--;
    this.vel.x *= this.friction;
    this.vel.y *= this.friction;
    //if (this.radius >= 1.2) this.radius -= .2;
    if (this.radius >= 1.2) this.radius -= .2;
  };

  Particle.prototype.drawFg = function (ctx) {
    ctx.fillStyle = Asteroids.Ship.COLOR;

    ctx.beginPath();

    ctx.arc(this.pos.x,
            this.pos.y,
            this.radius - 1,
            0,
            2 * Math.PI);

    ctx.fill();
  };
  
  Particle.prototype.drawBg = function(ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();

    ctx.arc(this.pos.x,
            this.pos.y,
            this.radius,
            0,
            2 * Math.PI);

    ctx.fill();
  };
})(this);
