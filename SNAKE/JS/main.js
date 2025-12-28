

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

document.getElementById('resetStatsBtn').addEventListener('click', () => {
    // 1. מי המשתמש שרוצה לאפס?
    const currentUser = localStorage.getItem("currentUserEmail");
    if (!currentUser) return;

    // 2. שליפת כל הטבלה
    const allData = localStorage.getItem("snakeStats");
    if (!allData) return;

    let statsTable = JSON.parse(allData);

    // 3. איפוס הנתונים רק עבור המשתמש הזה
    statsTable[currentUser] = { scores: [], highScore: 0 };

    // 4. שמירה חזרה ל-LocalStorage
    localStorage.setItem("snakeStats", JSON.stringify(statsTable));

    // 5. עדכון ה-UI מיד כדי שהמשתמש יראה שהתאפס
    document.getElementById('highScoreDisplay').innerText = "High score: 0";
    document.getElementById('scoreHistory').innerHTML = ""; // מנקה את רשימת המשחקים האחרונים
    if(document.getElementById('highScoreFinal')) {
        document.getElementById('highScoreFinal').innerText = "0";
    }

    alert("הסטטיסטיקה שלך אופסה בהצלחה!");
});