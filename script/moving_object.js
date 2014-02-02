(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var MovingObject = Asteroids.MovingObject = function(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.angle = Math.degToRad(options.angle);

    this.color = options.color;
  }

  MovingObject.prototype.move = function() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  };

  MovingObject.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 0.5;

    ctx.beginPath();

    ctx.arc(this.pos.x,
            this.pos.y,
            this.radius + 1,
            0,
            2 * Math.PI);

    ctx.stroke();
  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    var dx = Math.pow((this.pos.x - otherObject.pos.x), 2);
    var dy = Math.pow((this.pos.y - otherObject.pos.y), 2);

    var distance = Math.sqrt(dx + dy);

    return ((this.radius + otherObject.radius) > distance);
  };
})(this);
