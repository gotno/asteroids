(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Bullet = Asteroids.Bullet = function(options) {
    options.radius = Bullet.RADIUS;
    options.color = Bullet.COLOR;
    Asteroids.MovingObject.call(this, options);
  }

  Bullet.inherits(Asteroids.MovingObject);

  Bullet.RADIUS = 2;
  Bullet.COLOR = "#abef86";
}
)(this);
