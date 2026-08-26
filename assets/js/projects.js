const portraits = [
  {
    title: 'Albert Einstein',
    year: '2015',
    src: '/assets/images/portraits/albert-einstein-2015.png',
    summary: 'A study of character, contrast, and the small details that make a face recognisable.'
  },
  {
    title: 'Robert Pattinson',
    year: '2016',
    src: '/assets/images/portraits/robert-pattinson-2016.png',
    summary: 'A profile built through restrained values, texture, and the tension of a quiet moment.'
  },
  {
    title: 'Colton Haynes',
    year: '2018',
    src: '/assets/images/portraits/colton-haynes-2018.png',
    summary: 'An exercise in directional light, facial structure, and the weight of deep shadow.'
  },
  {
    title: 'Daria Ivanova',
    year: '2022',
    src: '/assets/images/portraits/daria-ivanova-2022.png',
    summary: 'A tonal portrait focused on silhouette, hair rhythm, and a calm, direct expression.'
  }
];

const portraitViewer = document.getElementById('portraitViewer');
const portraitImage = document.getElementById('portraitMainImage');
const portraitLens = document.getElementById('portraitLens');
const portraitTitle = document.getElementById('portraitTitle');
const portraitYear = document.getElementById('portraitYear');
const portraitOpen = document.getElementById('portraitOpen');
const portraitThumbs = Array.from(document.querySelectorAll('[data-portrait-index]'));
const portraitModal = document.getElementById('portraitModal');
const portraitModalImage = document.getElementById('portraitModalImage');
const portraitModalTitle = document.getElementById('portraitModalTitle');
const portraitModalYear = document.getElementById('portraitModalYear');
const portraitModalClose = document.getElementById('portraitModalClose');
const portraitModalSummary = document.getElementById('portraitModalSummary');
const portraitModalStage = document.getElementById('portraitModalStage');
const portraitModalPaper = document.getElementById('portraitModalPaper');
const portraitModalLens = document.getElementById('portraitModalLens');
const portraitDrawCanvas = document.getElementById('portraitDrawCanvas');
const portraitSmudgeCursor = document.getElementById('portraitSmudgeCursor');
const portraitFingerprintPath = document.getElementById('portraitFingerprintPath');
const fingerprintPathData = [
  'M24 3C11 3 4 13 4 27c0 12 5 22 14 28',
  'M24 7C14 7 8 15 8 27c0 11 5 19 13 25',
  'M24 11c-8 0-12 7-12 16 0 10 4 17 11 22',
  'M24 15c-5 0-8 5-8 12 0 8 3 14 9 19',
  'M24 19c-3 0-4 3-4 8 0 7 3 12 8 16',
  'M24 3c13 0 20 10 20 24 0 12-6 23-15 29',
  'M24 7c10 0 16 8 16 20 0 11-5 20-13 25',
  'M24 11c8 0 12 7 12 16 0 10-4 17-11 22',
  'M24 15c5 0 8 5 8 12 0 8-3 14-8 19',
  'M24 19c3 0 4 3 4 8 0 6-2 11-5 15',
  'M23 25c0 6 2 10 6 13',
  'M18 31c1 8 5 14 11 18'
].join(' ');
portraitFingerprintPath.setAttribute('d', fingerprintPathData);
const canvasFingerprintPath = new Path2D(fingerprintPathData);
const sharedCursorElements = [
  document.querySelector('.cursor-dot'),
  document.querySelector('.cursor-outline'),
  document.querySelector('.cursor-trail'),
  portraitSmudgeCursor
].filter(Boolean);
const portraitModeTabs = Array.from(document.querySelectorAll('[data-portrait-mode]'));
const portraitToolPanels = Array.from(document.querySelectorAll('[data-portrait-panel]'));
const graphiteTones = Array.from(document.querySelectorAll('[data-graphite]'));
const drawToolButtons = Array.from(document.querySelectorAll('[data-draw-tool]'));
const portraitDrawUndo = document.getElementById('portraitDrawUndo');
const portraitDrawClear = document.getElementById('portraitDrawClear');
const portraitLensSize = document.getElementById('portraitLensSize');
const portraitLensZoom = document.getElementById('portraitLensZoom');
const portraitLensSizeValue = document.getElementById('portraitLensSizeValue');
const portraitLensZoomValue = document.getElementById('portraitLensZoomValue');
let activePortraitIndex = 0;
let lensSize = Number(portraitLensSize.value);
let lensZoom = Number(portraitLensZoom.value);
let portraitMode = 'magnify';
let graphiteAlpha = 0.58;
let drawTool = 'finger';
let drawing = false;
let previousDrawPoint = null;
let pendingDrawPoint = null;
let pendingDrawPressure = 0.5;
let drawingFrame = 0;
let strokeConcentration = 1;
let previousDrawTime = 0;
let modalPointerInside = false;
let previousFingerEdges = null;
let lastCursorPoint = null;
let cursorToolAngle = -12;
let drawHistory = [];
const blurredPortraitCanvas = document.createElement('canvas');
let originalPortraitPixels = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function setLensSize(value) {
  lensSize = Math.round(clamp(value, Number(portraitLensSize.min), Number(portraitLensSize.max)));
  portraitLensSize.value = String(lensSize);
  portraitLens.style.width = `${lensSize}px`;
  portraitLens.style.height = `${lensSize}px`;
  portraitLensSizeValue.value = String(lensSize);
}

