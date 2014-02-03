(function(root){
   var Asteroids = root.Asteroids = (root.Asteroids || {});

   var Ship = Asteroids.Ship = function(pos, ctx){
     var options = {};
     options.pos = pos;
     options.vel = { x: 0, y: 0 };
     options.radius = Ship.RADIUS;
     options.color = Ship.COLOR;
     options.angle = 270;
     this.ctx = ctx;

     Asteroids.MovingObject.call(this, options);

     this.attachEmitter();

     /*
     this.exhaustEmitter = new Asteroids.Emitter({
       pos: $.extend({}, this.pos),
       vel: { x: 6, y: 6, wobble: 3, friction: 0.8 },
       sputter: 20,
       rate: { num: 4, wobble: 2 },
       radius: { radius: 7, wobble: 5, decay: 0.95 },
       lifespan: { lifespan: 20, wobble: 5 },
       ctx: ctx,
       color: Asteroids.Ship.COLOR
     });
     */

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

   Ship.prototype.attachEmitter = function (linearOffset, angleOffset) {
     var emitterOpts = $.extend(true, {}, Ship.exhaustEmitterOptions);
     console.log(emitterOpts);

     emitterOpts.pos = $.extend({}, this.pos);
     emitterOpts.ctx = this.ctx;

     //emitterOpts.emitterPoint.origin = $.extend({}, this.pos);
     //emitterOpts.emitterPoint.radius = linearOffset;
     //emitterOpts.emitterPoint.angle = this.angle + angleOffset;

     this.exhaustEmitter = new Asteroids.Emitter(emitterOpts);
   };

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

   Ship.exhaustEmitterOptions = {
     //emitterPoint: {
     //  origin: {},
     //  radius: 0,
     //  angle: 0
     //},
     emitter: {
       pos: {},
       vel: { x: 6, y: 6, wobble: { amt: 3, weight: 0 } },
       rate: { num: 4, wobble: { amt: 2, weight: 0 } },
       radius: { radius: 8, wobble: { amt: 4, weight: 0 } },
       sputter: 20,
     //  angle: 0,
       layers: 2
     },
     particles: {
       vel: { decay: { amt: 0.8, weight: 0, limit: .1 } },
       radius: { radius: 7, decay: { amt: 0.95, weight: 0, limit: 0 } },
       angle: 0,
       rotationSpeed: 0,
       lifespan: { span: 20, wobble: { amt: 5, weight: 1 } },
       lifeline: { attr: 'radius', val: 'radius', trigger: 0 },
       layers: [{ color: '#fcfcfc', radiusOffset: 0 },
                { color: Ship.COLOR, radiusOffset: -2 }]
     }
   }
})(this);
