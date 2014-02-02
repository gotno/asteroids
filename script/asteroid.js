(function(root){
    var Asteroids = root.Asteroids = (root.Asteroids || {});

    var Asteroid = Asteroids.Asteroid = function(options){
      Asteroids.MovingObjectPointed.call(this, options);
    }

    Asteroid.inherits(Asteroids.MovingObjectPointed);
    Asteroid.COLOR = "#FF4657";
    Asteroid.RADIUS = 64;

    Asteroid.randomAsteroid = function(dimX, dimY){
      var numPoints = 7 + Math.floor(Math.random() * 4);
      console.log(numPoints);
      var avgDistance = Math.roundTo((2 * Math.PI / numPoints), 2);
      var distWobble = Math.roundTo(Math.degToRad(15), 2);

      var options = {};
      options.radius = Asteroid.randomRadius();

      var currentAngle = 0;
      var currentWobble = 0;
      options.points = [];
      for (var i = 0; i < numPoints; i++) {
        currentWobble = (Math.random() * distWobble) - (distWobble / 2);
        currentAngle += avgDistance + distWobble;

        if (currentAngle > Math.PI * 2 || i == numPoints - 1) {
          currentAngle = 0;
        }

        options.points.push(new Asteroids.Point({
          radius: options.radius,
          origin: options.pos,
          angle: currentAngle
        }));
      }

      options.pos = {};
      options.pos.x = Math.random() * dimX;
      options.pos.y = Math.random() * dimY;

      options.vel = {};
      options.vel.x = Asteroid.randomVel();
      options.vel.y = Asteroid.randomVel();

      options.color = Asteroid.COLOR;

      var randomRotation = Math.roundTo((Math.random() * 1.5) - 0.75, 2);
      options.rotationSpeed = Math.degToRad(randomRotation);

      return new Asteroid(options);
    }

    Asteroid.randomVel = function () {
      return (Math.random() * 5) - 2.5;
    };

    Asteroid.randomRadius = function () {
      return (Math.random() * (Asteroid.RADIUS / 2)) + (Asteroid.RADIUS / 2);
    };
})(this);
