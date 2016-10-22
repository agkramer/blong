// BUILD CANVAS
var canvas = document.getElementById('blongCanvas');
var context = canvas.getContext('2d');
var width = 1000;
var height = 600;
canvas.width = width;
canvas.height = height;

// DEFINE VARIABLES FOR GAME ELEMENTS
var player = new Player();
var computer = new Computer();
var ball = new Ball(width/2, height/2);



// ANIMATE GAME

var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback) { window.setTimeout(callback, 1000/60) };

var update = function() {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
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





/////////////////////////////////////////////////////////////////////////
// PADDLE FUNCTIONS /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
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
            this.paddle.move(0, -8);
        } else if (value == 37) { // right arrow
            this.paddle.move(0, 8);
        } else {
            this.paddle.move(0, 0);
        }
    }
};

Computer.prototype.update = function(ball) {
    var y_pos = ball.y;

    var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);

    this.paddle.move(0, diff);
    
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





/////////////////////////////////////////////////////////////////////////
// BALL FUNCTIONS ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 10;
  this.x_speed = 3;
  this.y_speed = 0;
}

Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "green";
    context.fill();
};

Ball.prototype.update = function(paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 10;
    var top_y = this.y - 10;
    var bottom_x = this.x + 10;
    var bottom_y = this.y + 10;

    if (this.y - 10 < 0) { // hitting the top
        this.y = 10;
        this.y_speed = -this.y_speed;
    } else if (this.y + 10 > 600) { // hitting the bottom
        this.y = 590;
        this.y_speed = -this.y_speed;
    }

    if (this.x < 0 || this.x > 1000) { // a point was scored, reset to beginnig position/speed
        paddle1.y = (canvas.height - 125) / 2;
        this.x_speed = 3;
        this.y_speed = 0;
        this.x = width/2;
        this.y = height/2;
    }

    if (top_x > 500) {
        if (top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x && top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y) {
            // hit the player's paddle
            this.x_speed = -3;
            this.y_speed += (paddle1.y_speed / 2);
            this.x += this.x_speed;
        }
    } else {
        if(top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x && top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y) {
          // hit the computer's paddle
          this.x_speed = 3;
          this.y_speed += (paddle2.y_speed / 2);
          this.x += this.x_speed;
        }
    }
};
