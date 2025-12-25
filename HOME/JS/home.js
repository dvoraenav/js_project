function updateDashboard() {

    snakeStats
    // משיכת השיאים מהמחסן (LocalStorage)
    const memoryScores = JSON.parse(localStorage.getItem('memoryGameScores')) || {};
    const snakeScore = JSON.parse(localStorage.getItem('snakeStats')) || {};

    if (snakeScore['highScore']) { 
               document.getElementById('snakeStats').innerText = snakeScore['highScore']+" נקודות";
    } 
   
    // הצגת השיא של רמה "קלה"
    if (memoryScores[12]) {
        document.getElementById('best-easy').innerText = formatTime(memoryScores[12]);
    }

    // הצגת השיא של רמה "בינוני"
    if (memoryScores[18]) {
        document.getElementById('best-medium').innerText = formatTime(memoryScores[18]);
    }   

    // הצגת השיא של רמה "קשה"
    if (memoryScores[24]) {
        document.getElementById('best-hard').innerText = formatTime(memoryScores[24]);
    }
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

// קריאה לפונקציה בטעינת העמוד
window.onload = updateDashboard;