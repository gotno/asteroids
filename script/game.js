(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Game = Asteroids.Game = function (ctx) {
    this.ctx = ctx;
    this.asteroids = [];
    this.interval = null;
    this.ship = new Asteroids.Ship({
      x: Game.DIM_X/2,
      y: Game.DIM_Y/2,
    }, ctx);
    this.bullets = [];
    this.score = 0;
    this.gameOver = false;
/*
    this.test = new Asteroids.MovingObject({ 
      pos: { x: Game.DIM_X/2, y: Game.DIM_Y/2 },
      vel: { x: 0, y: 0 },
      radius: 0,
      angle: Math.PI,
      color: '#000000',
    });

    this.test.attachEmitter(Game.emitterOptions, ctx, 20, Math.PI/2);
*/

    this.HUD = new Asteroids.HUD(ctx);
  };

  Game.prototype.addSmallAsteroids = function(numAsteroids, asteroid) {
    for (var i = 0; i < numAsteroids; i++) {
      this.asteroids.push(Asteroids.Asteroid.randomSmallAsteroid(asteroid));
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

    this.ship.draw(ctx);

    if (!this.gameOver) {
      this.HUD.drawInPlay(this.score);
    } else {
      this.HUD.drawGameOver(this.score);
    }
//    this.test.draw(ctx);
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

    this.bullets = tempBullets;

 //   this.test.move();
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
    this.checkKeyPresses();
    this.checkCollisions();
    this.move();
    this.draw();
  };

  Game.prototype.start = function() {
    var game = this;
    this.addAsteroids(10);
    this.addKeyBindings();

    this.interval = setInterval(function() {
      game.step();
    }, Game.INTERVAL_MILLISECONDS);
  };

  Game.prototype.checkKeyPresses = function() {
    if(key.isPressed('up')) this.ship.impulse();
    if(key.isPressed('left')) this.ship.rotate(Math.degToRad(10));
    if(key.isPressed('right')) this.ship.rotate(Math.degToRad(-10));
  }

  Game.prototype.addKeyBindings = function() {
    var game = this;

    key('space', function() {
      game.fireBullet();
    });

    key('a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z',
         'highscores',
         function(event, handler) {
           console.log(handler.shortcut.toUpperCase());
    });
    key('backspace', 'highscores', function() {
      console.log('backspace');
    });
    key('enter', 'highscores', function() {
      console.log('enter');
    });
    key.setScope('highscores');
  };

  Game.prototype.checkCollisions = function(){
    var game = this;
    this.asteroids.forEach(function(asteroid, aIdx){
      if (asteroid.isCollidedWith(game.ship)) {
        game.ship.destroy();
        game.gameOver = true;
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
    if (!asteroid.isSmall()) {
      var numNew = 1 + (Math.ceil(Math.random() * 2))
      this.addSmallAsteroids(numNew, $.extend({}, asteroid));
      this.score += 1;
    } else {
      var numNew = 1 + (Math.ceil(Math.random() * 2))
      this.addAsteroids(numNew);
      this.score += 2;
    }
    this.asteroids.splice(aIdx, 1);
    this.bullets.splice(bIdx, 1);
  };

  Game.prototype.stop = function(){
    clearInterval(this.interval);
  }

  Game.colors = {
    bg: '#123234'
  };

  Game.INTERVAL_MILLISECONDS = 30;
  Game.DIM_X = 800;
  Game.DIM_Y = 600;
  Game.MAX_BULLETS = 5;

  Game.emitterOptions = {
    point: {
      origin: {},
      radius: 0,
      angle: 0
    },
    emitter: {
      vel: { x: 6, y: 6, wobble: { amt: 0, weight: 0 } },
      rate: { num: 1, wobble: { amt: 0, weight: 0 } },
      radius: { radius: 8, wobble: { amt: 0, weight: 0 } },
      sputter: 0,
      layers: 1,
      throttle: true,
      lifespan: -1
    },
    particles: {
      vel: { decay: { amt: 0.8, weight: 0, limit: .1 } },
      radius: { radius: 7, decay: { amt: 0.95, weight: 0, limit: 0 } },
      angle: 0,
      lifespan: { span: 20, wobble: { amt: 5, weight: 1 } },
      lifeline: { attr: 'radius', val: 'radius', trigger: 0 },
      layers: [{ color: '#fcfcfc', radiusOffset: 0 }]
    }
  }
})(this);
