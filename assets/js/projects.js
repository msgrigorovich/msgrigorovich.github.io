const portraits = [
  {
    title: 'Albert Einstein',
    year: '2015',
    src: '/assets/images/portraits/albert-einstein-2015.webp',
    summary: "What I love most about this portrait is the carefully rendered texture of Albert's moustache and sweater.",
    highlights: [
      { label: 'Moustache', src: '/assets/images/portraits/highlights/albert-moustache.webp', focus: { x: 0.482, y: 0.738, r: 0.196 } },
      { label: 'Sweater', src: '/assets/images/portraits/highlights/albert-sweater.webp', focus: { x: 0.638, y: 0.884, r: 0.135 } },
      { label: 'Wrinkle detail', src: '/assets/images/portraits/highlights/albert-eye-detail.webp', focus: { x: 0.682, y: 0.514, r: 0.105 } }
    ]
  },
  {
    title: 'Robert Pattinson',
    year: '2016',
    src: '/assets/images/portraits/robert-pattinson-2016.webp',
    summary: 'What I love most here is the shadow cast by the hand across the stubble, the carefully drawn fingernail, and the rendering of the hand itself.',
    highlights: [
      { label: 'Hand shadow', src: '/assets/images/portraits/highlights/robert-shadow.webp', focus: { x: 0.581, y: 0.659, r: 0.167 } },
      { label: 'Fingernail', src: '/assets/images/portraits/highlights/robert-nail.webp', focus: { x: 0.656, y: 0.613, r: 0.108 } },
      { label: 'Hand', src: '/assets/images/portraits/highlights/robert-hand.webp', focus: { x: 0.726, y: 0.812, r: 0.134 } }
    ]
  },
  {
    title: 'Colton Haynes',
    year: '2018',
    src: '/assets/images/portraits/colton-haynes-2018.webp',
    summary: 'What I love most here is the transition of tone and shadow across the shirt-collar fold, and the shift from light to shadow along its seam.',
    highlights: [
      { label: 'Collar fold', src: '/assets/images/portraits/highlights/colton-fold.webp', focus: { x: 0.682, y: 0.837, r: 0.124 } },
      { label: 'Collar seam', src: '/assets/images/portraits/highlights/colton-seam.webp', focus: { x: 0.572, y: 0.933, r: 0.091 } },
      { label: 'Eyebrow & eye', src: '/assets/images/portraits/highlights/colton-eye-detail.webp', focus: { x: 0.397, y: 0.414, r: 0.135 } }
    ]
  },
  {
    title: 'Daria Ivanova',
    year: '2022',
    src: '/assets/images/portraits/daria-ivanova-2022.webp',
    summary: 'What I love most here is the detailing of the eyes and the transition between light and shadow around the parting of the hair.',
    highlights: [
      { label: 'Left eye', src: '/assets/images/portraits/highlights/daria-eye-left.webp', focus: { x: 0.486, y: 0.414, r: 0.097 } },
      { label: 'Right eye', src: '/assets/images/portraits/highlights/daria-eye-right.webp', focus: { x: 0.316, y: 0.414, r: 0.108 } },
      { label: 'Hair part', src: '/assets/images/portraits/highlights/daria-hair-part.webp', focus: { x: 0.306, y: 0.201, r: 0.175 } }
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
const portraitModalWorkspace = document.querySelector('.portrait-modal-workspace');
const portraitModalStage = document.getElementById('portraitModalStage');
const portraitModalPaper = document.getElementById('portraitModalPaper');
const portraitModalLens = document.getElementById('portraitModalLens');
const portraitHighlightOverlay = document.getElementById('portraitHighlightOverlay');
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
const portraitPreloads = new Map();
let modalLensFrame = 0;
let pendingModalLensPoint = null;
let portraitModalScrollY = 0;
let activeHighlightFigure = null;

const isMobilePortraitModal = () => window.matchMedia('(max-width: 820px), (hover: none) and (pointer: coarse)').matches;

const qaScenarios = {
  events: {
    eyebrow: '01 · Event trail',
    title: 'Rebuild a user session',
    description: 'Trace ordered analytics events and inspect experiment context without touching production state.',
    insight: 'This baseline trace reconstructs the session. Device-owned install and session rows can leave product fields empty, so they are filtered before event order is assessed.',
    code: `SELECT
    created_at,
    activity_kind,
    event_name,
    JSONExtractString(base_parameters, 'ab_group') AS ab_group
FROM analytics.realtime_events
WHERE user_id = {user_id:String}
  AND toDate(created_at) = today()
  AND activity_kind NOT IN ('install', 'session')
ORDER BY created_at DESC;`,
    output: [['Signal', 'ordered event trail'], ['Use', 'reproduce & verify'], ['Guard', 'synthetic identifiers']],
    decisionTitle: 'The event sequence is the evidence',
    conclusion: 'The logging contract is healthy when the emitted order and parameters match the controlled actions performed on the device.',
    decision: 'Confirm the scenario, or investigate the first missing, duplicated or malformed event.'
  },
  ab: {
    eyebrow: '02 · A/B split',
    title: 'Validate experiment assignment',
    description: 'Compare exact unique-user counts before interpreting test results or investigating a biased rollout.',
    insight: 'Compare the actual distribution with the allocation planned by the team. A near 1:1 result is healthy only when 1:1 was the expected experiment ratio.',
    code: `SELECT
    app_version,
    ab_group,
    uniqExact(user_id) AS unique_users
FROM product.analytics_events
WHERE ab_group LIKE '021_%'
GROUP BY app_version, ab_group
ORDER BY app_version, ab_group;`,
    output: [['Signal', 'group distribution'], ['Use', 'detect allocation drift'], ['Expected', 'planned ratio']],
    decisionTitle: 'Expected must equal actual',
    conclusion: 'A near 1:1 split supports correct assignment only when 1:1 is the allocation planned for this experiment and version.',
    decision: 'Accept the rollout distribution, or investigate allocation drift by version and group.'
  },
  adActivity: {
    eyebrow: '03 · Ad activity',
    title: 'Verify advertising logging',
    description: 'Match the telemetry of a specific tester to the advertising test case performed on the device.',
    insight: 'Check creation time, ad type, placement and status together. Each emitted row should correspond to a deliberate action and its visible outcome.',
    code: `SELECT created_at,
    JSONExtractString(base_parameters, 'type') AS ad_type,
    JSONExtractString(base_parameters, 'ad_placement') AS placement,
    JSONExtractString(base_parameters, 'status') AS status
FROM analytics.realtime_events
WHERE toDate(created_at) = today()
  AND event_name = 'AdView' AND user_id = {user_id:String}
ORDER BY created_at DESC;`,
    output: [['Signal', 'time · type · placement'], ['Use', 'check ad test case'], ['Expected', 'action matches event']],
    decisionTitle: 'The test action matches its log',
    conclusion: 'Advertising logging is compliant when time, type, placement and status reproduce the tester’s controlled sequence.',
    decision: 'Confirm instrumentation, or report the first mismatch with its placement and status.'
  },
  adOutcomes: {
    eyebrow: '04 · Ad outcomes',
    title: 'Measure fail frequency',
    description: 'Compare Start, Complete and Fail outcomes to understand scale before prioritizing an advertising defect.',
    insight: 'The repository visualizes these counts as a funnel. A Fail event is an outcome signal; without crash evidence it must not be labelled as an ANR.',
    code: `WITH JSONExtractString(base_parameters, 'status') AS status
SELECT status, count() AS events
FROM analytics.realtime_events
WHERE event_name = 'AdView'
  AND toDate(created_at) >= '2024-02-02'
  AND status IN ('Start', 'Complete', 'Fail')
GROUP BY status
ORDER BY events DESC;`,
    output: [['Signal', 'outcome frequency'], ['Use', 'prioritize placement'], ['Guard', 'Fail ≠ ANR']],
    decisionTitle: 'Frequency informs priority, not cause',
    conclusion: 'A low Fail count can lower immediate priority, but it does not identify a crash mechanism or prove that the defect is harmless.',
    decision: 'Prioritize by rate and placement, then correlate failures with crash or ANR evidence.'
  },
  networkUser: {
    eyebrow: '05 · Network trace',
    title: 'Trace one ad network',
    description: 'Use production telemetry to verify whether a network emits revenue activity for a specific user and placement.',
    insight: 'This is useful when a test debugger reports an error but the integration did not change from production. Store, network, placement and type provide the context.',
    code: `SELECT app_name, created_at, store,
    ad_network, ad_placement, ad_type
FROM analytics.ad_revenue
WHERE app_name = {app:String} AND toDate(created_at) = today()
  AND activity_kind = 'ad_revenue'
  AND ad_network = 'Google AdMob'
  AND user_id = {user_id:String}
ORDER BY created_at DESC;`,
    output: [['Signal', 'network activity'], ['Use', 'verify integration'], ['Context', 'store · placement · type']],
    decisionTitle: 'Production activity challenges the debugger',
    conclusion: 'Rows from the expected store and placements demonstrate that the selected network is active for this product context.',
    decision: 'Treat the debugger error as environment-specific, or escalate when production telemetry is also absent.'
  },
  networkAggregate: {
    eyebrow: '06 · Network volume',
    title: 'Compare network activity',
    description: 'Count impressions by integrated ad network to establish the observed production distribution.',
    insight: 'Aggregate volume shows which networks are used most often. It is a useful prioritization signal, but traffic volume alone is not a stability metric.',
    code: `SELECT ad_network AS network,
    count() AS impressions
FROM analytics.ad_revenue
WHERE app_name = {app:String}
  AND toDate(created_at) >= '2024-02-15'
  AND activity_kind = 'ad_revenue' AND ad_network != ''
GROUP BY network
ORDER BY impressions DESC;`,
    output: [['Signal', 'impression volume'], ['Use', 'rank coverage'], ['Guard', 'volume ≠ quality']],
    decisionTitle: 'Coverage follows observed usage',
    conclusion: 'The ranking identifies high-volume networks that deserve proportionally strong regression coverage and monitoring.',
    decision: 'Prioritize coverage by volume, then assess failures and completion rates separately.'
  },
  socialSaves: {
    eyebrow: '07 · Social save',
    title: 'Find a stable save identity',
    description: 'Trace social connections that can anchor a user’s progress when device-level identifiers change.',
    insight: 'IDFA access can be denied or reset, and an app reinstall can generate a new project user ID. A social identifier is therefore a more reliable recovery key.',
    code: `SELECT created_at, event_name,
    JSONExtractString(base_parameters, 'reason') AS reason,
    JSONExtractString(base_parameters, 'social_network') AS network
FROM analytics.realtime_events
WHERE toDate(created_at) >= '2024-01-01'
  AND event_name = 'SocialConnected'
  AND user_id = {user_id:String}
ORDER BY created_at DESC;`,
    output: [['Signal', 'social connection'], ['Use', 'locate stable save'], ['Guard', 'verify ownership']],
    decisionTitle: 'Social identity is the safer anchor',
    conclusion: 'A verified social connection provides a more durable path to the correct progress than a resettable device or installation identifier.',
    decision: 'Use the verified social identity to locate the save, then follow the approved recovery flow.'
  },
  stateAudit: {
    eyebrow: '08 · State audit',
    title: 'Audit every state transition',
    description: 'Build a read-only timeline before any approved recovery action; keep decoding inside trusted tooling.',
    insight: 'Order every state transition before choosing the last valid save. Encrypted state payloads protect storage and must be decoded only inside trusted tools.',
    code: `SELECT event_time, process, login,
    coalesce(
      nullIf(JSONExtractString(request, 'state'), ''),
      JSONExtractString(response, 'state')
    ) AS encoded_state
FROM support.user_state_events
WHERE user_id = {user_id:String}
  AND toDate(event_time) >= '2024-01-01'
  AND bundle_id = {bundle_id:String}
ORDER BY event_time DESC;`,
    output: [['Signal', 'state chronology'], ['Use', 'locate last valid save'], ['Guard', 'audited recovery only']],
    decisionTitle: 'Recover from the last valid state',
    conclusion: 'The ordered timeline exposes when progress changed and which earlier state is a defensible recovery candidate.',
    decision: 'Select the last verified state and restore it only through access-controlled, audited tooling.'
  }
};

const qaScenarioGuides = {
  events: {
    condition: 'Reproduce one controlled session for a known test user, then reconstruct the emitted event order.',
    timing: 'Filter by today and order newest first. Device-owned install and session rows are excluded from the product-event assessment.',
    expected: 'SessionStart → RegimeChanged → PreferencesSelected → CoreOpen → GameExit, with the Testing A/B value present on product events.',
    columns: ['created_at', 'activity', 'event_name', 'ab_group'],
    rows: [
      ['11:30:58', 'event', 'GameExit', 'Testing'],
      ['11:29:56', 'event', 'CoreOpen', 'Testing'],
      ['11:29:41', 'event', 'PreferencesSelected', 'Testing'],
      ['11:07:06', 'event', 'RegimeChanged', 'Testing'],
      ['11:07:02', 'event', 'SessionStart', 'Testing']
    ],
    result: 'The expected product events are present in reverse chronological order; the logging contract can be compared directly with the controlled actions.'
  },
  ab: {
    condition: 'Check whether users of app version 1.74 were assigned to experiment 021 according to the planned allocation.',
    timing: 'Use the selected app version and the 021 experiment cohort; aggregate exact unique users by group.',
    expected: 'The planned split is 1:1, so Testing and Control should contain nearly equal unique-user counts.',
    columns: ['app_version', 'ab_group', 'users_unique'],
    rows: [['1.74', '021_AbName_Testing', '2,751'], ['1.74', '021_AbName_Control', '2,748']],
    result: 'The three-user difference is consistent with the planned 1:1 allocation: expected and observed distributions agree.'
  },
  adActivity: {
    condition: 'Perform a controlled advertising test and match every device action to its emitted AdView telemetry.',
    timing: 'Filter the known tester to today, then read creation time, type, placement and status together.',
    expected: 'Each Start, Click, Complete, Fail or End row should match the action, placement and visible outcome on the test device.',
    columns: ['created_at', 'type', 'placement', 'status'],
    rows: [
      ['17:54:32', 'Banner', 'Core', 'End'],
      ['15:25:52', 'Rewarded', 'Shop', 'Fail'],
      ['15:23:43', 'Rewarded', 'Shop', 'Complete'],
      ['16:04:17', 'Interstitial', 'CoreExit', 'Complete']
    ],
    result: 'The sample contains the expected placements and statuses. Any first mismatch should be reported with its timestamp and device action.'
  },
  adOutcomes: {
    condition: 'Measure the scale of advertising outcomes before assigning severity to a reported failure.',
    timing: 'Aggregate Start, Complete and Fail events from 2 February 2024 onward, matching the source example.',
    expected: 'Most starts should complete; Fail must be treated as an outcome signal rather than automatic proof of an ANR or crash.',
    columns: ['ad_status', 'count'],
    rows: [['Start', '4,293'], ['Complete', '4,064'], ['Fail', '3']],
    result: 'Fail is rare in this synthetic sample, which lowers immediate priority, but causality still requires crash or ANR correlation.'
  },
  networkUser: {
    condition: 'A debugger reports a Google AdMob error. Check whether unchanged production integration still emits activity.',
    timing: 'Filter one user and today, then retain Google AdMob ad-revenue rows across store, placement and type.',
    expected: 'At least one row from the expected stores and placements demonstrates that the network is active in the product context.',
    columns: ['store', 'network', 'placement', 'type'],
    rows: [
      ['google', 'Google AdMob', 'CoreExit', 'Interstitial'],
      ['itunes', 'Google AdMob', 'CoreExit', 'Interstitial'],
      ['itunes', 'Google AdMob', 'Shop', 'Rewarded'],
      ['google', 'Google AdMob', 'Core', 'Banner']
    ],
    result: 'Production telemetry contains the expected AdMob placements, so the isolated debugger error is not enough to declare an integration defect.'
  },
  networkAggregate: {
    condition: 'Establish which integrated advertising networks carry the most observed product traffic.',
    timing: 'Count non-empty ad-revenue network rows from 15 February 2024 onward and rank them descending.',
    expected: 'The result should expose a usable coverage ranking; impression volume alone must not be interpreted as stability.',
    columns: ['network', 'impressions'],
    rows: [['AppLovin', '1,307'], ['ironSource', '362'], ['Unity Ads', '294'], ['Mintegral', '260'], ['Facebook', '192'], ['InMobi', '159'], ['DT Exchange', '137']],
    result: 'AppLovin has the largest observed volume and therefore deserves proportionally strong regression coverage; quality still needs separate failure metrics.'
  },
  socialSaves: {
    condition: 'Find a durable identity that can locate progress after a device identifier changes or an application is reinstalled.',
    timing: 'Read SocialConnected events since 1 January 2024 for the known user and compare reason and social network.',
    expected: 'A verified social connection should provide a more stable recovery key than IDFA or an installation-scoped identifier.',
    columns: ['created_at', 'reason', 'network'],
    rows: [
      ['Jan 24 · 16:16', 'MainMenu', 'Google'],
      ['Jan 21 · 16:16', 'SettingsMenu', 'Google'],
      ['Jan 18 · 16:16', 'SettingsMenu', 'Apple'],
      ['Jan 06 · 16:16', 'MainMenu', 'Google'],
      ['Jan 02 · 16:16', 'MainMenu', 'Facebook']
    ],
    result: 'The timeline exposes several social identities. Ownership must be verified before Google is used as the durable recovery anchor.'
  },
  stateAudit: {
    condition: 'A user restored the wrong progress. Build the full state timeline before considering any recovery action.',
    timing: 'Read the selected bundle from 1 January 2024 onward and order LOAD, SAVE and RESOLVE operations newest first.',
    expected: 'The ordered states should reveal the last valid version before replacement; encrypted payloads remain inside trusted tooling.',
    columns: ['event_time', 'process', 'login', 'state'],
    rows: [
      ['16:13:31', 'LOAD', '145807…', 'v1.74'],
      ['16:13:28', 'SAVE', '145807…', 'v1.74'],
      ['16:13:27', 'RESOLVE', '145807…', 'v1.74'],
      ['16:13:03', 'LOAD', '—', 'v1.23'],
      ['16:12:52', 'LOAD', '—', 'v1.23']
    ],
    result: 'The state changes from 1.23 to 1.74. The earlier verified state is a recovery candidate, but restoration requires approved and audited tooling.'
  }
};

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

function preloadImage(src) {
  if (portraitPreloads.has(src)) return portraitPreloads.get(src);
  const promise = new Promise(resolve => {
    const image = new Image();
    image.decoding = 'async';
    image.fetchPriority = 'low';
    image.onload = image.onerror = resolve;
    image.src = src;
  });
  portraitPreloads.set(src, promise);
  return promise;
}

function warmPortrait(index, includeHighlights = false) {
  const portrait = portraits[index];
  if (!portrait) return Promise.resolve();
  const sources = [portrait.src];
  if (includeHighlights) sources.push(...portrait.highlights.map(highlight => highlight.src));
  return Promise.all(sources.map(preloadImage));
}

function schedulePortraitWarmup() {
  const run = async () => {
    await warmPortrait(0, true);
    for (let index = 1; index < portraits.length; index += 1) {
      await warmPortrait(index, true);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };
  if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 2500 });
  else setTimeout(run, 1500);
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
  drawingCanvasReady = false;
  portraitModalScrollY = window.scrollY;
  document.body.style.setProperty('--portrait-modal-scroll-y', `-${portraitModalScrollY}px`);
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
  hidePortraitHighlight();
  portraitDetailFocus.replaceChildren();
  portraitDetailFocus.hidden = highlights.length === 0;
  portraitDetailFocus.classList.toggle('is-trio', highlights.length === 3);
  activeHighlightFigure = null;

  highlights.forEach(highlight => {
    const figure = document.createElement('figure');
    const crop = document.createElement('span');
    const caption = document.createElement('figcaption');
    figure.tabIndex = 0;
    crop.className = `portrait-detail-crop${highlight.className ? ` ${highlight.className}` : ' portrait-detail-image'}`;
    crop.setAttribute('aria-hidden', 'true');
    crop.style.backgroundImage = `url("${highlight.src || portrait.src}")`;
    caption.textContent = highlight.label;
    const showFocus = () => showPortraitHighlight(highlight.focus);
    const hideFocus = () => hidePortraitHighlight();
    figure.addEventListener('pointerenter', showFocus);
    figure.addEventListener('pointerleave', hideFocus);
    figure.addEventListener('focus', showFocus);
    figure.addEventListener('blur', hideFocus);
    figure.addEventListener('click', event => {
      if (!isMobilePortraitModal()) return;
      event.preventDefault();
      const alreadyActive = activeHighlightFigure === figure;
      portraitDetailFocus.querySelectorAll('figure').forEach(item => item.classList.remove('active'));
      activeHighlightFigure = alreadyActive ? null : figure;
      figure.classList.toggle('active', !alreadyActive);
      if (alreadyActive) hidePortraitHighlight();
      else showFocus();
    });
    figure.append(crop, caption);
    portraitDetailFocus.append(figure);
  });
}

function showPortraitHighlight(focus) {
  if (!focus) return;
  // The overlay is positioned inside the paper border. clientWidth/clientHeight
  // use that same inner coordinate system, unlike getBoundingClientRect(),
  // which also includes the decorative frame and shifts small highlights.
  const width = portraitModalPaper.clientWidth;
  const height = portraitModalPaper.clientHeight;
  const radius = focus.r * Math.min(width, height);
  portraitHighlightOverlay.style.setProperty('--highlight-x', `${focus.x * width}px`);
  portraitHighlightOverlay.style.setProperty('--highlight-y', `${focus.y * height}px`);
  portraitHighlightOverlay.style.setProperty('--highlight-radius', `${radius}px`);
  portraitHighlightOverlay.classList.add('visible');
  portraitModalLens.classList.remove('visible');
}

function hidePortraitHighlight() {
  portraitHighlightOverlay.classList.remove('visible');
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
  if (isMobilePortraitModal()) {
    portraitModal.scrollTop = 0;
    portraitModalWorkspace.scrollTop = 0;
  }
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
  // The lens reads directly from the live composite canvas. Keeping it as a
  // canvas avoids encoding a multi-megapixel PNG and repainting it on every move.
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
  if (isMobilePortraitModal() && activeHighlightFigure) {
    activeHighlightFigure.classList.remove('active');
    activeHighlightFigure = null;
    hidePortraitHighlight();
  }
  const paperRect = portraitModalPaper.getBoundingClientRect();
  const imageRect = portraitModalImage.getBoundingClientRect();
  const pointerX = event.clientX - paperRect.left;
  const pointerY = event.clientY - paperRect.top;
  const imageX = event.clientX - imageRect.left;
  const imageY = event.clientY - imageRect.top;
  const lensDiameter = portraitModalLens.offsetWidth;
  const modalZoom = lensZoom;
  const mobileOffset = isMobilePortraitModal();
  const x = mobileOffset
    ? clamp(pointerX - lensDiameter * 0.48, lensDiameter / 2, paperRect.width - lensDiameter / 2)
    : pointerX;
  const y = mobileOffset
    ? clamp(pointerY - lensDiameter * 0.72, lensDiameter / 2, paperRect.height - lensDiameter / 2)
    : pointerY;
  portraitModalLens.classList.add('visible');
  portraitModalLens.style.left = `${x}px`;
  portraitModalLens.style.top = `${y}px`;
  pendingModalLensPoint = { imageX, imageY, imageRect, lensDiameter, modalZoom };
  if (modalLensFrame) return;
  modalLensFrame = requestAnimationFrame(() => {
    modalLensFrame = 0;
    if (!pendingModalLensPoint || !drawingCanvasReady) return;
    const point = pendingModalLensPoint;
    pendingModalLensPoint = null;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const outputSize = Math.max(1, Math.round(point.lensDiameter * pixelRatio));
    if (portraitModalLens.width !== outputSize || portraitModalLens.height !== outputSize) {
      portraitModalLens.width = outputSize;
      portraitModalLens.height = outputSize;
    }
    const scaleX = portraitDrawCanvas.width / Math.max(1, point.imageRect.width);
    const scaleY = portraitDrawCanvas.height / Math.max(1, point.imageRect.height);
    const sourceWidth = point.lensDiameter / point.modalZoom * scaleX;
    const sourceHeight = point.lensDiameter / point.modalZoom * scaleY;
    const sourceX = point.imageX * scaleX - sourceWidth / 2;
    const sourceY = point.imageY * scaleY - sourceHeight / 2;
    const context = portraitModalLens.getContext('2d', { alpha: false });
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.fillStyle = '#f4f0e6';
    context.fillRect(0, 0, outputSize, outputSize);
    context.drawImage(
      portraitDrawCanvas,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, outputSize, outputSize
    );
  });
}

function closePortraitModal() {
  if (!portraitModal.open) return;
  portraitModal.close();
  sharedCursorElements.forEach(element => document.body.appendChild(element));
  document.body.classList.remove('portrait-modal-open');
  document.body.style.removeProperty('--portrait-modal-scroll-y');
  document.body.classList.remove('portrait-inspecting', 'portrait-drawing', 'is-smudging', 'draw-tool-pencil', 'draw-tool-eraser');
  modalPointerInside = false;
  pendingModalLensPoint = null;
  if (modalLensFrame) cancelAnimationFrame(modalLensFrame);
  modalLensFrame = 0;
  window.scrollTo(0, portraitModalScrollY);
}

portraitThumbs.forEach(thumb => {
  const index = Number(thumb.dataset.portraitIndex);
  const warm = () => warmPortrait(index, true);
  thumb.addEventListener('pointerenter', warm, { once: true });
  thumb.addEventListener('focus', warm, { once: true });
  thumb.addEventListener('touchstart', warm, { once: true, passive: true });
  thumb.addEventListener('click', () => selectPortrait(index));
});

window.addEventListener('load', schedulePortraitWarmup, { once: true });

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
  if (portraitModalImage.naturalWidth && portraitModalImage.naturalHeight) {
    portraitModalPaper.style.setProperty(
      '--portrait-aspect-ratio',
      `${portraitModalImage.naturalWidth} / ${portraitModalImage.naturalHeight}`
    );
  }
  if (portraitModal.open) resetDrawingCanvas();
});