function setLensZoom(value) {
  lensZoom = clamp(value, Number(portraitLensZoom.min), Number(portraitLensZoom.max));
  portraitLensZoom.value = lensZoom.toFixed(2);
  portraitLensZoomValue.value = `${lensZoom.toFixed(2)}×`;
}

function portraitAlt(portrait) {
  return `Graphite portrait of ${portrait.title}`;
}

function selectPortrait(index) {
  const nextIndex = Math.max(0, Math.min(portraits.length - 1, index));
  const portrait = portraits[nextIndex];
  activePortraitIndex = nextIndex;

  portraitImage.src = portrait.src;
  portraitImage.alt = portraitAlt(portrait);
  portraitTitle.textContent = portrait.title;
  portraitYear.textContent = portrait.year;
  portraitOpen.setAttribute('aria-label', `Open ${portrait.title} portrait in full view`);
  portraitLens.style.backgroundImage = `url("${portrait.src}")`;

  portraitThumbs.forEach((thumb, thumbIndex) => {
    thumb.classList.toggle('active', thumbIndex === nextIndex);
    thumb.setAttribute('aria-pressed', thumbIndex === nextIndex ? 'true' : 'false');
  });
}

function updatePortraitLens(event) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const rect = portraitViewer.getBoundingClientRect();
  const imageRect = portraitImage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const renderedLensSize = portraitLens.offsetWidth;
  const imageX = event.clientX - imageRect.left;
  const imageY = event.clientY - imageRect.top;

  portraitViewer.classList.add('inspecting');
  document.body.classList.add('portrait-inspecting');
  portraitLens.style.left = `${x}px`;
  portraitLens.style.top = `${y}px`;
  portraitLens.style.backgroundSize = `${imageRect.width * lensZoom}px ${imageRect.height * lensZoom}px`;
  portraitLens.style.backgroundPosition = `${-(imageX * lensZoom - renderedLensSize / 2)}px ${-(imageY * lensZoom - renderedLensSize / 2)}px`;
}

function openPortraitModal() {
  const portrait = portraits[activePortraitIndex];
  portraitModalImage.src = portrait.src;
  portraitModalImage.alt = portraitAlt(portrait);
  portraitModalTitle.textContent = portrait.title;
  portraitModalYear.textContent = portrait.year;
  portraitModalSummary.textContent = portrait.summary;
  portraitModalLens.style.backgroundImage = `url("${portrait.src}")`;
  document.body.classList.add('portrait-modal-open');
  sharedCursorElements.forEach(element => portraitModal.appendChild(element));
  portraitModal.showModal();
  setPortraitMode('magnify');
  resetDrawingCanvas();
  requestAnimationFrame(resetDrawingCanvas);
}

