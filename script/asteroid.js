(function(root){
    var Asteroids = root.Asteroids = (root.Asteroids || {});

    Function.prototype.inherits = function(parentClass) {
      var Surrogate = function() {};
      Surrogate.prototype = parentClass.prototype;
      this.prototype = new Surrogate();
    }

    var Asteroid = Asteroids.Asteroid = function(options){
      Asteroids.MovingObject.call(this, options);
    }

    Asteroid.inherits(Asteroids.MovingObject);
    Asteroid.COLOR = "#FF4657";
    Asteroid.RADIUS = 64;

    Asteroid.randomAsteroid = function(dimX, dimY){
      var options = {};
      options.pos = {};
      options.pos.x = Math.random() * dimX;
      options.pos.y = Math.random() * dimY;

      options.vel = {};
      options.vel.x = randomVel();
      options.vel.y = randomVel();
      options.radius = randomRad();

      options.color = Asteroid.COLOR;

      return new Asteroid(options);
    }

    var randomVel = function () {
      return (Math.random() * 5) - 2.5;
    };

    var randomRad = function () {
      return (Math.random() * (Asteroid.RADIUS / 2)) + (Asteroid.RADIUS / 2);
    };
})(this);
