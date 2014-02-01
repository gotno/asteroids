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
  };

  Game.prototype.addAsteroids = function(numAsteroids) {
    for (var i = 0; i < numAsteroids; i++) {
      this.asteroids.push(Asteroids.Asteroid.randomAsteroid(Game.DIM_X,
                                                            Game.DIM_Y));
    }
  };

  Game.prototype.draw = function() {
    this.ctx.fillStyle = '#123234'
    this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    var ctx = this.ctx;
    this.ship.draw(ctx);

    this.asteroids.forEach(function(asteroid) {
      asteroid.draw(ctx);
    });

    this.bullets.forEach(function(bullet) {
      bullet.draw(ctx);
    })
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
    this.move();
    this.draw();
    this.checkCollisions();
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
    this.asteroids.forEach(function(asteroid){
      if (asteroid.isCollidedWith(game.ship)) {
        console.log("hit, over.");
        //alert("GAME OVER!!!!")
        //game.stop();
      }
    });
  }

  Game.prototype.fireBullet = function() {
    var bullet = this.ship.fireBullet(this);
    if (bullet){
      this.bullets.push(bullet);
    }
  }

  Game.prototype.stop = function(){
    clearInterval(this.interval);
  }

  Game.INTERVAL_MILLISECONDS = 30;
  Game.DIM_X = 640;
  Game.DIM_Y = 480;
})(this);