function setPortraitMode(mode) {
  portraitMode = mode;
  document.body.classList.remove('is-smudging');
  if (mode === 'draw') setDrawTool('finger');
  portraitModalWorkspaceMode(mode);
  portraitModeTabs.forEach(tab => {
    const selected = tab.dataset.portraitMode === mode;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', selected ? 'true' : 'false');
  });
  portraitToolPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.portraitPanel === mode));
  portraitModalLens.classList.remove('visible');
  syncPortraitCursorMode();
}

function setDrawTool(tool) {
  drawTool = tool;
  if (tool === 'pencil') {
    cursorToolAngle = -12;
    portraitSmudgeCursor.style.setProperty('--draw-tool-angle', '-12deg');
  }
  document.body.classList.toggle('draw-tool-pencil', tool === 'pencil');
  drawToolButtons.forEach(button => {
    const selected = button.dataset.drawTool === tool;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });
  previousFingerEdges = null;
}

function portraitModalWorkspaceMode(mode) {
  portraitModalStage.classList.toggle('draw-mode', mode === 'draw');
  portraitModalStage.classList.toggle('magnify-mode', mode === 'magnify');
}

function syncPortraitCursorMode() {
  document.body.classList.toggle('portrait-inspecting', modalPointerInside && portraitMode === 'magnify');
  document.body.classList.toggle('portrait-drawing', portraitModal.open && portraitMode === 'draw');
}

function resetDrawingCanvas() {
  const rect = portraitDrawCanvas.getBoundingClientRect();
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  portraitDrawCanvas.width = Math.max(1, Math.round(rect.width * scale));
  portraitDrawCanvas.height = Math.max(1, Math.round(rect.height * scale));
  const context = portraitDrawCanvas.getContext('2d');
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.clearRect(0, 0, rect.width, rect.height);
  drawHistory = [];
  rebuildBlurredPortrait(rect.width, rect.height);
}

function rebuildBlurredPortrait(width, height) {
  blurredPortraitCanvas.width = Math.max(1, Math.round(width));
  blurredPortraitCanvas.height = Math.max(1, Math.round(height));
  const context = blurredPortraitCanvas.getContext('2d');
  context.clearRect(0, 0, width, height);
  context.filter = 'blur(5px)';
  context.drawImage(portraitModalImage, -6, -6, width + 12, height + 12);
  context.filter = 'none';
  originalPortraitPixels = context.getImageData(0, 0, blurredPortraitCanvas.width, blurredPortraitCanvas.height);
}

function sampleOriginalShade(point) {
  if (!originalPortraitPixels) return 238;
  const x = Math.round(clamp(point.x, 0, originalPortraitPixels.width - 1));
  const y = Math.round(clamp(point.y, 0, originalPortraitPixels.height - 1));
  const index = (y * originalPortraitPixels.width + x) * 4;
  const data = originalPortraitPixels.data;
  return Math.round(data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722);
}

function selectedGraphiteShade() {
  const normalized = clamp((graphiteAlpha - 0.2) / 0.7, 0, 1);
  return Math.round(225 - normalized * 211);
}

function mixedGraphiteShade(point) {
  return Math.round(sampleOriginalShade(point) * 0.16 + selectedGraphiteShade() * 0.84);
}

