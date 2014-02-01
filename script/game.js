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

  // wrapping goes in here
  Game.prototype.move = function() {
    this.ship.move();
    var tempRoids = [];
    var tempBullets = [];

    this.asteroids.forEach(function(asteroid) {
      asteroid.move();

      if (((asteroid.pos.x + asteroid.radius) < 0 ||
           (asteroid.pos.x - asteroid.radius) > Game.DIM_X) ||
          ((asteroid.pos.y + asteroid.radius) < 0 ||
           (asteroid.pos.y - asteroid.radius) > Game.DIM_Y)) {
      } else {
        tempRoids.push(asteroid);
      }
    });

    this.asteroids = tempRoids;

    this.bullets.forEach(function(bullet) {
      bullet.move();

      if (((bullet.pos.x + bullet.radius) < 0 ||
           (bullet.pos.x - bullet.radius) > Game.DIM_X) ||
          ((bullet.pos.y + bullet.radius) < 0 ||
           (bullet.pos.y - bullet.radius) > Game.DIM_Y)) {
      } else {
        tempBullets.push(bullet);
      }
    });

    this.bullets = tempBullets;
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