portraitModalPaper.addEventListener('pointermove', event => {
  portraitSmudgeCursor.style.left = `${event.clientX}px`;
  portraitSmudgeCursor.style.top = `${event.clientY}px`;
  if (portraitMode === 'magnify') {
    updateModalLens(event);
  }
});

portraitModalPaper.addEventListener('pointerdown', event => {
  if (portraitMode !== 'magnify' || !isMobilePortraitModal()) return;
  event.preventDefault();
  modalPointerInside = true;
  updateModalLens(event);
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
  if (isMobilePortraitModal()) {
    updateModalLens(event);
    return;
  }
  const maximumSize = Number(portraitLensSize.max);
  const minimumSize = Number(portraitLensSize.min);
  setLensSize(lensSize >= maximumSize ? minimumSize : lensSize * 1.1);
  updateModalLens(event);
});

const projectsGallery = document.querySelector('.projects-gallery');
const qaProjectView = document.getElementById('qaProjectView');
const projectFilterButtons = Array.from(document.querySelectorAll('[data-project-filter]'));
const qaScenarioButtons = Array.from(document.querySelectorAll('[data-qa-scenario]'));
const qaQueryCard = document.querySelector('.qa-query-card');
const qaQueryEyebrow = document.getElementById('qaQueryEyebrow');
const qaQueryTitle = document.getElementById('qaQueryTitle');
const qaQueryDescription = document.getElementById('qaQueryDescription');
const qaQueryInsight = document.getElementById('qaQueryInsight');
const qaQueryCode = document.getElementById('qaQueryCode');
const qaQueryOutput = document.getElementById('qaQueryOutput');
const qaGuidedResult = document.getElementById('qaGuidedResult');
const qaGuidedResultTable = document.getElementById('qaGuidedResultTable');
const qaGuidedResultNote = document.getElementById('qaGuidedResultNote');
const qaDecisionNumber = document.getElementById('qaDecisionNumber');
const qaDecisionTitle = document.getElementById('qaDecisionTitle');
const qaDecisionConclusion = document.getElementById('qaDecisionConclusion');
const qaDecisionAction = document.getElementById('qaDecisionAction');
const qaCaseModal = document.getElementById('qaCaseModal');
const qaCaseOpen = document.getElementById('qaCaseOpen');
const qaCaseClose = document.getElementById('qaCaseClose');
const qaTourReplay = document.getElementById('qaTourReplay');
const qaTourLayer = document.getElementById('qaTourLayer');
const qaTourFocus = document.getElementById('qaTourFocus');
const qaTourPanel = document.getElementById('qaTourPanel');
const qaTourStep = document.getElementById('qaTourStep');
const qaTourProgress = document.getElementById('qaTourProgress');
const qaTourTitle = document.getElementById('qaTourTitle');
const qaTourText = document.getElementById('qaTourText');
const qaTourBack = document.getElementById('qaTourBack');
const qaTourNext = document.getElementById('qaTourNext');
const qaTourSkip = document.getElementById('qaTourSkip');
const qaScenarioRunButtons = Array.from(document.querySelectorAll('[data-qa-tour-scenario]'));
const qaProjectButtons = Array.from(document.querySelectorAll('[data-qa-project]'));
const qaCursorElements = [
  document.querySelector('.cursor-trail'),
  document.querySelector('.cursor-outline'),
  document.querySelector('.cursor-dot')
].filter(Boolean);
const qaOverviewTourSteps = [
  { target: '.qa-case-hero', title: 'Start with the question', text: 'The interface shows an outcome. The funnel and telemetry show the evidence behind it.' },
  { target: '.qa-case-method', title: 'Follow the testing method', text: 'Move from a controlled action to an emitted event, then use a query to reach an evidence-based decision.' },
  { target: '.qa-query-card', title: 'Read evidence beside the SQL', text: 'The left side explains the purpose and interpretation. The highlighted query shows exactly how the evidence is selected.' },
  { target: '.qa-scenario-list', title: 'Explore all eight questions', text: 'Choose any scenario to update its goal, explanation, SQL, conclusion and recommended decision.' },
  { target: '.qa-case-takeaways', title: 'Finish with a decision', text: 'A query is not the conclusion. This panel turns the observed signal into a defensible QA decision and next step.' },
  { target: '[data-qa-tour-scenario="events"]', title: 'Try the first case', text: 'Ready to apply the chain? Continue to inspect the condition, timing, expected result, query evidence and decision for Event trail.', nextLabel: 'Start case', skipLabel: 'Not now' }
];
let qaTourSteps = qaOverviewTourSteps;
let qaTourMode = 'overview';
let qaTourScenarioKey = null;
let qaTourIndex = -1;
let qaTourActive = false;
let qaTourPreviousFocus = null;
let qaTourPositionFrame = 0;
let qaTourMotionFrame = 0;
let qaTourStartTimer = 0;