function canvasPoint(event) {
  const rect = portraitDrawCanvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function drawFingerprintStamp(point, concentration, angle = -0.2, pressure = 0.5, isSmearing = false) {
  const context = portraitDrawCanvas.getContext('2d');
  const normalizedGraphite = clamp((graphiteAlpha - 0.2) / 0.7, 0, 1);
  const graphiteShade = mixedGraphiteShade(point);
  const width = 26 + pressure * 10;
  const height = width * 1.28;

  context.save();
  context.beginPath();
  context.ellipse(point.x, point.y, width * 0.47, height * 0.48, angle, 0, Math.PI * 2);
  context.clip();
  context.globalCompositeOperation = 'source-over';
  context.globalAlpha = (0.1 + (1 - normalizedGraphite) * 0.05) * concentration;
  context.drawImage(blurredPortraitCanvas, 0, 0);

  context.globalCompositeOperation = 'multiply';
  context.translate(point.x, point.y);
  context.rotate(angle);
  context.scale(1, 1.28);
  const pigment = context.createRadialGradient(0, 0, 1, 0, 0, width * 0.52);
  const centerDensity = isSmearing ? 0.42 : 0.54;
  const edgeDensity = isSmearing ? 0.13 : 0.28;
  pigment.addColorStop(0, `rgba(${graphiteShade}, ${graphiteShade}, ${graphiteShade}, ${(centerDensity + normalizedGraphite * 0.3) * concentration})`);
  pigment.addColorStop(0.66, `rgba(${graphiteShade}, ${graphiteShade}, ${graphiteShade}, ${(edgeDensity + normalizedGraphite * 0.24) * concentration})`);
  pigment.addColorStop(1, `rgba(${graphiteShade}, ${graphiteShade}, ${graphiteShade}, 0)`);
  context.fillStyle = pigment;
  context.beginPath();
  context.arc(0, 0, width * 0.52, 0, Math.PI * 2);
  context.fill();
  context.restore();

  if (isSmearing) return;

  context.save();
  context.translate(point.x, point.y);
  context.rotate(angle);
  context.scale(width / 48, height / 58);
  context.translate(-24, -29);
  context.globalCompositeOperation = 'multiply';
  context.strokeStyle = `rgb(${graphiteShade}, ${graphiteShade}, ${graphiteShade})`;
  context.globalAlpha = (0.22 + normalizedGraphite * 0.48) * concentration;
  context.lineWidth = 1.15;
  context.lineCap = 'round';
  context.stroke(canvasFingerprintPath);
  context.restore();
}

function drawFingerSegment(from, to, pressure = 0.5) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const now = performance.now();
  const elapsed = previousDrawTime ? now - previousDrawTime : 0;
  previousDrawTime = now;
  strokeConcentration = Math.max(
    0.1,
    strokeConcentration * Math.exp(-(distance / 620) - (elapsed / 4200))
  );
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const angle = Math.atan2(deltaY, deltaX) - Math.PI / 2;
  const steps = Math.max(1, Math.min(12, Math.ceil(distance / 3.5)));
  for (let step = 1; step <= steps; step += 1) {
    const progress = step / steps;
    const point = {
      x: from.x + deltaX * progress,
      y: from.y + deltaY * progress
    };
    drawFingerprintStamp(point, strokeConcentration * 0.31, angle, pressure, true);
  }

  const context = portraitDrawCanvas.getContext('2d');
  const width = 26 + pressure * 10;
  const normalX = Math.cos(angle) * width * 0.43;
  const normalY = Math.sin(angle) * width * 0.43;
  const edges = {
    left: { x: to.x - normalX, y: to.y - normalY },
    right: { x: to.x + normalX, y: to.y + normalY }
  };
  if (previousFingerEdges) {
    const shade = mixedGraphiteShade(to);
    context.save();
    context.globalCompositeOperation = 'multiply';
    context.strokeStyle = `rgb(${shade}, ${shade}, ${shade})`;
    context.globalAlpha = (0.14 + graphiteAlpha * 0.16) * strokeConcentration;
    context.lineWidth = 1.15 + pressure * 0.7;
    context.lineCap = 'round';
    ['left', 'right'].forEach(side => {
      context.beginPath();
      context.moveTo(previousFingerEdges[side].x, previousFingerEdges[side].y);
      context.lineTo(edges[side].x, edges[side].y);
      context.stroke();
    });
    context.restore();
  }
  previousFingerEdges = edges;
}

