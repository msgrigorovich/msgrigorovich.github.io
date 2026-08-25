
const el = document.querySelector('.typing-text');
const text = "Hello, World!";
let index = 0;
let typingForward = true;
let firstTypeDone = false;
let onFirstTypeComplete = null;
let skipIntroAnimations = false;
let typingActive = false;
let typingTimer = null;

function typeEffect() {
  if (!el || !typingActive) return;
  if (typingForward) {
    if (index <= text.length) {
      el.textContent = text.substring(0, index);
      index++;
      typingTimer = setTimeout(typeEffect, 100);
    } else {
      typingForward = false;
      if (!firstTypeDone) {
        firstTypeDone = true;
        if (onFirstTypeComplete) onFirstTypeComplete();
      }
      typingTimer = setTimeout(typeEffect, 2000);
    }
  } else {
    if (index >= 0) {
      el.textContent = text.substring(0, index);
      index--;
      typingTimer = setTimeout(typeEffect, 50);
    } else {
      typingForward = true;
      typingTimer = setTimeout(typeEffect, 500);
    }
  }
}

function animateSignature() {
  const svg = document.querySelector('.name-signature');
  if (!svg) return Promise.resolve();

  const paths = Array.from(svg.querySelectorAll('.signature-path'));
  if (!paths.length) return Promise.resolve();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS(SVG_NS, 'defs');
    svg.insertBefore(defs, svg.firstChild);
  }

  const duration = 400;
  const stagger = 160;
  const maskStrokeWidth = 18;

  const ordered = paths
    .map(p => ({ p, bbox: p.getBBox(), d: p.getAttribute('d') }))
    .sort((a, b) => a.bbox.x - b.bbox.x);

  const finished = [];

  ordered.forEach(({ p, d }, i) => {
    const maskId = `sig-mask-${i}`;
    const mask = document.createElementNS(SVG_NS, 'mask');
    mask.setAttribute('id', maskId);
    mask.setAttribute('maskUnits', 'userSpaceOnUse');

    const tracePath = document.createElementNS(SVG_NS, 'path');
    tracePath.setAttribute('d', d);
    tracePath.setAttribute('fill', 'none');
    tracePath.setAttribute('stroke', '#fff');
    tracePath.setAttribute('stroke-width', maskStrokeWidth);
    tracePath.setAttribute('stroke-linecap', 'round');
    tracePath.setAttribute('stroke-linejoin', 'round');
    mask.appendChild(tracePath);
    defs.appendChild(mask);
    p.setAttribute('mask', `url(#${maskId})`);

    if (prefersReducedMotion) return;

    const len = tracePath.getTotalLength();
    tracePath.style.strokeDasharray = len;
    tracePath.style.strokeDashoffset = len;

    try {
      const anim = tracePath.animate(
        [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
        { duration, delay: i * stagger, easing: 'ease-out', fill: 'forwards' }
      );
      finished.push(anim.finished);
    } catch (e) {
      tracePath.style.strokeDashoffset = '0';
    }
  });

  return Promise.all(finished).catch(() => {});
}

function revealRestOfPage() {
  document.querySelectorAll('.fade-in-content').forEach(section => {
    section.classList.add('visible');
  });
}

function startTyping() {
  if (skipIntroAnimations || typingActive) return;
  typingActive = true;
  if (el) el.classList.add('typing-active');
  onFirstTypeComplete = revealRestOfPage;
  typeEffect();
}

