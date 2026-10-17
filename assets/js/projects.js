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
      ['16:13:03', 'LOAD', ' – ', 'v1.23'],
      ['16:12:52', 'LOAD', ' – ', 'v1.23']
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

// The qalab case study's photo is lazy-loaded (most visitors never open it), but visitors
// who do explore QA case studies are likely to open it - so warm the HTTP cache for it
// in the background once the page is idle, the same way portraits are warmed above.
function scheduleQalabAssetWarmup() {
  const run = () => preloadImage('/assets/images/qalab/laboratory-viewport.jpg');
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
  syncProjectsHash();
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
  syncProjectsHash();
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
  syncProjectsHash();
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
const qaTourReplayRail = document.getElementById('qaTourReplayRail');
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
const qaProjectKicker = document.getElementById('qaProjectKicker');
const qaProjectNote = document.getElementById('qaProjectNote');
const qaProjectRepository = document.getElementById('qaProjectRepository');
const qaProjectCaption = document.getElementById('qaProjectCaption');
const qaProjectYear = document.getElementById('qaProjectYear');
const qaProjectArchiveNote = document.getElementById('qaProjectArchiveNote');
const qaProjectIndex = document.getElementById('qaProjectIndex');
const scopeModal = document.getElementById('scopeModal');
const scopeClose = document.getElementById('scopeClose');
const scopeAxisButtons = Array.from(document.querySelectorAll('[data-scope-axis] button'));
const scopeLevelButtons = Array.from(document.querySelectorAll('[data-level]'));
const scopeEvidenceButtons = Array.from(document.querySelectorAll('[data-evidence]'));
const scopeResultLevel = document.getElementById('scopeResultLevel');
const scopeResultTitle = document.getElementById('scopeResultTitle');
const scopeResultText = document.getElementById('scopeResultText');
const scopeResultMath = document.getElementById('scopeResultMath');
const scopeLevelDetail = document.getElementById('scopeLevelDetail');
const scopeEvidenceDetail = document.getElementById('scopeEvidenceDetail');
const scopeTourStart = document.getElementById('scopeTourStart');
const scopeTourStartRail = document.getElementById('scopeTourStartRail');
const scopeTour = document.getElementById('scopeTour');
const scopeTourExit = document.getElementById('scopeTourExit');
const scopeTourBack = document.getElementById('scopeTourBack');
const scopeTourNext = document.getElementById('scopeTourNext');
const scopeTourSkip = document.getElementById('scopeTourSkip');
const scopeTourStep = document.getElementById('scopeTourStep');
const scopeTourProgress = document.getElementById('scopeTourProgress');
const scopeTourFocus = document.getElementById('scopeTourFocus');
const scopeTourPanel = document.getElementById('scopeTourPanel');
const scopeTourTitle = document.getElementById('scopeTourTitle');
const scopeTourText = document.getElementById('scopeTourText');
const scopeScreens = Array.from(document.querySelectorAll('[data-scope-screen]'));
const scopeScreenJumps = Array.from(document.querySelectorAll('[data-scope-jump]'));
const scopeSideJumps = Array.from(document.querySelectorAll('[data-scope-side-jump]'));
const scopeScreenBack = document.getElementById('scopeScreenBack');
const scopeScreenNext = document.getElementById('scopeScreenNext');
const scopeScreenNumber = document.getElementById('scopeScreenNumber');
const scopeScreenName = document.getElementById('scopeScreenName');
const scopeRiskButtons = Array.from(document.querySelectorAll('[data-risk-layer]'));
const scopeRiskCaption = document.getElementById('scopeRiskCaption');
const scopeUniverseMap = document.getElementById('scopeUniverseMap');
const scopeUniverseButtons = Array.from(document.querySelectorAll('[data-universe-mode]'));
const scopeUniverseCaption = document.getElementById('scopeUniverseCaption');
const scopeContextButtons = Array.from(document.querySelectorAll('[data-context-parameter]'));
const scopeContextDetail = document.getElementById('scopeContextDetail');
const scopeContextHelpButtons = Array.from(document.querySelectorAll('.scope-context-help button'));
const scopeBoundaryMap = document.getElementById('scopeBoundaryMap');
const scopeBoundaryButtons = Array.from(document.querySelectorAll('[data-boundary-mode]'));
const scopeBoundaryCaption = document.getElementById('scopeBoundaryCaption');
const scopeChecklistButtons = Array.from(document.querySelectorAll('[data-checklist-level]'));
const scopeChecklistItems = Array.from(document.querySelectorAll('[data-min-level]'));
const scopeChecklistSummary = document.getElementById('scopeChecklistSummary');
const scopeWorkflowButtons = Array.from(document.querySelectorAll('[data-workflow]'));
const scopeWorkflowView = document.getElementById('scopeWorkflowView');
const scopePitfallButtons = Array.from(document.querySelectorAll('[data-pitfall]'));
const scopePitfallDetail = document.getElementById('scopePitfallDetail');
const scopeArtifactButtons = Array.from(document.querySelectorAll('[data-artifact-tab]'));
const scopeArtifactOutput = document.getElementById('scopeArtifactOutput');
const scopeArtifactLevel = document.getElementById('scopeArtifactLevel');
const scopeArtifactInputs = document.getElementById('scopeArtifactInputs');
const scopeArtifactCard = document.querySelector('.scope-artifact-layout > article');
const scopeFrameworkFrame = document.querySelector('.scope-framework-frame iframe');
const qalabModal = document.getElementById('qalabModal');
const qalabClose = document.getElementById('qalabClose');
const qalabEvidencePanel = document.getElementById('qalabEvidencePanel');
const qalabEvidenceEyebrow = document.getElementById('qalabEvidenceEyebrow');
const qalabEvidenceStatus = document.getElementById('qalabEvidenceStatus');
const qalabEvidenceTitle = document.getElementById('qalabEvidenceTitle');
const qalabEvidenceText = document.getElementById('qalabEvidenceText');
const qalabEvidenceVisual = document.getElementById('qalabEvidenceVisual');
const qalabTestGroups = document.getElementById('qalabTestGroups');
const qalabTestGroupLinks = Array.from(document.querySelectorAll('.qalab-test-groups a'));
const qalabEvidenceNote = document.getElementById('qalabEvidenceNote');
const qalabLayerButtons = Array.from(document.querySelectorAll('[data-qalab-layer]'));
const qalabTourStart = document.getElementById('qalabTourStart');
const qalabOpenRationale = document.getElementById('qalabOpenRationale');
const qalabOpenSimulation = document.getElementById('qalabOpenSimulation');
const qalabHeaderEl = document.querySelector('.qalab-header');
const qalabFooterEl = document.querySelector('.qalab-footer');
const qalabTour = document.getElementById('qalabTour');
const qalabTourFocus = document.getElementById('qalabTourFocus');
const qalabTourPanel = document.getElementById('qalabTourPanel');
const qalabTourStep = document.getElementById('qalabTourStep');
const qalabTourProgress = document.getElementById('qalabTourProgress');
const qalabTourTitle = document.getElementById('qalabTourTitle');
const qalabTourText = document.getElementById('qalabTourText');
const qalabTourExit = document.getElementById('qalabTourExit');
const qalabTourBack = document.getElementById('qalabTourBack');
const qalabTourNext = document.getElementById('qalabTourNext');
const qalabVerdict = document.getElementById('qalabVerdict');
const qalabArchitectureFlow = document.querySelector('.qalab-architecture-flow');
const qalabSimulation = document.getElementById('qalabSimulation');
const qalabSimState = document.getElementById('qalabSimState');
const qalabSimProgress = document.getElementById('qalabSimProgress');
const qalabSimTemp = document.getElementById('qalabSimTemp');
const qalabSimTempFill = document.getElementById('qalabSimTempFill');
const qalabSimYield = document.getElementById('qalabSimYield');
const qalabSimTime = document.getElementById('qalabSimTime');
const qalabSimReplay = document.getElementById('qalabSimReplay');
const qalabWorldValidation = document.getElementById('qalabWorldValidation');
const qalabWorldTemp = document.getElementById('qalabWorldTemp');
const qalabWorldTempBar = document.getElementById('qalabWorldTempBar');
const qalabWorldAction = document.getElementById('qalabWorldAction');
const qalabWorldYield = document.getElementById('qalabWorldYield');
const qalabWorldTime = document.getElementById('qalabWorldTime');
const qalabWorldPeak = document.getElementById('qalabWorldPeak');
const qalabWorldReaction = document.querySelector('.qalab-world-reaction');
const qalabRationale = document.getElementById('qalabRationale');
const qalabRationaleTitle = document.getElementById('qalabRationaleTitle');
const qalabRationaleCount = document.getElementById('qalabRationaleCount');
const qalabRationaleCaption = document.getElementById('qalabRationaleCaption');
const qalabRationaleProgress = document.getElementById('qalabRationaleProgress');
const qalabRationaleScenes = Array.from(document.querySelectorAll('[data-qalab-rationale-scene]'));
const qalabRationaleSteps = Array.from(qalabRationale.querySelectorAll('nav i'));
const qalabRationaleClose = document.getElementById('qalabRationaleClose');
const qalabSimulationClose = document.getElementById('qalabSimulationClose');
const qalabOpenRationaleCompact = document.getElementById('qalabOpenRationaleCompact');
const qalabOpenSimulationCompact = document.getElementById('qalabOpenSimulationCompact');
const qalabTourStartCompact = document.getElementById('qalabTourStartCompact');
const qalabIdent = document.getElementById('qalabIdent');
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
let selectedQaProject = 'qalab';
let scopeTourIndex = -1;
let scopeScreenIndex = 0;
let qalabRunTimers = [];
let qalabTourIndex = -1;
let qalabTourTimer = 0;
let qalabTourStartIndex = 0;
let qalabTourEndIndex = 0;
let qalabRationaleFocusGeometry = null;
let qalabSimTimers = [];
let qalabIdentTimer = 0;
let qalabTourMotionFrame = 0;

const qalabRunVisual = '<div class="qalab-run-stage"><div class="qalab-controlled-change"><header><span>Controlled fixture</span><b>day 5 of 5</b></header><div><article><small>Versioned baseline</small><strong>12.42 s</strong><span>ReactionTime mean</span></article><i>→</i><article><small>Friday batch</small><strong>11.67 s</strong><span>ReactionTime mean</span></article></div></div><div class="qalab-run-console"><div class="qalab-output" aria-live="polite"><header><span>Regression analyzer</span><b data-qalab-output-state>Ready</b></header><div data-qalab-output-lines><p><i>›</i> Waiting for baseline and current batch.</p></div></div><button type="button" class="qalab-run-button" data-qalab-run aria-label="Run regression comparison" title="Run comparison"><span>▶</span><b>Compare batches</b></button></div></div>';

const qalabLayers = {
  automation: {
    eyebrow: '01 · VALIDATE', status: '33 / 33 PASS', title: 'Functional gameplay automation',
    text: 'Domain rules, state transitions, interaction range, parameter sweeps, exports and regression logic are exercised through Unreal Automation Framework.',
    note: '29 simple tests + 1 parameterized test with 4 cases · Editor-only qalabTests module',
    visual: qalabRunVisual
  },
  telemetry: {
    eyebrow: '02 · OBSERVE', status: 'CSV / JSON', title: 'Every run becomes evidence',
    text: 'FTelemetryExporter and UQATelemetryLibrary turn every run into a structured CSV/JSON record.',
    note: 'RunId · ScenarioId · BuildVersion · A/B/Temperature · Yield/Time/Peak · Result',
    visual: '<div class="qalab-telemetry-table"><b>Day</b><b>Temp</b><b>Yield</b><b>Time</b><span>Mon</span><span>50°</span><span>100%</span><span>12.17s</span><span>Tue</span><span>50°</span><span>100%</span><span>12.05s</span><span>Wed</span><span>50°</span><span>100%</span><span>11.92s</span><span>Thu</span><span>50°</span><span>100%</span><span>11.80s</span><span>Fri</span><span>50°</span><span>100%</span><span>11.67s</span></div>'
  },
  regression: {
    eyebrow: '03 · DECIDE', status: 'DRIFT FOUND', title: 'A green test is not the whole answer',
    text: 'URegressionAnalyzer needs 5 runs to be conclusive. Every single day passed – only day five\'s trend crosses ±5%.',
    note: 'Mean · median · std.dev · p95 · max · failure rate · versioned baseline · per-metric thresholds',
    visual: '<div class="qalab-drift-week"><header><span>ReactionTime vs. baseline · Mon – Fri</span><strong>WARNING</strong></header><div class="qalab-drift-days"><p><b>Mon</b><i style="--score:25%;--delay:.05s"><em></em></i><strong>−2%</strong></p><p><b>Tue</b><i style="--score:37.5%;--delay:.1s"><em></em></i><strong>−3%</strong></p><p><b>Wed</b><i style="--score:50%;--delay:.15s"><em></em></i><strong>−4%</strong></p><p class="is-watch"><b>Thu</b><i style="--score:62.5%;--delay:.2s"><em></em></i><strong>−5%</strong></p><p class="is-drift"><b>Fri</b><i style="--score:75%;--delay:.25s"><em></em></i><strong>−6%</strong></p><p class="is-watch"><b>Limit</b><i style="--score:62.5%;--delay:.3s"><em></em></i><strong>±5%</strong></p></div></div>'
  }
};

const qalabTourSteps = [
  { target: '.qalab-hero', title: 'Start with the QA problem', text: 'A functional pass confirms an outcome, but it does not prove that behavior stayed unchanged.', place: 'right-center' },
  { target: '.qalab-architecture', title: 'One mechanic, five testing views', text: 'Manual UI checks, automation, test stands, analytics tests and the Blueprint debug panel all exercise or observe the same production mechanic.', place: 'right-below' },
  { target: '.qalab-simulation', panel: 'simulation', title: 'Try it first', text: 'Goal: yield ≥ 90% while peak temperature stays under 70°C. Configure the reaction and run it yourself.', action: 'chemistry-intro', place: 'right-center' },
  { target: '.qalab-sim-controls article:nth-child(1)', panel: 'simulation', title: 'Balance the reagents', text: 'A closer to 1:1 ratio of A:B raises yield. Either at zero, and the reaction never starts.', action: 'chemistry-run', place: 'right-center' },
  { target: '.qalab-sim-controls article:nth-child(2)', panel: 'simulation', title: 'Heat is a trade-off', text: 'More heat means faster results – until 70°C, where yield starts to drop.', action: 'chemistry-hot', place: 'right-center' },
  { target: '.qalab-controlled-change', title: 'Create a reproducible comparison', text: 'Automation repeats the same controlled fixture against a versioned reference, so a later change can be measured rather than guessed.', action: 'layer-automation', place: 'right-center' },
  { target: '.qalab-run-console', title: 'Run the comparison', text: 'The analyzer compares current measurements with the reference and evaluates the configured threshold.', action: 'run', next: 'Run comparison', place: 'left-center' },
  { target: '.qalab-telemetry-table', title: 'Keep evidence from every run', text: 'Each run becomes a structured record. A sequence of records makes gradual change visible over time.', action: 'layer-telemetry', place: 'right-center' },
  { target: '.qalab-drift-week', title: 'Detect the trend, not just a failure', text: 'Every daily run may still pass. The behavioral warning appears only when the accumulated trend crosses the accepted range.', action: 'layer-regression', place: 'right-center' },
  { target: '.qalab-verdict', title: 'Turn evidence into a QA decision', text: 'Functional checks remain green, while behavioral evidence asks the team to investigate the change before it becomes a visible failure.', action: 'verdict', place: 'right-center' },
  { target: '.qalab-rationale', panel: 'rationale', title: 'An experiment is a natural test case', text: 'Inputs, controlled conditions, outputs and an expected range – he same structure QA already uses to arrange and assert a test.', action: 'rationale-0', place: 'right-center' },
  { target: '.qalab-rationale', panel: 'rationale', title: 'Same discipline, different field', text: 'Standardize, repeat, measure deviation, validate. That is what makes chemistry – and QA evidence – rustworthy.', action: 'rationale-1', place: 'right-center' },
  { target: '.qalab-rationale', panel: 'rationale', title: 'One stand, two purposes', text: 'A lab stand fits the world and doubles as the automated test rig, so no fake developer-only device is needed.', action: 'rationale-2', place: 'right-center' },
  { target: '.qalab-rationale', panel: 'rationale', title: 'Kept deliberately simple', text: 'No formulas or kinetics – just readable cause and effect. Anyone can follow it, and it still holds up as a test case.', action: 'rationale-3', next: 'Finish', place: 'right-center' }
];

function qaTourWasCompleted() {
  try { return sessionStorage.getItem('qa-guided-tour-v1') === 'complete'; }
  catch { return false; }
}

function qalabTourWasCompleted() {
  try { return sessionStorage.getItem('qalab-guided-tour-v1') === 'complete'; }
  catch { return false; }
}

function rememberQalabTourCompletion() {
  try { sessionStorage.setItem('qalab-guided-tour-v1', 'complete'); }
  catch { /* Storage can be unavailable in privacy modes. */ }
}

function qalabIdentWasShown() {
  try { return sessionStorage.getItem('qalab-ident-shown-v1') === 'true'; }
  catch { return false; }
}

function rememberQalabIdentShown() {
  try { sessionStorage.setItem('qalab-ident-shown-v1', 'true'); }
  catch { /* Storage can be unavailable in privacy modes. */ }
}

function forgetQalabIdentShown() {
  try { sessionStorage.removeItem('qalab-ident-shown-v1'); }
  catch { /* Storage can be unavailable in privacy modes. */ }
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

function setProjectCategory(category, instant = false) {
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
    syncProjectsHash();
  };

  if (!instant && document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(updateCategory);
  } else {
    updateCategory();
    incomingView.classList.remove('category-arriving');
    void incomingView.offsetWidth;
    incomingView.classList.add('category-arriving');
  }
}

function renderQaProject(project) {
  selectedQaProject = project;
  const isQalab = project === 'qalab';
  const isScope = project === 'scope';
  qaProjectKicker.textContent = isQalab ? 'QA case study · Unreal Engine' : isScope ? 'QA case study · Test strategy' : 'QA case study · ClickHouse';
  qaProjectNote.textContent = isQalab
    ? 'An analytical-chemistry mindset translated into data-driven QA: controlled conditions, repeatable validation, measurable evidence and preventive regression detection.'
    : isScope ? 'A production-informed framework for turning change impact and implementation complexity into an explainable testing scope.'
    : 'A practical SQL toolkit for validating product analytics in mobile games – from a single event to a production pattern.';
  qaProjectRepository.href = isQalab
    ? 'https://github.com/msgrigorovich/qalab#qalab'
    : isScope
      ? 'https://github.com/msgrigorovich/TestingScopeFramework#----testing-scope-framework'
      : 'https://github.com/msgrigorovich/SQL#----qa-analyst';
  qaProjectRepository.querySelector('span').textContent = 'View repository';
  qaProjectCaption.textContent = isQalab ? 'qalab · quality assurance lab' : isScope ? 'Testing Scope Framework' : 'Analytics-driven QA';
  qaProjectYear.textContent = isQalab ? '2026' : isScope ? '2025' : '2024';
  qaProjectArchiveNote.innerHTML = isQalab ? 'Unreal Engine · C++ · Blueprints<br>Automation & analytics, 2026' : isScope ? 'Risk · complexity · evidence<br>QA test strategy, 2025' : 'ClickHouse · OLAP<br>Mobile game analytics, 2024';
  qaProjectIndex.innerHTML = isQalab
    ? '<p>Case contents</p><span><b>33</b> automated checks</span><span><b>03</b> QA evidence layers</span><span><b>01</b> shared gameplay API</span>'
    : isScope ? '<p>Case contents</p><span><b>05</b> testing levels</span><span><b>06</b> evidence sources</span><span><b>01</b> decision framework</span>'
    : '<p>Case contents</p><span><b>04</b> diagnostic scenarios</span><span><b>03</b> evidence layers</span><span><b>01</b> read-only approach</span>';
  qaCaseOpen.classList.toggle('qalab-preview', isQalab);
  qaCaseOpen.classList.toggle('scope-preview', isScope);
  qaCaseOpen.setAttribute('aria-label', isQalab ? 'Open qalab case study' : isScope ? 'Open Testing Scope Framework case study' : 'Open Analytics-driven QA case study');
  qaCaseOpen.innerHTML = isQalab
    ? '<span class="qa-preview-heading"><small>Chemistry · Quality · Analytics</small><strong>One system.<br>Five testing views.</strong></span><span class="qalab-preview-directions" aria-hidden="true"><i>Manual</i><i>Automated<br>Tests</i><i>Test<br>Stands</i><i>Analytics<br>Tests</i><i>Blueprint<br>Debug</i></span><span class="qa-preview-open"><span>Open full</span><span>↗</span></span>'
    : isScope ? '<span class="qa-preview-heading"><small>Risk · complexity · evidence</small><strong>Is it possible to<br>standardize QA in AAA?</strong></span><span class="scope-preview-model" aria-hidden="true"><span>IMPACT</span><b>+</b><span>COMPLEXITY</span></span><em class="scope-preview-question" aria-hidden="true">?</em><span class="scope-preview-scale" aria-hidden="true"><i>XS</i><i>S</i><i>M</i><i>L</i><i>XL</i></span><span class="qa-preview-open"><span>Open full</span><span>↗</span></span>'
    : '<span class="qa-preview-top"><b>analytics_qa.sql</b></span><span class="qa-preview-heading"><small>ClickHouse · read-only diagnostics</small><strong>From action<br>to evidence.</strong></span><span class="qa-preview-flow" aria-hidden="true"><i><b>01</b>Action</i><em>→</em><i><b>02</b>Event</i><em>→</em><i><b>03</b>Query</i><em>→</em><i><b>04</b>Decision</i></span><span class="qa-preview-chart" aria-hidden="true"><i style="--qa-bar: 88%"><b>Start</b></i><i style="--qa-bar: 78%"><b>Complete</b></i><i style="--qa-bar: 12%"><b>Fail</b></i></span><span class="qa-preview-open"><span>Open full</span><span>↗</span></span>';
}

function selectQaProject(project) {
  qaProjectButtons.forEach(projectButton => {
    const active = projectButton.dataset.qaProject === project;
    projectButton.classList.toggle('active', active);
    projectButton.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  renderQaProject(project);
  syncProjectsHash();
}

function selectQalabLayer(key) {
  const layer = qalabLayers[key];
  if (!layer) return;
  qalabEvidenceEyebrow.textContent = layer.eyebrow;
  qalabEvidenceStatus.textContent = layer.status;
  qalabEvidenceTitle.textContent = layer.title;
  qalabEvidenceText.textContent = layer.text;
  qalabEvidenceNote.textContent = layer.note;
  qalabEvidenceVisual.className = 'qalab-evidence-visual';
  qalabEvidenceVisual.classList.add(`is-${key}`);
  qalabEvidenceVisual.innerHTML = layer.visual;
  qalabTestGroups.hidden = key !== 'automation';
  qalabLayerButtons.forEach(button => {
    const active = button.dataset.qalabLayer === key;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  qalabEvidencePanel.classList.remove('is-changing');
  void qalabEvidencePanel.offsetWidth;
  qalabEvidencePanel.classList.add('is-changing');
  syncProjectsHash();
}

function bindDropletMotion(controls, targetSelector = null) {
  controls.filter(Boolean).forEach(control => {
    const animatedElement = targetSelector ? control.querySelector(targetSelector) : control;
    if (!animatedElement) return;
    animatedElement.classList.add('site-droplet-motion');

    control.addEventListener('pointerenter', () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      animatedElement.classList.remove('droplet-impact', 'droplet-release');
      void animatedElement.offsetWidth;
      animatedElement.classList.add('droplet-impact');
    });

    control.addEventListener('pointerleave', event => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = animatedElement.getBoundingClientRect();
      const angle = Math.atan2(
        event.clientY - (rect.top + rect.height / 2),
        event.clientX - (rect.left + rect.width / 2)
      ) * 180 / Math.PI;
      animatedElement.style.setProperty('--droplet-release-angle', `${angle}deg`);
      animatedElement.style.setProperty('--droplet-release-angle-reverse', `${-angle}deg`);
      animatedElement.classList.remove('droplet-impact', 'droplet-release');
      void animatedElement.offsetWidth;
      animatedElement.classList.add('droplet-release');
    });
  });
}

bindDropletMotion(qalabTestGroupLinks, '.qalab-test-group-icon');
bindDropletMotion(qalabLayerButtons);
bindDropletMotion([qaCaseClose, qalabClose, scopeClose, scopeTourStart, scopeTourStartRail]);
bindDropletMotion(qaScenarioRunButtons);
bindDropletMotion([...scopeAxisButtons, ...scopeLevelButtons, ...scopeEvidenceButtons, ...scopeSideJumps, ...scopeUniverseButtons, ...scopeChecklistButtons, ...scopeWorkflowButtons, ...scopePitfallButtons, ...scopeArtifactButtons]);
bindDropletMotion([
  qaTourReplay,
  qaTourReplayRail,
  qalabTourStart,
  qalabTourStartCompact,
  qalabOpenRationale,
  qalabOpenRationaleCompact,
  qalabOpenSimulation,
  qalabOpenSimulationCompact
]);

function clearQalabRun() {
  qalabRunTimers.forEach(timer => clearTimeout(timer));
  qalabRunTimers = [];
}

function runQalabStand(onComplete) {
  clearQalabRun();
  if (!qalabEvidenceVisual.querySelector('[data-qalab-run]')) selectQalabLayer('automation');
  const button = qalabEvidenceVisual.querySelector('[data-qalab-run]');
  const state = qalabEvidenceVisual.querySelector('[data-qalab-output-state]');
  const lines = qalabEvidenceVisual.querySelector('[data-qalab-output-lines]');
  if (!button || !state || !lines) return;
  button.classList.add('is-running');
  button.disabled = true;
  state.classList.remove('is-warning');
  state.textContent = 'Running';
  lines.replaceChildren();
  qalabVerdict.classList.remove('is-active');
  const log = (delay, message, warning = false) => {
    qalabRunTimers.push(setTimeout(() => {
      const line = document.createElement('p');
      line.classList.toggle('is-warning', warning);
      line.innerHTML = `<i>${warning ? '!' : '✓'}</i> ${message}`;
      lines.appendChild(line);
    }, delay));
  };
  log(180, 'Load versioned baseline · ReactionTime mean 12.42 s');
  log(620, 'Load current batch (day 5) · ReactionTime mean 11.67 s');
  log(1080, 'Functional result valid · controlled inputs stable');
  log(1540, 'Relative delta · (11.67 − 12.42) / 12.42 = −6.04%');
  log(2020, '|−6.04%| > configured ±5% · 5-day trend flagged', true);
  qalabRunTimers.push(setTimeout(() => {
    state.textContent = 'Warning';
    state.classList.add('is-warning');
    button.classList.remove('is-running');
    button.disabled = false;
    qalabVerdict.classList.add('is-active');
    if (onComplete) onComplete();
  }, 2440));
}

function clearQalabSimulation() {
  qalabSimTimers.forEach(timer => clearTimeout(timer));
  qalabSimTimers = [];
}

function playQalabIdent() {
  clearTimeout(qalabIdentTimer);
  if (qalabIdentWasShown()) {
    qalabIdent.hidden = true;
    qalabIdent.classList.remove('is-active');
    return;
  }
  rememberQalabIdentShown();
  qalabIdent.hidden = false;
  qalabIdent.classList.remove('is-active');
  void qalabIdent.offsetWidth;
  qalabIdent.classList.add('is-active');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  qalabIdentTimer = setTimeout(() => {
    qalabIdent.hidden = true;
    qalabIdent.classList.remove('is-active');
  }, reduceMotion ? 1800 : 4000);
}

function setQalabSimTimeline(index) {
  qalabSimulation.querySelectorAll('.qalab-sim-timeline i').forEach((item, itemIndex) => item.classList.toggle('active', itemIndex === index));
}

function resetQalabSimulation() {
  clearQalabSimulation();
  qalabSimulation.classList.remove('is-running', 'is-hot');
  qalabSimState.textContent = '01 · Configure';
  qalabSimProgress.textContent = '0%';
  qalabSimTemp.textContent = '20°C';
  qalabSimTempFill.style.width = '0%';
  qalabSimTempFill.style.background = '#72b581';
  qalabSimYield.textContent = ' – ';
  qalabSimTime.textContent = 'Waiting to run';
  qalabWorldValidation.textContent = 'Awaiting input';
  qalabWorldTemp.textContent = '20.0';
  qalabWorldTempBar.style.setProperty('--value', '0%');
  qalabWorldAction.textContent = 'Configure experiment';
  qalabWorldYield.textContent = ' – ';
  qalabWorldTime.textContent = ' – ';
  qalabWorldPeak.textContent = ' – ';
  qalabWorldReaction.style.setProperty('--reaction-progress', '0deg');
  setQalabSimTimeline(0);
}

function playQalabSimulation(mode = 'safe') {
  resetQalabSimulation();
  const hot = mode === 'hot';
  qalabSimulation.classList.add('is-running');
  qalabSimState.textContent = '02 · Ready';
  qalabWorldValidation.textContent = 'Inputs valid';
  qalabWorldAction.textContent = 'Start Default';
  setQalabSimTimeline(1);
  qalabSimTimers.push(setTimeout(() => {
    qalabSimState.textContent = '03 · Running';
    setQalabSimTimeline(2);
    qalabSimProgress.textContent = '24%';
    qalabSimTemp.textContent = hot ? '48°C' : '35°C';
    qalabSimTempFill.style.width = hot ? '35%' : '19%';
    qalabWorldTemp.textContent = hot ? '48.0' : '35.0';
    qalabWorldTempBar.style.setProperty('--value', hot ? '35%' : '19%');
    qalabWorldValidation.textContent = 'Running';
    qalabWorldAction.textContent = 'Observe metrics';
    qalabWorldReaction.style.setProperty('--reaction-progress', '86deg');
  }, 450));
  qalabSimTimers.push(setTimeout(() => {
    qalabSimProgress.textContent = '68%';
    qalabSimTemp.textContent = hot ? '72°C' : '46°C';
    qalabSimTempFill.style.width = hot ? '65%' : '33%';
    qalabWorldTemp.textContent = hot ? '72.0' : '46.0';
    qalabWorldTempBar.style.setProperty('--value', hot ? '65%' : '33%');
    if (hot) qalabSimulation.classList.add('is-hot');
    qalabWorldReaction.style.setProperty('--reaction-progress', '245deg');
  }, 1250));
  qalabSimTimers.push(setTimeout(() => {
    qalabSimProgress.textContent = '100%';
    qalabSimTemp.textContent = hot ? '90°C' : '50°C';
    qalabSimTempFill.style.width = hot ? '88%' : '38%';
    qalabSimTempFill.style.background = hot ? '#d9675d' : '#72b581';
    qalabWorldTemp.textContent = hot ? '90.0' : '50.0';
    qalabWorldTempBar.style.setProperty('--value', hot ? '88%' : '38%');
    qalabSimYield.textContent = hot ? '70% yield' : '100% yield';
    qalabSimTime.textContent = hot ? '3.0 s · faster, objective failed' : '6.0 s · objective passed';
    qalabSimState.textContent = hot ? '04 · Completed · FAIL' : '04 · Completed · PASS';
    qalabWorldValidation.textContent = hot ? 'Objective failed' : 'Completed · true';
    qalabWorldAction.textContent = hot ? 'Run Edge Case' : 'Get Result';
    qalabWorldYield.textContent = hot ? '70%' : '100%';
    qalabWorldTime.textContent = hot ? '3.0 s' : '6.0 s';
    qalabWorldPeak.textContent = hot ? '90°C' : '50°C';
    qalabWorldReaction.style.setProperty('--reaction-progress', '360deg');
    setQalabSimTimeline(3);
  }, 2250));
}

function positionQalabOverlayPanels() {
  if (!qalabHeaderEl || !qalabFooterEl) return;
  const top = `${qalabHeaderEl.getBoundingClientRect().height + 12}px`;
  const bottom = `${qalabFooterEl.getBoundingClientRect().height + 12}px`;
  qalabRationale.style.top = top;
  qalabRationale.style.bottom = bottom;
  qalabSimulation.style.top = top;
  qalabSimulation.style.bottom = bottom;
}

function getQalabScrollContainer() {
  const poster = qalabModal.querySelector('.qalab-poster');
  const body = qalabModal.querySelector('.qalab-body');
  const isScrollable = element => {
    if (!element) return false;
    const overflowY = getComputedStyle(element).overflowY;
    return (overflowY === 'auto' || overflowY === 'scroll') && element.scrollHeight > element.clientHeight + 1;
  };
  if (isScrollable(body)) return body;
  if (isScrollable(poster)) return poster;
  return body || poster;
}

function animateQalabTourScroll(container, destination) {
  if (qalabTourMotionFrame) cancelAnimationFrame(qalabTourMotionFrame);
  const startScroll = container.scrollTop;
  const distance = destination - startScroll;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || Math.abs(distance) < 1) {
    container.scrollTop = destination;
    positionQalabTour();
    return;
  }
  qalabTour.classList.add('is-moving');
  const startedAt = performance.now();
  const duration = 550;
  const move = now => {
    if (qalabTour.hidden) { qalabTourMotionFrame = 0; return; }
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = progress < 0.5 ? 4 * Math.pow(progress, 3) : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    container.scrollTop = startScroll + distance * eased;
    positionQalabTour();
    if (progress < 1) {
      qalabTourMotionFrame = requestAnimationFrame(move);
      return;
    }
    qalabTourMotionFrame = 0;
    qalabTour.classList.remove('is-moving');
    positionQalabTour();
  };
  qalabTourMotionFrame = requestAnimationFrame(move);
}

function revealQalabTourTarget(initial) {
  const step = qalabTourSteps[qalabTourIndex];
  const poster = qalabModal.querySelector('.qalab-poster');
  const target = poster.querySelector(step.target);
  const container = getQalabScrollContainer();
  if (!target || !container) {
    positionQalabTour();
    return;
  }
  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const targetTop = container.scrollTop + targetRect.top - containerRect.top;
  const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
  const destination = Math.max(0, Math.min(
    targetTop - Math.max(12, (container.clientHeight - targetRect.height) / 2),
    maxScroll
  ));
  if (initial) {
    container.scrollTop = destination;
    positionQalabTour();
  } else {
    animateQalabTourScroll(container, destination);
  }
}

function positionQalabTour() {
  if (qalabTour.hidden || qalabTourIndex < 0) return;
  const poster = qalabModal.querySelector('.qalab-poster');
  const target = poster.querySelector(qalabTourSteps[qalabTourIndex].target);
  if (!target) return;
  const overlayIsFixed = getComputedStyle(qalabTour).position === 'fixed';
  const root = overlayIsFixed
    ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
    : poster.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  const pad = 7;
  const rationaleStep = qalabTourSteps[qalabTourIndex].panel === 'rationale';
  let left = Math.max(8, rect.left - root.left - pad);
  let top = Math.max(8, rect.top - root.top - pad);
  let width = Math.min(root.width - left - 8, rect.width + pad * 2);
  let height = Math.min(root.height - top - 8, rect.height + pad * 2);
  if (rationaleStep && qalabRationaleFocusGeometry) {
    ({ left, top, width, height } = qalabRationaleFocusGeometry);
  } else if (rationaleStep) {
    qalabRationaleFocusGeometry = { left, top, width, height };
  } else {
    qalabRationaleFocusGeometry = null;
  }
  Object.assign(qalabTourFocus.style, { left:`${left}px`, top:`${top}px`, width:`${width}px`, height:`${height}px` });
  const panelWidth = qalabTourPanel.offsetWidth;
  const panelHeight = qalabTourPanel.offsetHeight;
  const gap = 14;
  if (window.innerWidth >= 821 && window.innerHeight >= 560) {
    const margin = 8;
    const minY = (qalabHeaderEl ? qalabHeaderEl.getBoundingClientRect().height : 0) + margin;
    const maxY = root.height - (qalabFooterEl ? qalabFooterEl.getBoundingClientRect().height : 0) - panelHeight - margin;
    const clampX = value => Math.min(Math.max(margin, value), root.width - panelWidth - margin);
    const clampY = value => Math.min(Math.max(minY, value), Math.max(minY, maxY));
    const preferred = qalabTourSteps[qalabTourIndex].place || 'right-center';
    const candidates = {
      'right-center': { left: left + width + gap, top: top + (height - panelHeight) / 2 },
      'right-below': { left: left + width - panelWidth, top: top + height + gap },
      'left-center': { left: left - panelWidth - gap, top: top + (height - panelHeight) / 2 },
      'below-center': { left: left + (width - panelWidth) / 2, top: top + height + gap },
      'above-center': { left: left + (width - panelWidth) / 2, top: top - panelHeight - gap }
    };
    const overlaps = candidate => {
      const x = clampX(candidate.left);
      const y = clampY(candidate.top);
      return x < left + width + gap && x + panelWidth + gap > left &&
        y < top + height + gap && y + panelHeight + gap > top;
    };
    const order = [preferred, 'right-center', 'left-center', 'right-below', 'below-center', 'above-center']
      .filter((name, index, names) => names.indexOf(name) === index);
    const chosen = candidates[order.find(name => !overlaps(candidates[name]))] || candidates[preferred];
    qalabTourPanel.style.left = `${clampX(chosen.left)}px`;
    qalabTourPanel.style.top = `${clampY(chosen.top)}px`;
    return;
  }
  const panelLeft = Math.min(Math.max(12, left), Math.max(12, root.width - panelWidth - 12));
  const spaceBelow = root.height - (top + height) - 12;
  const spaceAbove = top - 12;
  let panelTop;
  if (spaceBelow >= panelHeight + gap) {
    panelTop = top + height + gap;
  } else if (spaceAbove >= panelHeight + gap) {
    panelTop = top - panelHeight - gap;
  } else if (spaceBelow >= spaceAbove) {
    panelTop = Math.min(top + height + gap, root.height - panelHeight - 12);
  } else {
    panelTop = Math.max(12, top - panelHeight - gap);
  }
  qalabTourPanel.style.left = `${panelLeft}px`;
  qalabTourPanel.style.top = `${panelTop}px`;
}

function selectQalabRationale(index) {
  const titles = [
    'An experiment already behaves like a test case',
    'Trust comes from a repeatable analytical method',
    'The test stand belongs inside the world',
    'Scientific structure without scientific overload'
  ];
  const captions = [
    'Inputs → conditions → outputs → expected range',
    'Standardize → calibrate → repeat → measure → validate',
    'Player surface ↔ shared component ↔ automation surface',
    'Keep the causal model · remove specialist prerequisites'
  ];
  qalabRationaleTitle.textContent = titles[index];
  qalabRationaleCount.textContent = `${String(index + 1).padStart(2,'0')} / 04`;
  qalabRationaleCaption.textContent = captions[index];
  qalabRationaleProgress.style.width = `${(index + 1) * 25}%`;
  qalabRationaleScenes.forEach((scene, sceneIndex) => scene.classList.toggle('active', sceneIndex === index));
  qalabRationaleSteps.forEach((step, stepIndex) => {
    step.classList.toggle('active', stepIndex === index);
    step.classList.toggle('passed', stepIndex < index);
  });
}

function showQalabTourStep(initial = false) {
  const step = qalabTourSteps[qalabTourIndex];
  const simulationStep = step.panel === 'simulation';
  const rationaleStep = step.panel === 'rationale';
  if (rationaleStep || simulationStep) {
    const scrollContainer = getQalabScrollContainer();
    if (scrollContainer) scrollContainer.scrollTop = 0;
    positionQalabOverlayPanels();
  }
  const rationaleWasHidden = qalabRationale.hidden;
  const simulationWasHidden = qalabSimulation.hidden;
  qalabRationale.hidden = !rationaleStep;
  if (rationaleStep) {
    if (rationaleWasHidden) qalabRationale.classList.add('is-entering');
    selectQalabRationale(Number(step.action.split('-')[1]));
  }
  qalabSimulation.hidden = !simulationStep;
  if (simulationStep) {
    if (simulationWasHidden) qalabSimulation.classList.add('is-entering');
    if (step.action === 'chemistry-intro') resetQalabSimulation();
    if (step.action === 'chemistry-run') playQalabSimulation('safe');
    if (step.action === 'chemistry-hot') playQalabSimulation('hot');
  } else {
    clearQalabSimulation();
  }
  if (step.action === 'layer-automation') selectQalabLayer('automation');
  if (step.action === 'run') selectQalabLayer('automation');
  if (step.action === 'layer-telemetry') selectQalabLayer('telemetry');
  if (step.action === 'layer-regression') selectQalabLayer('regression');
  const sectionStep = qalabTourIndex - qalabTourStartIndex + 1;
  const sectionLength = qalabTourEndIndex - qalabTourStartIndex + 1;
  qalabTourStep.textContent = `${String(sectionStep).padStart(2,'0')} / ${String(sectionLength).padStart(2,'0')}`;
  qalabTourProgress.style.width = `${(sectionStep / sectionLength) * 100}%`;
  qalabTourTitle.textContent = step.title;
  qalabTourText.textContent = step.text;
  qalabTourBack.disabled = qalabTourIndex <= qalabTourStartIndex;
  qalabTourNext.textContent = step.next || (qalabTourIndex >= qalabTourEndIndex ? 'Finish' : 'Next');
  qalabTour.classList.toggle('is-interactive', step.action === 'run');
  if (qalabArchitectureFlow) qalabArchitectureFlow.classList.toggle('is-animating', step.target === '.qalab-architecture');
  if (step.action === 'verdict') {
    selectQalabLayer('regression');
    qalabVerdict.classList.add('is-active');
  }
  if (rationaleStep || simulationStep) {
    requestAnimationFrame(positionQalabTour);
  } else {
    requestAnimationFrame(() => revealQalabTourTarget(initial));
  }
}

function closeQalabPanels() {
  if (!qalabTour.hidden) { endQalabTour(true); return; }
  qalabRationale.hidden = true;
  qalabSimulation.hidden = true;
  clearQalabSimulation();
}

function startQalabTour(startIndex = 0, endIndex = qalabTourSteps.length - 1) {
  clearTimeout(qalabTourTimer);
  qalabRationaleFocusGeometry = null;
  selectQalabLayer('automation');
  qalabTourStartIndex = startIndex;
  qalabTourEndIndex = endIndex;
  qalabTourIndex = startIndex;
  qalabTour.hidden = false;
  qalabRationale.hidden = true;
  qalabSimulation.hidden = true;
  showQalabTourStep(true);
  syncProjectsHash();
}

function startQalabTourAtPanel(panel) {
  const startIndex = qalabTourSteps.findIndex(step => step.panel === panel);
  if (startIndex < 0) {
    startQalabTour(0);
    return;
  }
  let endIndex = startIndex;
  while (endIndex + 1 < qalabTourSteps.length && qalabTourSteps[endIndex + 1].panel === panel) {
    endIndex += 1;
  }
  startQalabTour(startIndex, endIndex);
}

function endQalabTour(completed = true) {
  clearTimeout(qalabTourTimer);
  clearQalabSimulation();
  qalabRationale.hidden = true;
  qalabSimulation.hidden = true;
  qalabTour.hidden = true;
  qalabTourIndex = -1;
  qalabRationaleFocusGeometry = null;
  if (qalabArchitectureFlow) qalabArchitectureFlow.classList.remove('is-animating');
  if (completed) rememberQalabTourCompletion();
  syncProjectsHash();
}

function runCurrentQalabTourStep() {
  const runStepIndex = qalabTourIndex;
  qalabTourNext.disabled = true;
  runQalabStand(() => {
    qalabTourNext.disabled = false;
    const stillOnRunStep = !qalabTour.hidden
      && qalabTourIndex === runStepIndex
      && qalabTourSteps[qalabTourIndex]?.action === 'run';
    if (!stillOnRunStep) return;
    qalabTourIndex += 1;
    showQalabTourStep();
  });
}

function nextQalabTour() {
  const step = qalabTourSteps[qalabTourIndex];
  if (step.action === 'run') {
    runCurrentQalabTourStep();
    return;
  }
  if (qalabTourIndex >= qalabTourEndIndex) { endQalabTour(true); return; }
  qalabTourIndex += 1;
  showQalabTourStep();
}

let qaCaseScrollY = 0;
function lockPageScroll() {
  qaCaseScrollY = window.scrollY;
  document.body.classList.add('qa-case-open');
  if (window.matchMedia('(max-width: 820px)').matches) {
    document.body.style.position = 'fixed';
    document.body.style.top = `-${qaCaseScrollY}px`;
    document.body.style.width = '100%';
  }
}
function unlockPageScroll() {
  document.body.classList.remove('qa-case-open');
  if (document.body.style.position === 'fixed') {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, qaCaseScrollY);
  }
}

function openQalabCaseStudy(suppressAutoTour = false) {
  lockPageScroll();
  qalabModal.showModal();
  qaCursorElements.forEach(element => qalabModal.appendChild(element));
  selectQalabLayer('automation');
  qalabVerdict.classList.remove('is-active');
  playQalabIdent();
  if (!suppressAutoTour && !qalabTourWasCompleted()) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    qalabTourTimer = window.setTimeout(() => startQalabTour(0), reduceMotion ? 1850 : 4100);
  }
  syncProjectsHash();
}