function qaTourWasCompleted() {
  try { return sessionStorage.getItem('qa-guided-tour-v1') === 'complete'; }
  catch { return false; }
}

function rememberQaTourCompletion() {
  try { sessionStorage.setItem('qa-guided-tour-v1', 'complete'); }
  catch { /* Storage can be unavailable in privacy modes. */ }
}

function setQaGuidedResultVisible(visible) {
  qaGuidedResult.hidden = !visible;
  qaQueryCard.classList.toggle('show-guided-result', visible);
}

function renderQaGuidedResult(key) {
  const guide = qaScenarioGuides[key];
  if (!guide) return;
  const table = document.createElement('table');
  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  guide.columns.forEach(column => {
    const cell = document.createElement('th');
    cell.textContent = column;
    headRow.appendChild(cell);
  });
  head.appendChild(headRow);
  const body = document.createElement('tbody');
  guide.rows.forEach(row => {
    const tableRow = document.createElement('tr');
    row.forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      tableRow.appendChild(cell);
    });
    body.appendChild(tableRow);
  });
  table.append(head, body);
  qaGuidedResultTable.replaceChildren(table);
  qaGuidedResultNote.textContent = `${guide.result} All displayed values are fictional, anonymized examples from the source article.`;
}

function buildQaScenarioTour(key) {
  const scenario = qaScenarios[key];
  const guide = qaScenarioGuides[key];
  if (!scenario || !guide) return [];
  return [
    {
      target: '.qa-query-description',
      title: `${scenario.eyebrow.slice(0, 2)} · Define the check`,
      text: `Condition: ${guide.condition} Timing: ${guide.timing}`,
      showResult: false
    },
    {
      target: '.qa-query-code',
      title: 'State the expected result',
      text: `${guide.expected} The query is read-only and uses fictional identifiers.`,
      nextLabel: 'Run query',
      showResult: false
    },
    {
      target: '.qa-guided-result',
      title: 'Compare with the returned data',
      text: 'This is the synthetic result published in the GitHub article. Compare observed rows with the expectation before interpreting them.',
      showResult: true,
      allowInteraction: true
    },
    {
      target: '.qa-case-takeaways',
      title: 'Conclude, then decide',
      text: `${guide.result} This completes the fixed chain: Question → Method → Evidence → Decision.`,
      nextLabel: 'Finish case',
      showResult: true
    }
  ];
}

