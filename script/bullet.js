(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Bullet = Asteroids.Bullet = function(xpos, ypos, xvel, yvel, game) {
    this.game = game;

    Asteroids.MovingObject.call(this,
                                xpos,
                                ypos,
                                xvel,
                                yvel,
                                Bullet.RADIUS,
                                Bullet.COLOR);
  }

  Bullet.inherits(Asteroids.MovingObject);

  Bullet.prototype.hitAsteroids = function () {
    var bullet = this;
    var game = this.game

    game.asteroids.forEach(function(asteroid) {
      if (asteroid.isCollidedWith(bullet)) {
      //  game.
      }
    })
  };

  Bullet.RADIUS = 2;
  Bullet.COLOR = "#abef86";
}
)(this);
