document.addEventListener('DOMContentLoaded', initializeApp);
document.addEventListener('keydown', handleUserInput);
// document.addEventListener('keyup', playerDirectionDecay);

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var maxGravity = 5;
var minGravity = 3;
var player = {
  position: {
    x: 200, //initial position
  },
  direction: {
    x: 3
  },
  changeDirection: function(direction){
    this.x = this.x * direction;
  }
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
  if(count === 0){
    createPlayer();
  }
  if(count % 20 === 0){
    createTriangle();
  }

  clearCanvas();
  movePlayer();
  moveTriangles();
  drawGrass();
}


function handleUserInput(input){
  console.log('change direction')
  if(input.code === "ArrowLeft" && player.direction != -1){
    player.direction.x = -3;
  }
  else if(input.code === "ArrowRight" && player.direction != 1){
    player.direction.x = 3;
  }

}
function movePlayer(){
  if(player.position.x > canvas.width - 8 && player.direction.x > 0){
    player.direction.x = 0;
  }
  else if(player.position.x < 8 && player.direction.x < 0){
    player.direction.x = 0;
  }

  player.position.x += player.direction.x;

  context.beginPath();
  context.arc(player.position.x, canvas.height - 70, 12, 0, 2 * Math.PI)
  context.fillStyle = 'black';
  context.fill();
  context.fillRect(player.position.x - 2 , canvas.height - 60, 5, 25);

}
function createPlayer(){
  context.beginPath();
  context.arc(player.position, canvas.height - 70, 12, 0, 2 * Math.PI)
  context.fillStyle = 'black';
  context.fill();
  context.fillRect(player.position - 2, canvas.height - 60, 5, 25);
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
