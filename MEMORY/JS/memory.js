// פונקציה להפעלת המשחק לפי מספר קלפים
let flippedCards = [];
let score = 0;
let timerInterval;
let secondsElapsed = 0;

function startGame(numCards, columns, event) {
    
    const board = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const gameInfo = document.getElementById('game-info');
    gameInfo.classList.remove('hidden'); //מראה את הניקוד והטיימר

    // 1. ניהול נראות הכפתורים (הדגשת השלב הנבחר)
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    if (event) {
        event.currentTarget.classList.add('active');
    }

    // איפוס טיימר
    clearInterval(timerInterval); // עוצר טיימר קודם אם היה
    secondsElapsed = 0;
    document.getElementById('timer').innerText = "00:00";
    
    // הפעלת טיימר חדש
    startTimer();

    // 2. איפוס הלוח והמשתנים
    board.innerHTML = ''; 
    flippedCards = []; // מערך הקלפים שפתוחים כרגע
    score = 0;
    scoreElement.innerText = score;

    // משיכת השיאים מהזיכרון
    const bestTimes = JSON.parse(localStorage.getItem('memoryGameScores')) || {};
    const bestScoreElement = document.getElementById('best-score');

    // בדיקה אם קיים שיא לרמה הנוכחית
    if (bestTimes[numCards]) {
        const bMins = Math.floor(bestTimes[numCards] / 60);
        const bSecs = bestTimes[numCards] % 60;
        // עיצוב התצוגה של השיא
        const timeDisplay = bMins > 0 ? `${bMins}:${bSecs.toString().padStart(2, '0')}` : `${bSecs} שניות`;
        bestScoreElement.innerText = timeDisplay;
    } else {
        bestScoreElement.innerText = "--:--";
    }

    // 3. הגדרת מבנה הלוח (כמות עמודות)
    board.style.gridTemplateColumns = `repeat(${columns}, 80px)`;

    // 4. מאגר תמונות של חיות
    const animalImages = [
        '/IMG/animal1.png',
        '/IMG/animal2.png',
        '/IMG/animal3.png',
        '/IMG/animal4.png',
        '/IMG/animal5.png',
        '/IMG/animal6.png',
        '/IMG/animal7.png',
        '/IMG/animal8.png',
        '/IMG/animal9.png',
        '/IMG/animal10.png',
        '/IMG/animal11.png',
        '/IMG/animal12.png',
        '/IMG/animal13.png',
        '/IMG/animal14.png',
        '/IMG/animal15.png',
        '/IMG/animal16.png',    
        '/IMG/animal17.png',
        '/IMG/animal18.png',
        '/IMG/animal19.png',
        '/IMG/animal20.png',
        '/IMG/animal21.png',
        '/IMG/animal22.png',
        '/IMG/animal23.png',
        '/IMG/animal24.png'    
    ];

    // 5. בחירת התמונות לרמה הנוכחית ושכפולן לזוגות
    const selectedImages = animalImages.slice(0, numCards / 2);
    let gameValues = [...selectedImages, ...selectedImages];

    // 6. ערבוב הקלפים
    gameValues.sort(() => Math.random() - 0.5);

    // 7. יצירת הקלפים והזרקתם ל-DOM
    gameValues.forEach(imgUrl => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = imgUrl; // נשתמש ב-URL כדי לבדוק התאמה
    
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-back">?</div>
                <div class="card-front">
                    <img src="${imgUrl}" alt="animal" class="card-img">
                </div>
            </div>
        `;
    
        card.addEventListener('click', onCardClick);
        board.appendChild(card);
    });
}

function onCardClick(e) {
    const clickedCard = e.currentTarget;

    if (clickedCard.classList.contains('flipped') || flippedCards.length === 2) {
        return;
    }

    clickedCard.classList.add('flipped');
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 700); // מחכה קצת פחות משנייה לבדיקה
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const msg = document.getElementById('success-message');

    if (card1.dataset.value === card2.dataset.value) {
        // 1. ניקוד
        score += 10;
        document.getElementById('score').innerText = score;

        // 3. הוספת הבהוב (הוא יפסיק לבד אחרי 2 פעימות בגלל ה-CSS)
        card1.classList.add('match-anim');
        card2.classList.add('match-anim');

        // 4. ניקוי המערך כדי שנוכל להמשיך ללחוץ על קלפים אחרים מיד
        flippedCards = [];

      
        // בדיקה אם כל הקלפים נמצאו
        const totalMatched = document.querySelectorAll('.match-anim').length;
        const totalCards = document.querySelectorAll('.card').length;
        
        if (totalMatched === totalCards) {
            clearInterval(timerInterval);

            setTimeout(() => {
                // בדיקה ושמירה של שיא ב-localStorage
                const isNewRecord = updateBestTime(totalCards, secondsElapsed);

                const msg = document.getElementById('success-message');
                let recordText = isNewRecord ? " (שיא חדש!)" : "";

                // יצירת הודעת הזמן (דקות ושניות) כפי שעשינו קודם
                const minutes = Math.floor(secondsElapsed / 60);
                const seconds = secondsElapsed % 60;
                let timeString = minutes > 0 ? `${minutes} דקות ו-${seconds} שניות` : `${seconds} שניות`;
            
                msg.innerText = `כל הכבוד! סיימת ב-${timeString}${recordText}, מדהים! 🎉`;
                msg.classList.remove('hidden');
                msg.classList.add('bounce-in');
            }, 500);
        
        }

    } else {
        // אין התאמה - סגירה אחרי חצי שניה כדי לא לעכב את המשחק
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 700);
    }
}

// פונקציית הטיימר
function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const secs = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById('timer').innerText = `${mins}:${secs}`;
    }, 1000);
}

function updateBestTime(numCards, time) {
    // 1. ננסה להביא את השיאים הקיימים, אם אין - ניצור אובייקט ריק
    let bestTimes = JSON.parse(localStorage.getItem('memoryGameScores')) || {};

    // 2. נבדוק אם אין שיא קודם לרמה הזו, או אם הזמן הנוכחי מהיר יותר
    if (!bestTimes[numCards] || time < bestTimes[numCards]) {
        bestTimes[numCards] = time;
        // 3. שמירה חזרה בזיכרון של הדפדפן
        localStorage.setItem('memoryGameScores', JSON.stringify(bestTimes));
        return true; // החזיר אמת אם נשבר שיא
    }
    return false; // לא נשבר שיא
}