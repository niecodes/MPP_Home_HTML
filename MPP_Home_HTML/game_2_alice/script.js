// ================= CANVAS =================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ================= SOUND EFFECT =================
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");
const startSound = document.getElementById("startSound");
const bgm = document.getElementById("bgm");

// ================= KONFIGURASI GAME =================
const box = 15;          
const speed = 150;       
const deadZone = 0.4;    

// ================= VARIABEL GAME =================
let snake;               
let direction;           
let food;                
let game;                
let score = 0;           
let playerName = "";     

// ================= START GAME =================
function startGame() {
    const nameInput = document.getElementById("playerName").value.trim();

    if (!nameInput) {
        alert("Your name is a must, Traveler!");
        return;
    }

    if(startSound) { startSound.currentTime = 0; startSound.play(); }
    if(bgm) { bgm.volume = 0.4; bgm.play().catch(()=>{}); }

    playerName = nameInput;
    document.getElementById("playerLabel").innerText = playerName;
    document.getElementById("landing").style.display = "none";
    document.getElementById("gamePage").style.display = "block";

    initGame();
}

// ================= INIT GAME =================
function initGame() {
    // Spawn di tengah
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;
    document.getElementById("score").innerText = score;
    food = spawnFood();

    if (game) clearInterval(game); 
    game = setInterval(draw, speed);
    requestAnimationFrame(gamepadLoop);
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function setDirection(dir) {
    if (dir === "LEFT" && direction !== "RIGHT") direction = dir;
    if (dir === "RIGHT" && direction !== "LEFT") direction = dir;
    if (dir === "UP" && direction !== "DOWN") direction = dir;
    if (dir === "DOWN" && direction !== "UP") direction = dir;
}

// ================= KONTROL =================
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") setDirection("UP");
    if (e.key === "ArrowDown") setDirection("DOWN");
    if (e.key === "ArrowLeft") setDirection("LEFT");
    if (e.key === "ArrowRight") setDirection("RIGHT");
});

function gamepadLoop() {
    const pads = navigator.getGamepads();
    for (let gp of pads) {
        if (!gp) continue;
        const x = gp.axes[0];
        const y = gp.axes[1];
        if (Math.abs(x) > deadZone || Math.abs(y) > deadZone) {
            if (Math.abs(x) > Math.abs(y)) setDirection(x > 0 ? "RIGHT" : "LEFT");
            else setDirection(y > 0 ? "DOWN" : "UP");
        }
    }
    requestAnimationFrame(gamepadLoop);
}

// ================= DRAW GAME ================= 
function draw() {
    // 1. Bersihkan Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. GAMBAR MAKANAN (APEL PREMIUM - SANGAT MENONJOL)
    ctx.save();
    // Beri "Aura" Putih di belakang apel agar lepas dari warna hitam
    ctx.shadowBlur = 15;
    ctx.shadowColor = "white"; 
    
    // Badan Apel Merah Menyala
    ctx.fillStyle = "#ff1744"; 
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2 + 1, box/1.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Kilasan Cahaya di Apel (Biar terlihat 3D)
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.beginPath();
    ctx.arc(food.x + box/2 - 2, food.y + box/2 - 2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Tangkai Cokelat
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#5d4037"; 
    ctx.fillRect(food.x + box/2 - 1, food.y - 2, 2, 5);
    ctx.restore();

    // 3. GAMBAR ULAR (HIJAU WONDERLAND - ANTI GAIB)
    if (snake.length > 0) {
        ctx.save(); 
        
        // A. GAMBAR KEPALA SEBAGAI LINGKARAN (Agar tidak gaib saat baru mulai)
        ctx.fillStyle = "#2ecc71";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#2ecc71";
        ctx.beginPath();
        ctx.arc(snake[0].x + box/2, snake[0].y + box/2, box/1.8, 0, Math.PI * 2);
        ctx.fill();

        // B. GAMBAR BADAN SEBAGAI GARIS MENYAMBUNG (Meliuk Halus)
        if (snake.length > 1) {
            ctx.lineWidth = box - 3; 
            ctx.lineJoin = "round";  
            ctx.lineCap = "round";   
            ctx.strokeStyle = "#2ecc71";
            ctx.beginPath();
            ctx.moveTo(snake[0].x + box / 2, snake[0].y + box / 2); 
            for (let i = 1; i < snake.length; i++) {
                ctx.lineTo(snake[i].x + box / 2, snake[i].y + box / 2);
            }
            ctx.stroke();
        }

        // C. MAHKOTA RAJA (Versi Elegan & Jelas)
        let head = snake[0];
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffd700"; // Emas
        ctx.strokeStyle = "#000";   // Border hitam tipis agar mahkota tegas
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.moveTo(head.x + 3, head.y);
        ctx.lineTo(head.x, head.y - 10);      // Kiri
        ctx.lineTo(head.x + box/4, head.y - 5);
        ctx.lineTo(head.x + box/2, head.y - 12); // Tengah (Tinggi)
        ctx.lineTo(head.x + 3*box/4, head.y - 5);
        ctx.lineTo(head.x + box, head.y - 10);   // Kanan
        ctx.lineTo(head.x + box - 3, head.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Permata Ruby Merah di Tengah Mahkota
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(head.x + box/2, head.y - 6, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // D. MATA
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(head.x + box/2 - 3, head.y + box/2, 2.5, 0, Math.PI * 2); 
        ctx.arc(head.x + box/2 + 3, head.y + box/2, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(head.x + box/2 - 3, head.y + box/2, 1, 0, Math.PI * 2);
        ctx.arc(head.x + box/2 + 3, head.y + box/2, 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore(); 
    }

    // 4. LOGIKA GERAKAN (Tetap sama)
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    let newHead = { x: headX, y: headY };

    if (headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height || 
        snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
        gameOver();
        return;
    }

    if (headX === food.x && headY === food.y) {
        if(eatSound) { eatSound.currentTime = 0; eatSound.play(); }
        score++;
        document.getElementById("score").innerText = score;
        food = spawnFood();
    } else {
        snake.pop();
    }
    snake.unshift(newHead);
}

// ================= GAME OVER =================
function gameOver() {
    clearInterval(game);
    if(bgm) bgm.pause();
    if(gameOverSound) { gameOverSound.currentTime = 0; gameOverSound.play(); }

    const data = JSON.parse(localStorage.getItem("snakeScores")) || [];
    data.push({ name: playerName, score });
    localStorage.setItem("snakeScores", JSON.stringify(data));

    alert(`OFF WITH THEIR HEADS!\n${playerName}'s score: ${score}`);
    location.reload();
}

function loadHistory() {
    const data = JSON.parse(localStorage.getItem("snakeScores")) || [];
    const list = document.getElementById("scoreHistory");
    if (!list) return;
    list.innerHTML = "";
    data.slice(-5).reverse().forEach(d => {
        const li = document.createElement("li");
        li.innerText = `${d.name} : ${d.score}`;
        list.appendChild(li);
    });
}

// --- TAMBAHAN FUNGSI RESET HISTORY ---
function resetHistory() {
    const confirmDelete = confirm("Remove all Wonderland's history?");
    if (confirmDelete) {
        localStorage.removeItem("snakeScores");
        loadHistory(); // Refresh tampilan list
    }
}

loadHistory();