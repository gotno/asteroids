(function(root) {
  var Asteroids = root.Asteroids = ( root.Asteroids || {});

  var Point = Asteroids.Point = function(options) {
    this.pos = options.pos || { x: 0, y: 0 };
    this.origin = options.origin || { x: 0, y: 0 };
    this.angle = options.angle || 0;
  };

  Point.prototype.rotate = function(angle) {
   this.angle += Math.degToRad(angle);

   var px = this.pos.x,
       py = this.pos.y,
       ox = this.origin.x,
       oy = this.origin.y,
       theta = this.angle;

   var newX = Math.cos(theta) * (px - ox) - Math.sin(theta) * (py - oy) + ox,
       newY = Math.sin(theta) * (px - ox) + Math.cos(theta) * (py - oy) + oy;

   this.pos.x = newX;
   this.pos.y = newY;
  };
})(this);
