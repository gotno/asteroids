(function(root) {
  var Asteroids = root.Asteroids = ( root.Asteroids || {});

  var Point = Asteroids.Point = function(options) {
    this.pos = { x: 0, y: 0 };
    this.radius = options.radius;
    this.setOrigin(options.origin);
    this.setAngle(-(options.angle));
    this.rotate(0);
  };

  Point.prototype.setAngle = function(angle) {
    this.angle = Math.roundTo(angle, 4);
  };

  Point.prototype.getAngle = function() {
    return this.angle
  };

  Point.prototype.setOrigin = function(origin) {
    this.origin = $.extend({}, origin);
    this.updatePos();
  }

  Point.prototype.rotate = function(offset) {
    this.setAngle(this.getAngle() - offset);
    this.updatePos();
  };

  Point.prototype.updatePos = function() {
    var px = this.origin.x + this.radius,
        py = this.origin.y,
        ox = this.origin.x,
        oy = this.origin.y,
        theta = this.angle;

    var newX = Math.cos(theta) * (px - ox) - Math.sin(theta) * (py - oy) + ox,
        newY = Math.sin(theta) * (px - ox) + Math.cos(theta) * (py - oy) + oy;
 
    this.pos.x = newX;
    this.pos.y = newY;
  };
})(this);