function drawPencilSegment(from, to, pressure = 0.5) {
  const context = portraitDrawCanvas.getContext('2d');
  const shade = selectedGraphiteShade();
  const normalizedGraphite = clamp((graphiteAlpha - 0.2) / 0.7, 0, 1);
  const speed = Math.max(1, Math.hypot(to.x - from.x, to.y - from.y));
  const width = 0.4 + pressure * 0.82 + normalizedGraphite * 0.88;
  context.save();
  context.globalCompositeOperation = 'multiply';
  context.lineCap = 'round';
  context.lineJoin = 'round';
  for (let strand = 0; strand < 3; strand += 1) {
    const jitter = (strand - 1) * 0.38;
    context.beginPath();
    context.moveTo(from.x + jitter, from.y - jitter);
    context.lineTo(to.x + jitter * 0.45, to.y - jitter * 0.45);
    context.lineWidth = width * (strand === 1 ? 0.72 : 0.24);
    context.strokeStyle = `rgb(${shade}, ${shade}, ${shade})`;
    context.globalAlpha = (0.07 + normalizedGraphite * 0.73) * Math.min(1, 8 / speed + 0.22);
    context.stroke();
  }
  context.restore();
}

function drawGraphiteSegment(from, to, pressure = 0.5) {
  if (drawTool === 'pencil') drawPencilSegment(from, to, pressure);
  else drawFingerSegment(from, to, pressure);
}

function saveDrawingState() {
  const context = portraitDrawCanvas.getContext('2d');
  drawHistory.push(context.getImageData(0, 0, portraitDrawCanvas.width, portraitDrawCanvas.height));
  if (drawHistory.length > 12) drawHistory.shift();
}

function updateModalLens(event) {
  if (portraitMode !== 'magnify') return;
  const paperRect = portraitModalPaper.getBoundingClientRect();
  const imageRect = portraitModalImage.getBoundingClientRect();
  const x = event.clientX - paperRect.left;
  const y = event.clientY - paperRect.top;
  const imageX = event.clientX - imageRect.left;
  const imageY = event.clientY - imageRect.top;
  const lensDiameter = portraitModalLens.offsetWidth;
  const modalZoom = Math.max(3.25, lensZoom);
  portraitModalLens.classList.add('visible');
  portraitModalLens.style.left = `${x}px`;
  portraitModalLens.style.top = `${y}px`;
  portraitModalLens.style.backgroundSize = `${imageRect.width * modalZoom}px ${imageRect.height * modalZoom}px`;
  portraitModalLens.style.backgroundPosition = `${-(imageX * modalZoom - lensDiameter / 2)}px ${-(imageY * modalZoom - lensDiameter / 2)}px`;
}

function closePortraitModal() {
  if (!portraitModal.open) return;
  portraitModal.close();
  sharedCursorElements.forEach(element => document.body.appendChild(element));
  document.body.classList.remove('portrait-modal-open');
  document.body.classList.remove('portrait-inspecting', 'portrait-drawing', 'is-smudging', 'draw-tool-pencil');
  modalPointerInside = false;
}

portraitThumbs.forEach(thumb => {
  thumb.addEventListener('click', () => selectPortrait(Number(thumb.dataset.portraitIndex)));
});

