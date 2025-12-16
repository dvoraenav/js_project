

const board = document.getElementById("board");
const size = 10;
let scoreEl=document.getElementById('score');
let timeEl=document.getElementById('time');
let score=0;
let time=0;
let gameLoop;

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.x = x;
    cell.dataset.y = y;
    board.appendChild(cell);
  }
}
//snake
resetGame();

//לקלוט את החיצים במקלדת
document.addEventListener("keydown",(event)=>{
    if(event.key=="ArrowUp" && direction!=="DOWN"){
        direction="UP";
    }
     if(event.key=="ArrowDown" && direction!=="UP"){
        direction="DOWN";
    }
     if(event.key=="ArrowLeft" && direction!=="RIGHT"){
        direction="LEFT";
    }
     if(event.key=="ArrowRight" && direction!=="LEFT"){
        direction="RIGHT";
    }

});

startGame();

setInterval(() => {
  timeEl.textContent="time:" + time;
  time++;
}, 1000);





//functions

function draw() {
  // ניקוי
  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove("snake", "food");
  });

  // ציור הנחש
  snake.forEach(part => {
    const cell = document.querySelector(
      `.cell[data-x="${part.x}"][data-y="${part.y}"]`
    );
    if (cell) {
      cell.classList.add("snake");
    }

    
  });
      // ציור אוכל
  const foodCell = document.querySelector(
        `.cell[data-x="${food.x}"][data-y="${food.y}"]`
        );
     if (foodCell) {
        foodCell.classList.add("food");
        }   
}


function resetGame() {
  snake = [
    { x: 4, y: 5 },
    { x: 3, y: 5 },
    { x: 2, y: 5 }
  ];
  direction = "RIGHT";
  food = createFood();
  score=0;
  scoreEl.textContent="score:" + score;

}

function moveSnake() {
  const head = snake[0];
  let newHead = { ...head };

  if (direction === "RIGHT") newHead.x++;
  if (direction === "LEFT")  newHead.x--;
  if (direction === "UP")    newHead.y--;
  if (direction === "DOWN")  newHead.y++;

  const hitSelf = snake.some(part =>
  part.x === newHead.x && part.y === newHead.y
);

  //  בדיקת גבולות
  if (
    newHead.x < 0 ||
    newHead.x >= size ||
    newHead.y < 0 ||
    newHead.y >= size||hitSelf
    
  ) {
    gameOver();
    return;
  }
  
  snake.unshift(newHead); // ראש חדש


if (newHead.x === food.x && newHead.y === food.y) {
  // אכלנו → לא מורידים זנב
  food=createFood();//מגרילים אוכל חדש
   score++;
   scoreEl.textContent="score:" + score;
   
 
} else {
  snake.pop();//אם לא אכלנו אז מורידים את הזנב כי לא צריך לגדול
}

}


function startGame(){
    
    gameLoop = setInterval(() => {
    moveSnake();
    draw();
    }, 300);
}



function gameOver(){
     time=0;    
    alert("Game Over");
    clearInterval(gameLoop);
    resetGame();
    startGame(); 
}


function createFood() {
  return {
    x: Math.floor(Math.random() * size),
    y: Math.floor(Math.random() * size)
  };
}






