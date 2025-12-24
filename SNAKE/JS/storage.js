// מחזירה את נתוני המשחק מה־Local Storage
// אם אין נתונים שמורים – מחזירה ערכי ברירת מחדל
function getStats() {
  const data = localStorage.getItem("snakeStats");

  // אם יש נתונים – מפענחים JSON
  // אחרת מחזירים אובייקט ריק עם ערכי התחלה
  return data
    ? JSON.parse(data)
    : { scores: [], highScore: 0 };
}
// שומר אובייקט סטטיסטיקות בלוקל סטורג'
function saveStats(stats) {
  localStorage.setItem("snakeStats", JSON.stringify(stats));
}
// שומר ניקוד של משחק שהסתיים
// מוסיף להיסטוריה, מגביל ל־3 משחקים ומעדכן שיא
function saveScore(score) {
  const stats = getStats();

 // שומרים רק את 3 המשחקים האחרונים
  stats.scores.unshift(score);
  if (stats.scores.length > 3) {
    stats.scores.pop();
  }

  // אם הניקוד גבוה מהשיא – מעדכנים
  if (score > stats.highScore) {
    stats.highScore = score;
  }
  
  // שמירה מחודשת בלוקל סטורג'
  saveStats(stats);
}
// מאפס את כל הנתונים השמורים (היסטוריה + שיא)
function resetStats() {
  localStorage.removeItem("snakeStats");
}
