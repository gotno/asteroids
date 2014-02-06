(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var MovingEmitter = Asteroids.MovingEmitter = function(options) {
    Asteroids.MovingObject.call(this, options);
  };
  MovingEmitter.inherits(Asteroids.MovingObject);

  MovingEmitter.prototype.draw = function() {
  };
})(this);
