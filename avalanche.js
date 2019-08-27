document.addEventListener('DOMContentLoaded', initializeApp);
document.addEventListener('keyup', handleUserInput);

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var maxGravity = 1.5;
var minGravity = .7;
var player = {
  direction: {
    x: 0
  },
  changeDirection: function(direction){
    // change direction
  }
}

var fallingTriangles = [
  {x: 390, y: 367.953, gravity: 1.0339},
  {x: 518, y: 642.834, gravity: 0.8529},
];
var loop = null
function initializeApp(){
  document.body.append(canvas);

  canvas.width = 900;
  canvas.height = 700;
  clearCanvas();

  setInterval(update, 5);
}
var count = 0;
function update(){
  count++;
  if(count % 70 === 0){
    createTriangle();
  }
  //main loop
  clearCanvas();
    // createTriangle();
  moveTriangles();
}
function handleUserInput(){
  // handle input
}
function moveTriangles(x, y){
  for(var i = 0; i< fallingTriangles.length; i++){
    var x = fallingTriangles[i].x;
    var y = fallingTriangles[i].y;
    if(y > canvas.height){
      fallingTriangles.splice(i, 1);
      console.log('element removed')
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
  var startingX = Math.floor(Math.random() * canvas.width);
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

}

function randomNum(){

}
