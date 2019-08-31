document.addEventListener('DOMContentLoaded', initializeApp);
document.addEventListener('keydown', handleUserInput);
document.addEventListener('keyup', playerDirectionDecay);

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
canvas.width = 650;
canvas.height = 650;

var keyLeft = false;
var keyRight = false;
var acceleration = 3.5;
var decay = 0;
var level = 1;
var gravityMultiplier = 0;
var maxGravity = 3.5;
var minGravity = 3;
var player = {
  headColor: 'black',
  height: canvas.height - 130,
  position:200, //initial position
  direction: 'left',
}

var fallingTriangles = [];


function initializeApp(){
  document.body.append(canvas);


  createTriangle();

  requestAnimationFrame(update);
  clearCanvas();
}

var count = 0;
/* Main game loop */
function update(){
  requestAnimationFrame(update);
  if(checkGameOver()){
    // return;
    console.log('game over');
  }
  count++;
  switch(level){
    case 1:
      if (count % 100 === 0) {
        var amountOfTriangles = Math.floor(Math.random() * 4 + 1);
        for (var i = 0; i < amountOfTriangles; i++) {
          createTriangle();
        }
      }
      break;
  }
  // if(count % 1500 === 0){
  //   var amountOfTriangles = Math.floor(Math.random() * 4 + 1);
  //   for (var i = 0; i < amountOfTriangles; i++) {
  //     createTriangle();
  //   }
  // }
  clearCanvas();
  movePlayer();
  moveTriangles();
  drawGrass();
}

function playerDirectionDecay(input){
  if(input.code === 'ArrowLeft'){
    keyLeft = false;
  }
  else if(input.code === 'ArrowRight'){
    keyRight = false;
  }
}

function handleUserInput(input){
  if(input.code === "ArrowLeft"){
    keyLeft = true;
    player.direction = 'left';
  }
  else if(input.code === "ArrowRight"){
    keyRight = true;
    player.direction = 'right';
  }
}

function isOutOfBounds(){
  if(player.position > canvas.width - 8 && player.direction === 'right'){
    return true;
  }
  else if(player.position < 8 && player.direction === 'left'){
    return true;
  }
  return false;
}

function movePlayer(){
  if(!isOutOfBounds()){
    if(keyLeft){
      decay = acceleration;
      player.position  -= acceleration;
    }
    else if(keyRight){
      decay = acceleration;
      player.position += acceleration;
    }
    else if(!keyRight && !keyLeft){
      if(player.direction === 'left'){
        player.position -= decay;
      }
      else if (player.direction === 'right'){
        player.position += decay;
      }
      if(decay > 0){
        decay -= .1;
      }
    }
  }

  context.beginPath();
              // x, y, radius, startAngle, endAngle
  context.arc(player.position, canvas.height - 70, 12, 0, 2 * Math.PI)
  context.fillStyle = player.headColor;
  context.fill();
  context.fillRect(player.position - 2 , canvas.height - 60, 5, 25);
  context.beginPath();
  context.fillRect(player.position + 2.5, canvas.height - 40, 3, 30);
  // context.rotate(20 * Math.PI / 180)
  context.closePath()
  context.fillRect(player.position - 3, canvas.height - 40, 3, 30);

}


function moveTriangles(){
  for(var i = 0; i < fallingTriangles.length; i++){
    var x = fallingTriangles[i].x;
    var y = fallingTriangles[i].y;
    if(y > canvas.height){
      fallingTriangles.splice(i, 1);
    }
    else{
      fallingTriangles[i].y += fallingTriangles[i].gravity;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + 25, y + 50);
      context.lineTo(x + 50, y);
      context.fillStyle = 'grey';
      context.fill();
    }
  }
}

function createTriangle(){
  var gravity = Math.random() * (maxGravity - minGravity) + minGravity;
  var startingX = null;
  var startingY = null;
  var validNum = null;
  var generatorCount = 0;
  do{
    generatorCount++;
    if(generatorCount > 1000){
      break;
    }
    validNum = true;
    startingX = Math.floor(Math.random() * canvas.width);
    for(var i = 0; i < fallingTriangles.length; i++){
      if (startingX < fallingTriangles[i].x + 50 && startingX > fallingTriangles[i].x - 50){
        validNum = false;
      }
    }
  }while(!validNum);
  startingY = -100;
  context.beginPath();
  context.moveTo(startingX, startingY);
  context.lineTo(startingX + 25, startingY + 50);
  context.lineTo(startingX + 50, startingY);
  context.fillStyle = 'black';
  context.fill();
  fallingTriangles.push({x: startingX, y: startingY, gravity: gravity});
}

function clearCanvas() {
  context.fillStyle = 'white';
  context.strokeStyle = 'black';
  context.lineWidth = 5;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawGrass(){
  context.fillStyle = 'green';
  context.fillRect(0, canvas.height - 10, canvas.width, 10);
}

function checkGameOver(){
  for(var i = 0; i < fallingTriangles.length; i++){
    if (fallingTriangles[i].y <= player.height && fallingTriangles[i].y > player.height + 10){
      if (player.position > fallingTriangles[i].x + 23 && player.position < fallingTriangles[i].x + 27) {
        player.headColor = 'red';
        return false;
      }
    }
    else if(fallingTriangles[i].y <= player.height + 20 && fallingTriangles[i].y >= player.height + 10){
      if (player.position > fallingTriangles[i].x + 10 && player.position < fallingTriangles[i].x + 40){

        player.headColor= 'red';
        return false;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 30 && fallingTriangles[i].y >= player.height + 20) {
      if (player.position > fallingTriangles[i].x + 2 && player.position < fallingTriangles[i].x + 49) {
        player.headColor = 'red';
        return false;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 40 && fallingTriangles[i].y >= player.height + 30) {
      if (player.position > fallingTriangles[i].x + -1 && player.position < fallingTriangles[i].x + 52) {
        player.headColor = 'red';
        return false;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 50 && fallingTriangles[i].y >= player.height + 40) {
      if (player.position > fallingTriangles[i].x + -7 && player.position < fallingTriangles[i].x + 57) {
        player.headColor = 'red';
        return false;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 60 && fallingTriangles[i].y >= player.height + 50) {
      if (player.position > fallingTriangles[i].x + -13 && player.position < fallingTriangles[i].x + 63) {
        player.headColor = 'red';
        return false;
      }
    }
    else if (fallingTriangles[i].y <= player.height + 70 && fallingTriangles[i].y >= player.height + 60) {
      if (player.position > fallingTriangles[i].x + 10 && player.position < fallingTriangles[i].x + 50) {
        player.headColor = 'red';
        return false;
      }
    }
  }
  player.headColor = 'black';
  return false;
}


// if the tip of the triangle on head
    // x + 25, y: 520
