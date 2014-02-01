(function(root){
   var Asteroids = root.Asteroids = (root.Asteroids || {});

   Asteroids.MovingObjectPointed = function(options) {
     Asteroids.MovingObject.call(this, options);

     this.points = options.points;
   };
   var MovingObjectPointed = Asteroids.MovingObjectPointed;
   MovingObjectPointed.inherits(Asteroids.MovingObject);

   MovingObjectPointed.prototype.draw = function(ctx) {
   };

   MovingObjectPointed.prototype.rotate = function() {
     Asteroids.MovingObject.prototype.rotate.call(this);
   };

   var mop = new MovingObjectPointed({
     pos: { x: 0, y: 0 },
     vel: { x: 0, y: 0 },
     radius: 0,
     color: '#000000',
     angle: 0
   });

   mop.rotate();
   console.log(mop);
})(this);
