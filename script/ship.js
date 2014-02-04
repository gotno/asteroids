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

     options.points = [
       new Asteroids.Point({
         origin: $.extend({}, pos),
         radius: Ship.RADIUS,
         angle: Math.PI/2
       }),
       new Asteroids.Point({
         origin: $.extend({}, pos),
         radius: Ship.RADIUS,
         angle: Math.PI/2 + Math.degToRad(130)
       }),
       new Asteroids.Point({
         origin: $.extend({}, pos),
         radius: 0,
         angle: 0
       }),
       new Asteroids.Point({
         origin: $.extend({}, pos),
         radius: Ship.RADIUS,
         angle: Math.PI/2 - Math.degToRad(130)
       })
     ];
     

     Asteroids.MovingObjectPointed.call(this, options);
     this.attachEmitter(20, Math.PI);
   }
   Ship.inherits(Asteroids.MovingObjectPointed);

   Ship.prototype.impulse = function(ximp, yimp) {
     this.vel.x += ( Math.sin(this.angle + Math.degToRad(90)) * Ship.IMPULSE );
     this.vel.y += (-Math.cos(this.angle + Math.degToRad(90)) * Ship.IMPULSE );
     this.exhaustEmitter.emit();
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
     Asteroids.MovingObjectPointed.prototype.draw.call(this, ctx);

     this.exhaustEmitter.setOrigin($.extend({}, this.pos));
     this.exhaustEmitter.setAngle(this.angle - Math.PI);
     this.exhaustEmitter.particleStep();
   }

   Ship.prototype.attachEmitter = function (linearOffset, angleOffset) {
     var emitterOpts = $.extend(true, {}, Ship.exhaustEmitterOptions);

     emitterOpts.ctx = this.ctx;

     emitterOpts.point.origin = $.extend({}, this.pos);
     emitterOpts.point.radius = linearOffset;
     emitterOpts.point.angle = this.angle + angleOffset;

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
     point: {
       origin: {},
       radius: 0,
       angle: 0
     },
     emitter: {
       vel: { x: 6, y: 6, wobble: { amt: 3, weight: 0 } },
       rate: { num: 4, wobble: { amt: 2, weight: 0 } },
       radius: { radius: 8, wobble: { amt: 4, weight: 0 } },
       sputter: 20,
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
