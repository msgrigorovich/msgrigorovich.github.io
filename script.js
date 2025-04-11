
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