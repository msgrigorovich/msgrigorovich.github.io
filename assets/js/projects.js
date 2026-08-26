const portraits = [
  {
    title: 'Albert Einstein',
    year: '2015',
    src: '/assets/images/portraits/albert-einstein-2015.png',
    summary: "What I love most about this portrait is the carefully rendered texture of Albert's moustache and sweater.",
    highlights: [
      { label: 'Moustache', className: 'portrait-detail-moustache' },
      { label: 'Sweater', className: 'portrait-detail-sweater' }
    ]
  },
  {
    title: 'Robert Pattinson',
    year: '2016',
    src: '/assets/images/portraits/robert-pattinson-2016.png',
    summary: 'What I love most here is the shadow cast by the hand across the stubble, the carefully drawn fingernail, and the rendering of the hand itself.',
    highlights: [
      { label: 'Hand shadow', src: '/assets/images/portraits/highlights/robert-shadow.png' },
      { label: 'Fingernail', src: '/assets/images/portraits/highlights/robert-nail.png' },
      { label: 'Hand', src: '/assets/images/portraits/highlights/robert-hand.png' }
    ]
  },
  {
    title: 'Colton Haynes',
    year: '2018',
    src: '/assets/images/portraits/colton-haynes-2018.png',
    summary: 'What I love most here is the transition of tone and shadow across the shirt-collar fold, and the shift from light to shadow along its seam.',
    highlights: [
      { label: 'Collar fold', src: '/assets/images/portraits/highlights/colton-fold.png' },
      { label: 'Collar seam', src: '/assets/images/portraits/highlights/colton-seam.png' }
    ]
  },
  {
    title: 'Daria Ivanova',
    year: '2022',
    src: '/assets/images/portraits/daria-ivanova-2022.png',
    summary: 'What I love most here is the detailing of the eyes and the transition between light and shadow around the parting of the hair.',
    highlights: [
      { label: 'Left eye', src: '/assets/images/portraits/highlights/daria-eye-left.png' },
      { label: 'Right eye', src: '/assets/images/portraits/highlights/daria-eye-right.png' },
      { label: 'Hair part', src: '/assets/images/portraits/highlights/daria-hair-part.png' }
    ]
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
const portraitDetailFocus = document.getElementById('portraitDetailFocus');
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
const portraitModalLensSize = document.getElementById('portraitModalLensSize');
const portraitModalLensZoom = document.getElementById('portraitModalLensZoom');
const portraitModalLensSizeValue = document.getElementById('portraitModalLensSizeValue');
const portraitModalLensZoomValue = document.getElementById('portraitModalLensZoomValue');
let activePortraitIndex = 0;
let lensSize = Number(portraitLensSize.value);
let lensZoom = Number(portraitLensZoom.value);
let portraitMode = 'magnify';
let graphiteAlpha = null;
let drawTool = 'finger';
let drawing = false;
let previousDrawPoint = null;
let pendingDrawPoint = null;
let pendingDrawPressure = 0.5;
let drawingFrame = 0;
let hoverSmudgeFrame = 0;
let pendingHoverSmudgePoint = null;
let fingerSmudgePrimed = false;
let strokeConcentration = 1;
let previousDrawTime = 0;
let modalPointerInside = false;
let lastCursorPoint = null;
let cursorToolAngle = -12;
let drawHistory = [];
let drawingCanvasReady = false;
const basePortraitCanvas = document.createElement('canvas');

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function setLensSize(value) {
  lensSize = Math.round(clamp(value, Number(portraitLensSize.min), Number(portraitLensSize.max)));
  portraitLensSize.value = String(lensSize);
  portraitLens.style.width = `${lensSize}px`;
  portraitLens.style.height = `${lensSize}px`;
  portraitModalLens.style.width = `${lensSize}px`;
  portraitModalLens.style.height = `${lensSize}px`;
  portraitLensSizeValue.value = String(lensSize);
  portraitModalLensSize.value = String(lensSize);
  portraitModalLensSizeValue.value = String(lensSize);
}

function setLensZoom(value) {
  lensZoom = clamp(value, Number(portraitLensZoom.min), Number(portraitLensZoom.max));
  portraitLensZoom.value = lensZoom.toFixed(2);
  portraitLensZoomValue.value = `${lensZoom.toFixed(2)}×`;
  portraitModalLensZoom.value = lensZoom.toFixed(2);
  portraitModalLensZoomValue.value = `${lensZoom.toFixed(2)}×`;
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
  renderPortraitHighlights(portrait);
  portraitModalLens.style.backgroundImage = `url("${portrait.src}")`;
  drawingCanvasReady = false;
  document.body.classList.add('portrait-modal-open');
  sharedCursorElements.forEach(element => portraitModal.appendChild(element));
  portraitModal.showModal();
  modalPointerInside = true;
  setPortraitMode('magnify');
  requestAnimationFrame(() => {
    modalPointerInside = true;
    syncPortraitCursorMode();
  });
  resetDrawingCanvas();
  requestAnimationFrame(resetDrawingCanvas);
}

function renderPortraitHighlights(portrait) {
  const highlights = portrait.highlights || [];
  portraitDetailFocus.replaceChildren();
  portraitDetailFocus.hidden = highlights.length === 0;
  portraitDetailFocus.classList.toggle('is-trio', highlights.length === 3);

  highlights.forEach(highlight => {
    const figure = document.createElement('figure');
    const crop = document.createElement('span');
    const caption = document.createElement('figcaption');
    crop.className = `portrait-detail-crop${highlight.className ? ` ${highlight.className}` : ' portrait-detail-image'}`;
    crop.setAttribute('aria-hidden', 'true');
    crop.style.backgroundImage = `url("${highlight.src || portrait.src}")`;
    caption.textContent = highlight.label;
    figure.append(crop, caption);
    portraitDetailFocus.append(figure);
  });
}

function setPortraitMode(mode) {
  portraitMode = mode;
  document.body.classList.remove('is-smudging');
  if (mode === 'draw') {
    setDrawTool('finger');
    selectGraphiteTone(graphiteTones.find(tone => tone.dataset.tone === 'none'));
  }
  if (mode === 'magnify' && drawingCanvasReady) refreshModalLensArtwork();
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
  fingerSmudgePrimed = false;
  pendingHoverSmudgePoint = null;
  if (tool === 'pencil' || tool === 'eraser') {
    cursorToolAngle = -12;
    portraitSmudgeCursor.style.setProperty('--draw-tool-angle', '-12deg');
  }
  document.body.classList.toggle('draw-tool-pencil', tool === 'pencil');
  document.body.classList.toggle('draw-tool-eraser', tool === 'eraser');
  graphiteTones.forEach(tone => {
    const disabled = tool === 'eraser' && tone.dataset.tone !== 'none';
    tone.disabled = disabled;
    tone.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  });
  if (tool === 'pencil') {
    selectGraphiteTone(graphiteTones.find(tone => tone.dataset.graphite === '6B'));
  } else if (tool === 'eraser') {
    selectGraphiteTone(graphiteTones.find(tone => tone.dataset.tone === 'none'));
  }
  drawToolButtons.forEach(button => {
    const selected = button.dataset.drawTool === tool;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });
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
  const displayWidth = Math.max(1, rect.width);
  const displayHeight = Math.max(1, rect.height);
  const nativeScale = Math.max(
    portraitModalImage.naturalWidth / displayWidth || 1,
    portraitModalImage.naturalHeight / displayHeight || 1
  );
  const scale = Math.min(Math.max(window.devicePixelRatio || 1, nativeScale), 4);
  portraitDrawCanvas.width = Math.max(1, Math.round(rect.width * scale));
  portraitDrawCanvas.height = Math.max(1, Math.round(rect.height * scale));
  const context = portraitDrawCanvas.getContext('2d');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  rebuildBasePortrait();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, portraitDrawCanvas.width, portraitDrawCanvas.height);
  context.drawImage(basePortraitCanvas, 0, 0);
  context.setTransform(scale, 0, 0, scale, 0, 0);
  drawHistory = [];
  drawingCanvasReady = true;
  if (portraitMode === 'magnify') refreshModalLensArtwork();
}

function refreshModalLensArtwork() {
  if (!drawingCanvasReady || !portraitDrawCanvas.width || !portraitDrawCanvas.height) return;
  portraitModalLens.style.backgroundImage = `url("${portraitDrawCanvas.toDataURL('image/png')}")`;
}

function rebuildBasePortrait() {
  basePortraitCanvas.width = portraitDrawCanvas.width;
  basePortraitCanvas.height = portraitDrawCanvas.height;
  const context = basePortraitCanvas.getContext('2d');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.clearRect(0, 0, basePortraitCanvas.width, basePortraitCanvas.height);
  context.filter = 'grayscale(1)';
  context.drawImage(portraitModalImage, 0, 0, basePortraitCanvas.width, basePortraitCanvas.height);
  context.filter = 'none';
}

function selectedGraphiteShade() {
  if (graphiteAlpha === null) return 255;
  const normalized = clamp((graphiteAlpha - 0.2) / 0.7, 0, 1);
  // A restrained, realistic value range: hard graphite stays pale while 2B
  // remains visibly softer without becoming an artificial near-black ink.
  return Math.round(174 - normalized * 130);
}

function canvasPoint(event) {
  const rect = portraitDrawCanvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function drawFingerprintStamp(point, concentration, angle = -0.2, pressure = 0.5, isSmearing = false) {
  if (graphiteAlpha === null) return;
  const context = portraitDrawCanvas.getContext('2d');
  const normalizedGraphite = clamp((graphiteAlpha - 0.2) / 0.7, 0, 1);
  const graphiteShade = selectedGraphiteShade();
  const width = 26 + pressure * 10;
  const height = width * 1.28;

  context.save();
  context.beginPath();
  context.ellipse(point.x, point.y, width * 0.47, height * 0.48, angle, 0, Math.PI * 2);
  context.clip();
  context.globalCompositeOperation = 'source-over';
  context.translate(point.x, point.y);
  context.rotate(angle);
  context.scale(1, 1.28);
  const pigment = context.createRadialGradient(0, 0, 1, 0, 0, width * 0.52);
  const centerDensity = isSmearing ? 0.155 : 0.11;
  const middleDensity = isSmearing ? 0.1 : 0.07;
  pigment.addColorStop(0, `rgba(${graphiteShade}, ${graphiteShade}, ${graphiteShade}, ${centerDensity * concentration})`);
  pigment.addColorStop(0.58, `rgba(${graphiteShade}, ${graphiteShade}, ${graphiteShade}, ${middleDensity * concentration})`);
  pigment.addColorStop(0.86, `rgba(${graphiteShade}, ${graphiteShade}, ${graphiteShade}, ${0.025 * concentration})`);
  pigment.addColorStop(1, `rgba(${graphiteShade}, ${graphiteShade}, ${graphiteShade}, 0)`);
  context.fillStyle = pigment;
  context.beginPath();
  context.arc(0, 0, width * 0.52, 0, Math.PI * 2);
  context.fill();

  context.globalAlpha = 0.048 * concentration;
  context.fillStyle = `rgb(${graphiteShade}, ${graphiteShade}, ${graphiteShade})`;
  context.lineCap = 'round';
  context.lineWidth = 0.28;
  for (let grain = 0; grain < 5; grain += 1) {
    const grainAngle = Math.random() * Math.PI * 2;
    const grainRadius = Math.sqrt(Math.random()) * width * 0.42;
    const grainX = Math.cos(grainAngle) * grainRadius;
    const grainY = Math.sin(grainAngle) * grainRadius;
    const fiberAngle = -0.8 + Math.random() * 1.6;
    const fiberLength = 0.8 + Math.random() * 3.4;
    context.beginPath();
    context.moveTo(grainX, grainY);
    context.quadraticCurveTo(
      grainX + Math.cos(fiberAngle + 0.35) * fiberLength * 0.55,
      grainY + Math.sin(fiberAngle + 0.35) * fiberLength * 0.55,
      grainX + Math.cos(fiberAngle) * fiberLength,
      grainY + Math.sin(fiberAngle) * fiberLength
    );
    context.strokeStyle = context.fillStyle;
    context.stroke();
  }
  context.restore();

  if (isSmearing) return;

  context.save();
  context.translate(point.x, point.y);
  context.rotate(angle);
  context.scale(width / 48, height / 58);
  context.translate(-24, -29);
  context.globalCompositeOperation = 'source-over';
  context.strokeStyle = `rgb(${graphiteShade}, ${graphiteShade}, ${graphiteShade})`;
  context.globalAlpha = (0.044 + normalizedGraphite * 0.096) * concentration;
  context.lineWidth = 1.15;
  context.lineCap = 'round';
  context.stroke(canvasFingerprintPath);
  context.restore();
}

function smudgeExistingGraphite(point) {
  const context = portraitDrawCanvas.getContext('2d');
  const scaleX = portraitDrawCanvas.width / Math.max(1, portraitDrawCanvas.clientWidth);
  const scaleY = portraitDrawCanvas.height / Math.max(1, portraitDrawCanvas.clientHeight);
  const radiusX = Math.max(10, Math.round(23 * scaleX));
  const radiusY = Math.max(13, Math.round(30 * scaleY));
  const centerX = Math.round(point.x * scaleX);
  const centerY = Math.round(point.y * scaleY);
  const left = clamp(centerX - radiusX, 0, portraitDrawCanvas.width - 1);
  const top = clamp(centerY - radiusY, 0, portraitDrawCanvas.height - 1);
  const width = Math.min(radiusX * 2 + 1, portraitDrawCanvas.width - left);
  const height = Math.min(radiusY * 2 + 1, portraitDrawCanvas.height - top);
  if (width < 3 || height < 3) return;

  const image = context.getImageData(left, top, width, height);
  const source = new Uint8ClampedArray(image.data);
  const sourcePigmentMap = new Float32Array(width * height);
  const candidatePigment = new Float32Array(width * height);
  const summedPigment = new Float64Array((width + 1) * (height + 1));
  let sourceMass = 0;
  let candidateMass = 0;

  const hash = (x, y) => {
    const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return value - Math.floor(value);
  };
  const smoothNoise = (x, y, cellSize) => {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    const localX = x / cellSize - gridX;
    const localY = y / cellSize - gridY;
    const easedX = localX * localX * (3 - 2 * localX);
    const easedY = localY * localY * (3 - 2 * localY);
    const topNoise = hash(gridX, gridY) * (1 - easedX) + hash(gridX + 1, gridY) * easedX;
    const bottomNoise = hash(gridX, gridY + 1) * (1 - easedX) + hash(gridX + 1, gridY + 1) * easedX;
    return topNoise * (1 - easedY) + bottomNoise * easedY;
  };

  for (let y = 0; y < height; y += 1) {
    let rowMass = 0;
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x;
      const index = pixel * 4;
      const sourceLuminance = source[index] * 0.2126 + source[index + 1] * 0.7152 + source[index + 2] * 0.0722;
      const sourcePigment = Math.max(0, 255 - sourceLuminance);
      sourcePigmentMap[pixel] = sourcePigment;
      sourceMass += sourcePigment;
      rowMass += sourcePigment;
      summedPigment[(y + 1) * (width + 1) + x + 1] =
        summedPigment[y * (width + 1) + x + 1] + rowMass;
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x;
      const sourcePigment = sourcePigmentMap[pixel];
      const normalizedX = (x - width / 2) / radiusX;
      const normalizedY = (y - height / 2) / radiusY;
      const distance = Math.hypot(normalizedX, normalizedY);
      if (distance >= 1 || x < 2 || y < 2 || x >= width - 2 || y >= height - 2) {
        candidatePigment[pixel] = sourcePigment;
        candidateMass += sourcePigment;
        continue;
      }
      const sampleLeft = Math.max(0, x - 5);
      const sampleRight = Math.min(width - 1, x + 5);
      const sampleTop = Math.max(0, y - 5);
      const sampleBottom = Math.min(height - 1, y + 5);
      const stride = width + 1;
      const pigment =
        summedPigment[(sampleBottom + 1) * stride + sampleRight + 1]
        - summedPigment[sampleTop * stride + sampleRight + 1]
        - summedPigment[(sampleBottom + 1) * stride + sampleLeft]
        + summedPigment[sampleTop * stride + sampleLeft];
      const samples = (sampleRight - sampleLeft + 1) * (sampleBottom - sampleTop + 1);
      // A broad, slow falloff lets graphite travel beyond the immediate
      // fingertip instead of fading at the first ring around it.
      const influence = (1 - distance * distance * distance) * 0.97;
      const averagePigment = pigment / samples;
      const worldX = left + x;
      const worldY = top + y;
      const coarseGrain = smoothNoise(worldX + 13, worldY - 29, 4.7) - 0.5;
      const fineGrain = hash(worldX * 1.73 + 41, worldY * 1.31 - 17) - 0.5;
      const fiberGrain = smoothNoise(worldX * 0.81 + worldY * 0.13, worldY * 1.19, 1.4) - 0.5;
      // Keep one continuous graphite field, then add only a restrained irregular
      // paper tooth. Mass correction below prevents this texture from erasing pigment.
      const paperPressure = 1 + coarseGrain * 0.012 + fineGrain * 0.008 + fiberGrain * 0.005;
      // Graphite caught in the paper tooth does not instantly dilute to the
      // average of the whole brush. Retaining part of the local concentration
      // keeps a narrow 6B pencil seed as rich as an equivalent finger/original tone.
      const paperBoundPigment = sourcePigment * 0.32 + averagePigment * 0.68;
      const blendedPigment = sourcePigment + (paperBoundPigment - sourcePigment) * influence;
      const nextPigment = Math.max(0, blendedPigment * paperPressure);
      candidatePigment[pixel] = nextPigment;
      candidateMass += nextPigment;
    }
  }
  if (sourceMass <= 0 || candidateMass <= 0) return;
  const massCorrection = sourceMass / candidateMass;
  let renderedMass = 0;
  const activePixels = [];
  for (let pixel = 0; pixel < candidatePigment.length; pixel += 1) {
    const index = pixel * 4;
    const pigment = clamp(Math.round(candidatePigment[pixel] * massCorrection), 0, 255);
    const luminance = 255 - pigment;
    image.data[index] = luminance;
    image.data[index + 1] = luminance;
    image.data[index + 2] = luminance;
    image.data[index + 3] = 255;
    renderedMass += pigment;
    if (pigment > 0 && pigment < 255) activePixels.push(pixel);
  }
  let residual = Math.round(sourceMass - renderedMass);
  for (let cursor = 0; residual !== 0 && activePixels.length && cursor < activePixels.length * 4; cursor += 1) {
    const pixel = activePixels[cursor % activePixels.length];
    const index = pixel * 4;
    const pigment = 255 - image.data[index];
    const adjustment = residual > 0 ? 1 : -1;
    if ((adjustment > 0 && pigment < 255) || (adjustment < 0 && pigment > 0)) {
      const nextLuminance = image.data[index] - adjustment;
      image.data[index] = nextLuminance;
      image.data[index + 1] = nextLuminance;
      image.data[index + 2] = nextLuminance;
      residual -= adjustment;
    }
  }
  context.putImageData(image, left, top);
}

function drawFingerSegment(from, to, pressure = 0.5) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  if (graphiteAlpha === null) {
    const steps = Math.max(1, Math.min(14, Math.ceil(distance / 4)));
    for (let step = 1; step <= steps; step += 1) {
      const progress = step / steps;
      smudgeExistingGraphite({
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress
      });
    }
    return;
  }
  const now = performance.now();
  const elapsed = previousDrawTime ? now - previousDrawTime : 0;
  previousDrawTime = now;
  if (strokeConcentration < 0.018) return;
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const angle = Math.atan2(deltaY, deltaX) - Math.PI / 2;
  const steps = Math.max(1, Math.min(16, Math.ceil(distance / 2.5)));
  for (let step = 1; step <= steps; step += 1) {
    const progress = step / steps;
    const point = {
      x: from.x + deltaX * progress,
      y: from.y + deltaY * progress
    };
    drawFingerprintStamp(point, strokeConcentration, angle, pressure, true);
  }
  strokeConcentration = Math.max(
    0,
    strokeConcentration * Math.exp(-(distance / 175) - (elapsed / 1150))
  );
}

