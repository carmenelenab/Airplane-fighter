const airplane = document.querySelector('.airplane');
const gameBoard = document.querySelector('.gameBoard');
const gameBoardWidth = gameBoard.clientWidth;
const airplaneWidth = airplane.offsetWidth;

let moveBy = 10;
let airplaneLeft;
let avoidedObjects = 0;
let gameOver = false;

window.addEventListener('load', () => {
    setInitialPosition();
    startTimer();
});

function setInitialPosition() {
    airplaneLeft = (gameBoardWidth - airplaneWidth) / 2;
    airplane.style.position = 'absolute';
    airplane.style.left = airplaneLeft + 'px';
}

let timerElement = document.getElementById('timer');
let seconds = 0;
let minutes = 0;
let timerInterval;

function startTimer() {
    timerInterval = setInterval(() => {
        ++seconds;
        if (seconds === 60) {
            seconds = 0;
            ++minutes;
        }
    }, 1000) // Update timer every second
}

//listening the keydown events
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            if (airplaneLeft > 0) {
                airplaneLeft -= moveBy;
                airplaneLeft = Math.max(airplaneLeft, 0);
                airplane.style.left = airplaneLeft + 'px';
            }
            break;
        case 'ArrowRight':
            if (airplaneLeft + airplaneWidth < gameBoardWidth) {
                airplaneLeft += moveBy;
                let maxRightPosition = gameBoardWidth - airplaneWidth;
                airplaneLeft = Math.min(airplaneLeft, maxRightPosition);
                airplane.style.left = airplaneLeft + 'px';
            }
            break;
    }
});

function generateFallingObject() {
    if (gameOver) {
        return;
    }
    // Create a new div element for the falling object
    let fallingObject = document.createElement('div');
    fallingObject.classList.add('fallingObject');

    // Randomize the width(between 20 and 70 pixels) and position of the falling object
    let objectWidth = Math.floor(Math.random() * 50) + 20;
    let objectLeft = Math.floor(Math.random() * (gameBoard.offsetWidth - objectWidth)); // Random left position within the game board

    // Apply styles to the falling object
    fallingObject.style.width = objectWidth + 'px';
    fallingObject.style.height = '20px'; // Adjust height as needed
    fallingObject.style.backgroundColor = 'green'; // Adjust color as needed
    fallingObject.style.position = 'absolute';
    fallingObject.style.left = objectLeft + 'px';
    fallingObject.style.top = '0px'; // Start from above the game board

    // Append the falling object to the game board
    gameBoard.appendChild(fallingObject);

    // Animate the falling object
    let fallInterval = setInterval(() => {
        let topPosition = parseInt(fallingObject.style.top);
        let bottomPosition = topPosition + fallingObject.offsetHeight;
        if (bottomPosition < gameBoard.offsetHeight) {
            fallingObject.style.top = (topPosition + 5) + 'px'; // Adjust speed as needed
        } else {
            clearInterval(fallInterval);
            gameBoard.removeChild(fallingObject); // Remove the falling object when it reaches the bottom
            if (!gameOver) {
                ++avoidedObjects;
                console.log(avoidedObjects);
            }
        }
    }, 60); // Adjust interval as needed
}

// Call function at regular intervals to generate falling objects
let objectInterval = setInterval(generateFallingObject, 2000); // Adjust interval as need

function checkCollision() {
    let airplaneRect = airplane.getBoundingClientRect(); // Get the position and size of the airplane
    // Loop through all falling objects
    document.querySelectorAll('.fallingObject').forEach((fallingObject) => {
        let fallingObjectRect = fallingObject.getBoundingClientRect(); // Get the position and size of the falling object

        // Check for collision
        if (fallingObjectRect.left < airplaneRect.right &&
            fallingObjectRect.right > airplaneRect.left &&
            fallingObjectRect.top < airplaneRect.bottom &&
            fallingObjectRect.bottom > airplaneRect.top) {
            // Collision detected
            gameOver = true;
            clearInterval(objectInterval);
            clearInterval(timerInterval);
            isGameOver();
        }
    });
}

setInterval(checkCollision, 100); // Check for collision every 100 milliseconds

function isGameOver() {
    let score = document.getElementById('score');
    document.getElementById("game-over").style.display = "block";
    timerElement.textContent = "Time Survived: " + minutes + " minutes " + seconds + " seconds";
    score.textContent = "Avoided Objects: " + avoidedObjects;
}

function refresh() {
    window.location.reload();
}