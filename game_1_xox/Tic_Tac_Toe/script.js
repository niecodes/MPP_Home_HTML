document.addEventListener("DOMContentLoaded", () => {

  const boardElement = document.getElementById("board");
  const turnInfo = document.getElementById("turnInfo");
  const popup = document.getElementById("popup");
  const winnerText = document.getElementById("winnerText");
  const resultText = document.getElementById("resultText");

  // AUDIO
  const bgm = document.getElementById("bgm");
  const clickSound = document.getElementById("clickSound");
  const winSound = document.getElementById("winSound");

  let board = Array(9).fill("");
  let gameOver = false;
  let playerName = "";

  const user = "O";
  const computer = "X";

  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  // ===== MULAI GAME =====
  window.startGame = function () {
    const input = document.getElementById("playerName").value;
    if (input === "") {
      alert("Are you dumb? Insert your name first. 😊");
      return;
    }

    playerName = input;
    document.getElementById("landing").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    bgm.volume = 0.3;
    bgm.play();

    createBoard();
  };

  // ===== BUAT PAPAN =====
  function createBoard() {
    boardElement.innerHTML = "";
    board.fill("");
    gameOver = false;
    turnInfo.innerText = "Your Turn";

    board.forEach((_, i) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.addEventListener("click", () => userMove(i));
      boardElement.appendChild(cell);
    });
  }

  // ===== USER MOVE =====
  function userMove(i) {
    if (board[i] !== "" || gameOver) return;

    clickSound.currentTime = 0;
    clickSound.play();

    board[i] = user;
    updateBoard();

    if (checkWinner(user)) {
      showPopup(playerName);
      return;
    }

    if (isDraw()) {
      showDraw();
      return;
    }

    turnInfo.innerText = "Computer's Turn";
    setTimeout(computerMove, 500);
  }

  // ===== KOMPUTER MOVE =====
  function computerMove() {
    if (gameOver) return;

    const empty = board
      .map((v, i) => v === "" ? i : null)
      .filter(v => v !== null);

    if (empty.length === 0) return;

    const pick = empty[Math.floor(Math.random() * empty.length)];
    board[pick] = computer;
    updateBoard();

    if (checkWinner(computer)) {
      showPopup("Computer");
      return;
    }

    if (isDraw()) {
      showDraw();
      return;
    }

    turnInfo.innerText = "Your Turn";
  }

  // ===== UPDATE =====
  function updateBoard() {
    document.querySelectorAll(".cell").forEach((cell, i) => {
      cell.innerText = board[i];
    });
  }

  // ===== CEK MENANG =====
  function checkWinner(p) {
    return winPatterns.some(pattern =>
      pattern.every(i => board[i] === p)
    );
  }

  // ===== CEK SERI =====
  function isDraw() {
    return board.every(cell => cell !== "");
  }

  // ===== POPUP MENANG / KALAH =====
  function showPopup(winner) {
    gameOver = true;
    popup.classList.remove("hidden");

    if (winner === playerName) {
      winnerText.innerText = `${playerName} WIN! 🎉`;
      resultText.innerText = "Here's your doorprais ✺◟(＾∇＾)◞✺";
      winSound.currentTime = 0;
      winSound.play();
    } else {
      winnerText.innerText = "You lost lolll";
      resultText.innerText = "Dw bru u can try again 😎👌";
    }
  }

  // ===== POPUP SERI =====
  function showDraw() {
    gameOver = true;
    popup.classList.remove("hidden");
    winnerText.innerText = "A Tie! ദ്ദി✧";
    resultText.innerText = "No winners";
  }

  // ===== TUTUP POPUP =====
  window.closePopup = function () {
    popup.classList.add("hidden");
  };

  // ===== RESET =====
  window.resetGame = function () {
    bgm.currentTime = 0;
    createBoard();
  };

});