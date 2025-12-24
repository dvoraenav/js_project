// אלמנטים של מסך הפתיחה
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
// אלמנטים של מסך Game Over
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreEl = document.getElementById("finalScore");
const highScoreEl = document.getElementById("highScoreDisplay");
const historyList = document.getElementById("scoreHistory");


// לחיצה על כפתור Start
// מסתירה את מסך הפתיחה ומתחילה משחק חדש
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none"; // הסתרת מסך פתיחה
  resetGame();                        // איפוס מצב המשחק
  startGame();                        // התחלת המשחק
});

// הצגת מסך Game Over
// מציג ניקוד סופי, שיא ורשימת משחקים קודמים
function showGameOverScreen() {
  const stats = getStats();

  finalScoreEl.textContent = "Your score: " + score;
  highScoreEl.textContent = "High score: " + stats.highScore;
  // הצגת שלוש  המשחקים האחרונים

  historyList.innerHTML = "";// ניקוי רשימת ניקודים קודמת
  stats.scores.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    historyList.appendChild(li);
  });

  gameOverScreen.classList.remove("hidden");// הצגת המסך
}
// הסתרת מסך Game Over
function hideGameOverScreen() {
  gameOverScreen.classList.add("hidden");
}