document.addEventListener('DOMContentLoaded', initializeApp);
document.addEventListener('keydown', handleUserInput);
document.addEventListener('keyup', playerDirectionDecay);

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
canvas.width = 650;
canvas.height = 650;

var keyLeft = false;
var keyRight = false;

var points = 0;

var acceleration = 5.5;
var decay = 0;

// var gravityMultiplier = 0;
var freezeTimer = 0;
var invincibleTimer = 0;
var invincible = false;

var level = 1;
var maxGravity = 13.5;
var minGravity = 10;

var fallingPowerUps = [];
var fallingTriangles = [];

var player = {
  color: 'black',
  height: canvas.height - 130,
  position: 200, //initial position
  direction: 'left',
}




function initializeApp() {
  document.body.append(canvas);


  createTriangle();

  requestAnimationFrame(update);
  clearCanvas();
}

var gameCount = 0;
/* Main game loop */
function update() {
  points++;
  gameCount++;

  if (checkGameOver()) {
    return;
  }

  requestAnimationFrame(update);

  setLevel();

  if(freezeTimer > 0){
    freezeTimer--
  }

  if (invincibleTimer > 0) {
    player.color = 'orange';
    invincibleTimer--;
  }
  else {
    player.color = 'black';
    invincible = false;
  }


  if (gameCount % 150 === 0) {
    generatePowerUps();
  }
  clearCanvas();
  drawGrass();
  movePlayer();
  checkPowerUpCollision();
  movePowerUps();
  moveTriangles();
  displayScore();
}

function setLevel() {
  if(points < 5000){
    level = 1;
  }
  else if (points < 10000){
    level = 2;
  }
  else if (points < 15000){
    level = 3
  }
  else if (points < 20000){
    level = 4;
  }

  if(!freezeTimer){
    switch (level) {
      case 1:
        if (gameCount % 40 === 0) {
          generateTriangles();
        }
        maxGravity = 13.5;
        minGravity = 10;
        break;
      case 2:
        maxGravity = 14.5;
        minGravity = 11.5;
        if (gameCount % 34 === 0) {
          generateTriangles();
        }
        break;
      case 3:
        maxGravity = 15;
        minGravity = 12.5;
        if (gameCount % 29 === 0) {
          generateTriangles();
        }
        break;

      case 4:
        maxGravity = 16.5;
        minGravity = 12.5;
        break;
    }
  }

}

function generateTriangles(){
  var chance = Math.random();
  if (chance > .25) {
    var amountOfTriangles = Math.floor(Math.random() * 3 + 1);
    for (var i = 0; i < amountOfTriangles; i++) {
      createTriangle();
    }
  }
}
function generatePowerUps(){
  var chance = Math.random();
  if (chance > .25) {
    var amountOfTriangles = Math.floor(Math.random() * 3 + 1);
    for (var i = 0; i < amountOfTriangles; i++) {
      createPowerUp();
    }
  }
}
function displayLevelOnChange(){
  context.beginPath();
  context.font = '35px hydrophilia-iced';
  context.fillStyle = 'black';
  context.fillText('Level ' + level, canvas.width/2 - 60, canvas.height/2);
  context.closePath();
}
function displayScore(){

  context.beginPath();
  context.font = '15px hydrophilia-iced';
  context.fillStyle = 'black';
  context.fillText('Level: ' + level, 10, 20 );
  context.closePath();
  context.beginPath()
  context.fillStyle = 'black';
  context.font = '15px hydrophilia-iced';
  context.fillText('Points: ' + points, 10, 40);
  context.closePath();
}
function playerDirectionDecay(input) {
  if (input.code === 'ArrowLeft') {
    keyLeft = false;
  }
  else if (input.code === 'ArrowRight') {
    keyRight = false;
  }
}

function handleUserInput(input) {
  if (input.code === "ArrowLeft") {
    keyLeft = true;
    player.direction = 'left';
  }
  else if (input.code === "ArrowRight") {
    keyRight = true;
    player.direction = 'right';
  }
}

function isOutOfBounds() {
  if (player.position > canvas.width - 8 && player.direction === 'right') {
    return true;
  }
  else if (player.position < 8 && player.direction === 'left') {
    return true;
  }
  return false;
}

function movePlayer() {
  if (!isOutOfBounds()) {
    if (keyLeft) {
      decay = acceleration;
      player.position -= acceleration;
    }
    else if (keyRight) {
      decay = acceleration;
      player.position += acceleration;
    }
    else if (!keyRight && !keyLeft) {
      if (player.direction === 'left') {
        player.position -= decay;
      }
      else if (player.direction === 'right') {
        player.position += decay;
      }
      if (decay > 0) {
        decay -= .25;
      }
    }
  }
  context.beginPath();
  drawHead();
  drawBody();

  drawLegs();
  context.closePath();
  drawArms();

}

