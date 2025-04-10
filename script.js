
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

document.querySelectorAll('a.circle.resume').forEach(link => {
  const href = link.getAttribute('href');
  if (href !== 'resume.html') return;

  const resumeBtn = document.querySelector('.circle.resume');
  const finalResume = document.getElementById('finalResume');
  if (!resumeBtn || !finalResume) return;

  link.addEventListener('click', e => {
    e.preventDefault();

    resumeBtn.classList.add('zooming');
    setTimeout(() => {
      document.body.style.backgroundColor = '#b3dcfd';
      resumeBtn.classList.add('pop');
    }, 1000);

    setTimeout(() => {
      finalResume.classList.add('resume-text-visible');
    }, 1800);

    setTimeout(() => {
      window.location.href = href;
    }, 2800);
  });
});



