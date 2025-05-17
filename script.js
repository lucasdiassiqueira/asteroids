const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const keys = {};
const bullets = [];
const asteroids = [];
let score = 0;
let gameOver = false;

class Ship {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.angle = 0;
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

  shoot() {
    bullets.push(new Bullet(this.x, this.y, this.angle));
  }
}

class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 5;
    this.radius = 2;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
}

class Asteroid {
  constructor(x, y, radius = 40) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2;
    this.points = this.generateShape();
  }

  generateShape() {
    const points = [];
    const count = 8 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const r = this.radius * (0.75 + Math.random() * 0.5);
      points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    }
    return points;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x + this.points[0].x, this.y + this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.x + this.points[i].x, this.y + this.points[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'white';
    ctx.stroke();
  }
}

function spawnAsteroid() {
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height;
  asteroids.push(new Asteroid(x, y));
}

function checkCollisions() {
  bullets.forEach((b, bi) => {
    asteroids.forEach((a, ai) => {
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < b.radius + a.radius) {
        bullets.splice(bi, 1);
        asteroids.splice(ai, 1);
        score += 10;
      }
    });
  });

  asteroids.forEach((a) => {
    let dx = a.x - ship.x;
    let dy = a.y - ship.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < a.radius + ship.radius) {
      gameOver = true;
    }
  });
}

const ship = new Ship();
setInterval(spawnAsteroid, 2000);

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 20, 30);
}

function drawGameOver() {
  ctx.fillStyle = 'red';
  ctx.font = '50px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    if (keys['ArrowLeft']) ship.rotate(-1);
    if (keys['ArrowRight']) ship.rotate(1);
    if (keys['ArrowUp']) ship.accelerate(0.1);

    ship.update();
    ship.draw();

    bullets.forEach((b, i) => {
      b.update();
      b.draw();
    });

    asteroids.forEach((a) => {
      a.update();
      a.draw();
    });

    checkCollisions();
    drawScore();
    requestAnimationFrame(gameLoop);
  } else {
    drawGameOver();
  }
}

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === ' ') ship.shoot();
});

document.addEventListener('keyup', (e) => keys[e.key] = false);

gameLoop();
