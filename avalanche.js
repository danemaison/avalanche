document.addEventListener('DOMContentLoaded', initializeApp);
document.addEventListener('keydown', handleUserInput);
document.addEventListener('keyup', playerDirectionDecay);

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

var keyLeft = false;
var keyRight = false;
var acceleration = 3.5;
var decay = 0;

var maxGravity = 8;
var minGravity = 5;
var player = {
  position:200, //initial position
  direction: 'left',
}

var fallingTriangles = [];


function initializeApp(){
  document.body.append(canvas);

  canvas.width = 900;
  canvas.height = 700;
  clearCanvas();

  requestAnimationFrame(update);

}

var count = 0;
/* Main game loop */
function update(){
  requestAnimationFrame(update);
  count++;
  if(count % 20 === 0){
    createTriangle();
  }
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
  console.log('change direction')
  if(input.code === "ArrowLeft"){
    keyLeft = true;
    player.direction = 'Left';
  }
  else if(input.code === "ArrowRight"){
    keyRight = true;
    player.direction = 'Right';
  }
}

function checkOutOfBounds(){
  if(player.position > canvas.width - 8 && player.direction === 'Right'){
    console.log('out of bounds');
    return true;
  }
  else if(player.position < 8 && player.direction === 'Left'){
    console.log('out of bounds');
    return true;
  }
  return false;
}
function movePlayer(){
  if(!checkOutOfBounds()){

    if(keyLeft){
      decay = acceleration;
      player.position  -= acceleration;
    }
    else if(keyRight){
      decay = acceleration;
      player.position += acceleration;
    }
    else if(!keyRight && !keyLeft){
      if(player.direction === 'Left'){
        player.position -= decay;
      }
      else if (player.direction === 'Right'){
        player.position += decay;
      }
      if(decay > 0){
        decay -= .1;
      }
    }
  }

  context.beginPath();
  context.arc(player.position, canvas.height - 70, 12, 0, 2 * Math.PI)
  context.fillStyle = 'black';
  context.fill();
  context.fillRect(player.position - 2 , canvas.height - 60, 5, 25);

}


function moveTriangles(){
  for(var i = 0; i< fallingTriangles.length; i++){
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
  var startingX = null;
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

  var startingY = -100;
  var gravity = Math.random() * (maxGravity - minGravity) + minGravity;
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

function randomNum(){

}
