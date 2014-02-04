(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var HUD = Asteroids.HUD = function(ctx) {
    this.ctx = ctx;
  };

  HUD.prototype.drawInPlay = function(score) {
    var ctx = this.ctx;
    var scoreText = 'score: ' + score;

    ctx.fillStyle = '#abef86'
    ctx.font = 'bold 24px sans-serif';
    ctx.textBaseLine = 'top';
    ctx.textAlign= 'right';
    
    ctx.fillText(scoreText, Asteroids.Game.DIM_X - 20, 30 );
  };
})(this);
