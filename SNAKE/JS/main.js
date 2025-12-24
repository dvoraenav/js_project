

// Callback שמופעל כשהמשחק נגמר
// אחראי על שמירת ניקוד והצגת מסך Game Over
onGameOver = function (score) {
  saveScore(score);
  showGameOverScreen(score);
};


// כפתור "Play Again"
// מתחיל משחק חדש בלי למחוק סטטיסטיקות
document.getElementById("playAgainBtn")
  .addEventListener("click", () => {
    hideGameOverScreen();
    resetGame();   // מאפס נחש, אוכל, ניקוד
    startGame();
  });

// כפתור "Reset Stats"
// מוחק סטטיסטיקות ומתחיל משחק חדש

document.getElementById("resetStatsBtn")
  .addEventListener("click", () => {
    resetStats();
    hideGameOverScreen();
    resetGame();
    startGame();
  });