function positionQaTour() {
  if (!qaTourActive) return;
  const step = qaTourSteps[qaTourIndex];
  const target = qaCaseModal.querySelector(step.target);
  if (!target) return;
  const card = qaCaseModal.querySelector('.qa-case-card');
  const cardRect = card.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const padding = 7;
  const left = Math.max(8, targetRect.left - cardRect.left - padding);
  const top = Math.max(8, targetRect.top - cardRect.top - padding);
  const right = Math.min(cardRect.width - 8, targetRect.right - cardRect.left + padding);
  const bottom = Math.min(cardRect.height - 8, targetRect.bottom - cardRect.top + padding);
  qaTourFocus.style.left = `${left}px`;
  qaTourFocus.style.top = `${top}px`;
  qaTourFocus.style.width = `${Math.max(1, right - left)}px`;
  qaTourFocus.style.height = `${Math.max(1, bottom - top)}px`;

  const panelWidth = qaTourPanel.offsetWidth;
  const panelHeight = qaTourPanel.offsetHeight;
  const gap = 14;
  const spaceRight = cardRect.width - right;
  const spaceLeft = left;
  let panelLeft;
  let panelTop;
  if (spaceRight >= panelWidth + gap) {
    panelLeft = right + gap;
    panelTop = top;
  } else if (spaceLeft >= panelWidth + gap) {
    panelLeft = left - panelWidth - gap;
    panelTop = top;
  } else {
    panelLeft = Math.min(Math.max(14, left), cardRect.width - panelWidth - 14);
    panelTop = bottom + panelHeight + gap <= cardRect.height
      ? bottom + gap
      : Math.max(14, top - panelHeight - gap);
  }
  qaTourPanel.style.left = `${panelLeft}px`;
  qaTourPanel.style.top = `${Math.min(panelTop, cardRect.height - panelHeight - 14)}px`;
}

