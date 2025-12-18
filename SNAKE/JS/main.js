

onGameOver = function (score) {
  saveScore(score);
  showGameOverScreen(score);
};




document.getElementById("playAgainBtn")
  .addEventListener("click", () => {
    hideGameOverScreen();
    resetGame();   // מאפס נחש, אוכל, ניקוד
    startGame();
  });


document.getElementById("resetStatsBtn")
  .addEventListener("click", () => {
    resetStats();
    hideGameOverScreen();
    resetGame();
    startGame();
  });