function closeQalabCaseStudy() {
  endQalabTour(false);
  clearQalabRun();
  clearTimeout(qalabIdentTimer);
  qalabIdent.hidden = true;
  if (qalabModal.open) qalabModal.close();
}

const scopeLevels = {
  1: { level:'XS', title:'Minimal Validation', text:'Confirm the local change at its point of application without exploring behavior outside it.', name:'Safety lock flag', description:'A local boolean blocks StartExperiment without changing the reaction model or its surrounding systems.', depth:'Surface-level confirmation of the requested behavior', breadth:'The specific change point only', boundary:'Alternative paths, states and dependencies are not checked.' },
  2: { level:'S', title:'Basic Validation', text:'Check simple logic, obvious deviations and nearby scenarios that use the same behavior.', name:'Static temperature threshold', description:'A fixed maximum temperature rejects unsafe reactions while the exact boundary remains valid.', depth:'Basic logic, a negative scenario and obvious boundaries', breadth:'The change point and its immediate surroundings', boundary:'Complex states and transitions are not checked.' },
  3: { level:'M', title:'Deep Validation', text:'Verify the complete mechanic as a system of calculations, states, transitions and dependencies.', name:'Ratio-dependent safe temperature', description:'The safe temperature now depends on the AmountA/AmountB ratio, creating combinations and a dynamic boundary.', depth:'Calculations, combinations, boundaries, states and data consistency', breadth:'The whole Reaction Experiment mechanic', boundary:'Testing does not expand beyond the mechanic.' },
  4: { level:'L', title:'System Validation', text:'Verify the mechanic together with the adjacent systems that consume or communicate its result.', name:'Threshold failures reach regression analysis', description:'Test Stand results must carry the new failures into FailureRate without losing them in aggregate metrics.', depth:'Complete mechanic logic and connected data flow', breadth:'The mechanic and identified adjacent systems', boundary:'The whole product is outside the required scope.' },
  5: { level:'XL', title:'Critical Validation', text:'Challenge the entire affected area with maximum distrust, including non-standard and cross-domain risks.', name:'Release-blocking threshold drift', description:'Regression, telemetry, anchor tests, interaction and sweep performance now share release-critical behavior.', depth:'Extreme, negative, recovery and non-functional scenarios', breadth:'Cross-system and cross-domain regression', boundary:'Practically none; the affected scope is challenged broadly.' }
};