function animateQaTourScroll(scroll, destination) {
  if (qaTourMotionFrame) cancelAnimationFrame(qaTourMotionFrame);
  qaTourLayer.classList.remove('is-moving');
  const startScroll = scroll.scrollTop;
  const distance = destination - startScroll;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    scroll.scrollTop = destination;
    positionQaTour();
    return;
  }

  const startFocus = {
    left: parseFloat(qaTourFocus.style.left),
    top: parseFloat(qaTourFocus.style.top),
    width: parseFloat(qaTourFocus.style.width),
    height: parseFloat(qaTourFocus.style.height)
  };
  const startPanel = {
    left: parseFloat(qaTourPanel.style.left),
    top: parseFloat(qaTourPanel.style.top)
  };
  const blend = (from, to, progress) => from + (to - from) * progress;
  const startedAt = performance.now();
  const duration = 580;
  qaTourLayer.classList.add('is-moving');
  const move = now => {
    if (!qaTourActive) return;
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = progress < 0.5
      ? 4 * Math.pow(progress, 3)
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    scroll.scrollTop = startScroll + distance * eased;
    positionQaTour();
    const targetFocus = {
      left: parseFloat(qaTourFocus.style.left),
      top: parseFloat(qaTourFocus.style.top),
      width: parseFloat(qaTourFocus.style.width),
      height: parseFloat(qaTourFocus.style.height)
    };
    const targetPanel = {
      left: parseFloat(qaTourPanel.style.left),
      top: parseFloat(qaTourPanel.style.top)
    };
    qaTourFocus.style.left = `${blend(startFocus.left, targetFocus.left, eased)}px`;
    qaTourFocus.style.top = `${blend(startFocus.top, targetFocus.top, eased)}px`;
    qaTourFocus.style.width = `${blend(startFocus.width, targetFocus.width, eased)}px`;
    qaTourFocus.style.height = `${blend(startFocus.height, targetFocus.height, eased)}px`;
    qaTourPanel.style.left = `${blend(startPanel.left, targetPanel.left, eased)}px`;
    qaTourPanel.style.top = `${blend(startPanel.top, targetPanel.top, eased)}px`;
    if (progress < 1) {
      qaTourMotionFrame = requestAnimationFrame(move);
      return;
    }
    qaTourMotionFrame = 0;
    qaTourLayer.classList.remove('is-moving');
    positionQaTour();
  };
  qaTourMotionFrame = requestAnimationFrame(move);
}

