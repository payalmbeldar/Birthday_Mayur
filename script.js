let currentPage = 0;
let currentMemory = 0;

const memoryImages = [
  "images/us1.jpeg",
  "images/us_2.jpeg",
  "images/us3.png",
  "images/mem1.jpg"
];

function goToPage(num) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const target = document.getElementById("page" + num);
  if (target) {
    target.classList.add("active");
    currentPage = num;
    if (num === 1) {
      const bgMusic = document.getElementById("bgMusic");
      if (bgMusic && bgMusic.paused) {
        bgMusic.play().catch((e) => console.warn("Music autoplay blocked:", e));
      }
    }
    // Stop background music and play final music on last page
    if (num === 8) {
      const bgMusic = document.getElementById("bgMusic");
      const finalMusic = document.getElementById("finalMusic");

      if (bgMusic && !bgMusic.paused) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
      }

      if (finalMusic) {
        finalMusic.play().catch((e) => console.warn("Final music autoplay blocked:", e));
      }
    }
    if (num !== 3) document.body.style.background = "#379baf";
  } else {
    console.warn("Page not found:", num);
  }
}

function cutCake() {
  document.getElementById("fullCake").style.display = "none";
  document.getElementById("cutCakeImg").style.display = "block";
  document.getElementById("knife").style.display = "block";
  document.getElementById("clapSound").play();
  document.querySelector(".balloons").style.display = "block";
  document.body.style.background = "radial-gradient(circle, #ffe4e1, #ffd6e8, #fff)";
  document.getElementById("cakeNextBtn").style.display = "inline-block";
}

function nextImage() {
  currentMemory = (currentMemory + 1) % memoryImages.length;
  document.getElementById("memoryImage").src = memoryImages[currentMemory];
}

function prevImage() {
  currentMemory = (currentMemory - 1 + memoryImages.length) % memoryImages.length;
  document.getElementById("memoryImage").src = memoryImages[currentMemory];
}

setInterval(() => {
  if (currentPage === 5) nextImage();
}, 5000);

const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");
const scratchSound = document.getElementById("scratchSound");
const nextBtn = document.getElementById("nextBtn");
const voucherImage = document.getElementById("voucherImage");

let isDrawing = false;
let revealed = false;

function resizeCanvasWhenReady() {
  const width = voucherImage.offsetWidth;
  const height = voucherImage.offsetHeight;

  if (width === 0 || height === 0) {
    setTimeout(resizeCanvasWhenReady, 100);
    return;
  }

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#C0C0C0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  if (scratchSound && scratchSound.readyState > 1) {
    scratchSound.currentTime = 0;
    scratchSound.play().catch(() => {});
  }
  draw(e);
});

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  if (!revealed && scratchedEnough()) {
    revealed = true;
    canvas.style.transition = "opacity 0.5s";
    canvas.style.opacity = "0";
    nextBtn.classList.remove("hidden");
  }
});

function draw(e) {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2);
  ctx.fill();
}

function scratchedEnough() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let cleared = 0;
  for (let i = 3; i < imageData.data.length; i += 4) {
    if (imageData.data[i] < 128) cleared++;
  }
  const percent = cleared / (canvas.width * canvas.height) * 100;
  return percent > 50;
}

function prepareCanvas() {
  resizeCanvasWhenReady();
}
if (voucherImage.complete) {
  prepareCanvas();
} else {
  voucherImage.onload = prepareCanvas;
}

window.onload = () => {
  goToPage(0);
  setTimeout(() => goToPage(1), 4000);
};