portraitViewer.addEventListener('mousemove', updatePortraitLens);
portraitViewer.addEventListener('mouseleave', () => {
  portraitViewer.classList.remove('inspecting');
  document.body.classList.remove('portrait-inspecting');
});
portraitOpen.addEventListener('click', openPortraitModal);
portraitModalClose.addEventListener('click', closePortraitModal);
portraitModal.addEventListener('click', event => {
  if (event.target === portraitModal) closePortraitModal();
});
portraitModal.addEventListener('cancel', event => {
  event.preventDefault();
  closePortraitModal();
});
portraitModal.addEventListener('pointermove', event => {
  portraitSmudgeCursor.style.left = `${event.clientX}px`;
  portraitSmudgeCursor.style.top = `${event.clientY}px`;
  if (lastCursorPoint) {
    const deltaX = event.clientX - lastCursorPoint.x;
    const deltaY = event.clientY - lastCursorPoint.y;
    if (Math.hypot(deltaX, deltaY) > 1.5) {
      const movementAngle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
      const isStraightDown = deltaY > 0 && Math.abs(deltaX) < Math.abs(deltaY) * 0.32;
      const targetAngle = drawTool === 'pencil'
        ? -12
        : isStraightDown ? -12 : movementAngle - 90;
      const deltaAngle = ((targetAngle - cursorToolAngle + 540) % 360) - 180;
      cursorToolAngle += deltaAngle * (drawTool === 'pencil' ? 1 : 0.34);
      portraitSmudgeCursor.style.setProperty('--draw-tool-angle', `${cursorToolAngle}deg`);
    }
  }
  lastCursorPoint = { x: event.clientX, y: event.clientY };
});

portraitModeTabs.forEach(tab => {
  tab.addEventListener('click', () => setPortraitMode(tab.dataset.portraitMode));
});

drawToolButtons.forEach(button => {
  button.addEventListener('click', () => setDrawTool(button.dataset.drawTool));
});

graphiteTones.forEach(tone => {
  const normalizedTone = (Number(tone.dataset.tone) - 0.2) / 0.7;
  const graphiteValue = Math.round(225 - normalizedTone * 211);
  tone.style.setProperty('--graphite-value', String(graphiteValue));
  tone.style.setProperty('--graphite-opacity', String(0.28 + normalizedTone * 0.72));
  tone.style.setProperty('--graphite-spacing', `${5.2 - normalizedTone * 3.65}px`);
  tone.style.setProperty('--graphite-secondary-opacity', String(0.2 + normalizedTone * 0.62));
  tone.style.setProperty('--graphite-secondary-spacing', `${7.2 - normalizedTone * 4.85}px`);
  tone.addEventListener('click', () => {
    graphiteAlpha = Number(tone.dataset.tone);
    portraitSmudgeCursor.style.setProperty('--smudge-cursor-value', String(graphiteValue));
    graphiteTones.forEach(item => item.classList.toggle('selected', item === tone));
  });
});

const animatedPortraitControls = Array.from(portraitModal.querySelectorAll([
  '[data-portrait-mode]',
  '[data-graphite]',
  '[data-draw-tool]',
  '#portraitDrawUndo',
  '#portraitDrawClear',
  '#portraitModalClose'
].join(',')));

animatedPortraitControls.forEach(control => {
  control.addEventListener('pointerenter', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    control.classList.remove('droplet-impact', 'droplet-release');
    void control.offsetWidth;
    control.classList.add('droplet-impact');
  });
  control.addEventListener('pointerleave', event => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = control.getBoundingClientRect();
    const angle = Math.atan2(
      event.clientY - (rect.top + rect.height / 2),
      event.clientX - (rect.left + rect.width / 2)
    ) * 180 / Math.PI;
    control.style.setProperty('--droplet-release-angle', `${angle}deg`);
    control.style.setProperty('--droplet-release-angle-reverse', `${-angle}deg`);
    control.classList.remove('droplet-impact', 'droplet-release');
    void control.offsetWidth;
    control.classList.add('droplet-release');
  });
});

portraitModalImage.addEventListener('load', () => {
  if (portraitModal.open) resetDrawingCanvas();
});

portraitModalPaper.addEventListener('pointermove', event => {
  portraitSmudgeCursor.style.left = `${event.clientX}px`;
  portraitSmudgeCursor.style.top = `${event.clientY}px`;
  if (portraitMode === 'magnify') {
    updateModalLens(event);
    return;
  }
  if (!drawing || !previousDrawPoint) return;
  event.preventDefault();
  pendingDrawPoint = canvasPoint(event);
  pendingDrawPressure = event.pressure || 0.5;
  if (drawingFrame) return;
  drawingFrame = requestAnimationFrame(() => {
    drawingFrame = 0;
    if (!drawing || !previousDrawPoint || !pendingDrawPoint) return;
    drawGraphiteSegment(previousDrawPoint, pendingDrawPoint, pendingDrawPressure);
    previousDrawPoint = pendingDrawPoint;
    pendingDrawPoint = null;
  });
});