function revealQaTourStep({ initial = false } = {}) {
  const step = qaTourSteps[qaTourIndex];
  qaTourLayer.classList.toggle('allows-target-interaction', Boolean(step.allowInteraction));
  if (qaTourMode === 'scenario') {
    setQaGuidedResultVisible(Boolean(step.showResult));
  }
  const target = qaCaseModal.querySelector(step.target);
  if (!target) return;
  const scroll = qaCaseModal.querySelector('.qa-case-scroll');
  const scrollRect = scroll.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const targetTop = scroll.scrollTop + targetRect.top - scrollRect.top;
  const nextScroll = Math.max(0, targetTop - Math.max(12, (scroll.clientHeight - targetRect.height) / 2));
  qaTourStep.textContent = `${String(qaTourIndex + 1).padStart(2, '0')} / ${String(qaTourSteps.length).padStart(2, '0')}`;
  qaTourProgress.style.width = `${((qaTourIndex + 1) / qaTourSteps.length) * 100}%`;
  qaTourTitle.textContent = step.title;
  qaTourText.textContent = step.text;
  qaTourBack.disabled = qaTourIndex === 0;
  qaTourNext.textContent = step.nextLabel || (qaTourIndex === qaTourSteps.length - 1 ? 'Finish' : 'Next');
  qaTourSkip.textContent = step.skipLabel || (qaTourMode === 'scenario' ? 'Exit case' : 'Skip tour');
  if (initial) {
    scroll.scrollTop = nextScroll;
    positionQaTour();
  } else {
    animateQaTourScroll(scroll, nextScroll);
  }
}

