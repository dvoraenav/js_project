function updateDashboard() {
    // 1. שליפת המייל של המשתמש המחובר
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    
    // אם אין משתמש מחובר (למשל נכנסו לדף ישירות בלי לוגין), אפשר להפסיק כאן
    if (!currentUserEmail) {
        console.log("No user is logged in");
        return;
    }

    // --- עדכון שיא סנייק ---
    const allSnakeStats = JSON.parse(localStorage.getItem('snakeStats')) || {};
    // שליפת הנתונים של היוזר הנוכחי מתוך האובייקט הגדול
    const userSnakeData = allSnakeStats[currentUserEmail] || { highScore: 0 };
    document.getElementById('snakeStats').innerText = userSnakeData.highScore + " נקודות";

    // --- עדכון שיאי משחק הזיכרון ---
    const allMemoryStats = JSON.parse(localStorage.getItem('memoryGameScores')) || {};
    // שליפת הנתונים של היוזר הנוכחי מתוך אובייקט הזיכרון
    const userMemoryScores = allMemoryStats[currentUserEmail] || {};

    // הצגת שיא רמה קלה (12)
    document.getElementById('best-easy').innerText = userMemoryScores[12] 
        ? formatTime(userMemoryScores[12]) 
        : "--:--";

    // הצגת שיא רמה בינונית (18)
    document.getElementById('best-medium').innerText = userMemoryScores[18] 
        ? formatTime(userMemoryScores[18]) 
        : "--:--";

    // הצגת שיא רמה קשה (24)
    document.getElementById('best-hard').innerText = userMemoryScores[24] 
        ? formatTime(userMemoryScores[24]) 
        : "--:--";
}


function showOops() {
    alert("אופס! החלק הזה עדיין בפיתוח... 🛠️");
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    // שימוש ב-padStart מוסיף 0 אם המספר קטן מ-10
    const displayMinutes = String(minutes).padStart(2, '0');
    const displaySeconds = String(seconds).padStart(2, '0');
    
    return `${displayMinutes}:${displaySeconds}`;
}
window.addEventListener("load", () => {
    // 1. שליפת המייל ששמרנו בזמן ההתחברות
    const userEmail = localStorage.getItem("currentUserEmail");
    const welcomeElement = document.getElementById("welcomeUser");

    if (userEmail && welcomeElement) {
        // 2. חיתוך המייל כדי לקבל רק את השם לפני ה-@ (אופציונלי)
        const userName = userEmail.split('@')[0];
        
        // 3. עדכון התצוגה
        welcomeElement.innerText = `שלום, ${userName}! 👋`;
    }
});
// בדיקה שרצה כל דקה כדי לראות אם העוגייה פגה
setInterval(() => {
    const hasCookie = document.cookie.includes("isLoggedIn=true");
    if (!hasCookie && localStorage.getItem("token")) {
        console.log("החיבור פג - מנתק עכשיו...");
        localStorage.removeItem("token");
        localStorage.removeItem("currentUserEmail");
        // alert("החיבור שלך פג, אנא התחבר שוב.");
        window.location.href = "/LOGIN/login.html";
    }
}, 60000); // 60,000 מילישניות = דקה אחת
// קריאה לפונקציה בטעינת העמוד
window.onload = updateDashboard;