let scopeImpactWeight = .6;
let scopeComplexityWeight = .4;
let scopeArtifactMode = 'summary';
const scopeLevelColors = {
  1:{background:'#82b79a',ink:'#171717'},
  2:{background:'#b8d4a6',ink:'#171717'},
  3:{background:'#eadb8d',ink:'#171717'},
  4:{background:'#dfa06e',ink:'#171717'},
  5:{background:'#ca6f5d',ink:'#ffffff'}
};

const scopeAxisCriteria = {
  impact: {
    1:'Isolated presentation or content change; no persistent state and negligible player consequence.',
    2:'Localized effect within one feature; limited player exposure and straightforward recovery.',
    3:'Meaningful effect on a complete feature and its nearest consumers or player experience.',
    4:'Multiple connected systems, persisted state or broad player exposure can be affected.',
    5:'Core experience, release integrity, critical data or a large part of the player base is exposed.'
  },
  complexity: {
    1:'A known, isolated implementation with no branching behavior or new dependencies.',
    2:'Localized logic with few states, familiar technology and clearly bounded dependencies.',
    3:'Several rules, states or dependencies create multiple credible behavioral paths.',
    4:'Cross-system flow, timing, asynchronous behavior or technical novelty increases uncertainty.',
    5:'Architectural change, migration, concurrency or systemic uncertainty makes behavior difficult to contain.'
  }
};

