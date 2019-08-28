document.addEventListener('DOMContentLoaded', initializeApp);
document.addEventListener('keyup', handleUserInput);

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var maxGravity = 3;
var minGravity = 1.5;
var player = {
  direction: {
    x: 0
  },
  changeDirection: function(direction){
    // change direction
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
  if(count % 50 === 0){
    createTriangle();
  }

  clearCanvas();
  moveTriangles();
}
function handleUserInput(){
  // handle input
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
      context.fillStyle = 'black';
      context.fill();
    }
  }
}
function createTriangle(){
  console.log(fallingTriangles);
  var startingX = null;
  var validNum = null;
  do{
    validNum = true;
    startingX = Math.floor(Math.random() * canvas.width);
    for(var i = 0; i < fallingTriangles.length; i++){
      if (startingX < fallingTriangles[i].x + 50 && startingX > fallingTriangles[i].x){
        console.log('invalid x');
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
  console.log(fallingTriangles);
}
function clearCanvas() {
  context.fillStyle = 'white';
  context.strokeStyle = 'black';
  context.lineWidth = 5;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeRect(0, 0, canvas.width, canvas.height);
}
function drawGrass(){

}

function randomNum(){

}
