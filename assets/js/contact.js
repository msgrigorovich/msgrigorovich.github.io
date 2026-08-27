const creditsWindow = document.getElementById('contactCreditsWindow');
const creditsTrack = document.getElementById('contactCreditsTrack');
const contactSignature = document.getElementById('contactSignature');
const contactCard = document.querySelector('.contact-card');
const contactInkCanvas = document.getElementById('contactInkCanvas');

function setupCreditsRoll() {
  if (!creditsWindow || !creditsTrack) return;
  const originals = Array.from(creditsTrack.children);
  [0, 1].forEach(() => {
    originals.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      creditsTrack.appendChild(clone);
    });
  });

  const AUTO_SCROLL_SPEED = 0.42;
  const USER_VELOCITY_DECAY = 0.92;
  let userVelocity = 0;
  let scrollPosition = 0;
  let lastFrame = performance.now();
  let dragging = false;
  let pointerY = 0;
  let previousPointerY = 0;
  let previousPointerTime = 0;

  const loopLength = () => creditsTrack.scrollHeight / 3;
  const normalize = () => {
    const length = loopLength();
    if (!length) return;
    while (scrollPosition >= length * 2) scrollPosition -= length;
    while (scrollPosition < length) scrollPosition += length;
    creditsWindow.scrollTop = scrollPosition;
  };

  const updateDepth = () => {
    const windowRect = creditsWindow.getBoundingClientRect();
    const center = windowRect.top + windowRect.height / 2;
    creditsTrack.querySelectorAll('.contact-credit-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const distance = Math.min(Math.abs(rect.top + rect.height / 2 - center) / (windowRect.height * 0.5), 1);
      card.style.setProperty('--credit-scale', String(1 - distance * 0.14));
      card.style.setProperty('--credit-opacity', String(1 - distance * 0.58));
    });
  };

  const tick = now => {
    const delta = Math.min((now - lastFrame) / 16.67, 3);
    lastFrame = now;
    if (!dragging) {
      scrollPosition += (AUTO_SCROLL_SPEED + userVelocity) * delta;
      userVelocity *= Math.pow(USER_VELOCITY_DECAY, delta);
    }
    normalize();
    updateDepth();
    requestAnimationFrame(tick);
  };

  creditsWindow.addEventListener('wheel', event => {
    event.preventDefault();
    userVelocity = Math.max(-8, Math.min(8, userVelocity + event.deltaY * 0.018));
  }, { passive: false });

  creditsWindow.addEventListener('pointerdown', event => {
    dragging = true;
    pointerY = previousPointerY = event.clientY;
    previousPointerTime = performance.now();
    userVelocity = 0;
    creditsWindow.setPointerCapture(event.pointerId);
  });

  creditsWindow.addEventListener('pointermove', event => {
    if (!dragging) return;
    const now = performance.now();
    pointerY = event.clientY;
    const movement = previousPointerY - pointerY;
    scrollPosition += movement;
    userVelocity = Math.max(-8, Math.min(8, movement / Math.max(now - previousPointerTime, 1) * 12));
    previousPointerY = pointerY;
    previousPointerTime = now;
    normalize();
  });

  const finishDrag = event => {
    dragging = false;
    if (creditsWindow.hasPointerCapture(event.pointerId)) creditsWindow.releasePointerCapture(event.pointerId);
  };
  creditsWindow.addEventListener('pointerup', finishDrag);
  creditsWindow.addEventListener('pointercancel', finishDrag);

  requestAnimationFrame(() => {
    scrollPosition = loopLength() + Math.max(1, originals[0]?.offsetHeight * 0.45 || 1);
    creditsWindow.scrollTop = scrollPosition;
    requestAnimationFrame(tick);
  });
}