const scopeRiskLayers = {
  change:{title:'Start at the change.',text:'Identify the rules, states and observable result that were intentionally modified.'},
  systems:{title:'Follow every connection.',text:'Map the systems that consume, persist, trigger or present the changed behavior.'},
  consequences:{title:'Reason about the blast radius.',text:'Ask what can reach the player, corrupt state, distort data or increase the cost of recovery.'}
};

const scopeContextParameters = {
  depth:{title:'Depth defines vertical coverage.',text:'It determines how many rules, states, boundaries, combinations and failure paths must be investigated inside the changed functionality.'},
  breadth:{title:'Breadth defines horizontal coverage.',text:'It determines which consumers, integrations, persisted states and neighboring systems belong to the justified regression boundary.'},
  distrust:{title:'Distrust challenges the calculated minimum.',text:'Expert intuition can raise the scope when something feels insufficiently understood – but the concern must be stated, examined and discussed.'}
};

const scopeEvidence = {
  blueprints:{n:'01',meta:'Logic & state',title:'Blueprints show what the feature can do.',text:'Inspect execution paths, state ownership and dependencies before deciding which conditions and transitions need direct validation.',question:'Which paths, states and connected systems can this change reach?',footer:'Understand the implementation → map test conditions'},
  logs:{n:'02',meta:'Sequence & context',title:'Logs explain what happened in one run.',text:'Use structured messages to reconstruct the sequence, parameters and first point where actual behavior diverged from expectation.',question:'Where did the observed run first depart from the intended flow?',footer:'Reproduce → order events → isolate the divergence'},
  insights:{n:'03',meta:'Time & performance',title:'Unreal Insights reveals cost hidden by a PASS.',text:'A function can remain correct while becoming slower, noisier or more expensive. A trace makes that behavioral change measurable.',question:'Did execution time, frame cost or resource behavior regress?',footer:'Capture a trace → compare markers → investigate cost'},
  stands:{n:'04',meta:'Controlled runs',title:'Test stands make behavior repeatable.',text:'Fix inputs and environmental conditions, then run the same mechanic repeatedly so a result can be compared rather than merely observed.',question:'Does the same controlled setup continue to produce the expected range?',footer:'Control inputs → repeat → compare with baseline'},
  telemetry:{n:'05',meta:'Behavior at scale',title:'Telemetry turns runs into a trend.',text:'Structured results expose drift that isolated functional passes cannot: rates, timing, distribution and changes across builds.',question:'Is behavior stable across repeated runs and versions?',footer:'Measure batches → observe trend → signal regression'},
  diff:{n:'06',meta:'Change surface',title:'A diff narrows the investigation.',text:'Code, Blueprint and data changes help connect a new signal to the actual implementation surface without treating correlation as proof.',question:'What changed that could plausibly explain the new behavior?',footer:'Compare revisions → form a hypothesis → verify it'}
};

