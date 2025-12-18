const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreEl = document.getElementById("finalScore");
const highScoreEl = document.getElementById("highScoreDisplay");
const historyList = document.getElementById("scoreHistory");


startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  resetGame();
  startGame();
});



function showGameOverScreen() {
  const stats = getStats();

  finalScoreEl.textContent = "Your score: " + score;
  highScoreEl.textContent = "High score: " + stats.highScore;

  historyList.innerHTML = "";
  stats.scores.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    historyList.appendChild(li);
  });

  gameOverScreen.classList.remove("hidden");
}

function hideGameOverScreen() {
  gameOverScreen.classList.add("hidden");
}