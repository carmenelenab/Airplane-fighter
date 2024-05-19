const airplane = document.querySelector('.airplane');
const gameBoard = document.querySelector('.gameBoard');
const gameBoardWidth = gameBoard.clientWidth;
const airplaneWidth = airplane.offsetWidth;

let moveBy = 10;
let airplaneLeft;
let avoidedObjects = 0;
let gameOver = false;

const HOUR = 60;

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
        if (seconds === HOUR) {
            seconds = 0;
            ++minutes;
        }
    }, 1000) // Update timer every second
}

//listening the keydown events
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        if (airplaneLeft > 0) {
            airplaneLeft -= moveBy;
            airplaneLeft = Math.max(airplaneLeft, 0);
            airplane.style.left = airplaneLeft + 'px';
        }
    } else if (e.key === 'ArrowRight') {
        if (airplaneLeft + airplaneWidth < gameBoardWidth) {
            airplaneLeft += moveBy;
            let maxRightPosition = gameBoardWidth - airplaneWidth;
            airplaneLeft = Math.min(airplaneLeft, maxRightPosition);
            airplane.style.left = airplaneLeft + 'px';
        }
    }
});

const objectImages = [
    'object1.png',
    'object2.png',
    'object3.png',
    'object4.png',
];

function generateFallingObject() {
    if (gameOver) {
        return;
    }
    // Create a new div element for the falling object
    let fallingObject = document.createElement('div');
    fallingObject.classList.add('fallingObject');

    let randomImage =
        objectImages[Math.floor(Math.random() * objectImages.length)];
    const objectWidth = 65;
    const columns = Math.floor(gameBoardWidth / objectWidth);
    const randomColumn = Math.floor(Math.random() * columns);
    const objectLeft = randomColumn * objectWidth;

    // Apply styles to the falling object
    fallingObject.style.backgroundImage = `url(${randomImage})`;
    fallingObject.style.backgroundSize = 'cover';
    fallingObject.style.left = objectLeft + 'px';
    fallingObject.style.top = '0px'; // Start from above the game board

    // Append the falling object to the game board
    console.log('Adding falling object:', fallingObject);
    gameBoard.appendChild(fallingObject);

    // Animate the falling object
    let fallInterval = setInterval(() => {
        let topPosition = parseInt(fallingObject.style.top);
        let bottomPosition = topPosition + fallingObject.offsetHeight;
        if (bottomPosition < gameBoard.offsetHeight) {
            // Adjust speed as needed
            fallingObject.style.top = (topPosition + 5) + 'px';
        } else {
            clearInterval(fallInterval);
            // Remove the falling object when it reaches the bottom
            gameBoard.removeChild(fallingObject);
            if (!gameOver) {
                ++avoidedObjects;
                console.log(avoidedObjects);
            }
        }
    }, 60); // Adjust interval as needed
}

// Call function at regular intervals to generate falling objects
// Adjust interval as need
let objectInterval = setInterval(generateFallingObject, 2000);

function checkCollision() {
    // Get the position and size of the airplane
    let airplaneRect = airplane.getBoundingClientRect();
    // Loop through all falling objects
    document.querySelectorAll('.fallingObject').forEach((fallingObject) => {
        // Get the position and size of the falling object
        let fallingObjectRect = fallingObject.getBoundingClientRect();

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
    timerElement.textContent =
        "Time Survived: " + minutes + " minutes " + seconds + " seconds";
    score.textContent = "Avoided Objects: " + avoidedObjects;
}

function refresh() {
    window.location.reload();
}