let flippedCards = [];
let timerInterval;
let secondsElapsed = 0;

function startGame(numCards, columns, event) {
    // הסתרת מסך הפתיחה
    document.getElementById('startScreen').classList.add('hidden-screen');
    
    const board = document.getElementById('game-board');
    const gameInfo = document.getElementById('game-info');
    gameInfo.classList.remove('hidden'); 

    // 1. ניהול נראות הכפתורים
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    if (event) {
        event.currentTarget.classList.add('active');
    }

    // איפוס טיימר
    clearInterval(timerInterval); 
    secondsElapsed = 0;
    document.getElementById('timer').innerText = "00:00";
    
    // הפעלת טיימר חדש
    startTimer();

    // 2. איפוס הלוח והמשתנים
    board.innerHTML = ''; 
    flippedCards = []; 

    // משיכת השיאים מהזיכרון
    const bestTimes = JSON.parse(localStorage.getItem('memoryGameScores')) || {};
    const bestScoreElement = document.getElementById('best-score');

    // בדיקה אם קיים שיא לרמה הנוכחית
    if (bestTimes[numCards]) {
        const bMins = Math.floor(bestTimes[numCards] / 60);
        const bSecs = bestTimes[numCards] % 60;
        const timeDisplay = bMins > 0 ? `${bMins}:${bSecs.toString().padStart(2, '0')}` : `${bSecs} שניות`;
        bestScoreElement.innerText = timeDisplay;
    } else {
        bestScoreElement.innerText = "--:--";
    }

    // 3. הגדרת מבנה הלוח
    board.style.gridTemplateColumns = `repeat(${columns}, 80px)`;

    // 4. מאגר תמונות
    const animalImages = [
        '/IMG/animal1.png', '/IMG/animal2.png', '/IMG/animal3.png', '/IMG/animal4.png',
        '/IMG/animal5.png', '/IMG/animal6.png', '/IMG/animal7.png', '/IMG/animal8.png',
        '/IMG/animal9.png', '/IMG/animal10.png', '/IMG/animal11.png', '/IMG/animal12.png',
        '/IMG/animal13.png', '/IMG/animal14.png', '/IMG/animal15.png', '/IMG/animal16.png',    
        '/IMG/animal17.png', '/IMG/animal18.png', '/IMG/animal19.png', '/IMG/animal20.png',
        '/IMG/animal21.png', '/IMG/animal22.png', '/IMG/animal23.png', '/IMG/animal24.png'    
    ];

    const selectedImages = animalImages.slice(0, numCards / 2);
    let gameValues = [...selectedImages, ...selectedImages];
    gameValues.sort(() => Math.random() - 0.5);

    // 5. יצירת הקלפים
    gameValues.forEach(imgUrl => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = imgUrl; 
    
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
    if (clickedCard.classList.contains('flipped') || flippedCards.length === 2) return;

    clickedCard.classList.add('flipped');
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 200);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add('match-anim');
        card2.classList.add('match-anim');
        flippedCards = [];

        const totalMatched = document.querySelectorAll('.match-anim').length;
        const totalCards = document.querySelectorAll('.card').length;
        
        if (totalMatched === totalCards) {
            let stage = totalCards === 18 ? "בינוני" : (totalCards === 24 ? "קשה" : "קל");

            clearInterval(timerInterval);

            setTimeout(() => {
                const isNewRecord = updateBestTime(totalCards, secondsElapsed);
                const msgContainer = document.getElementById('success-message');
                const msgText = document.getElementById('message-text');
            
                let recordText = isNewRecord ? " (שיא חדש!)" : "";
                const minutes = Math.floor(secondsElapsed / 60);
                const seconds = secondsElapsed % 60;
                let timeString = minutes > 0 ? `${minutes} דקות ו-${seconds} שניות` : `${seconds} שניות`;
            
                msgText.innerText = `כל הכבוד!
                 סיימת את השלב ה${stage} ב-${timeString}${recordText}, מדהים! 🎉`;
            
                msgContainer.classList.remove('hidden'); 
                msgContainer.classList.add('bounce-in');
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 700);
    }
}

function goToMenu() {
    const successMsg = document.getElementById('success-message');
    successMsg.classList.remove('bounce-in');
    successMsg.classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden-screen');
}

function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const secs = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById('timer').innerText = `${mins}:${secs}`;
    }, 1000);
}

function updateBestTime(numCards, time) {
    let bestTimes = JSON.parse(localStorage.getItem('memoryGameScores')) || {};
    if (!bestTimes[numCards] || time < bestTimes[numCards]) {
        bestTimes[numCards] = time;
        localStorage.setItem('memoryGameScores', JSON.stringify(bestTimes));
        return true; 
    }
    return false;
}