function runIntro() {
  const block = document.querySelector('.signature-block');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!block || prefersReducedMotion) {
    animateSignature().then(startTyping);
    return;
  }

  const naturalRect = block.getBoundingClientRect();
  const centerLeft = (window.innerWidth - naturalRect.width) / 2;
  const centerTop = (window.innerHeight - naturalRect.height) / 2;

  // The safety clamp is based on the actual visible signature graphic, not
  // `.signature-block`'s own box (which stretches to fill its container and is
  // mostly invisible empty space around the centered svg) - otherwise the clamp
  // kicked in even on wide desktop screens and killed the enlargement almost entirely.
  const svg = block.querySelector('.name-signature');
  const svgWidth = svg ? svg.getBoundingClientRect().width : naturalRect.width;
  const viewportMargin = 24;
  const maxScaleForViewport = (window.innerWidth - viewportMargin * 2) / svgWidth;
  const introScale = Math.min(1.2, Math.max(1, maxScaleForViewport));
  const dx = centerLeft - naturalRect.left;
  const dy = centerTop - naturalRect.top;

  // Position is fixed at the true final (natural) spot from the very start and never
  // changes; the centered/enlarged look during writing is done purely via `transform`
  // (translate + scale), which the browser can animate on the compositor without
  // recomputing layout every frame. Animating `left`/`top` directly was prone to jank
  // that showed up as the signature "snapping" the last bit of the way at the end.
  block.style.position = 'fixed';
  block.style.margin = '0';
  block.style.width = `${naturalRect.width}px`;
  block.style.left = `${naturalRect.left}px`;
  block.style.top = `${naturalRect.top}px`;
  block.style.zIndex = '10';
  block.style.transform = `translate(${dx}px, ${dy}px) scale(${introScale})`;

  animateSignature().then(() => {
    setTimeout(() => {
      const finish = () => {
        block.style.position = '';
        block.style.margin = '';
        block.style.width = '';
        block.style.left = '';
        block.style.top = '';
        block.style.zIndex = '';
        block.style.transform = '';
        startTyping();
      };

      try {
        const anim = block.animate(
          [
            { transform: `translate(${dx}px, ${dy}px) scale(${introScale})` },
            { transform: 'translate(0px, 0px) scale(1)' }
          ],
          { duration: 700, easing: 'ease-in-out', fill: 'forwards' }
        );
        anim.finished.then(finish).catch(finish);
      } catch (e) {
        finish();
      }
    }, 500);
  });
}

const MAIN_PATHS = ['/', '/index.html'];
const SKIP_MAIN_INTRO_KEY = 'skip-main-intro-once';

function isMainPath(pathname) {
  return MAIN_PATHS.includes(pathname);
}

function showMainPageImmediately() {
  // The typing heading starts empty and the remaining sections start hidden in CSS.
  // Put everything directly into its final state when returning from an inner page.
  skipIntroAnimations = true;
  typingActive = false;
  clearTimeout(typingTimer);
  typingTimer = null;
  index = 0;
  typingForward = true;
  firstTypeDone = true;
  onFirstTypeComplete = null;
  if (el) {
    el.textContent = '';
    el.classList.add('typing-active');
  }

  const signatureBlock = document.querySelector('.signature-block');
  if (signatureBlock) {
    signatureBlock.getAnimations().forEach(animation => animation.cancel());
    signatureBlock.style.position = '';
    signatureBlock.style.margin = '';
    signatureBlock.style.width = '';
    signatureBlock.style.left = '';
    signatureBlock.style.top = '';
    signatureBlock.style.zIndex = '';
    signatureBlock.style.transform = '';
  }

  document.querySelectorAll('.name-signature mask path').forEach(path => {
    path.getAnimations().forEach(animation => animation.cancel());
    path.style.strokeDashoffset = '0';
  });

  revealRestOfPage();
  typingActive = true;
  typeEffect();
}

const shouldSkipMainIntro =
  isMainPath(window.location.pathname) &&
  sessionStorage.getItem(SKIP_MAIN_INTRO_KEY) === 'true';

if (shouldSkipMainIntro) {
  sessionStorage.removeItem(SKIP_MAIN_INTRO_KEY);
  showMainPageImmediately();
} else {
  runIntro();
}

// When the browser restores the main page from its back/forward cache, the script
// is not executed again. Consume the same flag on `pageshow` and stop any intro
// callbacks that may still be pending from before the user left the page.
window.addEventListener('pageshow', () => {
  if (
    isMainPath(window.location.pathname) &&
    sessionStorage.getItem(SKIP_MAIN_INTRO_KEY) === 'true'
  ) {
    sessionStorage.removeItem(SKIP_MAIN_INTRO_KEY);
    showMainPageImmediately();
  }
});

const logo = document.querySelector('.logo');

if (logo) {
  logo.addEventListener('click', function (e) {
    const current = window.location.pathname;
    if (isMainPath(current)) {
      e.preventDefault();
      // Clicking the logo while already on the main page intentionally replays
      // the intro, just like refreshing the page.
      window.location.reload();
    }
  });
}

