var canvas = document.getElementById('blongCanvas');
var context = canvas.getContext('2d');

// define variables for game elements
var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

var render = function() {
    // render board
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fillRect((canvas.width / 2), 10, 10, canvas.height - 20);

    // render other elements
    player.render();
    computer.render();
    ball.render();
};

window.onload = function() {
    render();
};



// PADDLE FUNCTIONS
function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Paddle.prototype.render = function() {
    context.fillStyle = "yellow";
    context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
   this.paddle = new Paddle(canvas.width - 20, (canvas.height - 125) / 2, 15, 125);
}

function Computer() {
  this.paddle = new Paddle(5, (canvas.height - 125) / 2, 15, 125);
}

Player.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.render = function() {
  this.paddle.render();
};


// BALL FUNCTIONS
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 10;
}

Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "green";
    context.fill();
};
