import { Screen } from "./screen.js";

const canvas = document.getElementById("worldCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const screen = new Screen(canvas, ctx);

const boxes = [];
for (let i = -10; i <= 10; i++) {
    for (let j = -10; j <= 10; j++) {
        boxes.push({ x: i * 60, y: j * 60 });
    }
}

const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function update() {
    const speed = 5;

    if (keys["ArrowLeft"]) screen.camera.x -= speed;
    if (keys["ArrowRight"]) screen.camera.x += speed;
    if (keys["ArrowUp"]) screen.camera.y -= speed;
    if (keys["ArrowDown"]) screen.camera.y += speed;
}

function drawWorld() {
    for (let b of boxes) {
        ctx.fillStyle = "white";
        ctx.fillRect(b.x - 10, b.y - 10, 20, 20);
    }
}

function drawUI() {
    ctx.fillStyle = "lime";
    ctx.font = "16px monospace";
    ctx.fillText("SCREEN SPACE UI (test)", 20, 30);
    ctx.fillStyle = "white";
    ctx.fillText(`Camera: (${screen.camera.x.toFixed(1)}, ${screen.camera.y.toFixed(1)})`, 20, 55);
}

function loop() {
    update();

    screen.draw(drawWorld, drawUI);

    requestAnimationFrame(loop);
}

loop();