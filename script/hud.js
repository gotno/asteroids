(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var HUD = Asteroids.HUD = function(ctx) {
    this.ctx = ctx;
    this.highScores = [];
    this.userInput = '';
  };

  HUD.prototype.drawStartScreen = function() {
  };

  HUD.prototype.drawHighScores = function() {
    var ctx = this.ctx;
    var dimX = Asteroids.Game.DIM_X;
    var dimY = Asteroids.Game.DIM_Y;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    var posX = dimX - 290;
    var posY = 125;
    var width = 250;
    var height = dimY - (posY * 2);
    ctx.fillRect(posX, posY, width, height);

    var textX = posX + width / 2;
    var textY = posY + 30;

    ctx.fillStyle = '#FF4657';
    ctx.font = 'bold 20px sans-serif';
    ctx.textBaseLine = 'middle';
    ctx.textAlign= 'center';
    ctx.fillText('HIGH SCORES', textX, textY );
    
    ctx.font = 'bold 18px sans-serif';
    ctx.textBaseLine = 'middle';
    ctx.textAlign= 'left';
    textX = textX - 80;
    for (var i = 0; i < this.highScores.length; i++) {
      textY += 30;
      var initials = this.highScores[i].initials;
      var score = this.highScores[i].score;

      ctx.textAlign = 'left';
      ctx.fillText(initials, textX, textY);

      ctx.textAlign = 'right';
      ctx.fillText(score, textX + 155, textY);

    }
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

    this.drawHighScores();
  };

  HUD.prototype.getHighScores = function() {
    var url = 'https://api.mongolab.com/api/1/databases/asteroids/collections/highscores'
    var qString = '?apiKey=7E2CWYg8hIrz_IcFzq_eKsv1-ezDZpyi';
    qString += '&s={"score": -1}';
    qString += '&l=10';

    var HUD = this;
    $.ajax({
      url: url + qString,
      type: "GET",
      dataType: 'json',
      success: function(data) {
        HUD.highScores = data;
      }
    });
  };

  HUD.prototype.addHighScore = function(highScore) {
    var url = 'https://api.mongolab.com/api/1/databases/asteroids/collections/highscores'
    var key = '?apiKey=7E2CWYg8hIrz_IcFzq_eKsv1-ezDZpyi';

    var HUD = this;
    $.ajax({
      url: url + key,
      type: "POST",
      data: JSON.stringify(highScore),
      contentType: "application/json",
      success: function() {
        HUD.getHighScores();
      }
    });
  };

  HUD.prototype.input = function(keyPressed) {
    var userInput = this.userInput;
    if (keyPressed === 'backspace' && userInput.length > 0) {
      this.userInput = userInput.substring(0, userInput.length - 1);
    } else if (keyPressed !== 'backspace' && userInput.length < 3) {
      this.userInput += keyPressed.toUpperCase();
    }
  };

  HUD.prototype.submit = function(points) {
    if (this.userInput.length === 3) {
      this.addHighScore({ initials: this.userInput, score: points });
    }
  };
})(this);
