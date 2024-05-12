const gameWindow = document.getElementById(`game-window`);
const leftScore = document.getElementById(`left-score`);
const rightScore = document.getElementById(`right-score`);
const ball = document.getElementById(`ball`);
const leftPaddle = document.getElementById(`left-paddle`);
const rightPaddle = document.getElementById(`right-paddle`);
const titleStart = document.querySelector(`h3`);
const titlePong = document.getElementById(`pong-title`);
const titleRestart = document.getElementById(`restart-dialogue`);
const titleMusic = document.getElementById(`music-dialogue`);
const point = new Audio('sound/point.mp3');;
const hitSFX = new Audio('sound/hit.mp3')
const BG_music = document.getElementById('backgroundMusic');

let player1Score = 0, 
    player2Score = 0, 
    y = 3, 
    x = 3,
    running = false,
    ballState;
let randomNum = Math.random(); 
if (randomNum > .75) {
  ballState = 4;
} else if (randomNum > .5) {
  ballState = 3;
} else if (randomNum > .25) {
  ballState = 2;
} else {
  ballState = 1;
}

const paddleStyles = window.getComputedStyle(leftPaddle);
const ballStyle = window.getComputedStyle(ball);
let ballY = parseInt(ballStyle.getPropertyValue('top'));
let ballX = parseInt(ballStyle.getPropertyValue('left'));
const initBallY = ballY;
const initBallX = ballX;
let leftPaddleY, rightPaddleY;
leftPaddleY = rightPaddleY = parseInt(paddleStyles.getPropertyValue('top'));
const initLeftPaddleY = leftPaddleY;
const initRightPaddleY = rightPaddleY;

document.body.onkeyup = function(e) {
  if (e.key == " ") {
    running = !running;
  }
}

// Define a variable to track whether the s or k keys are currently pressed
let sKeyPressed = false;
let wKeyPressed = false;

document.body.addEventListener('keydown', function(e) {
    if (e.key === 's') {
      sKeyPressed = true;
    }
    if (e.key === 'w') {
      wKeyPressed = true;
    }
});

document.body.addEventListener('keyup', function(e) {
    if (e.key === 's') {
      sKeyPressed = false;
    }
    if (e.key === 'w') {
      wKeyPressed = false;
    }
});

// zero out score and start over.
document.body.addEventListener('keyup', function(e) {
  if (e.key === 'r') { 
    location.reload();
  }
});



let music = true;
document.body.addEventListener('keyup', function(e) {
  if (e.key === 'm') { 
    if (music) {
      BG_music.pause();
      music = false;
    } else {
      BG_music.play();
      music = true;
    }
  }
});

// Functions to move the left paddle
function moveLeftPaddleDown() {
  leftPaddle.style.top = `${leftPaddleY += 7}px`;
}
function moveLeftPaddleUp() {
  leftPaddle.style.top = `${leftPaddleY -= 7}px`;
}

// Functions to move the right paddle
function moveRightPaddleDown() {
  rightPaddle.style.top = `${rightPaddleY += 7}px`;
}
function moveRightPaddleUp() {
  rightPaddle.style.top = `${rightPaddleY -= 7}px`;
}

// move ball
function ballUpLeft() {
  ball.style.top = `${ballY -= y}px`;
  ball.style.left = `${ballX -= x}px`
}
function ballUpRight() {
  ball.style.top = `${ballY -= y}px`;
  ball.style.left = `${ballX += x}px`
}
function ballDownLeft() {
  ball.style.top = `${ballY += y}px`;
  ball.style.left = `${ballX -= x}px`
}
function ballDownRight() {
  ball.style.top = `${ballY += y}px`;
  ball.style.left = `${ballX += x}px`
}
function initBall() {
  switch(ballState) {
    case 1:
      ballUpLeft();
      break;
    case 2:
      ballUpRight();
      break;
    case 3:
      ballDownRight();
      break;
    case 4:
      ballDownLeft();
      break;
  }
}

function reset() {
  y = 3;
  x = 3;
  randomNum = Math.random(); 
  if (randomNum > .75) {
    ballState = 4;
  } else if (randomNum > .5) {
    ballState = 3;
  } else if (randomNum > .25) {
    ballState = 2;
  } else {
    ballState = 1;
  }
  ballY = initBallY;
  ballX = initBallX;
  leftPaddleY = initLeftPaddleY;
  rightPaddleY = initRightPaddleY;
  running = false;
}

// Function to update the game state
function update() {
    if (running) {
        titleStart.classList.add(`hide`);
        titlePong.classList.add(`hide`);
        titleRestart.classList.add(`hide`);
        titleMusic.classList.add(`hide`);
        initBall();

        if (ballY < 0) {
          ++y;
          if (ballState == 2) {
            ballState = 3;
          } else {
            ballState = 4;
          }
        } else if (ballY > 820) {
          ++x;
          if (ballState == 3) {
            ballState = 2;
          } else {
            ballState = 1;
          }
        }

        if ((leftPaddleY <= ballY && ballY <= (leftPaddleY + 125)) && ballX < 45) {
          hitSFX.play();
          if (ballState == 4) {
            ++x;
            --y;
            ballState = 3;
          } else {
            ++y;
            --x;
            ballState = 2;
          }
        }

        if ((rightPaddleY <= ballY && ballY <= (rightPaddleY + 125)) && ballX > 980) {
          hitSFX.play();
          if (ballState == 3) {
            ++x;
            --y;
            ballState = 4;
          } else {
            --x;
            ++y;
            ballState = 1;
          }
        }

        if (ballX > 1005) {
          point.play();
          player1Score++;
          leftScore.innerText = player1Score;
          reset();
        } else if (ballX < 10) {
          point.play();
          player2Score++;
          rightScore.innerText = player2Score;
          reset();
        }

        // Move the left paddle if the "s" key is pressed
        if (sKeyPressed && leftPaddleY < 692) {
          moveLeftPaddleDown();
        }
        if (wKeyPressed && leftPaddleY > 20) {
          moveLeftPaddleUp();
        } 
        // move right paddle in accordance with relative height to ball
        if ((rightPaddleY + 50) < ballY && rightPaddleY < 692) { 
          moveRightPaddleDown();
        } else if ((rightPaddleY + 50) > ballY && rightPaddleY > 20) {
          moveRightPaddleUp();
        }
    } else {
      titleStart.classList.remove(`hide`); 
      titlePong.classList.remove(`hide`);
      titleRestart.classList.remove(`hide`);
      titleMusic.classList.remove(`hide`);
    }

    // Request the next animation frame to continue the game loop
    requestAnimationFrame(update);
}

// Start the game loop
requestAnimationFrame(update);