const scopePitfalls = {
  goal:{meta:'Input failure · goal',title:'The team cannot agree on success.',text:'If the intended result is vague or no longer relevant, neither the matrix nor a detailed checklist can make the conclusion reliable.',action:'Restate the current goal, expected behavior and acceptance boundary in the task.'},
  pr:{meta:'Input failure · change',title:'The implementation surface stays invisible.',text:'An uninformative Pull Request prevents QA from validating dependencies, affected paths and whether the assigned Impact still holds.',action:'Document the actual change, affected modules, risks and verification already performed.'},
  values:{meta:'Input failure · score',title:'The formula formalizes the wrong assumption.',text:'Missing or unjustified Impact and Complexity values make every downstream recommendation consistently repeatable – and consistently wrong.',action:'Return to the task owner, challenge both values and record the reasoning.'},
  context:{meta:'Input failure · knowledge',title:'The task is not the source of truth.',text:'When decisions live in private messages or stale threads, two engineers cannot receive identical input.',action:'Move relevant decisions, constraints and expected behavior into the task.'},
  branch:{meta:'Execution failure · version',title:'Correct checks run against the wrong system.',text:'A stale or unreconciled branch invalidates part of the evidence and can force the same work to be repeated.',action:'Confirm target revision, rebase state and build provenance before testing.'},
  environment:{meta:'Execution failure · coverage',title:'One configuration becomes the whole conclusion.',text:'A local or single-environment pass cannot represent distributed, networked or platform-specific behavior when those modes apply.',action:'Name the required environments explicitly and record which were actually covered.'}
};

