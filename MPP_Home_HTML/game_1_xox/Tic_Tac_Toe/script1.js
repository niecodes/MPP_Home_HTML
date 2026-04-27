document.addEventListener("DOMContentLoaded", () => {

  const boardElement = document.getElementById("board");
  const turnInfo = document.getElementById("turnInfo");
  const popup = document.getElementById("popup");
  const winnerText = document.getElementById("winnerText");

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

  // ===== START GAME ===== 
  window.starGame = function () {
    const input = document.getElementById("playerName").value;
    if (input === "") {
 alert("Input name first");
 return;
    }
  
    playerName = input;
    document.getElementById("landing").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    createBoard();
  };

// ===== CREATE BOARD =====
function createBoard() {
  boardElement.innerHTML = "";
  board.fill("")
  gameOver = false;
  turnInfo.innerText= "Your Turn";

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

  board[i] = user;
  updateBoard();

  if (checkWinner(user)) {
    showPopup(playerName);
    return;
}
  turnInfo.innerText = "Computer's Turn"
  setTimeout(computerMove, 500);
}


// ===== COMPUTER MOVE ===== 
function computerMove() {
    const empty = board
    .map((v, i) => v === "" ? i : null)
    .filter(v => v !== null);

    if (empty.length === 0) return;

    const pick = empty[Math.floor(Math.random() * empty.length)];
    board[pick] = computer;
    updateBoard();

  if(checkWinner(computer)) {
    showPopup("komputer");
    return;
  }

  turnInfo.innerText = "Your Turn";
}

// ===== UPDATE =====
function updateBoard(){
  document.querySelectorAll(".cell.").forEach((cell, i) => {
    cell.innerText = board[i];
  });
}

// ===== CHECK WINNER ===== 
function checkWinner(p) {
  return winPatterns.some(pattern => 
    pattern.every(i => board[i] === p)
  );
}

// ===== POPUP =====
function showPopup(winner) {
  gameOver = true;
  winnerText.innerText =`${winner} win!`;
  popup.classList.remove("hidden");
}

window.closePopup = function () {
  popup.classList.add("hidden");
};

// ===== RESET ===== 
window.resetGame = function () {
  createBoard();
};

});