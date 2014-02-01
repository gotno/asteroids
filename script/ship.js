(function(root){
   var Asteroids = root.Asteroids = (root.Asteroids || {});

   var Ship = Asteroids.Ship = function(pos, ctx){
     var options = {};
     options.pos = pos;
     options.vel = { x: 0, y: 0 };
     options.radius = Ship.RADIUS;
     options.color = Ship.COLOR;
     options.angle = 270;

     Asteroids.MovingObject.call(this, options);

     this.exhaustEmitter = new Asteroids.Emitter({
       pos: $.extend({}, this.pos),
       ctx: ctx
     });

     this.emitterDistance = 10;
   }
   Ship.inherits(Asteroids.MovingObject);

   Ship.prototype.impulse = function(ximp, yimp) {
     this.vel.x += ( Math.sin(this.angle + Math.degToRad(90)) * Ship.IMPULSE );
     this.vel.y += (-Math.cos(this.angle + Math.degToRad(90)) * Ship.IMPULSE );
     this.exhaustEmitter.emit();
   };
   
   Ship.prototype.rotate = function(degrees) {
     this.angle += Math.degToRad(degrees);
   };

   Ship.prototype.fireBullet = function(game) {
     var options = {};
     options.pos = $.extend({}, this.pos);

     options.vel = {};
     options.vel.x =  Math.sin(this.angle + Math.degToRad(90)) * Ship.BULLET_SPEED;
     options.vel.y = -Math.cos(this.angle + Math.degToRad(90)) * Ship.BULLET_SPEED;

     var bullet = new Asteroids.Bullet(game, options);
     return bullet;
   };

   Ship.prototype.draw = function(ctx) {
     var initOpts = { 
       x: this.pos.x + Ship.RADIUS,
       y: this.pos.y
     };

     var bow  = $.extend({}, initOpts);
     bow.angle = this.angle;

     var port = $.extend({}, initOpts);
     port.angle = this.angle + Math.degToRad(130);

     var star = $.extend({}, initOpts);
     star.angle = this.angle - Math.degToRad(130);

     var rotatedBow = Ship.rotatePoint(bow.x,
                                       bow.y,
                                       this.pos.x,
                                       this.pos.y,
                                       bow.angle);

     var rotatedPort = Ship.rotatePoint(port.x,
                                        port.y,
                                        this.pos.x,
                                        this.pos.y,
                                        port.angle);

     var rotatedStar = Ship.rotatePoint(star.x,
                                        star.y,
                                        this.pos.x,
                                        this.pos.y,
                                        star.angle);


     ctx.fillStyle = this.color;

     ctx.moveTo(rotatedStar.x, rotatedStar.y);
     ctx.beginPath();
     ctx.lineTo(rotatedBow.x, rotatedBow.y);
     ctx.lineTo(rotatedPort.x, rotatedPort.y);
     ctx.lineTo(this.pos.x, this.pos.y);
     ctx.lineTo(rotatedStar.x, rotatedStar.y);
     ctx.closePath();
     ctx.fill();

     var emitterOpts = {
       x: this.pos.x + Ship.RADIUS + this.emitterDistance,
       y: this.pos.y,
       angle: this.angle - Math.PI
     }
     var rotatedEmitter = Ship.rotatePoint(emitterOpts.x,
                                           emitterOpts.y,
                                           this.pos.x,
                                           this.pos.y,
                                           emitterOpts.angle);
     this.exhaustEmitter.pos.x = rotatedEmitter.x;
     this.exhaustEmitter.pos.y = rotatedEmitter.y;
     this.exhaustEmitter.angle = emitterOpts.angle;

     this.exhaustEmitter.particleStep();
   }

   Ship.rotatePoint = function(px, py, ox, oy, theta) {
     var px = px;
     var py = py;
     var ox = ox;
     var oy = oy;
     var theta = theta;

     newX = Math.cos(theta) * (px - ox) - Math.sin(theta) * (py - oy) + ox;
     newY = Math.sin(theta) * (px - ox) + Math.cos(theta) * (py - oy) + oy;

     return { x: newX, y: newY };
   };

   Ship.RADIUS = 8;
   Ship.IMPULSE = 0.20;
   Ship.BULLET_SPEED = 12;
   Ship.COLOR = "#7dabca";
})(this);
