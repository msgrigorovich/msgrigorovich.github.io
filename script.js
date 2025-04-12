
const el = document.querySelector('.typing-text');
const text = "Hello, World!";
let index = 0;
let typingForward = true;

function typeEffect() {
  if (!el) return;
  if (typingForward) {
    if (index <= text.length) {
      el.textContent = text.substring(0, index);
      index++;
      setTimeout(typeEffect, 100);
    } else {
      typingForward = false;
      setTimeout(typeEffect, 2000);
    }
  } else {
    if (index >= 0) {
      el.textContent = text.substring(0, index);
      index--;
      setTimeout(typeEffect, 50);
    } else {
      typingForward = true;
      setTimeout(typeEffect, 500);
    }
  }
}

typeEffect();

const logo = document.querySelector('.logo');

if (logo) {
  logo.addEventListener('click', function (e) {
    const current = window.location.pathname;
    if (current.endsWith('/') || current === '/' || current === '/') {
      e.preventDefault();
    }
  });
}

document.querySelectorAll('a').forEach(link => {
  const href = link.getAttribute('href');
  const current = window.location.pathname;

  if (!href || href.startsWith('http')) return;

  const linkPath = new URL(href, window.location.origin).pathname;

  if (linkPath === current || (linkPath.endsWith('/') && current === '/')) {
    link.addEventListener('click', e => e.preventDefault());
  }
});

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;
let mouseInitialized = false;

if (cursorDot && cursorOutline) {
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!mouseInitialized) {
      // 🔥 Устанавливаем курсоры в позицию мыши без анимации
      gsap.set(cursorDot, { x: mouseX, y: mouseY });
      gsap.set(cursorOutline, { x: mouseX, y: mouseY });
      outlineX = mouseX;
      outlineY = mouseY;
      mouseInitialized = true;
    }

    // Анимируем dot (мгновенно)
    gsap.to(cursorDot, {
      x: mouseX,
      y: mouseY,
      duration: 0.1,
      ease: 'power3.out'
    });
  });

  // Анимируем outline (с задержкой)
  gsap.ticker.add(() => {
    if (!mouseInitialized) return;
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    gsap.set(cursorOutline, {
      x: outlineX,
      y: outlineY
    });
  });
}

document.querySelectorAll('a, .circle').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursorOutline, {
      scale: 1.6,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursorOutline, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
});

const canvas = document.querySelector('.cursor-trail');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let trail = [];

window.addEventListener('mousemove', (e) => {
  const target = document.elementFromPoint(e.clientX, e.clientY);
  let color = '0,0,0'; // по умолчанию — чёрный

  if (target) {
    if (target.classList.contains('circle')) {
      const bg = window.getComputedStyle(target).backgroundColor;
      const match = bg.match(/\d+,\s*\d+,\s*\d+/);
      if (match) color = match[0];
    } else if (
      ['P', 'A', 'SPAN', 'H1', 'H2', 'STRONG'].includes(target.tagName) ||
      (target.classList && (
        target.classList.contains('logo') ||
        target.classList.contains('copy')
      )) ||
      target.closest('.logo') ||
      target.closest('.footer-grid') ||
      target.closest('footer')
    ) {
      color = '255,255,255'; // белый трейл
    }
  }

  trail.push({ x: e.clientX, y: e.clientY, alpha: 1, color });
});

function drawTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  trail.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 40, 0, Math.PI * 2); // больше радиус
    ctx.fillStyle = `rgba(${p.color || '0,0,0'},${p.alpha})`;
    ctx.fill();
    p.alpha -= 0.02;
  });
  
  trail = trail.filter(p => p.alpha > 0);
  requestAnimationFrame(drawTrail);
}

drawTrail();

function animateProgressBar() {
  const fill = document.querySelector('.progress-bar-fill');
  const percentText = document.querySelector('.progress-percentage');

  if (!fill || !percentText) return;

  const startDate = new Date('2021-09-15');
  const endDate = new Date('2025-12-01');
  const today = new Date();

  const total = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  const passed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const progress = Math.min((passed / total) * 100, 100);
  const rounded = progress.toFixed(2);

  fill.style.width = `${rounded}%`;
  percentText.textContent = `${rounded}% complete`;
}

window.addEventListener('DOMContentLoaded', animateProgressBar);
