(function(root){
   var Asteroids = root.Asteroids = (root.Asteroids || {});

   var Ship = Asteroids.Ship = function(pos, ctx){
     var options = {};
     options.pos = pos;
     options.vel = { x: 0, y: 0 };
     options.radius = Ship.RADIUS;
     options.color = Ship.COLOR;
     options.angle = Math.PI;

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

     this.exhaustEmitter = this.attachEmitter(Ship.exhaustEmitterOptions,
                                              ctx, 20, Math.PI/2);
   }
   Ship.inherits(Asteroids.MovingObjectPointed);

   Ship.prototype.impulse = function(ximp, yimp) {
     this.vel.x += ( Math.sin(this.angle - Math.PI) * Ship.IMPULSE );
     this.vel.y += (-Math.cos(this.angle - Math.PI) * Ship.IMPULSE );
     this.exhaustEmitter.emit();
   };
   
   Ship.prototype.fireBullet = function(game) {
     var options = {};
     options.pos = $.extend({}, this.pos);

     options.vel = {};
     options.vel.x =  Math.sin(this.angle - Math.PI) * Ship.BULLET_SPEED;
     options.vel.y = -Math.cos(this.angle - Math.PI) * Ship.BULLET_SPEED;

     var bullet = new Asteroids.Bullet(options);
     return bullet;
   };

   Ship.prototype.draw = function(ctx) {
     this.emitters.forEach(function(emitter) {
       emitter.particleStep();
     });
//     this.exhaustEmitter.particleStep();

     Asteroids.MovingObjectPointed.prototype.draw.call(this, ctx);
   }

   Ship.prototype.destroy = function() {
     delete this.exhaustEmitter;
     this.emitters = [];
     this.points = [];
 
     this.rotationSpeed = Math.degToRad(30);
     this.attachEmitter(Ship.explosionEmitterOptions, this.ctx, 0, 0);
     this.attachEmitter(Ship.explosionEmitterOptions, this.ctx, 0, Math.PI*2*.333);
     this.attachEmitter(Ship.explosionEmitterOptions, this.ctx, 0, Math.PI*2*.666);
   };

   Ship.RADIUS = 8;
   Ship.IMPULSE = 0.20;
   Ship.BULLET_SPEED = 12;
   Ship.COLOR = "#7dabca";

   Ship.explosionEmitterOptions = {
     point: {
       origin: {},
       radius: 0,
       angle: 0
     },
     emitter: {
       vel: { x: 6, y: 6, wobble: { amt: 4, weight: 0 } },
       rate: { num: 3, wobble: { amt: 1, weight: 0 } },
       radius: { radius: 14, wobble: { amt: 4, weight: 0 } },
       sputter: 20,
       layers: 2,
       throttle: true,
       lifespan: 15 
     },
     particles: {
       vel: { decay: { amt: 0.7, weight: 0, limit: .1 } },
       radius: { radius: 0, decay: { amt: 0.95, weight: 0, limit: 0 } },
       angle: 0,
       rotationSpeed: 0,
       lifespan: { span: 20, wobble: { amt: 5, weight: 1 } },
       lifeline: { attr: 'radius', val: 'radius', trigger: 0 },
       layers: [{ color: Asteroids.Asteroid.COLOR, radiusOffset: 0 },
                { color: Ship.COLOR, radiusOffset: -1 }]
     }
   };

   Ship.exhaustEmitterOptions = {
     point: {
       origin: {},
       radius: 0,
       angle: 0
     },
     emitter: {
       vel: { x: 6, y: 6, wobble: { amt: 4, weight: 0 } },
       rate: { num: 3, wobble: { amt: 1, weight: 0 } },
       radius: { radius: 10, wobble: { amt: 2, weight: 0 } },
       sputter: 20,
       layers: 2,
       lifespan: -1
     },
     particles: {
       vel: { decay: { amt: 0.7, weight: 0, limit: .1 } },
       radius: { radius: 0, decay: { amt: 0.95, weight: 0, limit: 0 } },
       angle: 0,
       rotationSpeed: 0,
       lifespan: { span: 20, wobble: { amt: 5, weight: 1 } },
       lifeline: { attr: 'radius', val: 'radius', trigger: 0 },
       layers: [{ color: '#fcfcfc', radiusOffset: 0 },
                { color: Ship.COLOR, radiusOffset: -2 }]
     }
   }
})(this);