function drawPencilSegment(from, to, pressure = 0.5) {
  if (graphiteAlpha === null) return;
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

function drawEraserSegment(from, to, pressure = 0.5) {
  const context = portraitDrawCanvas.getContext('2d');
  const scaleX = portraitDrawCanvas.width / Math.max(1, portraitDrawCanvas.clientWidth);
  const scaleY = portraitDrawCanvas.height / Math.max(1, portraitDrawCanvas.clientHeight);
  const radiusX = Math.max(8, Math.round((11 + pressure * 6) * scaleX));
  const radiusY = Math.max(7, Math.round((8 + pressure * 5) * scaleY));
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const steps = Math.max(1, Math.ceil(distance / 3));

  for (let step = 1; step <= steps; step += 1) {
    const progress = step / steps;
    const centerX = Math.round((from.x + (to.x - from.x) * progress) * scaleX);
    const centerY = Math.round((from.y + (to.y - from.y) * progress) * scaleY);
    const left = clamp(centerX - radiusX, 0, portraitDrawCanvas.width - 1);
    const top = clamp(centerY - radiusY, 0, portraitDrawCanvas.height - 1);
    const width = Math.min(radiusX * 2 + 1, portraitDrawCanvas.width - left);
    const height = Math.min(radiusY * 2 + 1, portraitDrawCanvas.height - top);
    if (width < 1 || height < 1) continue;

    const image = context.getImageData(left, top, width, height);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const normalizedX = (left + x - centerX) / radiusX;
        const normalizedY = (top + y - centerY) / radiusY;
        const brushDistance = Math.hypot(normalizedX, normalizedY);
        if (brushDistance >= 1) continue;
        const index = (y * width + x) * 4;
        const luminance = image.data[index] * 0.2126 + image.data[index + 1] * 0.7152 + image.data[index + 2] * 0.0722;
        const pigment = 255 - luminance;
        if (pigment <= 0) continue;
        const darkness = pigment / 255;
        const edgePressure = Math.pow(1 - brushDistance, 1.35);
        // Dense/soft graphite resists the eraser, but every pass removes a
        // finite amount so repeated work can still reach clean white paper.
        const removal = Math.max(1, Math.round(
          (3.2 + (1 - darkness) * 8.6) * edgePressure * (0.72 + pressure * 0.56)
        ));
        image.data[index] = Math.min(255, image.data[index] + removal);
        image.data[index + 1] = Math.min(255, image.data[index + 1] + removal);
        image.data[index + 2] = Math.min(255, image.data[index + 2] + removal);
        image.data[index + 3] = 255;
      }
    }
    context.putImageData(image, left, top);
  }
}

