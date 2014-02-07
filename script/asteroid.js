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

    Asteroid.randomSmallAsteroid = function(asteroid, bullet) {
      var options = {};

      options.radius = (asteroid.radius / 2);
      options.radius += Math.random() * (asteroid.radius / 4)
      options.radius -= asteroid.radius/8;
      options.radius = Math.round(options.radius);

      options.pos = Asteroid.randomInsidePos(asteroid.pos.x, asteroid.pos.y);
      options.points = Asteroid.generatePoints(options.pos, options.radius);

      options.vel = {};
      if (asteroid.vel.x > 0) {
        options.vel.x = Math.random() * asteroid.vel.x;
        options.vel.x += Math.random() * asteroid.vel.x;
      } else {
        options.vel.x = -(Math.random() * asteroid.vel.x);
        options.vel.x -= Math.random() * asteroid.vel.x;
      }
      if (asteroid.vel.y > 0) {
        options.vel.y = Math.random() * asteroid.vel.y;
        options.vel.y += Math.random() * asteroid.vel.y;
      } else {
        options.vel.y = -(Math.random() * asteroid.vel.y);
        options.vel.y -= (Math.random() * asteroid.vel.y);
      }
      options.vel.x += Math.random() * (bullet.vel.x / 6);
      options.vel.y += Math.random() * (bullet.vel.y / 6);

      options.color = Asteroid.COLOR;
      options.strokeColor = Asteroid.STROKE_COLOR;

      var randomRotation = Math.roundTo((Math.random() * 1.5) - 0.75, 2);
      options.rotationSpeed = Math.degToRad(randomRotation);

      options.crosslineIndices = 
        Asteroid.generateCrosslineIndices(options.points.length);

      return new Asteroid(options);
    };

    Asteroid.randomAsteroid = function(dimX, dimY){
      var options = {};
      options.pos = {};

      options.radius = Asteroid.randomRadius(Asteroid.RADIUS);
      options.pos = Asteroid.randomOutsidePos(dimX, dimY);

      options.points = Asteroid.generatePoints(options.pos, options.radius);

      options.vel = {};
      options.vel.x = Asteroid.randomVel();
      options.vel.y = Asteroid.randomVel();

      options.color = Asteroid.COLOR;
      options.strokeColor = Asteroid.STROKE_COLOR;

      var randomRotation = Math.roundTo((Math.random() * 1.5) - 0.75, 2);
      options.rotationSpeed = Math.degToRad(randomRotation);

      options.crosslineIndices =
        Asteroid.generateCrosslineIndices(options.points.length); 

      return new Asteroid(options);
    }

    Asteroid.randomStartAsteroid = function(dimX, dimY){
      var options = {};
      options.pos = {};

      options.radius = Asteroid.randomRadius(Asteroid.RADIUS);
      options.pos = Asteroid.randomStartScreenPos(dimX, dimY);

      options.points = Asteroid.generatePoints(options.pos, options.radius);

      options.vel = {};
      options.vel.x = 0;
      options.vel.y = Math.random() * 4 + 2;

      options.color = Asteroid.COLOR;
      options.strokeColor = Asteroid.STROKE_COLOR;

      var randomRotation = Math.roundTo((Math.random() * 1.5) - 0.75, 2);
      options.rotationSpeed = Math.degToRad(randomRotation);

      options.crosslineIndices =
        Asteroid.generateCrosslineIndices(options.points.length); 

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
      if (this.radius < Asteroid.SMALL_RADIUS) {
        return true;
      }
      return false;
    };
    
    Asteroid.generateCrosslineIndices = function(len) {
      var crosslineIndices = [];

      var firstPoint = Math.floor(Math.random() * len);
      var secondPoint = ((Math.ceil(Math.random() * 2) + 1) + firstPoint);
      secondPoint %= len;
      crosslineIndices.push([firstPoint, secondPoint]);

      secondPoint = (secondPoint + 1 + Math.round(Math.random() * 1));
      secondPoint %= len;
      crosslineIndices.push([firstPoint, secondPoint]); 

      return crosslineIndices;
    };
    
    Asteroid.generatePoints = function(pos, radius) {
      var numPoints = 7 + Math.floor(Math.random() * 4);
      var avgDistance = Math.roundTo((2 * Math.PI / numPoints), 2);
      var distWobble = Math.roundTo(Math.degToRad(15), 2);

      var currentAngle = 0;
      var currentWobble = 0;

      var points = [];

      for (var i = 0; i < numPoints; i++) {
        currentWobble = (Math.random() * distWobble) - (distWobble / 2);
        currentAngle += avgDistance + distWobble;

        if (currentAngle > Math.PI * 2 || i == numPoints - 1) {
          currentAngle = 0;
        }

        points.push(new Asteroids.Point({
          origin: pos,
          radius: radius,
          angle: currentAngle
        }));
      }

      return points;
    }

    Asteroid.randomInsidePos = function(posX, posY) {
      var pos = {};
      pos.x = posX + Math.round((Math.random() * 32) - 16);
      pos.y = posY + Math.round((Math.random() * 32) - 16);
      return pos;
    };
    
    Asteroid.randomStartScreenPos = function(dimX, dimY) {
      var pos = {};
      pos.y = -Asteroid.RADIUS - (Math.random() * Asteroid.RADIUS * 2); 
      pos.x = dimX/2;
      while (pos.x > dimX/2 - 80 && pos.x < dimX/2 + 80) {
        pos.x = Math.random() * dimX;
      }
      return pos;
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
