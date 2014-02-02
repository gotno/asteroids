(function(root){
   var Asteroids = root.Asteroids = (root.Asteroids || {});

   Asteroids.MovingObjectPointed = function(options) {
     Asteroids.MovingObject.call(this, options);

     this.points = options.points;
     this.rotationSpeed = options.rotationSpeed;
     this.strokeColor = options.strokeColor || null;
   };
   var MovingObjectPointed = Asteroids.MovingObjectPointed;
   MovingObjectPointed.inherits(Asteroids.MovingObject);

   MovingObjectPointed.prototype.draw = function(ctx) {
     ctx.fillStyle = this.color;
     ctx.beginPath();
     ctx.moveTo(this.points[0].pos.x, this.points[0].pos.y);
     for (var i = 1; i < this.points.length; i++) {
       ctx.lineTo(this.points[i].pos.x, this.points[i].pos.y);
     }
     ctx.lineTo(this.points[0].pos.x, this.points[0].pos.y);
     ctx.fill();
     if (this.strokeColor) {
       ctx.strokeStyle = this.strokeColor;
       ctx.lineWidth = 2;
       ctx.stroke();
     }
   };

   MovingObjectPointed.prototype.rotate = function(angle) {
     this.points.forEach(function(point) {
       point.rotate(angle);
     });
   };

   MovingObjectPointed.prototype.move = function(angle) {
     Asteroids.MovingObject.prototype.move.call(this);

     this.rotate(this.rotationSpeed);

     var that = this;
     this.points.forEach(function(point) {
       point.setOrigin(that.pos);
     });
   };
})(this);