document.querySelectorAll('a').forEach(link => {
  const href = link.getAttribute('href');
  const current = window.location.pathname;

  if (!href || href.startsWith('http')) return;

  const linkPath = new URL(href, window.location.origin).pathname;

  if (isMainPath(current) && !isMainPath(linkPath)) {
    link.addEventListener('click', () => {
      sessionStorage.setItem(SKIP_MAIN_INTRO_KEY, 'true');
    });
  }

  if (isMainPath(linkPath) && !isMainPath(current)) {
    link.addEventListener('click', () => {
      sessionStorage.setItem(SKIP_MAIN_INTRO_KEY, 'true');
    });
  }

  if (linkPath === current || (linkPath.endsWith('/') && current === '/')) {
    link.addEventListener('click', e => e.preventDefault());
  }
});

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const cursorOutlineInner = document.querySelector('.cursor-outline-inner');


let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;
let mouseInitialized = false;
let isHoveringClickable = false;

if (cursorDot && cursorOutline) {
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!mouseInitialized) {

      gsap.set(cursorDot, { x: mouseX, y: mouseY });
      gsap.set(cursorOutline, { x: mouseX, y: mouseY });
      outlineX = mouseX;
      outlineY = mouseY;
      mouseInitialized = true;
    }

   
    gsap.to(cursorDot, {
      x: mouseX,
      y: mouseY,
      duration: 0.1,
      ease: 'power3.out'
    });
  });

  gsap.ticker.add(() => {
    if (!mouseInitialized) return;
    const speed = isHoveringClickable ? 0.18 : 0.12;
    outlineX += (mouseX - outlineX) * speed;
    outlineY += (mouseY - outlineY) * speed;
    gsap.set(cursorOutline, {
      x: outlineX,
      y: outlineY
    });
  });
}

