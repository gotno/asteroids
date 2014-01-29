(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var MovingObject = 
    Asteroids.MovingObject = function(xpos,
                                      ypos,
                                      xvel,
                                      yvel,
                                      radius,
                                      color,
                                      angle) {

    this.xpos = xpos;
    this.ypos = ypos;
    this.xvel = xvel;
    this.yvel = yvel;
    this.radius = radius;
    this.color = color;
    this.angle = Math.degToRad(angle);
  }

  MovingObject.prototype.move = function() {
    this.xpos += this.xvel;
    this.ypos += this.yvel;
  };

  MovingObject.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 0.5;

    ctx.beginPath();

    ctx.arc(this.xpos,
            this.ypos,
            this.radius + 1,
            0,
            2 * Math.PI);

    ctx.stroke();
  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    var dx = Math.pow((this.xpos - otherObject.xpos), 2);
    var dy = Math.pow((this.ypos - otherObject.ypos), 2);

    var distance = Math.sqrt(dx + dy);

    return ((this.radius + otherObject.radius) > distance);
  };
})(this);