function moveTriangles() {
  for (var i = 0; i < fallingTriangles.length; i++) {
    var x = fallingTriangles[i].x;
    var y = fallingTriangles[i].y;

    if (y > canvas.height) {
      fallingTriangles.splice(i, 1);
      i--;
    }
    else {
      if(!freezeTimer){
        fallingTriangles[i].y += fallingTriangles[i].gravity;
      }
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + 25, y + 50);
      context.lineTo(x + 50, y);
      context.fillStyle = 'grey';
      context.fill();
      context.closePath();
    }
  }
}

function createPowerUp(){
  var gravity = randomFloat(minGravity, maxGravity);
  var startingX = Math.floor(Math.random() * canvas.width);
  var startingY = -100;
  var type = null;
  var color = null;
  context.fillStyle = color;
  context.fillRect(startingX, startingY, 25, 25);
  var typeChance = Math.floor(Math.random() * 5  + 1);
  switch(typeChance){
    case 1:
    case 2:
    case 3:
      type = 'points';
      color = 'red';
      break;
    case 4:
      type = 'freeze';
      color = 'lightgreen';
      break;
    case 5:
      type = 'invincible';
      color = 'orange';
      break;
  }
  fallingPowerUps.push({x: startingX, y: startingY, gravity: gravity, type:type, color:color});

}
function movePowerUps(){
  for (var i = 0; i < fallingPowerUps.length; i++){
    if(fallingPowerUps[i].y > canvas.height){
      fallingPowerUps.splice(i, 1);
      i--;
    }
    else{
      fallingPowerUps[i].y += fallingPowerUps[i].gravity;
      context.fillStyle = fallingPowerUps[i].color;
      context.fillRect(fallingPowerUps[i].x, fallingPowerUps[i].y, 25, 25);
    }
  }

}

function randomFloat(min, max){
  return Math.random() * (max - min) + min;
}

function createTriangle() {
  var gravity = randomFloat(minGravity, maxGravity);
  var startingX = null;
  var startingY = null;
  var validNum = null;
  var generatorCount = 0;
  do {
    generatorCount++;
    if (generatorCount > 10000) {
      break;
    }
    validNum = true;
    startingX = Math.floor(Math.random() * canvas.width);
    for (var i = 0; i < fallingTriangles.length; i++) {
      if (startingX < fallingTriangles[i].x + 50 && startingX > fallingTriangles[i].x - 50) {
        validNum = false;
      }
    }
  } while (!validNum);
  startingY = -100;
  context.beginPath();
  context.moveTo(startingX, startingY);
  context.lineTo(startingX + 25, startingY + 50);
  context.lineTo(startingX + 50, startingY);
  context.fillStyle = 'black';
  context.fill();
  fallingTriangles.push({ x: startingX, y: startingY, gravity: gravity });
}

