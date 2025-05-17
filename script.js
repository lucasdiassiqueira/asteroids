const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const keys = {};

class Ship {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.angle = 0;
    this.speed = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.radius = 15;
  }

  rotate(dir) {
    this.angle += dir * 0.1;
  }

  accelerate(val) {
    this.velocityX += Math.cos(this.angle) * val;
    this.velocityY += Math.sin(this.angle) * val;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Loop de tela
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-15, 10);
    ctx.lineTo(-15, -10);
    ctx.closePath();
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.restore();
  }
}

const ship = new Ship();

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keys['ArrowLeft']) ship.rotate(-1);
  if (keys['ArrowRight']) ship.rotate(1);
  if (keys['ArrowUp']) ship.accelerate(0.1);

  ship.update();
  ship.draw();

  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

gameLoop();