portraitModalPaper.addEventListener('pointerleave', () => {
  portraitModalLens.classList.remove('visible');
  modalPointerInside = false;
  syncPortraitCursorMode();
});

portraitModalPaper.addEventListener('pointerenter', event => {
  modalPointerInside = true;
  portraitSmudgeCursor.style.left = `${event.clientX}px`;
  portraitSmudgeCursor.style.top = `${event.clientY}px`;
  syncPortraitCursorMode();
});

portraitDrawCanvas.addEventListener('pointerdown', event => {
  if (portraitMode !== 'draw') return;
  event.preventDefault();
  saveDrawingState();
  drawing = true;
  document.body.classList.add('is-smudging');
  strokeConcentration = 1;
  previousDrawTime = performance.now();
  previousDrawPoint = canvasPoint(event);
  previousFingerEdges = null;
  if (drawTool === 'finger') {
    drawFingerprintStamp(previousDrawPoint, 0.4, cursorToolAngle * Math.PI / 180, event.pressure || 0.5);
  }
  pendingDrawPoint = null;
  portraitDrawCanvas.setPointerCapture(event.pointerId);
});

const finishDrawing = event => {
  if (!drawing) return;
  if (drawingFrame) {
    cancelAnimationFrame(drawingFrame);
    drawingFrame = 0;
  }
  if (previousDrawPoint && pendingDrawPoint) {
    drawGraphiteSegment(previousDrawPoint, pendingDrawPoint, pendingDrawPressure);
  }
  drawing = false;
  document.body.classList.remove('is-smudging');
  previousDrawTime = 0;
  previousDrawPoint = null;
  pendingDrawPoint = null;
  if (portraitDrawCanvas.hasPointerCapture(event.pointerId)) portraitDrawCanvas.releasePointerCapture(event.pointerId);
};

portraitDrawCanvas.addEventListener('pointerup', finishDrawing);
portraitDrawCanvas.addEventListener('pointercancel', finishDrawing);

portraitDrawUndo.addEventListener('click', () => {
  const previousState = drawHistory.pop();
  if (!previousState) return;
  const context = portraitDrawCanvas.getContext('2d');
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, portraitDrawCanvas.width, portraitDrawCanvas.height);
  context.putImageData(previousState, 0, 0);
  context.restore();
});

portraitDrawClear.addEventListener('click', () => {
  saveDrawingState();
  const context = portraitDrawCanvas.getContext('2d');
  context.clearRect(0, 0, portraitDrawCanvas.clientWidth, portraitDrawCanvas.clientHeight);
});

portraitModalPaper.addEventListener('wheel', event => {
  if (portraitMode !== 'magnify') return;
  event.preventDefault();
  const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
  setLensZoom(lensZoom - delta * 0.0035);
  updateModalLens(event);
}, { passive: false });

portraitLensSize.addEventListener('input', () => {
  setLensSize(Number(portraitLensSize.value));
});

portraitLensZoom.addEventListener('input', () => {
  setLensZoom(Number(portraitLensZoom.value));
});

portraitViewer.addEventListener('wheel', event => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  event.preventDefault();
  const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
  setLensZoom(lensZoom - delta * 0.0035);
  updatePortraitLens(event);
}, { passive: false });

function increaseLensSize(event) {
  const maximumSize = Number(portraitLensSize.max);
  const minimumSize = Number(portraitLensSize.min);
  setLensSize(lensSize >= maximumSize ? minimumSize : lensSize * 1.1);
  updatePortraitLens(event);
}

portraitViewer.addEventListener('click', event => {
  if (event.target.closest('.portrait-open')) return;
  increaseLensSize(event);
});

setLensSize(lensSize);
setLensZoom(lensZoom);
selectPortrait(0);