function beginQaTour(steps, mode, { initial = true } = {}) {
  if (!qaCaseModal.open) return;
  if (!qaTourActive) qaTourPreviousFocus = document.activeElement;
  qaTourSteps = steps;
  qaTourMode = mode;
  qaTourIndex = 0;
  qaTourActive = true;
  qaTourLayer.hidden = false;
  qaTourLayer.classList.toggle('is-preparing', initial);
  qaCaseModal.classList.add('qa-tour-active');
  revealQaTourStep({ initial });
  requestAnimationFrame(() => {
    positionQaTour();
    requestAnimationFrame(() => {
      qaTourLayer.classList.remove('is-preparing');
      qaTourNext.focus();
    });
  });
}

function startQaTour() {
  qaTourScenarioKey = null;
  setQaGuidedResultVisible(false);
  beginQaTour(qaOverviewTourSteps, 'overview');
}

function startQaScenarioTour(key, continueFromOverview = false) {
  const steps = buildQaScenarioTour(key);
  if (!steps.length) return;
  qaTourScenarioKey = key;
  selectQaScenario(key);
  renderQaGuidedResult(key);
  setQaGuidedResultVisible(false);
  beginQaTour(steps, 'scenario', { initial: !continueFromOverview });
}

function endQaTour(completed = true) {
  if (qaTourStartTimer) clearTimeout(qaTourStartTimer);
  qaTourStartTimer = 0;
  if (!qaTourActive) return;
  qaTourActive = false;
  qaTourIndex = -1;
  if (qaTourMotionFrame) cancelAnimationFrame(qaTourMotionFrame);
  qaTourMotionFrame = 0;
  qaTourLayer.classList.remove('is-moving', 'is-preparing', 'allows-target-interaction');
  qaTourLayer.hidden = true;
  qaCaseModal.classList.remove('qa-tour-active');
  setQaGuidedResultVisible(false);
  qaTourSteps = qaOverviewTourSteps;
  qaTourMode = 'overview';
  qaTourScenarioKey = null;
  if (completed) rememberQaTourCompletion();
  if (qaTourPreviousFocus?.isConnected) qaTourPreviousFocus.focus();
}

