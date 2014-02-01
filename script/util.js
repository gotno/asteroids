(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  Function.prototype.inherits = function(parentClass) {
    var Surrogate = function() {};
    Surrogate.prototype = parentClass.prototype;
    this.prototype = new Surrogate();
  };

  Math.degToRad = function(deg) {
    return deg * (Math.PI / 180);
  };
})(this);
