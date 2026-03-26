const canvas = document.getElementById("petal-canvas");
const ctx = canvas.getContext("2d");
const roseTrigger = document.getElementById("rose-trigger");
const photoModal = document.getElementById("photo-modal");
const photoBackdrop = document.getElementById("photo-backdrop");
const photoClose = document.getElementById("photo-close");
const photoImage = document.getElementById("photo-image");
const photoError = document.getElementById("photo-error");
const photoSource = "./assets/dali-photo-fast.jpg";

const petals = [];
const petalCount = 22;

function openPhoto() {
  photoModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closePhoto() {
  photoModal.hidden = true;
  document.body.style.overflow = "";
}

function preloadPhoto() {
  const image = new Image();
  image.decoding = "async";
  image.loading = "eager";
  image.src = photoSource;
}

photoImage.addEventListener("load", () => {
  photoError.hidden = true;
});

photoImage.addEventListener("error", () => {
  photoError.hidden = false;
});

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createPetal(initial = false) {
  return {
    x: random(0, window.innerWidth),
    y: initial ? random(0, window.innerHeight) : random(-120, -20),
    size: random(10, 24),
    speedY: random(0.4, 1.2),
    speedX: random(-0.45, 0.45),
    sway: random(0.01, 0.028),
    angle: random(0, Math.PI * 2),
    spin: random(-0.02, 0.02),
    opacity: random(0.4, 0.9),
  };
}

function resetPetals() {
  petals.length = 0;
  for (let i = 0; i < petalCount; i += 1) {
    petals.push(createPetal(true));
  }
}

function drawPetal(petal) {
  ctx.save();
  ctx.translate(petal.x, petal.y);
  ctx.rotate(petal.angle);
  ctx.scale(petal.size / 16, petal.size / 16);

  const gradient = ctx.createLinearGradient(-8, -12, 10, 18);
  gradient.addColorStop(0, `rgba(255, 204, 219, ${petal.opacity})`);
  gradient.addColorStop(0.45, `rgba(255, 109, 152, ${petal.opacity})`);
  gradient.addColorStop(1, `rgba(185, 12, 70, ${petal.opacity})`);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.bezierCurveTo(11, -18, 16, -4, 8, 8);
  ctx.bezierCurveTo(4, 14, -2, 16, 0, 22);
  ctx.bezierCurveTo(-4, 15, -14, 10, -12, -2);
  ctx.bezierCurveTo(-10, -10, -6, -16, 0, -14);
  ctx.fill();

  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const petal of petals) {
    petal.y += petal.speedY;
    petal.x += Math.sin(petal.y * petal.sway) * 0.5 + petal.speedX;
    petal.angle += petal.spin;

    if (petal.y > window.innerHeight + 30 || petal.x < -40 || petal.x > window.innerWidth + 40) {
      Object.assign(petal, createPetal(false), {
        x: random(0, window.innerWidth),
      });
    }

    drawPetal(petal);
  }

  requestAnimationFrame(animate);
}

resizeCanvas();
resetPetals();
animate();
preloadPhoto();

window.addEventListener("resize", () => {
  resizeCanvas();
  resetPetals();
});

roseTrigger.addEventListener("click", openPhoto);
photoBackdrop.addEventListener("click", closePhoto);
photoClose.addEventListener("click", closePhoto);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !photoModal.hidden) {
    closePhoto();
  }
});
