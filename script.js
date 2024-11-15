"use strict";

let gameStarted = false;
const gameTimeLeft = 30;
let score = 0;
let currentPopped = 0;
let countDownTimer = 3;

const dialogBox = document.querySelector("dialog");
const scoreText = document.querySelector("#score");
const gridItems = document.querySelectorAll(".grid-item");
const startButton = document.querySelector("#modal-button");
const modal = document.querySelector(".modal-container");
const modalP = document.querySelector("#modal-text");
const gridContainer = document.querySelector(".grid-container");
const countdown = document.querySelector("#countdown");
const scoreBoard = document.querySelector("#scoreBoard");
const timerId = document.querySelector("#countdown");
const countBoard = document.querySelector("#countModal");
timerId.textContent = gameTimeLeft;

dialogBox?.showModal();

const pumpkins = [];

gridItems.forEach((element) => {
  const hitbox = element.querySelector(".hitbox");
  const ghost = element.querySelector(".ghost");
  const glow = element.querySelector(".pumpkin-glow");

  const obj = {
    hitbox: hitbox,
    ghost: ghost,
    glow: glow,
  };

  pumpkins.push(obj);
});

function countDown3(count) {
  if (count == -1) {
    countBoard.style.display = "none";
    startGame();
    setTimeout(gameCountdown, 1000, gameTimeLeft - 1);
  } else if (count == 0) {
    countBoard.innerHTML = "<h2>Go!<h2>";
    setTimeout(countDown3, 1000, count - 1);
  } else {
    countBoard.innerHTML = "<h2>" + count + "<h2>";
    setTimeout(countDown3, 1000, count - 1);
  }
}

function gameCountdown(timeLeft) {
  if (timeLeft == -1) {
    gameOver();
  } else {
    timerId.textContent = timeLeft;
    setTimeout(gameCountdown, 1000, timeLeft - 1);
  }
}

function gameOver() {
  timerId.textContent = "Game over";
  currentPopped = 0;
  gameStarted = false;
  dialogBox?.showModal();
  countBoard.style.display = "flex";
  startButton.src = "images/retry-button.svg";
  modalP.textContent = "Score: " + score;
  pumpkins.forEach((pumpkin) => {
    pumpkin.ghost.classList.remove("popped-up");
    pumpkin.glow.classList.remove("glow");
    pumpkin.hitbox.classList.remove("active");
  });
}

function toggleGhost(popped, pumpkin) {
  if (!gameStarted) {
    return;
  }
  if (popped) {
    popped = false;
    pumpkin.hitbox.classList.remove("active");
    pumpkin.ghost.classList.remove("popped-up");
    currentPopped--;
  } else if (currentPopped < 3) {
    popped = true;
    pumpkin.hitbox.classList.add("active");
    pumpkin.ghost.classList.add("popped-up");
    currentPopped++;
  }
  let randomNum = Math.floor(Math.random() * 3000);
  randomNum = randomNum < 250 ? 250 : randomNum;
  setTimeout(toggleGhost, randomNum, popped, pumpkin);
}

function whackGhost(pumpkin) {
  if (pumpkin.hitbox.classList.contains("active")) {
    score++;
    scoreText.textContent = score;
    pumpkin.hitbox.classList.remove("active");
    pumpkin.ghost.classList.remove("popped-up");
    pumpkin.glow.classList.add("glow");
    whackedHop(pumpkin);
    glow(pumpkin);
  }
}

function whackedHop(pumpkin) {
  pumpkin.ghost.classList.add("whacked-hop");
  setTimeout(() => {
    pumpkin.ghost.classList.remove("whacked-hop");
  }, 100);
}

function glow(pumpkin) {
  if (pumpkin.glowTimer) {
    clearTimeout(pumpkin.glowTimer);
  }
  pumpkin.glowTimer = setTimeout(() => {
    pumpkin.glow.classList.remove("glow");
    pumpkin.glowTimer = null;
  }, 2000);
}

pumpkins.forEach((pumpkin) => {
  pumpkin.hitbox.addEventListener("click", () => {
    whackGhost(pumpkin);
  });
});

function startGame() {
  gameStarted = true;
  pumpkins.forEach((pumpkin) => {
    let randomNum = Math.floor(Math.random() * 3000);
    setTimeout(toggleGhost, randomNum, false, pumpkin);
  });
}

startButton.addEventListener("click", () => {
  score = 0;
  scoreText.textContent = score;
  timerId.textContent = gameTimeLeft;
  dialogBox.close();
  pumpkins.forEach((obj) => {
    obj.ghost.classList.remove("popped-up");
  });
  if (!gameStarted) {
    countBoard.innerHTML = "<h2>" + countDownTimer + "<h2>";
    setTimeout(countDown3, 1000, countDownTimer - 1);
    pumpkins.forEach((obj) => {
      obj.ghost.classList.remove("popped-up");
    });
    pumpkins.forEach((pumpkin) => {
      let randomNum = Math.floor(Math.random() * 3000);
      setTimeout(toggleGhost, randomNum, false, pumpkin);
    });
  }
});
