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

  Math.roundTo = function(num, digits) {
    var mutator = Math.pow(10, digits);
    num *= mutator;
    num = Math.round(num);
    num /= mutator;
    return num;
  };
})(this);
