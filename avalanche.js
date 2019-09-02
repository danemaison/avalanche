document.addEventListener('DOMContentLoaded', initializeApp);
document.addEventListener('keydown', handleUserInput);
document.addEventListener('keyup', playerDirectionDecay);

var deathAnimation = loadDeath();
var sprites = loadSprites();
var spriteIndex = 0;

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth / 2;
// canvas.width = 650;
canvas.height = window.innerHeight / 1.25;

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
  position: 200,
  direction: 'left',
  height: canvas.height - 130,

}

function initializeApp() {
  document.body.append(canvas);

  requestAnimationFrame(update);
}

var gameCount = 0;

/* Main game loop */
function update() {
  points++;
  gameCount++;

  if (checkGameOver()) {
    drawDeath();
    return;
  }

  requestAnimationFrame(update);

  setLevel();

  if(freezeTimer > 0){
    freezeTimer--
  }

  if (invincibleTimer > 0) {
    invincibleTimer--;
  }
  else {
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
  else if(points < 25000){
    level = 5;
  }
  else if (points < 30000) {
    level = 6;
  }
  else{
    level = 7
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
        maxGravity = 14;
        minGravity = 11.5;
        if (gameCount % 34 === 0) {
          generateTriangles();
        }
        break;
      case 3:
        maxGravity = 14.5;
        minGravity = 12.5;
        if (gameCount % 29 === 0) {
          generateTriangles();
        }
        break;
      case 4:
        maxGravity = 15;
        minGravity = 12.5;
        if (gameCount % 29 === 0) {
          generateTriangles();
        }
        break;
      case 5:
        maxGravity = 13;
        minGravity = 9.5;
        if (gameCount % 29 === 0) {
          generateTriangles();
        }
        break;
      case 6:
        maxGravity = 15;
        minGravity = 12.5;
        if (gameCount % 25 === 0) {
          generateTriangles();
        }
        break;
      case 7:
        if (gameCount % 20 === 0) {
          generateTriangles();
        }
        maxGravity = 16;
        minGravity = 13.5;
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
  else if (player.position < 15 && player.direction === 'left') {
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
        if(level === 3){
          decay -= .025;
        }
        else{
          decay -= .25;
        }
      }
    }
  }

  if(keyLeft || keyRight){
    if (sprites.left[spriteIndex + 1]) {
      spriteIndex++
    }
    else{
      spriteIndex = 0;
    }
  }
  else{
    if(spriteIndex){
      if(spriteIndex > 15 && sprites.left[spriteIndex + 1]){
        spriteIndex++
      }
      else if(!sprites.left[spriteIndex + 1]){
        spriteIndex = 0;
      }
      else{
        spriteIndex--;
      }
    }
  }

  if(invincible){
    context.globalAlpha = .3;
  }
  if(player.direction === 'left'){
    context.drawImage(sprites.left[spriteIndex], player.position - 40, player.height + 35, 75, 100);
  }
  else{
    context.drawImage(sprites.right[spriteIndex], player.position - 40, player.height + 35, 75, 100);
  }

  context.globalAlpha = 1; // reset
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
      if(!freezeTimer && !checkGameOver()){
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
  if(level === 3){
    context.fillStyle = 'aqua';
  }
  else{
    context.fillStyle = 'chartreuse';
  }
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
  return false;
}

function checkGameOver() {
  if(invincible){
    return false;
  }
  for (var i = 0; i < fallingTriangles.length; i++) {
    if (fallingTriangles[i].y <= player.height && fallingTriangles[i].y > player.height + 10) {
      if (player.position > fallingTriangles[i].x + 23 && player.position < fallingTriangles[i].x + 27) {
        return true;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 20 && fallingTriangles[i].y >= player.height + 10) {
      if (player.position > fallingTriangles[i].x + 10 && player.position < fallingTriangles[i].x + 40) {
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
        return true;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 50 && fallingTriangles[i].y >= player.height + 40) {
      if (player.position > fallingTriangles[i].x + -7 && player.position < fallingTriangles[i].x + 57) {
        return true;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 60 && fallingTriangles[i].y >= player.height + 50) {
      if (player.position > fallingTriangles[i].x + -13 && player.position < fallingTriangles[i].x + 63) {
        return true;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 70 && fallingTriangles[i].y >= player.height + 60) {
      if (player.position > fallingTriangles[i].x + 10 && player.position < fallingTriangles[i].x + 50) {
        return true;
      }
    }
  }
  return false;
}

var deathCount = 0;
function drawDeath(){
    clearCanvas();
    drawGrass();
    moveTriangles();
    displayScore();
    if(deathAnimation[deathCount + 1]){
      requestAnimationFrame(drawDeath);
      context.drawImage(deathAnimation[deathCount], player.position - 40, player.height + 45, 225, 110);
      deathCount++
    }
    else{
      context.drawImage(deathAnimation[deathCount], player.position - 40, player.height + 45, 225, 110);
      return false;
    }
}

function loadDeath() {
  var sprites = [];
  for (var i = 1; i < 70; i++) {
    var image = new Image();
    image.src = `death-sprites/${i}.png`;
    sprites.push(image);
  }
  return sprites;
}

function loadSprites() {
  var sprites = { left: [], right: [] };
  for (let i = 0; i < 30; i++) {
    sprites.left[i] = new Image();
    sprites.left[i].src = `left-sprites/${i + 1}.png`;
  }
  for (let i = 0; i < 30; i++) {
    sprites.right[i] = new Image();
    sprites.right[i].src = `right-sprites/${i + 1}.png`;
  }
  return sprites;
}
