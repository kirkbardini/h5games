const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

let basket = { x: 175, y: 450, width: 50, height: 20, speed: 20 };
let apples = [];
let score = 0;
let gameOver = false;
let gameStarted = false; // New flag to track if game has started

// Display game instructions before countdown
function showInstructions() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Use LEFT and RIGHT arrow keys", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("to move the basket.", canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText("Game starts in 3...", canvas.width / 2, canvas.height / 2 + 50);
}

// Countdown before the game starts
function startCountdown() {
    let countdown = 3;
    showInstructions();

    let countdownInterval = setInterval(() => {
        ctx.clearRect(0, canvas.height / 2 + 30, canvas.width, 40);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`Game starts in ${countdown}...`, canvas.width / 2, canvas.height / 2 + 50);

        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval);
            startGame(); // Start game properly
        }
    }, 1000);
}

function drawBasket() {
    ctx.fillStyle = "brown";
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawApples() {
    ctx.fillStyle = "red";
    apples.forEach(apple => {
        ctx.beginPath();
        ctx.arc(apple.x, apple.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });
}

function moveApples() {
    apples.forEach(apple => apple.y += 3);
    apples = apples.filter(apple => {
        if (apple.y > canvas.height) {
            score--;
            if (score < 0) {
                gameOver = true;
            }
            return false;
        }
        return true;
    });
}

function detectCollision() {
    apples.forEach((apple, index) => {
        if (
            apple.y + 10 >= basket.y &&
            apple.x > basket.x &&
            apple.x < basket.x + basket.width
        ) {
            apples.splice(index, 1);
            score++;
        }
    });
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "center"; // CENTER ALIGN
    ctx.fillText("Score: " + score, canvas.width / 2, 30); // CENTERED POSITION
}


function spawnApple() {
    if (!gameOver) {
        apples.push({ x: Math.random() * 400, y: 0 });
        setTimeout(spawnApple, 1000);
    }
}

function gameLoop() {
    if (!gameStarted) return; // Ensure the game only runs when started
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBasket();
    drawApples();
    drawScore();
    moveApples();
    detectCollision();

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        restartBtn.style.display = "block";
    }
}

function startGame() {
    console.log("Starting Game...");
    gameStarted = true; // Set flag to true
    apples = []; // Reset apples
    score = 0; // Reset score
    gameOver = false; // Reset game over status
    restartBtn.style.display = "none";
    spawnApple();
    gameLoop();
}

function restartGame() {
    basket.x = 175;
    apples = [];
    score = 0;
    gameOver = false;
    restartBtn.style.display = "none";
    startCountdown(); // Restart countdown before the game starts
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && basket.x > 0) {
        basket.x -= basket.speed;
    } else if (event.key === "ArrowRight" && basket.x < canvas.width - basket.width) {
        basket.x += basket.speed;
    }
});

// Called from ads.js after the ad finishes
function resumeGameAfterAd() {
    console.log("Ad finished, starting countdown...");
    document.getElementById("adContainer").style.display = "none"; // Hide ad container
    startCountdown();
}

function pauseGame() {
    gameStarted = false;
    gameOver = true;
}