function setProjectCategory(category) {
  const showQa = category === 'qa';
  if (showQa === !qaProjectView.hidden) return;
  if (portraitModal.open) closePortraitModal();
  if (qaCaseModal.open) qaCaseModal.close();
  const incomingView = showQa ? qaProjectView : projectsGallery;
  const updateCategory = () => {
    projectsGallery.hidden = showQa;
    qaProjectView.hidden = !showQa;
    document.querySelector('.projects-main').classList.toggle('qa-active', showQa);
    projectFilterButtons.forEach(button => {
      const active = button.dataset.projectFilter === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };

  if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(updateCategory);
  } else {
    updateCategory();
    incomingView.classList.remove('category-arriving');
    void incomingView.offsetWidth;
    incomingView.classList.add('category-arriving');
  }
}

function openQaCaseStudy() {
  document.body.classList.add('qa-case-open');
  qaCaseModal.showModal();
  qaCursorElements.forEach(element => qaCaseModal.appendChild(element));
  qaCaseModal.querySelector('.qa-case-scroll').scrollTop = 0;
  selectQaScenario('events');
  if (!qaTourWasCompleted()) {
    qaTourStartTimer = window.setTimeout(() => {
      qaTourStartTimer = 0;
      startQaTour();
    }, 320);
  }
}

function closeQaCaseStudy() {
  endQaTour(false);
  if (qaCaseModal.open) qaCaseModal.close();
}

function renderHighlightedSql(code) {
  const tokenPattern = /(--[^\n]*|'(?:''|[^'])*'|\{[^}]+\}|\b(?:SELECT|FROM|WHERE|AND|OR|AS|WITH|IN|NOT|LIKE|GROUP|BY|ORDER|DESC|ASC|INTERVAL|DAY|WHEN|THEN|ELSE|END|NULL)\b|\b(?:JSONExtractString|uniqExact|countIf|count|nullIf|coalesce|toDate|today|now|round)\b(?=\s*\()|\b\d+(?:\.\d+)?\b)/gi;
  const fragment = document.createDocumentFragment();
  let cursor = 0;
  for (const match of code.matchAll(tokenPattern)) {
    if (match.index > cursor) fragment.append(document.createTextNode(code.slice(cursor, match.index)));
    const token = document.createElement('span');
    const value = match[0];
    if (value.startsWith('--')) token.className = 'sql-comment';
    else if (value.startsWith("'")) token.className = 'sql-string';
    else if (value.startsWith('{')) token.className = 'sql-parameter';
    else if (/^\d/.test(value)) token.className = 'sql-number';
    else if (/^(JSONExtractString|uniqExact|countIf|count|nullIf|coalesce|toDate|today|now|round)$/i.test(value)) token.className = 'sql-function';
    else token.className = 'sql-keyword';
    token.textContent = value;
    fragment.append(token);
    cursor = match.index + value.length;
  }
  if (cursor < code.length) fragment.append(document.createTextNode(code.slice(cursor)));
  qaQueryCode.replaceChildren(fragment);
}

function selectQaScenario(key) {
  const scenario = qaScenarios[key];
  if (!scenario) return;
  qaQueryEyebrow.textContent = scenario.eyebrow;
  qaQueryTitle.textContent = scenario.title;
  qaQueryDescription.textContent = scenario.description;
  qaQueryInsight.textContent = scenario.insight;
  renderHighlightedSql(scenario.code);
  qaDecisionNumber.textContent = scenario.eyebrow.slice(0, 2);
  qaDecisionTitle.textContent = scenario.decisionTitle;
  qaDecisionConclusion.textContent = scenario.conclusion;
  qaDecisionAction.textContent = scenario.decision;
  qaQueryOutput.replaceChildren(...scenario.output.map(([label, value]) => {
    const item = document.createElement('span');
    const heading = document.createElement('b');
    heading.textContent = label;
    item.append(heading, ` ${value}`);
    return item;
  }));
  qaScenarioButtons.forEach(button => {
    const active = button.dataset.qaScenario === key;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  qaQueryCard.classList.remove('scenario-changing');
  void qaQueryCard.offsetWidth;
  qaQueryCard.classList.add('scenario-changing');
}

projectFilterButtons.forEach(button => {
  button.addEventListener('click', () => {
    button.classList.remove('filter-pressed');
    void button.offsetWidth;
    button.classList.add('filter-pressed');
    setProjectCategory(button.dataset.projectFilter);
  });
});

document.querySelectorAll('.projects-filter').forEach(button => {
  button.addEventListener('animationend', () => button.classList.remove('filter-pressed'));
});

qaScenarioButtons.forEach(button => {
  button.addEventListener('click', () => {
    setQaGuidedResultVisible(false);
    selectQaScenario(button.dataset.qaScenario);
  });
});

qaScenarioRunButtons.forEach(button => {
  button.addEventListener('click', () => startQaScenarioTour(button.dataset.qaTourScenario));
});

qaTourReplay.addEventListener('click', startQaTour);
qaTourNext.addEventListener('click', () => {
  if (qaTourIndex >= qaTourSteps.length - 1) {
    if (qaTourMode === 'overview') {
      startQaScenarioTour('events', true);
      return;
    }
    endQaTour(true);
    return;
  }
  qaTourIndex += 1;
  revealQaTourStep();
});
qaTourBack.addEventListener('click', () => {
  if (qaTourIndex <= 0) return;
  qaTourIndex -= 1;
  revealQaTourStep();
});
qaTourSkip.addEventListener('click', () => endQaTour(true));
qaCaseModal.querySelector('.qa-case-scroll').addEventListener('scroll', () => {
  if (!qaTourActive || qaTourPositionFrame) return;
  qaTourPositionFrame = requestAnimationFrame(() => {
    qaTourPositionFrame = 0;
    positionQaTour();
  });
}, { passive: true });
window.addEventListener('resize', positionQaTour);
document.addEventListener('keydown', event => {
  if (!qaTourActive || event.key !== 'Escape') return;
  event.preventDefault();
  event.stopImmediatePropagation();
  endQaTour(true);
}, true);

qaCaseOpen.addEventListener('click', openQaCaseStudy);
qaProjectButtons.forEach(button => {
  button.addEventListener('click', () => {
    qaProjectButtons.forEach(projectButton => {
      const active = projectButton === button;
      projectButton.classList.toggle('active', active);
      projectButton.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  });
});
qaCaseClose.addEventListener('click', closeQaCaseStudy);
qaCaseModal.addEventListener('click', event => {
  if (event.target === qaCaseModal) closeQaCaseStudy();
});
qaCaseModal.addEventListener('cancel', event => {
  event.preventDefault();
  closeQaCaseStudy();
});
qaCaseModal.addEventListener('close', () => {
  document.body.classList.remove('qa-case-open');
  qaCursorElements.forEach(element => document.body.appendChild(element));
});

setLensSize(lensSize);
setLensZoom(lensZoom);
selectPortrait(0);
