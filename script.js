const airplane = document.querySelector('.airplane');
const gameBoard = document.querySelector('.gameBoard');
const gameBoardWidth = gameBoard.clientWidth;
const airplaneWidth = airplane.offsetWidth;

const MOVE_BY = 10;
const SPEED_ADJUSTMENT = 5;
const ONE_SECOND_INTERVAL = 1000;
const COLLISION_CHECK_INTERVAL = 100;
const FALLING_CHECK_INTERVAL = 60;
const FALLING_OBJECT_INTEVAL = 2000;
const FALLING_OBJECT_WIDTH = 65;
const ONE_MINUTE = 60;

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
        if (seconds === ONE_MINUTE) {
            seconds = 0;
            ++minutes;
        }
    }, ONE_SECOND_INTERVAL)
}

//listening the keydown events
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        if (airplaneLeft > 0) {
            airplaneLeft -= MOVE_BY;
            airplaneLeft = Math.max(airplaneLeft, 0);
            airplane.style.left = airplaneLeft + 'px';
        }
    } else if (e.key === 'ArrowRight') {
        if (airplaneLeft + airplaneWidth < gameBoardWidth) {
            airplaneLeft += MOVE_BY;
            let maxRightPosition = gameBoardWidth - airplaneWidth;
            airplaneLeft = Math.min(airplaneLeft, maxRightPosition);
            airplane.style.left = airplaneLeft + 'px';
        }
    }
});

const objectImages = [
    'images/object1.png',
    'images/object2.png',
    'images/object3.png',
    'images/object4.png',
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
    const columns = Math.floor(gameBoardWidth / FALLING_OBJECT_WIDTH);
    const randomColumn = Math.floor(Math.random() * columns);
    const objectLeft = randomColumn * FALLING_OBJECT_WIDTH;

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
            fallingObject.style.top = (topPosition + SPEED_ADJUSTMENT) + 'px';
        } else {
            clearInterval(fallInterval);
            // Remove the falling object when it reaches the bottom
            gameBoard.removeChild(fallingObject);
            if (!gameOver) {
                ++avoidedObjects;
                console.log(avoidedObjects);
            }
        }
    }, FALLING_CHECK_INTERVAL);
}

// Call function at regular intervals to generate falling objects
// Adjust interval as need
let objectInterval = setInterval(generateFallingObject, FALLING_OBJECT_INTEVAL);

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

setInterval(checkCollision, COLLISION_CHECK_INTERVAL);

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