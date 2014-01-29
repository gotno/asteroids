(function(root){
    var Asteroids = root.Asteroids = (root.Asteroids || {});

    Function.prototype.inherits = function(parentClass) {
      var Surrogate = function() {};
      Surrogate.prototype = parentClass.prototype;
      this.prototype = new Surrogate();
    }

    var Asteroid = Asteroids.Asteroid = function(xpos, ypos, xvel, yvel, radius){
      Asteroids.MovingObject.call(this,
                        xpos,
                        ypos,
                        xvel,
                        yvel,
                        radius,
                        Asteroid.COLOR);
    }

    Asteroid.inherits(Asteroids.MovingObject);
    Asteroid.COLOR = "#FF4657";
    Asteroid.RADIUS = 64;

    Asteroid.randomAsteroid = function(dimX, dimY){
      xpos = Math.random() * dimX;
      ypos = Math.random() * dimY;

      return new Asteroid(xpos, ypos, randomVec(), randomVec(), randomRad());
    }

    var randomVec = function () {
      return (Math.random() * 5) - 2.5;
    };

    var randomRad = function () {
      return (Math.random() * (Asteroid.RADIUS / 2)) + (Asteroid.RADIUS / 2);
    };
})(this);
