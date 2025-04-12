
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

if (cursorDot && cursorOutline) {
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // моментальный dot
    gsap.to(cursorDot, {
      x: mouseX,
      y: mouseY,
      duration: 0.1,
      ease: 'power3.out'
    });
  });

  // задержка outline
  gsap.ticker.add(() => {
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
  trail.push({ x: e.clientX, y: e.clientY, alpha: 1 });
});

function drawTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  trail.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(50,205,50,${p.alpha})`;
    ctx.fill();
    p.alpha -= 0.02;
  });
  trail = trail.filter(p => p.alpha > 0);
  requestAnimationFrame(drawTrail);
}

drawTrail();

