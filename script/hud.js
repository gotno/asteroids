(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var HUD = Asteroids.HUD = function(ctx) {
    this.ctx = ctx;
  };

  HUD.prototype.drawStartScreen = function() {
  }

  HUD.prototype.drawHighScores = function() {
  }

  HUD.prototype.drawInPlay = function(score) {
    var ctx = this.ctx;
    var scoreText = 'score: ' + score;

    ctx.fillStyle = '#abef86'
    ctx.font = 'bold 24px sans-serif';
    ctx.textBaseLine = 'top';
    ctx.textAlign= 'right';
    
    ctx.fillText(scoreText, Asteroids.Game.DIM_X - 20, 30 );
  };

  HUD.prototype.drawGameOver = function(score) {
    var ctx = this.ctx;
    var dimX = Asteroids.Game.DIM_X;
    var dimY = Asteroids.Game.DIM_Y;
    var scoreText = 'score: ' + score;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, dimX, dimY);

    ctx.fillStyle = '#abef86'
    ctx.font = 'bold 24px sans-serif';
    ctx.textBaseLine = 'middle';
    ctx.textAlign= 'center';
    
    ctx.fillText('GAME OVER', dimX/2, dimY/2 - 20 );
    ctx.fillText(scoreText, dimX/2, dimY/2 + 20 );
  };

  HUD.prototype.getHighScores = function() {
    var scores = [ 
      { initials: 'WOD', score: 2 },
      { initials: 'ONT', score: 20000 }
    ];

    var url = 'https://api.mongolab.com/api/1/databases/asteroids/collections/highscores?apiKey='
    var key = '7E2CWYg8hIrz_IcFzq_eKsv1-ezDZpyi';
    var qString = '?';
    qString += 's={"score": -1}';
    qString += '&l=10';

  //*
    $.ajax({
      url: url + key + qString,
      type: "GET",
//      data: JSON.stringify(scores),
      contentType: "application/json"
    }).done(function(msg) {
      console.log(arguments);
      console.log(msg);
    });
  // */
  };
})(this);