function drawGraphiteSegment(from, to, pressure = 0.5) {
  if (drawTool === 'pencil') drawPencilSegment(from, to, pressure);
  else if (drawTool === 'eraser') drawEraserSegment(from, to, pressure);
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
  const modalZoom = lensZoom;
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
  document.body.classList.remove('portrait-inspecting', 'portrait-drawing', 'is-smudging', 'draw-tool-pencil', 'draw-tool-eraser');
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
  if (portraitMode === 'magnify') {
    const paperRect = portraitModalPaper.getBoundingClientRect();
    const pointerOverPaper = event.clientX >= paperRect.left
      && event.clientX <= paperRect.right
      && event.clientY >= paperRect.top
      && event.clientY <= paperRect.bottom;
    if (pointerOverPaper !== modalPointerInside) {
      modalPointerInside = pointerOverPaper;
      syncPortraitCursorMode();
    }
  }
  portraitSmudgeCursor.style.left = `${event.clientX}px`;
  portraitSmudgeCursor.style.top = `${event.clientY}px`;
  if (lastCursorPoint) {
    const deltaX = event.clientX - lastCursorPoint.x;
    const deltaY = event.clientY - lastCursorPoint.y;
    if (Math.hypot(deltaX, deltaY) > 1.5) {
      const movementAngle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
      const isStraightUp = deltaY < 0 && Math.abs(deltaX) < Math.abs(deltaY) * 0.32;
      const fixedAngleTool = drawTool === 'pencil' || drawTool === 'eraser';
      const targetAngle = fixedAngleTool
        ? -12
        : isStraightUp ? -12 : movementAngle - 90;
      const deltaAngle = ((targetAngle - cursorToolAngle + 540) % 360) - 180;
      cursorToolAngle += deltaAngle * (fixedAngleTool ? 1 : 0.34);
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
  if (tone.dataset.tone === 'none') {
    tone.addEventListener('click', () => selectGraphiteTone(tone));
    return;
  }
  const normalizedTone = (Number(tone.dataset.tone) - 0.2) / 0.7;
  const graphiteValue = Math.round(174 - normalizedTone * 130);
  tone.style.setProperty('--graphite-value', String(graphiteValue));
  tone.style.setProperty('--graphite-opacity', String(0.28 + normalizedTone * 0.72));
  tone.style.setProperty('--graphite-spacing', `${5.2 - normalizedTone * 3.65}px`);
  tone.style.setProperty('--graphite-secondary-opacity', String(0.2 + normalizedTone * 0.62));
  tone.style.setProperty('--graphite-secondary-spacing', `${7.2 - normalizedTone * 4.85}px`);
  tone.addEventListener('click', () => selectGraphiteTone(tone));
});

function selectGraphiteTone(tone) {
  if (!tone) return;
  if (drawTool === 'eraser' && tone.dataset.tone !== 'none') return;
  fingerSmudgePrimed = false;
  pendingHoverSmudgePoint = null;
  graphiteAlpha = tone.dataset.tone === 'none' ? null : Number(tone.dataset.tone);
  portraitSmudgeCursor.style.setProperty(
    '--smudge-cursor-value',
    graphiteAlpha === null ? '118' : String(selectedGraphiteShade())
  );
  graphiteTones.forEach(item => item.classList.toggle('selected', item === tone));
}

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
  }
});