function setupContactInk() {
  if (!contactCard || !contactInkCanvas) return;
  const context = contactInkCanvas.getContext('2d');
  const marks = [];
  let previousPoint = null;
  let inkFrame = 0;

  const resize = () => {
    const rect = contactCard.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    contactInkCanvas.width = Math.max(1, Math.round(rect.width * ratio));
    contactInkCanvas.height = Math.max(1, Math.round(rect.height * ratio));
    contactInkCanvas.style.width = `${rect.width}px`;
    contactInkCanvas.style.height = `${rect.height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const draw = now => {
    inkFrame = 0;
    const rect = contactCard.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.globalCompositeOperation = 'source-over';
    context.filter = 'blur(7px)';
    for (let index = marks.length - 1; index >= 0; index -= 1) {
      const mark = marks[index];
      const age = now - mark.createdAt;
      if (age >= mark.lifetime) {
        marks.splice(index, 1);
        continue;
      }
      const life = 1 - age / mark.lifetime;
      context.strokeStyle = `rgba(17, 17, 17, ${0.13 * life * life})`;
      context.lineWidth = mark.width * (0.72 + life * 0.28);
      context.beginPath();
      context.moveTo(mark.fromX, mark.fromY);
      context.quadraticCurveTo(mark.fromX, mark.fromY, mark.x, mark.y);
      context.stroke();
    }
    context.filter = 'none';
    if (marks.length) inkFrame = requestAnimationFrame(draw);
  };

  contactCard.addEventListener('pointerenter', event => {
    document.body.classList.add('contact-inking');
    const rect = contactCard.getBoundingClientRect();
    previousPoint = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  });

  contactCard.addEventListener('pointermove', event => {
    const rect = contactCard.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (!previousPoint) previousPoint = point;
    const distance = Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y);
    if (distance >= 2) {
      marks.push({
        fromX: previousPoint.x,
        fromY: previousPoint.y,
        x: point.x,
        y: point.y,
        width: Math.min(30, 17 + distance * 0.16),
        createdAt: performance.now(),
        lifetime: 460
      });
      if (marks.length > 55) marks.splice(0, marks.length - 55);
      if (!inkFrame) inkFrame = requestAnimationFrame(draw);
    }
    previousPoint = point;
  });

  contactCard.addEventListener('pointerleave', () => {
    document.body.classList.remove('contact-inking');
    previousPoint = null;
  });

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(contactCard);
  else window.addEventListener('resize', resize);
  resize();
}

async function setupContactSignature() {
  if (!contactSignature) return;
  try {
    const response = await fetch('/');
    if (!response.ok) throw new Error('Signature source unavailable');
    const documentText = await response.text();
    const source = new DOMParser().parseFromString(documentText, 'text/html').querySelector('.name-signature');
    if (!source) throw new Error('Signature SVG missing');
    const svg = document.importNode(source, true);
    svg.removeAttribute('role');
    svg.removeAttribute('aria-label');
    svg.setAttribute('aria-hidden', 'true');
    contactSignature.replaceChildren(svg);

    const paths = Array.from(svg.querySelectorAll('.signature-path'))
      .map(path => ({ path, box: path.getBBox(), d: path.getAttribute('d') }))
      .sort((a, b) => a.box.x - b.box.x);
    const namespace = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(namespace, 'defs');
    svg.insertBefore(defs, svg.firstChild);
    const traces = paths.map(({ path, d }, index) => {
      const mask = document.createElementNS(namespace, 'mask');
      const trace = document.createElementNS(namespace, 'path');
      const id = `contact-signature-mask-${index}`;
      mask.id = id;
      mask.setAttribute('maskUnits', 'userSpaceOnUse');
      trace.setAttribute('d', d);
      trace.setAttribute('fill', 'none');
      trace.setAttribute('stroke', '#fff');
      trace.setAttribute('stroke-width', '18');
      trace.setAttribute('stroke-linecap', 'round');
      trace.setAttribute('stroke-linejoin', 'round');
      mask.appendChild(trace);
      defs.appendChild(mask);
      path.setAttribute('mask', `url(#${id})`);
      const length = trace.getTotalLength();
      trace.style.strokeDasharray = length;
      trace.style.strokeDashoffset = length;
      return { trace, length, delay: index * 55 };
    });

    contactSignature.classList.add('ready');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      traces.forEach(({ trace }) => { trace.style.strokeDashoffset = '0'; });
      return;
    }
    traces.forEach(({ trace, length, delay }) => {
      trace.animate(
        [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
        { duration: 230, delay: 280 + delay, easing: 'ease-out', fill: 'forwards' }
      );
    });
  } catch (error) {
    contactSignature.classList.add('fallback-visible');
  }
}

setupCreditsRoll();
setupContactInk();
setupContactSignature();
