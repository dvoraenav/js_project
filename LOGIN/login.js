const tabs = document.querySelectorAll(".tab");
const forms = document.querySelectorAll(".form");


tabs.forEach(tab => {
  tab.addEventListener("click", () => {

    // 1. הסרת מחלקת active מכל הטאבים ומכל הטפסים
    tabs.forEach(t => t.classList.remove("active"));
    forms.forEach(f => f.classList.remove("active"));

    // 2. הוספת active לטאב שנלחץ
    tab.classList.add("active");

    // 3. התיקון: חילוץ ה-ID של טופס היעד מתוך ה-Attribute
    const targetId = tab.getAttribute("data-target");

    // 4. הצגת הטופס המתאים בעזרת ה-ID שקיבלנו
    document.getElementById(targetId).classList.add("active");
  });
});

// בדיקה מיד עם טעינת הדף
window.addEventListener("load", () => {
    // בודק אם העוגייה שקראנו לה 'isLoggedIn' עדיין קיימת
    const hasCookie = document.cookie.includes("isLoggedIn=true");
    const hasToken = localStorage.getItem("token");

    if (hasCookie && hasToken) {
        console.log("המשתמש מחובר והזמן לא עבר.");
        // אופציונלי: להסתיר את הטפסים אם הוא מחובר
        // document.querySelector(".login-box").style.display = "none";
    } else {
        // אם העוגייה נמחקה ע"י הדפדפן (אחרי 3 שעות) או שלא הייתה קיימת
        localStorage.removeItem("token"); 
        console.log("אין חיבור בתוקף.");
    }
});


// 1. קודם כל מגדירים את המשתנים ומושכים מה-HTML
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// 2. פונקציית הרשמה - שומרת את הנתונים
registerForm.addEventListener("submit", (e) => {
    e.preventDefault(); // מונע מהדף להתרענן ולהציג פרטים ב-URL

    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;

    // שמירה ב-LocalStorage תחת המפתח 'user'
    const userData = { email: email, password: password };
    localStorage.setItem("user", JSON.stringify(userData));

    alert("נרשמת בהצלחה! עכשיו אפשר להתחבר.");
});

// 3. פונקציית התחברות - בודקת מול מה ששמרנו
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = loginForm.querySelector('input[type="email"]').value;
    const passInput = loginForm.querySelector('input[type="password"]').value;

    // שליפת הנתונים ששמרנו בהרשמה
    const savedUser = JSON.parse(localStorage.getItem("user"));

    // בתוך loginForm.addEventListener("submit" ...
if (savedUser && savedUser.email === emailInput && savedUser.password === passInput) {
    
    // 1. יצירת טוקן ב-LocalStorage
    localStorage.setItem("token", "secret-token-" + Date.now());

    // 2. יצירת עוגייה ל-3 שעות (3 שעות = 10800 שניות)
    const THREE_HOURS = 3 * 60 * 60;
    document.cookie = `isLoggedIn=true; max-age=${THREE_HOURS}; path=/`;

    alert("התחברת בהצלחה! החיבור תקף ל-3 שעות.");
    
    // כאן אפשר להוסיף ריענון דף כדי שהבדיקה מלמעלה תרוץ
    location.reload(); 
}
});