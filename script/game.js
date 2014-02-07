(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Game = Asteroids.Game = function (ctx) {
    this.switchModes('inPlay');
    this.ctx = ctx;

    this.HUD = new Asteroids.HUD(ctx);
    this.HUD.getHighScores();

    this.addKeyBindings();
    this.setup();
  };

  Game.prototype.setup = function() {
    this.asteroids = [];
    this.emitterObjects = [];
    this.ship = new Asteroids.Ship({
      x: Game.DIM_X/2,
      y: Game.DIM_Y/2,
    }, this.ctx);
    this.bullets = [];
    this.score = 0;
    this.gameOver = false;

    this.addAsteroids(10);
  };

  Game.prototype.reset = function() {
    this.asteroids.forEach(function(asteroid) {
      delete asteroid;
    });
    this.bullets.forEach(function(bullet) {
      delete bullet;
    });
    delete this.ship;

    this.emitterObjects.forEach(function(EO) {
      delete EO;
    });

    this.setup();
  };

  Game.prototype.switchModes = function (mode) {
    this.mode = mode;
    key.setScope(mode);
  };

  Game.prototype.addSmallAsteroids = function(numAsteroids, asteroid, bullet) {
    for (var i = 0; i < numAsteroids; i++) {
      var newAst = Asteroids.Asteroid.randomSmallAsteroid(asteroid, bullet);
      this.asteroids.push(newAst);
    }
  };

  Game.prototype.addAsteroids = function(numAsteroids) {
    for (var i = 0; i < numAsteroids; i++) {
      this.asteroids.push(Asteroids.Asteroid.randomAsteroid(Game.DIM_X,
                                                            Game.DIM_Y));
    }
  };

  Game.prototype.draw = function() {
    var ctx = this.ctx;

    ctx.fillStyle = Game.colors.bg;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.asteroids.forEach(function(asteroid) {
      asteroid.draw(ctx);
    });

    this.bullets.forEach(function(bullet) {
      bullet.draw(ctx);
    });

    this.emitterObjects.forEach(function(EO) {
      EO.draw(ctx);
    });

    switch(this.mode) {
    case 'start':
      this.ship.draw(ctx);
      break;
    case 'inPlay':
      this.ship.draw(ctx);
      this.HUD.drawInPlay(this.score);
      break;
    case 'over':
      this.ship.draw(ctx);
      this.HUD.drawGameOver(this.score);
      break;
    }
  };

  Game.prototype.move = function() {
    var game = this;

    this.ship.move();
    this.screenWrap(this.ship);

    this.asteroids.forEach(function(asteroid) {
      asteroid.move();
      game.screenWrap(asteroid);
    });

    var tempBullets = [];

    this.bullets.forEach(function(bullet) {
      bullet.move();
      if (game.isOnScreen(bullet)) {
        tempBullets.push(bullet);
      }
    });

    this.emitterObjects.forEach(function(EO) {
      EO.move();
    });

    this.bullets = tempBullets;
  };

  Game.prototype.screenWrap = function(mObj) {
    if (mObj.pos.x + mObj.radius < 0 && mObj.vel.x < 0) {
      mObj.pos.x = Game.DIM_X + mObj.radius;
    }
    if (mObj.pos.x - mObj.radius > Game.DIM_X && mObj.vel.x > 0) {
      mObj.pos.x = -(mObj.radius);
    }
    if (mObj.pos.y + mObj.radius < 0 && mObj.vel.y < 0) {
      mObj.pos.y = Game.DIM_Y + mObj.radius;
    }
    if (mObj.pos.y - mObj.radius > Game.DIM_Y && mObj.vel.y > 0) {
      mObj.pos.y = -(mObj.radius);
    }
  };

  Game.prototype.isOnScreen = function(mObj) {
    if (((mObj.pos.x + mObj.radius) < 0 ||
         (mObj.pos.x - mObj.radius) > Game.DIM_X) ||
        ((mObj.pos.y + mObj.radius) < 0 ||
         (mObj.pos.y - mObj.radius) > Game.DIM_Y)) {
       return false;
    } 
    return true;
  };

  Game.prototype.step = function() {
    if (this.mode == 'inPlay') {
      this.checkKeyPresses();
      this.checkCollisions();
    }
    this.move();
    this.draw();
  };

  Game.prototype.checkKeyPresses = function() {
    if(key.isPressed('up')) this.ship.impulse();
    if(key.isPressed('left')) this.ship.rotate(Math.degToRad(10));
    if(key.isPressed('right')) this.ship.rotate(Math.degToRad(-10));
  }

  Game.prototype.addKeyBindings = function() {
    var game = this;

    key('space', 'inPlay', function() {
      game.fireBullet();
    });

    key('a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,backspace',
         'over',
         function(event, handler) {
           game.HUD.input(handler.shortcut);
    });
    key('enter', 'over', function() {
      if (game.HUD.mode === 'input') {
        game.HUD.submit(game.score);
      } else {
        game.stop();
        game.reset();
        game.setup();
        game.start();
        game.switchModes('inPlay');
      }
    });
  };

  Game.prototype.checkCollisions = function(){
    var game = this;
    this.asteroids.forEach(function(asteroid, aIdx){
      if (asteroid.isCollidedWith(game.ship)) {
        game.switchModes('over');
        game.ship.destroy();
        console.log(this.mode);

        if (game.HUD.isHighScore(game.score)) {
          game.HUD.switchModes('input');
        }
      }

      if (game.bullets.length > 0) {
        game.bullets.forEach(function(bullet, bIdx) {
          if (asteroid.isCollidedWith(bullet)) {
            game.handleBulletHit(aIdx, bIdx);
          }
        });
      }
    });
  };

  Game.prototype.fireBullet = function() {
    if (this.bullets.length < Game.MAX_BULLETS) {
      var bullet = this.ship.fireBullet();
      if (bullet){
        this.bullets.push(bullet);
      }
    }
  };

  Game.prototype.handleBulletHit = function(aIdx, bIdx) {
    var asteroid = this.asteroids[aIdx];
    var bullet = this.bullets[bIdx];

    if (!asteroid.isSmall()) {
      var numNew = 1 + (Math.ceil(Math.random() * 2))
      this.addSmallAsteroids(numNew,
                             $.extend({}, asteroid),
                             $.extend({}, bullet));
      this.score += 1;
    } else {
      var numNew = 1 + (Math.ceil(Math.random() * 2))
      this.addAsteroids(numNew);
      this.score += 2;
    }

    this.addEmitterObject({
      pos: { x: bullet.pos.x, y: bullet.pos.y },
      vel: { x: 0, y: 0 },
      radius: 0,
      angle: 0,
      rotationSpeed: Math.degToRad(30)
    }, Game.bulletExplosionEmitter);

    delete this.asteroids[aIdx];
    this.asteroids.splice(aIdx, 1);

    delete this.bullets[bIdx];
    this.bullets.splice(bIdx, 1);

  };

  Game.prototype.start = function() {
    var game = this;

    this.interval = setInterval(function() {
      game.step();
    }, Game.INTERVAL_MILLISECONDS);
  };

  Game.prototype.stop = function(){
    clearInterval(this.interval);
  }

  Game.prototype.addEmitterObject = function(options, emitter) {
    var newEO = new Asteroids.MovingObject(options);
    this.emitterObjects.push(newEO);

    var newEmitter = newEO.attachEmitter(emitter, this.ctx, 0, 0);
    var newEmitter = newEO.attachEmitter(emitter, this.ctx, 0, Math.PI*2*.333);
    var newEmitter = newEO.attachEmitter(emitter, this.ctx, 0, Math.PI*2*.666);
  }

  Game.colors = {
    bg: '#123234'
  };

  Game.INTERVAL_MILLISECONDS = 30;
  Game.DIM_X = 800;
  Game.DIM_Y = 600;
  Game.MAX_BULLETS = 5;

  Game.bulletExplosionEmitter = {
    point: {
      origin: {},
      radius: 0,
      angle: 0
    },
    emitter: {
      vel: { x: 6, y: 6, wobble: { amt: 6, weight: 0 } },
      rate: { num: 1, wobble: { amt: 0, weight: 0 } },
      radius: { radius: 12, wobble: { amt: 4, weight: 0 } },
      sputter: 50,
      layers: 2,
      throttle: true,
      lifespan: 5 
    },
    particles: {
      vel: { decay: { amt: 0.8, weight: 0, limit: .1 } },
      radius: { radius: 7, decay: { amt: 0.95, weight: 0, limit: 0 } },
      angle: 0,
      lifespan: { span: 20, wobble: { amt: 5, weight: 1 } },
      lifeline: { attr: 'radius', val: 'radius', trigger: 0 },
      layers: [{ color: '#952933', radiusOffset: 0 },
               { color: '#abef86', radiusOffset: 3 }]
    }
  }
})(this);
