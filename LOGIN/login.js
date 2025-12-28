
const tabs = document.querySelectorAll(".tab");
const forms = document.querySelectorAll(".form");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

/**
 * פונקציה להצגת הודעות בתוך הטופס
 */
// פונקציית עזר להצגת הודעות על המסך
function displayFeedback(elementId, text, isSuccess) {
    const msgElement = document.getElementById(elementId);
    if (!msgElement) return;

    msgElement.innerText = text;
    msgElement.classList.remove("success", "error");
    msgElement.classList.add(isSuccess ? "success" : "error");

    setTimeout(() => {
        msgElement.innerText = "";
        msgElement.classList.remove("success", "error");
    }, 4000);
}
// ניהול טאבים (התחברות/הרשמה)
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        forms.forEach(f => f.classList.remove("active"));
        tab.classList.add("active");
        const targetId = tab.getAttribute("data-target");
        document.getElementById(targetId).classList.add("active");
    });
});

// לוגיקת הרשמה
// לוגיקת הרשמה עם אימות סיסמה
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = registerForm.querySelector('input[type="email"]').value;
    const passwordInputs = registerForm.querySelectorAll('input[type="password"]');
    
    // בדיקה שיש לפחות שני שדות סיסמה (סיסמה ואימות)
    if (passwordInputs.length < 2) {
        displayFeedback("registerMessage", "חסר שדה אימות סיסמה ב-HTML", false);
        return;
    }

    const password = passwordInputs[0].value;
    const confirmPassword = passwordInputs[1].value;

    // כאן מתבצע האימות שביקשת
    if (password !== confirmPassword) {
        displayFeedback("registerMessage", "הסיסמאות אינן תואמות!", false);
        return; // זה מונע מהקוד להמשיך לשמירה
    }


    let users = JSON.parse(localStorage.getItem("users")) || [];

    // 2. בדיקה אם האימייל כבר קיים במערכת
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        displayFeedback("registerMessage", "המשתמש כבר קיים במערכת!", false);
        return;
    }

    // 3. הוספת המשתמש החדש למערך
    users.push({ email: email, password: password });

    // 4. שמירה של המערך המעודכן חזרה ל-LocalStorage
    localStorage.setItem("users", JSON.stringify(users));

    displayFeedback("registerMessage", "נרשמת בהצלחה! יש כרגע " + users.length + " משתמשים.", true);
    displayFeedback("registerMessage", "נרשמת בהצלחה!", true);
});
// לוגיקת התחברות
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = loginForm.querySelector('input[type="email"]').value;
    const passInput = loginForm.querySelector('input[type="password"]').value;
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 2. חיפוש המשתמש המתאים
    const foundUser = users.find(u => u.email === emailInput && u.password === passInput);

   if (foundUser) {
    // 1. יצירת טוקן ועוגייה (נשאר ללא שינוי)
    localStorage.setItem("token", "secret-token-" + Date.now());
    document.cookie = `isLoggedIn=true; max-age=${3 * 60 * 60}; path=/`;
    localStorage.setItem("currentUserEmail",emailInput);
    // 2. הודעת הצלחה על המסך
    displayFeedback("loginMessage", "התחברת בהצלחה! מעביר אותך לדף הבית...", true);

    setTimeout(() => {
        window.location.href = "/HOME/HTML/home.html"; 
    }, 1200);
} else {
    displayFeedback("loginMessage", "אימייל או סיסמה לא נכונים", false);
}
});

// בדיקת חיבור בטעינה
window.addEventListener("load", () => {
    const hasCookie = document.cookie.includes("isLoggedIn=true");
    const hasToken = localStorage.getItem("token");

    if (hasCookie && hasToken) {
        console.log("מחובר.");
    } else {
        localStorage.removeItem("token");
    }
});