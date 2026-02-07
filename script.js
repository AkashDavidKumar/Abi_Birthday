// Utility helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* Audio & start button */
const music = $('#music');
const startBtn = $('#startBtn');
const confettiBtn = $('#confettiBtn');

startBtn.addEventListener('click', async () => {
  // If already in 'Enjoy' state, toggle music off
  if (startBtn.textContent.includes('Enjoy')) {
    music.pause();
    startBtn.textContent = 'Start the surprise';
    startBtn.style.filter = 'none';
    return;
  }

  try {
    // Start ambient music
    await music.play();
  } catch (e) {
    console.log("Audio play failed:", e);
  }

  startBtn.textContent = 'Enjoy 🎶 (Stop)';
  startBtn.disabled = false; // Keep it enabled to allow stopping
  startBtn.style.filter = 'grayscale(0.2)';
  shootConfetti(180);
  initBalloons(18);
});

confettiBtn.addEventListener('click', () => shootConfetti(140));

/* Keyboard shortcuts */
window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowRight') nextSlide();
  else if (e.code === 'ArrowLeft') prevSlide();
  else if (e.code === 'Space') {
    e.preventDefault();
    if (music.paused) music.play(); else music.pause();
  }
});

/* Slideshow logic */
const slides = $$('.slide');
const prev = $('#prev');
const next = $('#next');
let index = 0;
let autoTimer;

function showSlide(i) {
  slides.forEach(s => s.classList.remove('active'));
  slides[i].classList.add('active');
}

function nextSlide() {
  index = (index + 1) % slides.length;
  showSlide(index);
}
function prevSlide() {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
}

function autoPlay() {
  clearInterval(autoTimer);
  autoTimer = setInterval(nextSlide, 4000);
}

prev.addEventListener('click', prevSlide);
next.addEventListener('click', nextSlide);
autoPlay();

/* Balloons */
const balloonColors = ['#ff6bd9', '#69e0ff', '#ffd166', '#7cf29b', '#b389ff', '#ff9aa2'];
function initBalloons(count = 12) {
  const wrap = $('#balloons');
  wrap.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    const color = balloonColors[i % balloonColors.length];
    b.style.background = `radial-gradient(circle at 30% 30%, #fff6, transparent 55%), ${color}`;
    b.style.left = Math.random() * 100 + 'vw';
    b.style.setProperty('--dur', (10 + Math.random() * 10) + 's');
    b.style.setProperty('--drift', (Math.random() * 40 - 20) + 'px');
    wrap.appendChild(b);
  }
}

/* Confetti */
function shootConfetti(pieces = 120) {
  const layer = $('#confetti');
  for (let i = 0; i < pieces; i++) {
    const el = document.createElement('div');
    el.className = 'piece';
    const hue = Math.floor(Math.random() * 360);
    el.style.background = `hsl(${hue}deg, 90%, 60%)`;
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '-6vh';
    el.style.setProperty('--x', Math.random() * 100 + 'vw');
    el.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    el.style.setProperty('--rot', Math.random() * 180 + 'deg');
    el.style.setProperty('--time', (5 + Math.random() * 4) + 's');
    layer.appendChild(el);
    setTimeout(() => el.remove(), 9000);
  }
}

/* Sync video with background music */
const video = $('#video');

video.addEventListener('play', () => {
  shootConfetti(80);
  // Pause background music when video starts
  if (!music.paused) {
    music.pause();
  }
});

video.addEventListener('pause', () => {
  // Resume background music when video is paused
  // Only if the start button has already been clicked (to avoid playing before start)
  if (startBtn.textContent.includes('Enjoy') && music.paused) {
    music.play();
  }
});

video.addEventListener('ended', () => {
  // Resume background music when video ends
  if (startBtn.textContent.includes('Enjoy') && music.paused) {
    music.play();
  }
});

/* Typewriter effect */
const typeTarget = $('#typewriter');
const wishes = [
  "Today is not just another day, it’s a celebration of you! 🎂",
  "May your year be filled with laughter and endless joy. ✨",
  "Wishing you health, wealth, and all the magic you deserve. 💖",
  "Keep shining brightly, the world needs your light. 🌟",
  "Happy Birthday to an amazing human! 🎈",
  "Celebrate your journey and everything that makes you special. 🌹"
];

let wishIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeLine() {
  const currentWish = wishes[wishIndex];

  if (isDeleting) {
    typeTarget.textContent = currentWish.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50; // Faster when deleting
  } else {
    typeTarget.textContent = currentWish.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100;
  }

  if (!isDeleting && charIndex === currentWish.length) {
    isDeleting = true;
    typeSpeed = 2000; // Pause at the end of the wish
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wishIndex = (wishIndex + 1) % wishes.length;
    typeSpeed = 500; // Small pause before starting next wish
  }

  setTimeout(typeLine, typeSpeed);
}

// Start typing after a short delay
setTimeout(typeLine, 1000);

/* Accessibility: reduce motion respect */
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mq.matches) {
  document.querySelectorAll('*').forEach(el => el.style.animation = 'none');
  clearInterval(autoTimer);
  typeTarget.textContent = wishes[0]; // Just show the first wish
}