const scopeTourSteps = [
  {screen:0,target:'.scope-universe-map',title:'Begin with the real question',text:'A useful standard starts by asking how much evidence this particular change needs.'},
  {screen:1,target:'.scope-context-parameters',title:'Replace the universal checklist',text:'The framework standardizes reasoning because fixed mandatory and optional lists cannot represent every feature and dependency.'},
  {screen:2,target:'.scope-result',title:'Estimate a responsible minimum',text:'Impact carries 60% and implementation complexity 40%. The rounded-up result proposes where testing should begin.'},
  {screen:3,target:'.scope-level-detail',title:'Translate a score into test design',text:'Each level changes depth, breadth and the explicit boundary of what is not required.'},
  {screen:4,target:'#scopeChecklistSummary',title:'Nothing is dropped as scope grows',text:'Every level inherits every required check from the levels below it — raising the scope never silently removes earlier coverage.'},
  {screen:5,target:'.scope-input-gate',title:'A correct formula still needs correct inputs',text:'If Impact or Complexity were never validated, the matrix produces a confident, consistently wrong scope.'},
  {screen:6,target:'.scope-workflow-view article',title:'One workflow does not fit every path',text:'The base workflow assumes time to validate inputs and reason about scope — emergency and hotfix branches are explicitly excluded.'},
  {screen:7,target:'#scopeEvidenceDetail',title:'Finish with observable evidence',text:'Blueprints, logs, traces, stands, telemetry and diffs answer different questions. Together they support the final human decision.'},
  {screen:8,target:'#scopePitfallDetail',title:'Most failures begin before testing',text:'A vague goal, an uninformative PR or a stale branch can make even a correct formula produce an unreliable scope.'},
  {screen:9,target:'.scope-live-framework header',title:'Use the model, not a reconstruction',text:'This is the actual public tool from the repository — change its inputs and copy a real checklist, not a mockup.'},
  {screen:10,target:'#scopeArtifactOutput',title:'A level is not the deliverable',text:'Another engineer must be able to see what is included, excluded and still uncertain — not just a single letter.'},
  {screen:11,target:'.scope-calibration aside',title:'Calibrate the weights, not the person',text:'The 60/40 split may be tuned against real history — but it changes as a team decision, visibly, not silently per engineer.'}
];

const scopeScreenNames = ['Question','Context','Assess','Scope','Checklist','Inputs','Workflow','Evidence','Pitfalls','Framework','Artifact','Calibrate'];

function showScopeScreen(index) {
  scopeScreenIndex = Math.max(0, Math.min(index, scopeScreens.length - 1));
  scopeScreens.forEach(screen => screen.classList.toggle('active', Number(screen.dataset.scopeScreen) === scopeScreenIndex));
  scopeScreenJumps.forEach(button => button.classList.toggle('active', Number(button.dataset.scopeJump) === scopeScreenIndex));
  scopeSideJumps.forEach(button => button.classList.toggle('active', Number(button.dataset.scopeSideJump) === scopeScreenIndex));
  scopeScreenNumber.textContent = String(scopeScreenIndex + 1).padStart(2,'0');
  scopeScreenName.textContent = scopeScreenNames[scopeScreenIndex];
  scopeScreenBack.disabled = scopeScreenIndex === 0;
  scopeScreenNext.disabled = scopeScreenIndex === scopeScreens.length - 1;
  syncProjectsHash();
}

