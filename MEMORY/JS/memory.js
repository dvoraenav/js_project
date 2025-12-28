let flippedCards = []; //cards currently flipped
let timerInterval; // timer interval
let secondsElapsed = 0; // time elapsed in seconds

function startGame(numCards, columns) {
    
    document.getElementById('startScreen').classList.add('hidden-screen'); //hide start screen (add hidden to start screen)
    
    const board = document.getElementById('game-board'); //from memory.html
    const gameInfo = document.getElementById('game-info'); //from memory.html

    clearInterval(timerInterval);  //stop previous timer if any
    secondsElapsed = 0; // reset time
    document.getElementById('timer').innerText = "00:00"; //write 00:00 to timer display
    
    startTimer(); // start new timer

    board.innerHTML = '';  //clear previous board
    flippedCards = []; // reset flipped cards

            // 1. שליפת המייל של המשתמש המחובר
    const currentUser = localStorage.getItem('currentUserEmail');

        // 2. שליפת כל טבלת השיאים של כל המשתמשים
    const allMemoryStats = JSON.parse(localStorage.getItem('memoryGameScores')) || {};

        // 3. שליפת השיאים הספציפיים רק של היוזר הזה
    const bestTimes = allMemoryStats[currentUser] || {}; //translate from local storage Json to string
    const bestScoreElement = document.getElementById('best-score'); //from memory.html

    if (bestTimes[numCards]) { // if there is a best time for this level
        const bMins = Math.floor(bestTimes[numCards] / 60);
        const bSecs = bestTimes[numCards] % 60;
        const timeDisplay = bMins > 0 ? `${bMins}:${bSecs.toString().padStart(2, '0')}` : `${bSecs} שניות`; // format time display,
        // padStart(2, '0') for adding zero if there just one number
        bestScoreElement.innerText = timeDisplay; // display best time in the best score element
    } else {
        bestScoreElement.innerText = "--:--"; // no best time yet
    }

    board.style.gridTemplateColumns = `repeat(${columns}, 80px)`; //calling to grid-template-columns in memory.css 
    //to set number of columns, reapet it the number of the columns, 80px width each

    const animalImages = [ //array of animal images
        '/IMG/animal1.png', '/IMG/animal2.png', '/IMG/animal3.png', '/IMG/animal4.png',
        '/IMG/animal5.png', '/IMG/animal6.png', '/IMG/animal7.png', '/IMG/animal8.png',
        '/IMG/animal9.png', '/IMG/animal10.png', '/IMG/animal11.png', '/IMG/animal12.png',
        '/IMG/animal13.png', '/IMG/animal14.png', '/IMG/animal15.png', '/IMG/animal16.png',    
        '/IMG/animal17.png', '/IMG/animal18.png', '/IMG/animal19.png', '/IMG/animal20.png',
        '/IMG/animal21.png', '/IMG/animal22.png', '/IMG/animal23.png', '/IMG/animal24.png'    
    ];

    const selectedImages = animalImages.slice(0, numCards / 2); //select half the number of images from the array.each image appears twice
    let gameValues = [...selectedImages, ...selectedImages]; //create pairs by duplicating the selected images
    gameValues.sort(() => Math.random() - 0.5); //shuffle the array randomly

    gameValues.forEach(imgUrl => {
        const card = document.createElement('div'); //create a div for each card
        card.classList.add('card'); //add class card to the div
        card.dataset.value = imgUrl; //set value to the image URL for matching
    
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-back">?</div>
                <div class="card-front">
                    <img src="${imgUrl}" alt="animal" class="card-img">
                </div>
            </div>
        `; //card structure with front and back sides
    
        card.addEventListener('click', onCardClick); 
        board.appendChild(card); //add card to the game board
    });
}

function onCardClick(e) {
    const clickedCard = e.currentTarget; //the element that was clicked
    if (clickedCard.classList.contains('flipped') || flippedCards.length === 2) return; 
        //ignore if already flipped or two cards are already flipped

    clickedCard.classList.add('flipped'); 
    flippedCards.push(clickedCard); //add the clicked card to the flipped cards array

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 200); //check for match after a short delay to allow user to see the second card
    }
    //if its worng, it will flip back in checkMatch function 
}

function checkMatch() {
    const [card1, card2] = flippedCards; 

    if (card1.dataset.value === card2.dataset.value) { //if the data values match
        card1.classList.add('match-anim'); //we found a match, add match animation class
        card2.classList.add('match-anim'); //here to
        flippedCards = []; //reset flipped cards array

        const totalMatched = document.querySelectorAll('.match-anim').length; //count matched cards
        const totalCards = document.querySelectorAll('.card').length; //total cards on board
        
        if (totalMatched === totalCards) { //if all cards are matched, game over, then-
            let stage = totalCards === 18 ? "בינוני" : (totalCards === 24 ? "קשה" : "קל"); //the current stage

            setTimeout(() => {
                const isNewRecord = updateBestTime(totalCards, secondsElapsed); //update best time
                const msgContainer = document.getElementById('success-message');
                const msgText = document.getElementById('message-text');
            
                let recordText = isNewRecord ? " (שיא חדש!)" : "";
                const minutes = Math.floor(secondsElapsed / 60);
                const seconds = secondsElapsed % 60;
                let timeString = minutes > 0 ? `${minutes} דקות ו-${seconds} שניות` : `${seconds} שניות`;
            
                msgText.innerText = `כל הכבוד!
                 סיימת את השלב ה${stage} ב-${timeString}${recordText}, מדהים! 🎉`;
            
                msgContainer.classList.remove('hidden'); 
            }, 500);
            //after 0.5 second delay, show success message with time and record info
        }
    } else { //if not a match
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 700); //flip back after 0.7 second delay
    }
}

function goToMenu() {
    const successMsg = document.getElementById('success-message'); 
    successMsg.classList.add('hidden'); //hide success message
    document.getElementById('startScreen').classList.remove('hidden-screen'); //show start screen
}

function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const secs = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById('timer').innerText = `${mins}:${secs}`; //update timer display
    }, 1000); //update every second (1000 milliseconds)
}

function updateBestTime(numCards, time) {
    const currentUser = localStorage.getItem('currentUserEmail'); 
    if (!currentUser) return false;

    let allMemoryStats = JSON.parse(localStorage.getItem('memoryGameScores')) || {};

   
    let userTimes = allMemoryStats[currentUser] || {};

    if (!userTimes[numCards] || time < userTimes[numCards]) {
        userTimes[numCards] = time;
        
       
        allMemoryStats[currentUser] = userTimes; 
        
        localStorage.setItem('memoryGameScores', JSON.stringify(allMemoryStats));
        return true; 
    }
    return false;
}