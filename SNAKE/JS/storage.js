// מחזירה את הנתונים של המשתמש הספציפי
function getStats() {
  const currentUser = localStorage.getItem("currentUserEmail"); // ודאי שזה נשמר בלוגין!
  const allData = localStorage.getItem("snakeStats");

  // אם אין אף נתון ב-LocalStorage, מחזירים אובייקט ריק התחלתי
  if (!allData) return { scores: [], highScore: 0 };

  const statsTable = JSON.parse(allData);

  // אם המשתמש קיים בטבלה - מחזירים את הנתונים שלו
  // אם הוא משתמש חדש - מחזירים לו ערכים ריקים (Scores ריק ושיא 0)
  return statsTable[currentUser] || { scores: [], highScore: 0 };
}

// שומר את הנתונים תחת המייל של המשתמש
function saveStats(userStats) {
  const currentUser = localStorage.getItem("currentUserEmail");
  if (!currentUser) return; // הגנה למקרה שלא מחוברים

  // שליפת כל הטבלה הקיימת או יצירת אחת חדשה
  const allData = localStorage.getItem("snakeStats");
  const statsTable = allData ? JSON.parse(allData) : {};

  // הוספת/עדכון הנתונים תחת המפתח של המייל
  statsTable[currentUser] = userStats;

  // שמירה של כל ה-Object חזרה ל-LocalStorage
  localStorage.setItem("snakeStats", JSON.stringify(statsTable));
}

// פונקציית העזר לשמירת הניקוד בסוף משחק
function saveScore(score) {
  const stats = getStats(); // מקבלת אוטומטית את של המשתמש הנוכחי

  stats.scores.unshift(score);
  if (stats.scores.length > 3) stats.scores.pop();

  if (score > stats.highScore) {
    stats.highScore = score;
  }
  
  saveStats(stats); // שומרת תחת המייל שלו
}