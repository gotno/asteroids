(function(root){
    var Asteroids = root.Asteroids = (root.Asteroids || {});

    var Asteroid = Asteroids.Asteroid = function(options){
      Asteroids.MovingObjectPointed.call(this, options);
      this.crosslineIndices = options.crosslineIndices;
    }

    Asteroid.inherits(Asteroids.MovingObjectPointed);
    Asteroid.COLOR = '#952933';
    Asteroid.STROKE_COLOR = '#FF4657'
    Asteroid.SMALL_RADIUS = 32;
    Asteroid.RADIUS = 64;

    Asteroid.randomAsteroid = function(dimX, dimY, small, x, y){
      var numPoints = 7 + Math.floor(Math.random() * 4);
      var avgDistance = Math.roundTo((2 * Math.PI / numPoints), 2);
      var distWobble = Math.roundTo(Math.degToRad(15), 2);

      var options = {};
      options.pos = {};

      if (small) {
        options.radius = Asteroid.randomRadius(Asteroid.SMALL_RADIUS);
        options.pos.x = x + Math.round((Math.random() * 16) - 8);
        options.pos.y = y + Math.round((Math.random() * 16) - 8);
        console.log(options.pos);
      } else {
        options.radius = Asteroid.randomRadius(Asteroid.RADIUS);
        options.pos = Asteroid.randomOutsidePos(dimX, dimY);
      }

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

      options.vel = {};
      options.vel.x = Asteroid.randomVel();
      options.vel.y = Asteroid.randomVel();

      options.color = Asteroid.COLOR;
      options.strokeColor = Asteroid.STROKE_COLOR;

      var randomRotation = Math.roundTo((Math.random() * 1.5) - 0.75, 2);
      options.rotationSpeed = Math.degToRad(randomRotation);

      options.crosslineIndices = [];
      var firstPoint = Math.floor(Math.random() * options.points.length);
      var secondPoint = ((Math.ceil(Math.random() * 2) + 1) + firstPoint);
      secondPoint %= options.points.length;
      options.crosslineIndices.push([firstPoint, secondPoint]);

      secondPoint = (secondPoint + 1 + Math.round(Math.random() * 1));
      secondPoint %= options.points.length;
      options.crosslineIndices.push([firstPoint, secondPoint]); 

      return new Asteroid(options);
    }

    Asteroid.prototype.draw = function(ctx) {
      Asteroids.MovingObjectPointed.prototype.draw.call(this, ctx);

      var asteroid = this;

      this.crosslineIndices.forEach(function(pair) {
        ctx.beginPath();
        var point = asteroid.points[pair[0]];
        ctx.moveTo(point.pos.x, point.pos.y);
        point = asteroid.points[pair[1]];
        ctx.lineTo(point.pos.x, point.pos.y);
        ctx.stroke();
      });
    };

    Asteroid.prototype.isSmall = function() {
      console.log(this.radius);
      if (this.radius < Asteroid.SMALL_RADIUS) {
        return true;
      }
      return false;
    };
    
    Asteroid.randomOutsidePos = function(dimX, dimY) {
      var pos = {};

      var x = (Asteroid.RADIUS/2) + ((Math.random() * Asteroid.RADIUS) * 5);
      x = Math.round(x);
      var y = (Asteroid.RADIUS/2) + ((Math.random() * Asteroid.RADIUS) * 5);
      y = Math.round(y);
      

      if (Math.random() < 0.5) {
        pos.x = -(x);
      } else {
        pos.x = dimX + x;
      }

      if (Math.random() < 0.5) {
        pos.y = -(y);
      } else {
        pos.y = dimY + y;
      }

      return pos;
    };

    Asteroid.randomVel = function () {
      return (Math.random() * 4) - 2;
    };

    Asteroid.randomRadius = function (max) {
      return (Math.random() * (max / 2)) + (max / 2);
    };
})(this);