function positionScopeTour() {
  if (scopeTour.hidden || scopeTourIndex < 0) return;
  const article = scopeModal.querySelector('.scope-article');
  const step = scopeTourSteps[scopeTourIndex];
  const target = scopeModal.querySelector(step.target);
  if (!article || !target) return;
  const root = article.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  const pad = 7;
  const left = Math.max(8, rect.left - root.left - pad);
  const top = Math.max(8, rect.top - root.top - pad);
  const width = Math.min(root.width - left - 8, rect.width + pad * 2);
  const height = Math.min(root.height - top - 8, rect.height + pad * 2);
  Object.assign(scopeTourFocus.style, { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` });

  const panelWidth = scopeTourPanel.offsetWidth;
  const panelHeight = scopeTourPanel.offsetHeight;
  const gap = 14;
  const margin = 10;
  const clampX = value => Math.min(Math.max(margin, value), root.width - panelWidth - margin);
  const clampY = value => Math.min(Math.max(margin, value), root.height - panelHeight - margin);
  const candidates = {
    'right-center': { left: left + width + gap, top: top + (height - panelHeight) / 2 },
    'left-center': { left: left - panelWidth - gap, top: top + (height - panelHeight) / 2 },
    'below-center': { left: left + (width - panelWidth) / 2, top: top + height + gap },
    'above-center': { left: left + (width - panelWidth) / 2, top: top - panelHeight - gap }
  };
  const overlapArea = candidate => {
    const x = clampX(candidate.left);
    const y = clampY(candidate.top);
    const overlapW = Math.min(x + panelWidth, left + width) - Math.max(x, left);
    const overlapH = Math.min(y + panelHeight, top + height) - Math.max(y, top);
    return Math.max(0, overlapW) * Math.max(0, overlapH);
  };
  const order = window.innerWidth < 720
    ? ['below-center', 'above-center', 'right-center', 'left-center']
    : ['right-center', 'left-center', 'below-center', 'above-center'];
  const chosenName = order.find(name => overlapArea(candidates[name]) === 0)
    || order.reduce((best, name) => overlapArea(candidates[name]) < overlapArea(candidates[best]) ? name : best, order[0]);
  const chosen = candidates[chosenName];
  scopeTourPanel.style.left = `${clampX(chosen.left)}px`;
  scopeTourPanel.style.top = `${clampY(chosen.top)}px`;
}

function showScopeTourStep(index) {
  scopeTourIndex = Math.max(0, Math.min(index, scopeTourSteps.length - 1));
  const step = scopeTourSteps[scopeTourIndex];
  showScopeScreen(step.screen);
  scopeTourStep.textContent = `${String(scopeTourIndex + 1).padStart(2,'0')} / ${String(scopeTourSteps.length).padStart(2,'0')}`;
  scopeTourProgress.style.width = `${(scopeTourIndex + 1) / scopeTourSteps.length * 100}%`;
  scopeTourTitle.textContent = step.title;
  scopeTourText.textContent = step.text;
  scopeTourBack.disabled = scopeTourIndex === 0;
  scopeTourNext.textContent = scopeTourIndex === scopeTourSteps.length - 1 ? 'Finish' : 'Next';
  requestAnimationFrame(positionScopeTour);
}

function startScopeTour() { scopeTour.hidden = false; showScopeTourStep(0); }
function endScopeTour() { scopeTour.hidden = true; scopeTourIndex = -1; }

function renderScopeLevel(value, updateCalculator = false) {
  const item = scopeLevels[value];
  scopeLevelButtons.forEach(button => button.classList.toggle('active', Number(button.dataset.level) === value));
  scopeLevelDetail.innerHTML = `<div><small>qalab example · level ${item.level}</small><h4>${item.name}</h4><p>${item.description}</p></div><ol><li><b>Depth</b><span>${item.depth}</span></li><li><b>Breadth</b><span>${item.breadth}</span></li><li><b>Boundary</b><span>${item.boundary}</span></li></ol>`;
  if (updateCalculator) document.querySelector('.scope-levels').scrollIntoView({ behavior:'smooth', block:'center' });
}

function renderScopeArtifact(level, impact, complexity) {
  if (!scopeArtifactOutput) return;
  const item = scopeLevels[level];
  const included = scopeChecklistItems.filter(check => Number(check.dataset.minLevel) <= level);
  const introduced = scopeChecklistItems.filter(check => Number(check.dataset.minLevel) === level).map(check => check.textContent.trim());
  const excluded = scopeChecklistItems.filter(check => Number(check.dataset.minLevel) > level).map(check => check.textContent.trim());
  const excludedPreview = excluded.slice(0, 4);
  const excludedRemainder = excluded.length - excludedPreview.length;
  const color = scopeLevelColors[level];
  scopeArtifactCard?.style.setProperty('--artifact-color', color.background);
  scopeArtifactCard?.style.setProperty('--artifact-ink', color.ink);
  scopeArtifactLevel.textContent = item.level;
  scopeArtifactInputs.textContent = `Impact ${scopeLevels[impact].level} · Complexity ${scopeLevels[complexity].level}`;
  scopeArtifactOutput.textContent = scopeArtifactMode === 'markup'
    ? `h3. Testing scope: ${item.level} – ${item.title}\n* Impact: ${scopeLevels[impact].level}\n* Complexity: ${scopeLevels[complexity].level}\n* Required checks: ${included.length} of ${scopeChecklistItems.length}\n* Expert override: none\n\nh4. Added at this level\n${introduced.map(check => `* ${check}`).join('\n')}\n\nh4. Outside minimum\n${excludedPreview.length ? excludedPreview.map(check => `* ${check}`).join('\n') : '* Nothing identified'}${excludedRemainder > 0 ? `\n* …and ${excludedRemainder} more` : ''}`
    : `LEVEL\n${item.level} – ${item.title}\nImpact ${scopeLevels[impact].level} · Complexity ${scopeLevels[complexity].level}\n${included.length} of ${scopeChecklistItems.length} check groups required\n\nADDED AT THIS LEVEL\n${introduced.map(check => `✓ ${check}`).join('\n')}\n\nOUTSIDE MINIMUM\n${excludedPreview.length ? excludedPreview.map(check => ` – ${check}`).join('\n') : ' – Nothing identified'}${excludedRemainder > 0 ? `\n – …and ${excludedRemainder} more` : ''}\n\nEVIDENCE\nAutomated runs · Logs · Baseline comparison`;
}

function syncScopeFramework(impact, complexity) {
  scopeFrameworkFrame?.contentWindow?.postMessage({
    type:'scope-state-sync',
    impact:scopeLevels[impact].level,
    complexity:scopeLevels[complexity].level,
    impactWeight:scopeImpactWeight,
    complexityWeight:scopeComplexityWeight
  }, window.location.origin);
}

function setScopeAxisValue(axis, value) {
  document.querySelectorAll(`[data-scope-axis="${axis}"] button`).forEach(button => {
    button.classList.toggle('active', Number(button.dataset.value) === value);
  });
}

function setScopeLevelEverywhere(value) {
  setScopeAxisValue('impact', value);
  setScopeAxisValue('complexity', value);
  calculateScope();
}

function calculateScope({ syncFramework = true } = {}) {
  const impact = Number(document.querySelector('[data-scope-axis="impact"] button.active').dataset.value);
  const complexity = Number(document.querySelector('[data-scope-axis="complexity"] button.active').dataset.value);
  const impactPart = impact * scopeImpactWeight;
  const complexityPart = complexity * scopeComplexityWeight;
  const rawScore = impactPart + complexityPart;
  const score = Math.ceil(rawScore);
  const item = scopeLevels[score];
  scopeResultLevel.textContent = item.level;
  scopeResultTitle.textContent = item.title;
  scopeResultText.textContent = item.text;
  scopeResultMath.textContent = `ceil(${impact} × ${scopeImpactWeight.toFixed(2)} + ${complexity} × ${scopeComplexityWeight.toFixed(2)}) = ${score}`;
  document.querySelectorAll('.scope-matrix td').forEach(cell => {
    cell.classList.remove('current');
    cell.removeAttribute('tabindex');
    cell.removeAttribute('data-calculation');
    cell.removeAttribute('aria-label');
  });
  document.querySelectorAll('.scope-matrix tbody tr').forEach((row, complexityIndex) => {
    row.querySelectorAll('td').forEach((cell, impactIndex) => {
      const cellScore = Math.ceil((impactIndex + 1) * scopeImpactWeight + (complexityIndex + 1) * scopeComplexityWeight);
      cell.textContent = scopeLevels[cellScore].level;
      cell.dataset.matrixLevel = String(cellScore);
      cell.style.setProperty('--heat', String((cellScore - 1) / 4));
    });
  });
  const currentCell = document.querySelector(`.scope-matrix tbody tr:nth-child(${complexity}) td:nth-of-type(${impact})`);
  if (currentCell) {
    const impactLevel = scopeLevels[impact].level;
    const complexityLevel = scopeLevels[complexity].level;
    const calculation = `WHY THESE VALUES\nImpact ${impactLevel} = ${impact}\n${scopeAxisCriteria.impact[impact]}\n\nComplexity ${complexityLevel} = ${complexity}\n${scopeAxisCriteria.complexity[complexity]}\n\nCALCULATION\n${impact} × ${(scopeImpactWeight * 100).toFixed(0)}% = ${impactPart.toFixed(1)}\n${complexity} × ${(scopeComplexityWeight * 100).toFixed(0)}% = ${complexityPart.toFixed(1)}\nRaw score: ${rawScore.toFixed(1)}\nRounded up: ${score} → ${item.level}`;
    currentCell.classList.add('current');
    currentCell.tabIndex = 0;
    currentCell.dataset.calculation = calculation;
    currentCell.setAttribute('aria-label', `Calculated level ${item.level}. ${calculation.replaceAll('\n', '. ')}`);
  }
  renderScopeLevel(score);
  renderScopeChecklist(score);
  renderScopeArtifact(score, impact, complexity);
  if (syncFramework) syncScopeFramework(impact, complexity);
}

function openScopeCaseStudy() {
  lockPageScroll();
  scopeModal.showModal();
  qaCursorElements.forEach(element => scopeModal.appendChild(element));
  showScopeScreen(0);
  calculateScope();
}

function closeScopeCaseStudy() {
  endScopeTour();
  if (scopeModal.open) scopeModal.close();
}

function openQaCaseStudy(suppressAutoTour = false) {
  lockPageScroll();
  qaCaseModal.showModal();
  qaCursorElements.forEach(element => qaCaseModal.appendChild(element));
  qaCaseModal.querySelector('.qa-case-scroll').scrollTop = 0;
  selectQaScenario('events');
  if (!suppressAutoTour && !qaTourWasCompleted()) {
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
  syncProjectsHash();
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
qaTourReplayRail.addEventListener('click', startQaTour);
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

qaCaseOpen.addEventListener('click', () => {
  if (selectedQaProject === 'qalab') openQalabCaseStudy();
  else if (selectedQaProject === 'scope') openScopeCaseStudy();
  else openQaCaseStudy();
});
qaProjectButtons.forEach(button => {
  button.addEventListener('click', () => selectQaProject(button.dataset.qaProject));
});
scopeAxisButtons.forEach(button => button.addEventListener('click', () => {
  button.closest('.scope-options').querySelectorAll('button').forEach(option => option.classList.toggle('active', option === button));
  calculateScope();
}));
scopeLevelButtons.forEach(button => button.addEventListener('click', () => setScopeLevelEverywhere(Number(button.dataset.level))));
scopeEvidenceButtons.forEach(button => button.addEventListener('click', () => {
  const item = scopeEvidence[button.dataset.evidence];
  scopeEvidenceButtons.forEach(option => option.classList.toggle('active', option === button));
  scopeEvidenceDetail.innerHTML = `<small>${item.n} · ${item.meta}</small><h4>${item.title}</h4><p>${item.text}</p><div><b>Question</b><span>${item.question}</span></div><footer>${item.footer}</footer>`;
}));
scopeRiskButtons.forEach(button => button.addEventListener('click', () => {
  const item = scopeRiskLayers[button.dataset.riskLayer];
  scopeRiskButtons.forEach(option => option.classList.toggle('active', option === button));
  scopeRiskCaption.innerHTML = `<b>${item.title}</b><span>${item.text}</span>`;
}));
scopeUniverseButtons.forEach(button => button.addEventListener('click', () => {
  const framed = button.dataset.universeMode === 'framed';
  scopeUniverseButtons.forEach(option => option.classList.toggle('active', option === button));
  scopeUniverseMap.classList.toggle('is-framed', framed);
  scopeUniverseMap.classList.toggle('is-unframed', !framed);
  scopeUniverseMap.querySelector('[data-universe-path-a]').textContent = framed ? 'Shared assessment model' : 'Personal interpretation';
  scopeUniverseMap.querySelector('[data-universe-path-b]').textContent = framed ? 'Shared assessment model' : 'Personal interpretation';
  scopeUniverseMap.querySelector('[data-universe-result-a]').textContent = framed ? 'Comparable scope' : 'Scope A';
  scopeUniverseMap.querySelector('[data-universe-result-b]').textContent = framed ? 'Comparable scope' : 'Scope B';
  scopeUniverseCaption.innerHTML = framed
    ? '<b>Different engineers. Comparable reasoning.</b><span>The framework does not remove judgment; it gives both engineers the same questions, language and minimum recommendation.</span>'
    : '<b>Same task. Different reasoning.</b><span>Experience and individual interpretation can produce two valid-looking but materially different test scopes.</span>';
}));
scopeContextButtons.forEach(button => button.addEventListener('click', () => {
  const item = scopeContextParameters[button.dataset.contextParameter];
  scopeContextButtons.forEach(option => option.classList.toggle('active', option === button));
  scopeContextDetail.innerHTML = `<b>${item.title}</b><p>${item.text}</p>`;
  scopeContextDetail.style.animation = 'none';
  void scopeContextDetail.offsetWidth;
  scopeContextDetail.style.animation = '';
  scopeBoundaryMap.classList.remove('focus-depth','focus-breadth','focus-distrust');
  scopeBoundaryMap.classList.add('is-justified', `focus-${button.dataset.contextParameter}`);
  scopeBoundaryMap.classList.remove('is-everything');
  scopeBoundaryButtons.forEach(option => option.classList.toggle('active', option.dataset.boundaryMode === 'justified'));
  scopeBoundaryCaption.innerHTML = `<b>${item.title}</b><span>${item.text}</span>`;
}));
scopeBoundaryButtons.forEach(button => button.addEventListener('click', () => {
  const justified = button.dataset.boundaryMode === 'justified';
  scopeBoundaryButtons.forEach(option => option.classList.toggle('active', option === button));
  scopeBoundaryMap.classList.toggle('is-everything', !justified);
  scopeBoundaryMap.classList.toggle('is-justified', justified);
  if (!justified) {
    scopeBoundaryMap.classList.remove('focus-depth','focus-breadth','focus-distrust');
    scopeBoundaryCaption.innerHTML = '<b>Maximum coverage is not automatically maximum quality.</b><span>When every layer is treated as equally necessary, scope becomes expensive but the reasoning behind it remains invisible.</span>';
  } else {
    const selected = document.querySelector('[data-context-parameter].active')?.dataset.contextParameter || 'depth';
    const item = scopeContextParameters[selected];
    scopeBoundaryMap.classList.add(`focus-${selected}`);
    scopeBoundaryCaption.innerHTML = `<b>${item.title}</b><span>${item.text}</span>`;
  }
}));
function renderScopeChecklist(level) {
  let required = 0;
  scopeChecklistButtons.forEach(button => button.classList.toggle('active', Number(button.dataset.checklistLevel) === level));
  scopeChecklistItems.forEach(item => {
    const included = Number(item.dataset.minLevel) <= level;
    item.classList.toggle('required', included);
    if (included) required += 1;
  });
  scopeChecklistSummary.textContent = `${required} of ${scopeChecklistItems.length} check groups required at ${scopeLevels[level].level}`;
}
scopeChecklistButtons.forEach(button => button.addEventListener('click', () => setScopeLevelEverywhere(Number(button.dataset.checklistLevel))));
scopeWorkflowButtons.forEach(button => button.addEventListener('click', () => {
  const hot = button.dataset.workflow === 'hot';
  scopeWorkflowButtons.forEach(option => option.classList.toggle('active', option === button));
  scopeWorkflowView.innerHTML = hot
    ? '<div><span>Urgent defect</span><span>Release blocker</span><span>Emergency branch</span><span>Time-critical recovery</span></div><article><small>Hot workflow</small><h4>Triage → Contain → Verify critical path → Release → Follow up</h4><p>This framework does not define the emergency process. The team needs a separate explicit workflow rather than silently lowering the Base Workflow.</p></article>'
    : '<div><span>New functionality</span><span>Bug fixes</span><span>Refactoring</span><span>Technical changes</span><span>R&amp;D hypotheses</span></div><article><small>Base workflow</small><h4>Understand → Validate → Calculate → Test → Finalize</h4><p>The framework applies when the team can validate inputs and build a reasoned minimum scope.</p></article>';
}));
scopePitfallButtons.forEach(button => button.addEventListener('click', () => {
  const item = scopePitfalls[button.dataset.pitfall];
  scopePitfallButtons.forEach(option => option.classList.toggle('active', option === button));
  scopePitfallDetail.innerHTML = `<small>${item.meta}</small><h4>${item.title}</h4><p>${item.text}</p><div><b>Before testing continues</b><span>${item.action}</span></div>`;
}));
scopeArtifactButtons.forEach(button => button.addEventListener('click', () => {
  scopeArtifactMode = button.dataset.artifactTab;
  scopeArtifactButtons.forEach(option => option.classList.toggle('active', option === button));
  calculateScope();
}));
scopeFrameworkFrame?.addEventListener('load', () => calculateScope());
window.addEventListener('message', event => {
  if (event.origin !== window.location.origin || event.source !== scopeFrameworkFrame?.contentWindow) return;
  if (event.data?.type !== 'scope-framework-change') return;
  const impact = Object.keys(scopeLevels).find(key => scopeLevels[key].level === event.data.impact);
  const complexity = Object.keys(scopeLevels).find(key => scopeLevels[key].level === event.data.complexity);
  if (!impact || !complexity) return;
  setScopeAxisValue('impact', Number(impact));
  setScopeAxisValue('complexity', Number(complexity));
  const impactWeight = Number(event.data.impactWeight);
  const complexityWeight = Number(event.data.complexityWeight);
  if (Number.isFinite(impactWeight) && Number.isFinite(complexityWeight) && impactWeight + complexityWeight > 0) {
    const total = impactWeight + complexityWeight;
    scopeImpactWeight = impactWeight / total;
    scopeComplexityWeight = complexityWeight / total;
  }
  calculateScope({ syncFramework:false });
});
scopeScreenJumps.forEach(button => button.addEventListener('click', () => showScopeScreen(Number(button.dataset.scopeJump))));
scopeSideJumps.forEach(button => button.addEventListener('click', () => showScopeScreen(Number(button.dataset.scopeSideJump))));
scopeScreenBack.addEventListener('click', () => showScopeScreen(scopeScreenIndex - 1));
scopeScreenNext.addEventListener('click', () => showScopeScreen(scopeScreenIndex + 1));
scopeTourStart.addEventListener('click', startScopeTour);
scopeTourStartRail.addEventListener('click', startScopeTour);
scopeTourExit.addEventListener('click', endScopeTour);
scopeTourSkip.addEventListener('click', endScopeTour);
scopeTourBack.addEventListener('click', () => showScopeTourStep(scopeTourIndex - 1));
scopeTourNext.addEventListener('click', () => scopeTourIndex === scopeTourSteps.length - 1 ? endScopeTour() : showScopeTourStep(scopeTourIndex + 1));
window.addEventListener('resize', positionScopeTour);
qalabLayerButtons.forEach(button => button.addEventListener('click', () => selectQalabLayer(button.dataset.qalabLayer)));
qalabEvidenceVisual.addEventListener('click', event => {
  if (!event.target.closest('[data-qalab-run]')) return;
  const tourIsWaitingForRun = !qalabTour.hidden
    && qalabTourSteps[qalabTourIndex]?.action === 'run';
  if (tourIsWaitingForRun) runCurrentQalabTourStep();
  else runQalabStand();
});
qalabTourStart.addEventListener('click', () => startQalabTour(0));
qalabOpenRationale.addEventListener('click', () => startQalabTourAtPanel('rationale'));
qalabOpenSimulation.addEventListener('click', () => startQalabTourAtPanel('simulation'));
qalabTourStartCompact.addEventListener('click', () => startQalabTour(0));
qalabOpenRationaleCompact.addEventListener('click', () => startQalabTourAtPanel('rationale'));
qalabOpenSimulationCompact.addEventListener('click', () => startQalabTourAtPanel('simulation'));
qalabRationaleClose.addEventListener('click', closeQalabPanels);
qalabSimulationClose.addEventListener('click', closeQalabPanels);
qalabRationaleSteps.forEach((step, index) => step.addEventListener('click', () => selectQalabRationale(index)));
qalabTourExit.addEventListener('click', () => endQalabTour(true));
qalabTourNext.addEventListener('click', nextQalabTour);
qalabTourBack.addEventListener('click', () => {
  if (qalabTourIndex <= qalabTourStartIndex) return;
  qalabTourIndex -= 1;
  showQalabTourStep();
});
qalabSimReplay.addEventListener('click', () => playQalabSimulation(qalabSimulation.classList.contains('is-hot') ? 'hot' : 'safe'));
window.addEventListener('resize', () => {
  qalabRationaleFocusGeometry = null;
  positionQalabOverlayPanels();
  positionQalabTour();
});
qalabClose.addEventListener('click', closeQalabCaseStudy);
let qalabBackdropPointerDown = false;
qalabModal.addEventListener('pointerdown', event => {
  qalabBackdropPointerDown = event.target === qalabModal;
});
qalabModal.addEventListener('click', event => {
  if (event.target === qalabModal && qalabBackdropPointerDown) closeQalabCaseStudy();
});
qalabModal.addEventListener('cancel', event => {
  event.preventDefault();
  closeQalabCaseStudy();
});
qalabModal.addEventListener('close', () => {
  unlockPageScroll();
  forgetQalabIdentShown();
  qaCursorElements.forEach(element => document.body.appendChild(element));
  syncProjectsHash();
});
qaCaseClose.addEventListener('click', closeQaCaseStudy);
let qaCaseBackdropPointerDown = false;
qaCaseModal.addEventListener('pointerdown', event => {
  qaCaseBackdropPointerDown = event.target === qaCaseModal;
});
qaCaseModal.addEventListener('click', event => {
  if (event.target === qaCaseModal && qaCaseBackdropPointerDown) closeQaCaseStudy();
});
qaCaseModal.addEventListener('cancel', event => {
  event.preventDefault();
  closeQaCaseStudy();
});
qaCaseModal.addEventListener('close', () => {
  unlockPageScroll();
  qaCursorElements.forEach(element => document.body.appendChild(element));
  syncProjectsHash();
});
scopeClose.addEventListener('click', closeScopeCaseStudy);
let scopeBackdropPointerDown = false;
scopeModal.addEventListener('pointerdown', event => { scopeBackdropPointerDown = event.target === scopeModal; });
scopeModal.addEventListener('click', event => { if (event.target === scopeModal && scopeBackdropPointerDown) closeScopeCaseStudy(); });
scopeModal.addEventListener('cancel', event => { event.preventDefault(); closeScopeCaseStudy(); });
scopeModal.addEventListener('close', () => {
  unlockPageScroll();
  qaCursorElements.forEach(element => document.body.appendChild(element));
  syncProjectsHash();
});

// --- Deep linking (shareable URLs for category / project / case tab) ---
// #art[/<portrait-slug>[/full]]
// #qa/<qalab|scope|sql>[/case[/<layer-or-screen-or-scenario>]]
let applyingProjectsHash = false;
const portraitSlugs = portraits.map(portrait => portrait.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
const scopeScreenSlugs = scopeScreenNames.map(name => name.toLowerCase());
const qaScenarioSlugs = {
  events: 'events', ab: 'ab', adActivity: 'ad-activity', adOutcomes: 'ad-outcomes',
  networkUser: 'network-user', networkAggregate: 'network-aggregate',
  socialSaves: 'social-saves', stateAudit: 'state-audit'
};
const qaScenarioKeysBySlug = Object.fromEntries(Object.entries(qaScenarioSlugs).map(([key, slug]) => [slug, key]));

function currentProjectsHash() {
  if (!qaProjectView.hidden) {
    const parts = ['qa', selectedQaProject];
    if (selectedQaProject === 'qalab' && qalabModal.open) {
      parts.push('case');
      let subState = null;
      if (!qalabTour.hidden) {
        const step = qalabTourSteps[qalabTourIndex];
        if (step?.panel === 'rationale' || step?.panel === 'simulation') subState = step.panel;
      }
      if (!subState) subState = qalabLayerButtons.find(button => button.classList.contains('active'))?.dataset.qalabLayer;
      if (subState) parts.push(subState);
    } else if (selectedQaProject === 'scope' && scopeModal.open) {
      parts.push('case', scopeScreenSlugs[scopeScreenIndex] || scopeScreenSlugs[0]);
    } else if (selectedQaProject === 'sql' && qaCaseModal.open) {
      const activeScenario = qaScenarioButtons.find(button => button.classList.contains('active'))?.dataset.qaScenario || 'events';
      parts.push('case', qaScenarioSlugs[activeScenario] || 'events');
    }
    return `#${parts.join('/')}`;
  }
  const parts = ['art'];
  if (portraitModal.open) parts.push(portraitSlugs[activePortraitIndex], 'full');
  else if (activePortraitIndex > 0) parts.push(portraitSlugs[activePortraitIndex]);
  return `#${parts.join('/')}`;
}

function syncProjectsHash() {
  if (applyingProjectsHash) return;
  const hash = currentProjectsHash();
  if (location.hash !== hash) history.replaceState(null, '', hash);
}

function applyProjectsHash(hash) {
  const segments = (hash || '').replace(/^#/, '').split('/').filter(Boolean);
  applyingProjectsHash = true;
  try {
    const [root, second, third, fourth] = segments;
    if (root === 'qa') {
      const project = ['qalab', 'scope', 'sql'].includes(second) ? second : 'qalab';
      setProjectCategory('qa', true);
      selectQaProject(project);
      if (third === 'case') {
        if (project === 'qalab') {
          openQalabCaseStudy(Boolean(fourth));
          if (fourth === 'rationale' || fourth === 'simulation') {
            clearTimeout(qalabTourTimer);
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            qalabTourTimer = window.setTimeout(() => startQalabTourAtPanel(fourth), reduceMotion ? 1850 : 4100);
          } else if (fourth && qalabLayers[fourth]) {
            selectQalabLayer(fourth);
          }
        } else if (project === 'scope') {
          openScopeCaseStudy();
          const screenIndex = fourth ? scopeScreenSlugs.indexOf(fourth) : 0;
          if (screenIndex > 0) showScopeScreen(screenIndex);
        } else {
          openQaCaseStudy(Boolean(fourth));
          const scenarioKey = fourth && qaScenarioKeysBySlug[fourth];
          if (scenarioKey) selectQaScenario(scenarioKey);
        }
      }
    } else {
      setProjectCategory('art', true);
      const portraitIndex = second ? portraitSlugs.indexOf(second) : 0;
      if (portraitIndex >= 0) selectPortrait(portraitIndex);
      if (third === 'full') openPortraitModal();
    }
  } finally {
    applyingProjectsHash = false;
  }
  syncProjectsHash();
}

const initialProjectsHash = location.hash;
setLensSize(lensSize);
setLensZoom(lensZoom);
selectPortrait(0);
schedulePortraitWarmup();
scheduleQalabAssetWarmup();
applyProjectsHash(initialProjectsHash);
window.addEventListener('hashchange', () => applyProjectsHash(location.hash));
