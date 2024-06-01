const airplane = document.querySelector('.airplane');
const gameBoard = document.querySelector('.gameBoard');
const gameBoardWidth = gameBoard.clientWidth;
const airplaneWidth = airplane.offsetWidth;
const objectImages = ['object1', 'object2', 'object3', 'object4'];
const columns = 13;

const MOVE_BY = 10;
const ONE_SECOND_INTERVAL = 1000;
const COLLISION_CHECK_INTERVAL = 100;
const FALLING_OBJECT_INTEVAL = 2000;
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

function generateFallingObject() {
    if (gameOver) {
        return;
    }
    // Create a new div element for the falling object
    let fallingObject = document.createElement('div');
    fallingObject.classList.add('fallingObject');

    let randomImage =
        `object${Math.floor(Math.random() * objectImages.length) + 1}`;
    fallingObject.classList.add(randomImage);
    const randomColumn = Math.floor(Math.random() * columns);
    const columnClass = `column-${randomColumn}`;
    fallingObject.classList.add(columnClass);

    // Append the falling object to the game board
    console.log('Adding falling object:', fallingObject);
    gameBoard.appendChild(fallingObject);
    // animateFallingObjects(fallingObject);
}

document.addEventListener('animationiteration', function (event) {
    if (event.animationName === 'fall') {
        const fallingObject = event.target;
        gameBoard.removeChild(fallingObject);
        if (!gameOver) {
            ++avoidedObjects;
            console.log(avoidedObjects);
        }
    }
});

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