function clearCanvas() {
  context.fillStyle = 'white';
  context.lineWidth = 5;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGrass() {
  context.fillStyle = 'chartreuse';
  context.fillRect(0, canvas.height - 10, canvas.width, 10);
}

function checkPowerUpCollision(){
  for(var i = 0; i < fallingPowerUps.length; i++){
    if(player.position > fallingPowerUps[i].x - 15 && player.position < fallingPowerUps[i].x + 40
        && player.height + 20 <= fallingPowerUps[i].y && player.height + 110 > fallingPowerUps[i].y){
          switch(fallingPowerUps[i].type){
            case 'points':
              points += 500;
              break;
            case 'freeze':
              minGravity = 0;
              maxGravity = 0;
              freezeTimer = 100;
              console.log('FREEZE');
              break;
            case 'invincible':
              invincible = true;
              invincibleTimer = 300;
              break;
          }
          fallingPowerUps.splice(i, 1);
          i--;
          return true;
        }
  }
  // player.color = 'black';
  return false;
}

function checkGameOver() {
  if(invincible){
    console.log('invincible')
    return false;
  }
  for (var i = 0; i < fallingTriangles.length; i++) {
    if (fallingTriangles[i].y <= player.height && fallingTriangles[i].y > player.height + 10) {
      if (player.position > fallingTriangles[i].x + 23 && player.position < fallingTriangles[i].x + 27) {
        player.color = 'red';
        return true;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 20 && fallingTriangles[i].y >= player.height + 10) {
      if (player.position > fallingTriangles[i].x + 10 && player.position < fallingTriangles[i].x + 40) {

        player.color = 'red';
        return true;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 30 && fallingTriangles[i].y >= player.height + 20) {
      if (player.position > fallingTriangles[i].x + 2 && player.position < fallingTriangles[i].x + 49) {
        player.color = 'red';
        return true;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 40 && fallingTriangles[i].y >= player.height + 30) {
      if (player.position > fallingTriangles[i].x + -1 && player.position < fallingTriangles[i].x + 52) {
        player.color = 'red';
        return true;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 50 && fallingTriangles[i].y >= player.height + 40) {
      if (player.position > fallingTriangles[i].x + -7 && player.position < fallingTriangles[i].x + 57) {
        player.color = 'red';
        return true;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 60 && fallingTriangles[i].y >= player.height + 50) {
      if (player.position > fallingTriangles[i].x + -13 && player.position < fallingTriangles[i].x + 63) {
        player.color = 'red';
        return true;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 70 && fallingTriangles[i].y >= player.height + 60) {
      if (player.position > fallingTriangles[i].x + 10 && player.position < fallingTriangles[i].x + 50) {
        player.color = 'red';
        return true;
      }
    }
  }
  return false;
}
function spinDrawing(drawPart, angle) {
  context.save();
  context.translate(200, 200);
  context.rotate(angle * Math.PI / 180);
  drawPart();
  context.translate(-200, -200);
  context.restore();
}
function drawArms() {
  // context.strokeStyle = 'red';
  context.lineWidth = 3;
  context.beginPath();
  if (player.direction === 'left') {
    // left arm
    context.moveTo(player.position + 3, player.height + 65);
    context.lineTo(player.position - 5, player.height + 85);
    context.stroke();
    // left lower arm
    context.moveTo(player.position - 5, player.height + 85);
    context.lineTo(player.position - 14, player.height + 88);
    context.stroke();

    // right arm
    context.moveTo(player.position - 3, player.height + 68);
    context.lineTo(player.position + 10, player.height + 85);
    context.stroke();
    //right lower arm
    context.moveTo(player.position + 10, player.height + 85);
    context.lineTo(player.position + 10, player.height + 95);
    context.stroke();
  }
  else {
    // left arm
    context.moveTo(player.position - 3, player.height + 65);
    context.lineTo(player.position + 5, player.height + 85);
    context.stroke();
    // left lower arm
    context.moveTo(player.position + 5, player.height + 85);
    context.lineTo(player.position + 14, player.height + 88);
    context.stroke();

    // right arm
    context.moveTo(player.position + 3, player.height + 68);
    context.lineTo(player.position - 10, player.height + 85);
    context.stroke();
    //right lower arm
    context.moveTo(player.position - 10, player.height + 85);
    context.lineTo(player.position - 10, player.height + 95);
    context.stroke();
  }
  context.closePath();

}

function drawHead() {
  // x, y, radius, startAngle, endAngle
  context.arc(player.position, canvas.height - 70, 12, 0, 2 * Math.PI)
  context.fillStyle = player.color;
  context.fill();
}
function drawBody() {
  if (player.direction === 'left') {
    context.fillRect(player.position - 2, canvas.height - 60, 5, 25);
  }
  else {
    context.fillRect(player.position - 2.5, canvas.height - 60, 5, 25);
  }
}
function drawLegs() {
  context.lineWidth = 3;
  context.strokeStyle = player.color;

  if (player.direction === 'left') {
    //left Leg
    context.moveTo(player.position, player.height + 90);
    context.lineTo(player.position - 5, player.height + 110);
    context.stroke();
    // left lower leg
    context.moveTo(player.position - 5, player.height + 110);
    context.lineTo(player.position - 4, player.height + 120);
    context.stroke();
    // left foot
    context.moveTo(player.position - 4, player.height + 120);
    context.lineTo(player.position - 10, player.height + 120);
    context.stroke();

    // right leg
    context.moveTo(player.position + 1.5, player.height + 90);
    context.lineTo(player.position + 1.5, player.height + 110);
    context.lineWidth = 3;
    context.strokeStyle = player.color;
    context.stroke();
    // right lowerleg
    context.moveTo(player.position + 1.5, player.height + 110);
    context.lineTo(player.position + 3.5, player.height + 120);
    context.stroke();
    // right foot
    context.moveTo(player.position + 4.5, player.height + 120);
    context.lineTo(player.position - 1.5, player.height + 121);
    context.stroke();
  }
  else { //facing right
    // right leg
    context.moveTo(player.position, player.height + 90);
    context.lineTo(player.position + 5.5, player.height + 110);
    context.lineWidth = 3.5;
    context.strokeStyle = player.color;
    context.stroke();
    // right lower leg
    context.moveTo(player.position + 5.5, player.height + 110);
    context.lineTo(player.position + 4.5, player.height + 120);
    context.stroke();
    // right foot
    context.moveTo(player.position + 3.5, player.height + 120);
    context.lineTo(player.position + 10.5, player.height + 120);
    context.stroke();

    // left leg
    context.moveTo(player.position, player.height + 90);
    context.lineTo(player.position - 1.5, player.height + 110);
    context.lineWidth = 3;
    context.strokeStyle = player.color;
    context.stroke();
    // left lowerleg
    context.moveTo(player.position - 1.5, player.height + 110);
    context.lineTo(player.position - 3.5, player.height + 120);
    context.stroke();
    // left foot
    context.moveTo(player.position - 5.5, player.height + 120);
    context.lineTo(player.position + 1.5, player.height + 121);
    context.stroke();
  }
}
