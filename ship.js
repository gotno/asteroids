(function(root){
   var Asteroids = root.Asteroids = (root.Asteroids || {});

   var Ship = Asteroids.Ship = function(xpos, ypos){
     Asteroids.MovingObject.call(this,
                                 xpos,
                                 ypos,
                                 0,
                                 0,
                                 Ship.RADIUS,
                                 Ship.COLOR,
                                 270)
   }
   Ship.inherits(Asteroids.MovingObject);

   Ship.prototype.impulse = function(ximp, yimp) {
     this.xvel += (  Math.sin(this.angle + Math.degToRad(90)) * Ship.IMPULSE );
     this.yvel += ( -Math.cos(this.angle + Math.degToRad(90)) * Ship.IMPULSE );
   };
   
   Ship.prototype.rotate = function(degrees) {
     this.angle += Math.degToRad(degrees);
   };

   Ship.prototype.fireBullet = function(game) {
     var bulletXVel = Math.sin(this.angle + Math.degToRad(90)) * Ship.BULLET_SPEED;
     var bulletYVel = -Math.cos(this.angle + Math.degToRad(90)) * Ship.BULLET_SPEED;
     
     var bullet = new Asteroids.Bullet(this.xpos,
                                       this.ypos,
                                       bulletXVel,
                                       bulletYVel,
                                       game);
     return bullet;
   };

   Ship.prototype.draw = function(ctx) {
     Asteroids.MovingObject.prototype.draw.call(this, ctx);

     var bowX, bowY, bowTheta,
         portX, portY, portTheta,
         starX, starY, starTheta;

     bowX = this.xpos + Ship.RADIUS;
     bowY = this.ypos;
     bowTheta = this.angle;
     var rotatedBow = Ship.rotatePoint(bowX,
                                       bowY,
                                       this.xpos,
                                       this.ypos,
                                       bowTheta);
     bowX = rotatedBow.x;
     bowY = rotatedBow.y;

     portX = this.xpos + Ship.RADIUS;
     portY = this.ypos;
     portTheta = this.angle + Math.degToRad(130);
     var rotatedPort = Ship.rotatePoint(portX,
                                        portY,
                                        this.xpos,
                                        this.ypos,
                                        portTheta);
     portX = rotatedPort.x;
     portY = rotatedPort.y;


     starX = this.xpos + Ship.RADIUS;
     starY = this.ypos;
     starTheta = this.angle + Math.degToRad(230);
     var rotatedStar = Ship.rotatePoint(starX,
                                        starY,
                                        this.xpos,
                                        this.ypos,
                                        starTheta);
     starX = rotatedStar.x;
     starY = rotatedStar.y;

     ctx.strokeStyle = this.color;
     ctx.fillStyle = this.color;

     ctx.moveTo(starX, starY);
     ctx.beginPath();
     ctx.lineTo(bowX, bowY);
     ctx.lineTo(portX, portY);
     ctx.lineTo(this.xpos, this.ypos);
     ctx.lineTo(starX, starY);
     ctx.closePath();
     ctx.fill();
     //ctx.stroke();
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

   Math.degToRad = function(deg) {
     return deg * (Math.PI / 180);
   }

   Ship.RADIUS = 8;
   Ship.IMPULSE = 0.20;
   Ship.BULLET_SPEED = 12;
   Ship.COLOR = "#7dabca";
})(this);
