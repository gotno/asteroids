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
// 
    this.mop = new Asteroids.MovingObjectPointed({
      pos: { x: 320, y: 240 },
      vel: { x: 1, y: 0 },
      radius: 30,
      color: '#000000',
      angle: 0,
      points: [
        new Asteroids.Point ({
          radius: 30,
          origin: { x: 320, y: 240 },
          angle: 0
        }),
        new Asteroids.Point ({
          radius: 30,
          origin: { x: 320, y: 240 },
          angle: Math.PI * 0.25
        }),
        new Asteroids.Point ({
          radius: 30,
          origin: { x: 320, y: 240 },
          angle: Math.PI * 0.5
        }),
        new Asteroids.Point ({
          radius: 30,
          origin: { x: 320, y: 240 },
          angle: Math.PI * 0.75
        }),
        new Asteroids.Point ({
          radius: 30,
          origin: { x: 320, y: 240 },
          angle: Math.PI
        }),
        new Asteroids.Point ({
          radius: 30,
          origin: { x: 320, y: 240 },
          angle: 0
        }),
      ]
    });
// */
/*
    this.p1 = new Asteroids.Point({
      origin: { x: 320, y: 240 },
      radius: 30,
      angle: 0
    });
// */
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

    this.ship.draw(ctx);

    this.asteroids.forEach(function(asteroid) {
      asteroid.draw(ctx);
    });

    this.bullets.forEach(function(bullet) {
      bullet.draw(ctx);
    });

    this.mop.draw(ctx);
/*
    ctx.fillStyle = "#000000"
    ctx.beginPath();
    ctx.moveTo(this.p1.pos.x, this.p1.pos.y);

    this.p1.rotate(Math.PI * 0.5);
    ctx.lineTo(this.p1.pos.x, this.p1.pos.y);

    this.p1.rotate(Math.PI * 0.5);
    ctx.lineTo(this.p1.pos.x, this.p1.pos.y);

    this.p1.rotate(Math.PI);
    ctx.lineTo(this.p1.pos.x, this.p1.pos.y);

    ctx.fill();
// */

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

    this.mop.move();
    this.mop.rotate(Math.degToRad(.5));
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
    if(key.isPressed('left')) this.ship.rotate(-10);
    if(key.isPressed('right')) this.ship.rotate(10);
  }

  Game.prototype.addKeyBindings = function() {
    var game = this;

    key('space', function() {
      game.fireBullet();
    });
  };

  Game.prototype.checkCollisions = function(){
    var game = this;
    this.asteroids.forEach(function(asteroid, aIdx){
      if (asteroid.isCollidedWith(game.ship)) {
        console.log("hit, over.");
        //alert("GAME OVER!!!!")
        //game.stop();
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
    var bullet = this.ship.fireBullet(this);
    if (bullet){
      this.bullets.push(bullet);
    }
  };

  Game.prototype.handleBulletHit = function(aIdx, bIdx) {
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
  Game.DIM_X = 640;
  Game.DIM_Y = 480;
})(this);
