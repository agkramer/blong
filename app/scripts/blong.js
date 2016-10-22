var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.getElementById('blongCanvas');
var context = canvas.getContext('2d');
var width = 1000;
var height = 600;
canvas.width = width;
canvas.height = height;

// define variables for game elements
var player = new Player();
var computer = new Computer();
var ball = new Ball(width/2, height/2);



var update = function() {
    player.update();
    ball.update();
    // ball.update(player.paddle, computer.paddle);
};

var step = function() {
    update();
    render();
    animate(step);
};

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
    document.body.appendChild(canvas);
    animate(step);
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

var keysDown = {};

window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
});

Player.prototype.update = function() {
    for(var key in keysDown) {
        var value = Number(key);
        if(value == 39) { // left arrow
            this.paddle.move(0, -4);
        } else if (value == 37) { // right arrow
            this.paddle.move(0, 4);
        } else {
            this.paddle.move(0, 0);
        }
    }
};

Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;

    if (this.y < 0) { // all the way up
        this.y = 0;
        this.y_speed = 0;
    } else if (this.y + 125 > 600) { // all the way down
        this.y = 600 - 125;
        this.y_speed = 0;
    }
}






// BALL FUNCTIONS
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 10;
  this.x_speed = 2;
  this.y_speed = 0;
}

Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "green";
    context.fill();
};

Ball.prototype.update = function() {
    this.x += this.x_speed;
    this.y += this.y_speed;
};
