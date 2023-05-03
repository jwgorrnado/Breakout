/// <reference path = "p5.global.d.ts"/>

class Game {
  width = windowWidth - 50;
  height = windowHeight - 50;
  lives = 3;
  score = 0;
  targetRows = random(2, 5);
  targetCols = 5;
  background = "black";
  gameWon = false;
}
class Ball {
  constructor() {
    this.x = random(game.width / 2 - 50, game.width / 2 + 50);
    this.y = random(game.height / 2 - 50, game.height / 2 + 50);
    this.vx = random([-3, -2, 2, 3]);
    this.vy = random([-2, -3]);
    this.size = 50;
    this.radius = this.size / 2;
    this.r = 255;
    this.g = 255;
    this.b = 255;
  }

  draw() {
    fill(game.background);
    stroke(this.r, this.g, this.b);
    circle(this.x, this.y, this.size);
    this.x += this.vx;
    this.y += this.vy;

    this.collideWithWalls();
    this.collideWithPaddle();
    this.collideWithTargets();
    this.checkSpeed();
  }
  checkSpeed() {
    if (this.vx === 0) {
      this.vx = 2;
    }
    if (this.vy === 0) {
      this.vy = 2;
    }
  }
  collideWithWalls() {
    if (this.x - this.radius <= 0 || this.x + this.radius >= windowWidth) {
      this.vx = -this.vx;
      this.r = random(100, 255);
      this.g = random(100, 255);
      this.b = random(100, 255);
    }
    if (this.y - this.radius <= 0) {
      this.vy = -this.vy;
      this.r = random(100, 255);
      this.g = random(100, 255);
      this.b = random(100, 255);
    }
    if (this.y + this.radius >= windowHeight) {
      this.x = random(game.width / 2 - 50, game.width / 2 + 50);
      this.y = random(game.height / 2 - 50, game.height / 2 + 50);
      game.lives -= 1;
      this.vx = random([-3, -2, 2, 3]);
      this.vy = random([-2, -3]);
    }
  }
  collideWithPaddle() {
    if (
      this.bottomEdge() >= paddle.topEdge() &&
      this.topEdge() <= paddle.topEdge()
    ) {
      if (
        this.rightEdge() >= paddle.leftEdge() &&
        this.leftEdge() <= paddle.rightEdge()
      ) {
        this.vy = -this.vy;
        this.r = random(100, 255);
        this.g = random(100, 255);
        this.b = random(100, 255);
      }
    }
  }
  collideWithTargets() {
    // Similar code to colliding with the paddle, but check ALL of the targets!
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      if (
        this.bottomEdge() >= target.topEdge() &&
        this.topEdge() <= target.topEdge()
      ) {
        if (
          this.rightEdge() >= target.leftEdge() &&
          this.leftEdge() <= target.rightEdge()
        ) {
          this.vy = -this.vy;
          this.r = random(100, 255);
          this.g = random(100, 255);
          this.b = random(100, 255);
          targets.splice(i, 1);
          game.score += 1;
          ball.vx += 0.4;
          ball.vy += 0.3;
          paddle.size -= 5;
          return;
        }
      }
    }
  }
  topEdge() {
    return this.y - this.radius;
  }
  bottomEdge() {
    return this.y + this.radius;
  }
  leftEdge() {
    return this.x - this.radius;
  }
  rightEdge() {
    return this.x + this.radius;
  }
}

class Paddle {
  constructor() {
    this.width = 200;
    this.height = 10;
    this.x = game.width / 2;
    this.y = game.height / 2 + 212;
    this.color = 255;
  }
  draw() {
    fill(game.background);
    stroke(this.color);
    strokeWeight(4);
    rect(this.x, this.y, this.width, this.height);
  }
  topEdge() {
    return this.y;
  }
  bottomEdge() {
    return this.y + this.height;
  }
  leftEdge() {
    return this.x;
  }
  rightEdge() {
    return this.x + this.width;
  }
}
class Target {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.height = random(10, 20);
    this.width = game.width / game.targetCols;
    this.x = this.width * this.row;
    this.y = (120 / game.targetRows) * col + 20;
  }
  draw() {
    fill(game.background);
    stroke(140, 69, 169);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.height);
  }
  topEdge() {
    return this.y;
  }
  bottomEdge() {
    return this.y + this.height;
  }
  leftEdge() {
    return this.x;
  }
  rightEdge() {
    return this.x + this.width;
  }
}
/** @type {Game} */
let game;
/** @type {Ball} */
let ball;
/** @type {Paddle} */
let paddle;
/** @type {Array<Target>} */
let targets = [];

var setup = function () {
  game = new Game();
  createCanvas(game.width, game.height);
  background(game.background);
  ball = new Ball();
  ball2 = new Ball();
  paddle = new Paddle();
  for (let across = 0; across < game.targetCols; across++) {
    for (let down = 0; down < game.targetRows; down++) {
      targets.push(new Target(across, down));
    }
  }
};

var draw = function () {
  background(game.background);
  ball.draw();
  ball2.draw();
  paddle.draw();
  for (const target of targets) {
    target.draw();
  }
  keyPressed();
  if (targets.length === 0) {
    // you win!
    background("green");
    game.gameWon = true;
    fill(255);
    stroke(0);
    textSize(50);
    textAlign(CENTER);
    textFont("Ariel");
    text("YOU WIN!", windowWidth / 2, windowHeight / 2);
    noLoop();
  }
  if (game.lives === 0) {
    background(169, 0, 0);
    fill(255);
    stroke(0);
    textSize(50);
    textAlign(CENTER);
    textFont("Ariel");
    text("SKILL ISSUE!", windowWidth / 2, windowHeight / 2);
    noLoop();
  }
  if (game.lives > 0 && game.gameWon === false) {
    let lifePos = 500;
    stroke(169, 0, 0);
    fill(0);
    for (let index = 0; index < game.lives; index++) {
      circle(50, (lifePos -= 50), 20);
    }
  }
};
var keyPressed = function () {
  paddleMovement = 10;
  if (keyIsDown(SHIFT)) {
    paddleMovement = 25;
    paddle.color = "#21C9BA";
  } else {
    paddle.color = 255;
  }
  if (keyIsDown(LEFT_ARROW)) {
    paddle.x -= paddleMovement;
  } else if (keyIsDown(RIGHT_ARROW)) {
    paddle.x += paddleMovement;
  }
};
let element = (document.getElementsById("score").innerHTML = game.score);