portraitDrawCanvas.addEventListener('pointermove', event => {
  if (portraitMode !== 'draw') return;
  const leftButtonHeld = (event.buttons & 1) === 1;
  if (drawTool === 'finger' && !leftButtonHeld) {
    if (!fingerSmudgePrimed) return;
    pendingHoverSmudgePoint = canvasPoint(event);
    if (!hoverSmudgeFrame) {
      hoverSmudgeFrame = requestAnimationFrame(() => {
        hoverSmudgeFrame = 0;
        if (pendingHoverSmudgePoint && portraitMode === 'draw' && drawTool === 'finger') {
          smudgeExistingGraphite(pendingHoverSmudgePoint);
        }
        pendingHoverSmudgePoint = null;
      });
    }
    return;
  }
  if (!leftButtonHeld || !drawing || !previousDrawPoint) return;
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
  if (drawTool === 'finger') fingerSmudgePrimed = true;
  saveDrawingState();
  drawing = true;
  pendingHoverSmudgePoint = null;
  if (hoverSmudgeFrame) {
    cancelAnimationFrame(hoverSmudgeFrame);
    hoverSmudgeFrame = 0;
  }
  document.body.classList.add('is-smudging');
  strokeConcentration = 1;
  previousDrawTime = performance.now();
  previousDrawPoint = canvasPoint(event);
  if (drawTool === 'finger' && graphiteAlpha !== null) {
    drawFingerprintStamp(previousDrawPoint, 0.4, cursorToolAngle * Math.PI / 180, event.pressure || 0.5);
  } else if (drawTool === 'eraser') {
    drawEraserSegment(previousDrawPoint, previousDrawPoint, event.pressure || 0.5);
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
  fingerSmudgePrimed = false;
  pendingHoverSmudgePoint = null;
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
  fingerSmudgePrimed = false;
  pendingHoverSmudgePoint = null;
  saveDrawingState();
  const context = portraitDrawCanvas.getContext('2d');
  const scale = portraitDrawCanvas.width / Math.max(1, portraitDrawCanvas.clientWidth);
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, portraitDrawCanvas.width, portraitDrawCanvas.height);
  context.drawImage(basePortraitCanvas, 0, 0);
  context.restore();
  context.setTransform(scale, 0, 0, scale, 0, 0);
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

portraitModalLensSize.addEventListener('input', () => {
  setLensSize(Number(portraitModalLensSize.value));
});

portraitModalLensZoom.addEventListener('input', () => {
  setLensZoom(Number(portraitModalLensZoom.value));
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

portraitModalPaper.addEventListener('click', event => {
  if (portraitMode !== 'magnify') return;
  const maximumSize = Number(portraitLensSize.max);
  const minimumSize = Number(portraitLensSize.min);
  setLensSize(lensSize >= maximumSize ? minimumSize : lensSize * 1.1);
  updateModalLens(event);
});

setLensSize(lensSize);
setLensZoom(lensZoom);
selectPortrait(0);