document.querySelectorAll('a, .circle, button').forEach(el => {
el.addEventListener('mouseenter', () => {
    isHoveringClickable = true;

    const dotRect = cursorDot.getBoundingClientRect();

    mouseX = dotRect.left + dotRect.width / 2;
    mouseY = dotRect.top + dotRect.height / 2;

    const elementColor = window.getComputedStyle(el).backgroundColor;

    const darkerElementColor = darkenColor(elementColor, 0.5);

    gsap.to(cursorDot, {
      backgroundColor: '#ff5e5e',
      duration: 0.2,
      ease: 'power2.out'
    });

    gsap.to(cursorOutlineInner, {
      backgroundColor: colorWithAlpha(darkerElementColor, 0.25),
      duration: 0.2,
      ease: 'power2.out'
    });

    gsap.to(cursorOutline, {
      scale: 2.0,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  el.addEventListener('mouseleave', () => {
    isHoveringClickable = false;
    gsap.to(cursorDot, {
      backgroundColor: '#ff5e5e',
      duration: 0.2,
      ease: 'power2.out'
    });

    gsap.to(cursorOutlineInner, {
      backgroundColor: 'rgba(255, 94, 94, 0.25)',
      duration: 0.2,
      ease: 'power2.out'
    });

    gsap.to(cursorOutline, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
});

// function of blackout color
function darkenColor(rgb, amount) {
  const nums = rgb.match(/\d+/g).map(Number);
  const factor = 1 - amount;
  const r = Math.max(Math.round(nums[0] * factor), 0);
  const g = Math.max(Math.round(nums[1] * factor), 0);
  const b = Math.max(Math.round(nums[2] * factor), 0);
  return `rgb(${r}, ${g}, ${b})`;
}

function colorWithAlpha(rgb, alpha) {
  const nums = rgb.match(/\d+/g).map(Number);
  return `rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, ${alpha})`;
}


// function of blending with cursor base color priority
function mixColors(color1, color2, weight) {
  const c1 = color1.match(/\d+/g).map(Number);
  const c2 = color2.match(/\d+/g).map(Number);
  const w = weight || 0.5;
  const r = Math.round(c1[0] * w + c2[0] * (1 - w));
  const g = Math.round(c1[1] * w + c2[1] * (1 - w));
  const b = Math.round(c1[2] * w + c2[2] * (1 - w));
  return `rgb(${r}, ${g}, ${b})`;
}

function colorWithAlpha(rgb, alpha) {
  const nums = rgb.match(/\d+/g).map(Number);
  return `rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, ${alpha})`;
}


// Color mixing function
function mixColors(color1, color2, weight) {
  const c1 = color1.match(/\d+/g).map(Number);
  const c2 = color2.match(/\d+/g).map(Number);
  const w = weight || 0.5;
  const r = Math.round(c1[0] * w + c2[0] * (1 - w));
  const g = Math.round(c1[1] * w + c2[1] * (1 - w));
  const b = Math.round(c1[2] * w + c2[2] * (1 - w));
  return `rgb(${r}, ${g}, ${b})`;
}

// Add alpha to rgb
function colorWithAlpha(rgb, alpha) {
  const nums = rgb.match(/\d+/g).map(Number);
  return `rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, ${alpha})`;
}





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
  let color = '0,0,0';

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
      color = '255,255,255';
    }
  }

  trail.push({ x: e.clientX, y: e.clientY, alpha: 1, color });
});

function drawTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  trail.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 40, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color || '0,0,0'},${p.alpha})`;
    ctx.fill();
    p.alpha -= 0.02;
  });
  
  trail = trail.filter(p => p.alpha > 0);
  requestAnimationFrame(drawTrail);
}

drawTrail();

function animateProgressBar() {
  const container = document.querySelector('.progress-bar-fill');
  const percentText = document.querySelector('.progress-percentage');

  if (!container || !percentText) return;

  const startDate = new Date('2021-09-15');
  const endDate = new Date('2027-12-01');
  const today = new Date();

  const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  const passedDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const percent = Math.min((passedDays / totalDays) * 100, 100);
  const rounded = parseFloat(percent.toFixed(2));

  const totalSegments = 40;
  const filledSegments = Math.round((percent / 100) * totalSegments);

  // Segment Animation
  for (let i = 0; i < filledSegments; i++) {
    const segment = document.createElement('div');
    segment.classList.add('progress-segment');
    segment.style.animationDelay = `${i * 0.05}s`;
    container.appendChild(segment);
  }

  let currentPercent = 0;
  const duration = filledSegments * 50;
  const stepTime = 10;
  const totalSteps = duration / stepTime;
  const increment = rounded / totalSteps;

  // Calculate days left
  const daysLeft = Math.max(Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)), 0);

  // Create element for days left message
  let daysLeftMsg = document.querySelector('.progress-days-left');
  if (!daysLeftMsg) {
    daysLeftMsg = document.createElement('div');
    daysLeftMsg.className = 'progress-days-left';
    percentText.parentNode.insertBefore(daysLeftMsg, percentText.nextSibling);
  }
  daysLeftMsg.textContent = '';

  const counter = setInterval(() => {
    currentPercent += increment;
    if (currentPercent >= rounded) {
      percentText.textContent = `${rounded.toFixed(2)}% COMPLETE`;
      clearInterval(counter);
      // Show days left message
      daysLeftMsg.textContent = `I am very grateful for the presence of this page, however it is in the waiting stage of my projects. There is an end date for this development and it is ${daysLeft} days away. I believe that you will return to this page.`;
      // Fade-in
      setTimeout(() => {
        daysLeftMsg.style.opacity = '1';
      }, 100);
    } else {
      percentText.textContent = `${currentPercent.toFixed(2)}% COMPLETE`;
    }
  }, stepTime);
}


window.addEventListener('DOMContentLoaded', animateProgressBar);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('https://formspree.io/f/mkgjybaz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          form.reset();
          successMessage.style.display = 'block';
          setTimeout(() => {
            successMessage.style.opacity = 1;
          }, 100);
        } else {
          alert('Something went wrong. Please try again later.');
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    });
  }
});

function darkenColor(rgb, amount) {
  const nums = rgb.match(/\d+/g).map(Number);
  const factor = 1 - amount;
  const r = Math.max(Math.round(nums[0] * factor), 0);
  const g = Math.max(Math.round(nums[1] * factor), 0);
  const b = Math.max(Math.round(nums[2] * factor), 0);
  return `rgb(${r}, ${g}, ${b})`;
}
