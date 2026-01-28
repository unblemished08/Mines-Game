const gridSize = 5;
let mines = new Set();
let revealed = new Set();
let score = 0;
let gameOn = false;
let timer = 0;
let timerInterval = null;
let soundOn = true;

/* ---------- Sounds ---------- */

const sounds = {
  start: new Audio("sounds/start.mp3"),
  gem: new Audio("sounds/gem.mp3"),
  mine: new Audio("sounds/mine.mp3"),
  win: new Audio("sounds/win.mp3"),
  lose: new Audio("sounds/lose.mp3"),
};

function playSound(type) {
  if (!soundOn) return;
  const sound = sounds[type];
  if (!sound) return;

  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function toggleSound() {
  soundOn = !soundOn;
  document.getElementById("soundBtn").innerText = soundOn ? "🔊" : "🔇";
}

/* ---------- Game Flow ---------- */

function startGame() {
  const mineCount = Number(document.getElementById("mineCount").value);

  if (mineCount < 1 || mineCount >= gridSize * gridSize) {
    setStatus("Invalid number of mines ❌");
    return;
  }

  playSound("start");

  // UI state
  document.getElementById("startBtn").hidden = true;
  document.getElementById("quitBtn").hidden = false;
  document.getElementById("resultBox").classList.add("hidden");

  // Reset state
  stopTimer();
  mines.clear();
  revealed.clear();
  score = 0;
  gameOn = true;

  document.getElementById("grid").innerHTML = "";
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("timer").innerText = "Time: 0s";

  generateMines(mineCount);
  createGrid();
  startTimer();
  setStatus("Game Started 🎯");
}

function quitGame() {
  if (!gameOn) return;
  endGame("Game Quit 🚪", "quit");
}

function restartGame() {
  document.getElementById("resultBox").classList.add("hidden");
  document.getElementById("startBtn").hidden = false;
  document.getElementById("quitBtn").hidden = true;
}

function animateScore(finalScore) {
  const scoreEl = document.getElementById("finalScore");
  let current = 0;

  const interval = setInterval(() => {
    current++;
    scoreEl.innerText = "Final Score: " + current;

    if (current >= finalScore) {
      clearInterval(interval);
    }
  }, 30);
}


/* ---------- End Game ---------- */

function endGame(title, type) {
  gameOn = false;
  stopTimer();
  revealAllMines();

  if (type === "lose") playSound("lose");
  if (type === "win") {
  playSound("win");
  launchConfetti();
}


  const titleEl = document.getElementById("resultTitle");

  if (type === "win") titleEl.style.color = "#22c55e";
  else if (type === "lose") titleEl.style.color = "#ef4444";
  else titleEl.style.color = "#e5e7eb";

  titleEl.innerText = title;

  document.getElementById("finalScore").innerText = "Final Score: 0";
animateScore(score);

  document.getElementById("finalTime").innerText =
    "Time Taken: " + timer + "s";

  const resultBox = document.getElementById("resultBox");

  // 🔁 Reset animation so it plays every time
  resultBox.classList.add("hidden");
  resultBox.style.animation = "none";
  resultBox.offsetHeight; // force reflow
  resultBox.style.animation = "";

  resultBox.classList.remove("hidden");
  document.getElementById("quitBtn").hidden = true;
}


/* ---------- Grid Logic ---------- */

function generateMines(count) {
  while (mines.size !== count) {
    mines.add(Math.floor(Math.random() * gridSize * gridSize));
  }

  console.log(
    "Mines at:",
    Array.from(mines).sort((a, b) => a - b)
  );
}

function createGrid() {
  const grid = document.getElementById("grid");

  for (let i = 0; i < gridSize * gridSize; i++) {
    const btn = document.createElement("button");
    btn.className = "tile";
    btn.innerText = "?";
    btn.onclick = () => handleClick(i, btn);
    grid.appendChild(btn);
  }
}

function handleClick(index, btn) {
  if (!gameOn || revealed.has(index)) return;

  revealed.add(index);
  btn.classList.add("disabled");

  if (mines.has(index)) {
    btn.innerText = "💣";
    btn.classList.add("mine");
    playSound("mine");

    score = 0;
    document.getElementById("score").innerText = "Score: 0";
    setStatus("💥 You hit a mine!");
    endGame("💥 You Lost!", "lose");
  } else {
    btn.innerText = "💎";
    btn.classList.add("gem");
    playSound("gem");

    score++;
    document.getElementById("score").innerText = "Score: " + score;
    setStatus("Safe 💎 Keep going!");

    if (revealed.size === gridSize * gridSize - mines.size) {
      setStatus("🏆 All gems collected!");
      endGame("🏆 You Won!", "win");
    }
  }
}

function revealAllMines() {
  const buttons = document.querySelectorAll(".tile");
  mines.forEach(i => {
    buttons[i].innerText = "💣";
    buttons[i].classList.add("mine", "disabled");
  });
}

/* ---------- Helpers ---------- */

function setStatus(msg) {
  document.getElementById("status").innerText = msg;
}

function startTimer() {
  timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById("timer").innerText = "Time: " + timer + "s";
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function launchConfetti() {
  const colors = ["#22c55e", "#3b82f6", "#facc15", "#ef4444"];

  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration =
      2 + Math.random() * 1.5 + "s";

    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3000);
  }
}
