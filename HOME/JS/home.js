// function updateDashboard() {
//     const currentUserEmail = localStorage.getItem('currentUserEmail');
//     if (!currentUserEmail) return;

//     // --- 1. עדכון טופ 3 לסנייק ---
//     const allSnakeStats = JSON.parse(localStorage.getItem('snakeStats')) || {};
    
//     // הפיכת האובייקט למערך של {email, score} כדי שנוכל למיין
//     let snakeList = Object.keys(allSnakeStats).map(email => ({
//         email: email,
//         score: allSnakeStats[email].highScore || 0
//     }));

//     // מיון מהגבוה לנמוך
//     snakeList.sort((a, b) => b.score - a.score);

//     // בניית הטקסט לתצוגה (טופ 2 + המשתמש הנוכחי)
//     document.getElementById('snakeStats').innerText = generateTop3Text(snakeList, currentUserEmail, "נקודות");

//     // --- 2. עדכון טופ 3 למשחק הזיכרון (לפי רמות) ---
//     const allMemoryStats = JSON.parse(localStorage.getItem('memoryGameScores')) || {};
//     const levels = [12, 18, 24];
//     const levelIds = { 12: 'best-easy', 18: 'best-medium', 24: 'best-hard' };

//     levels.forEach(level => {
//         let memoryList = Object.keys(allMemoryStats).map(email => ({
//             email: email,
//             score: allMemoryStats[email][level] || Infinity // בזיכרון זמן נמוך זה טוב יותר
//         })).filter(item => item.score !== Infinity); // סינון מי שמעולם לא שיחק ברמה הזו

//         // מיון מהזמן המהיר ביותר לאיטי ביותר
//         memoryList.sort((a, b) => a.score - b.score);

//         const element = document.getElementById(levelIds[level]);
//         if (element) {
//             element.innerText = generateTop3Text(memoryList, currentUserEmail, "", true);
//         }
//     });
// }

// // פונקציית עזר לבניית הטקסט של הטופ 3
// function generateTop3Text(sortedList, currentUserEmail, unit, isTime = false) {
//     // לקיחת 2 הראשונים
//     let top2 = sortedList.slice(0, 2);
    
//     // מציאת המיקום של המשתמש הנוכחי
//     let userRank = sortedList.findIndex(item => item.email === currentUserEmail);
//     let userItem = sortedList[userRank];

//     let result = [];
    
//     // הוספת 2 הראשונים לרשימה
//     top2.forEach((item, index) => {
//         let displayScore = isTime ? formatTime(item.score) : item.score;
//         let name = item.email === currentUserEmail ? "את/ה" : item.email.split('@')[0];
//         result.push(`${index + 1}. ${name} (${displayScore}${unit})`);
//     });

//     // אם המשתמש הנוכחי לא בטופ 2, נוסיף אותו במיוחד עם המיקום שלו
//     if (userRank > 1) {
//         let displayScore = isTime ? formatTime(userItem.score) : userItem.score;
//         result.push(`... ${userRank + 1}. את/ה (${displayScore}${unit})`);
//     } else if (userRank === -1) {
//         result.push(`... את/ה: טרם שיחקת`);
//     }

//     return result.join(" | ");
// }
function toggleRank(gameType) {
    const container = document.getElementById(`${gameType}-rank-list`);
    const isOpen = container.classList.toggle('open');
    
    if (isOpen) {
        renderRankList(gameType);
    }
}

function renderRankList(gameType) {
    const container = document.getElementById(`${gameType}-rank-list`);
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    let html = "";

    if (gameType === 'snake') {
        const stats = JSON.parse(localStorage.getItem('snakeStats')) || {};
        const sorted = Object.keys(stats)
            .map(email => ({ email, score: stats[email].highScore }))
            .sort((a, b) => b.score - a.score);
            
        html = buildListHTML(sorted, currentUserEmail, "נק'");
    } else {
        // בזיכרון נציג את הרמה הבינונית (18) כדוגמה לדירוג כללי
        const stats = JSON.parse(localStorage.getItem('memoryGameScores')) || {};
        const sorted = Object.keys(stats)
            .map(email => ({ email, score: stats[email][18] || Infinity }))
            .filter(item => item.score !== Infinity)
            .sort((a, b) => a.score - b.score);
            
        html = "<strong>דירוג רמה בינונית:</strong><br>" + buildListHTML(sorted, currentUserEmail, "", true);
    }

    container.innerHTML = html;
}

function buildListHTML(list, currentEmail, unit, isTime = false) {
    const top2 = list.slice(0, 2);
    const userRank = list.findIndex(i => i.email === currentEmail);
    let items = [];

    top2.forEach((item, i) => {
        const val = isTime ? formatTime(item.score) : item.score;
        const isMe = item.email === currentEmail;
        items.push(`<div class="rank-entry ${isMe ? 'current-user' : ''}">
            <span>${i + 1}. ${isMe ? 'את/ה' : item.email.split('@')[0]}</span>
            <span>${val} ${unit}</span>
        </div>`);
    });

    if (userRank > 1) {
        const val = isTime ? formatTime(list[userRank].score) : list[userRank].score;
        items.push(`<div style="text-align:center">...</div>`);
        items.push(`<div class="rank-entry current-user">
            <span>${userRank + 1}. את/ה</span>
            <span>${val} ${unit}</span>
        </div>`);
    }

    return items.length > 0 ? items.join('') : "אין נתונים עדיין";
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
