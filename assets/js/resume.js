const amazonStoreOverrides = new Map([
  ['Secret City|London Calling', 'https://www.amazon.com/dp/B0BC25MWLP'],
  ['Secret City|The Sunken Kingdom', 'https://www.amazon.com/dp/B0B9BGW8TJ'],
  ['Secret City|The Human Threat', 'https://www.amazon.com/dp/B0BDYXP2CZ'],
  ['Secret City|The Chalk of Fate', 'https://www.amazon.com/dp/B0BCX9PY54'],
  ['Secret City|Mysterious Collection', ''],
  ['Secret City|Sacred Fire', 'https://www.amazon.com/dp/B0BBSFDQVP'],
  ['Mystery Tales|Her Own Eyes', 'https://www.amazon.com/dp/B0BD2RFQVZ'],
  ['Mystery Tales|Eye of the Fire', 'https://www.amazon.com/dp/B0B9H32FQF'],
  ['Mystery Tales|The Hangman Returns', 'https://www.amazon.com/dp/B0BD93JJBX'],
  ['Mystery Tales|The House of Others', 'https://www.amazon.com/dp/B0BBH5SPCG'],
  ['Mystery Tales|Dangerous Desires', 'https://www.amazon.com/dp/B0B9H443LN'],
  ['Mystery Tales|The Other Side', 'https://www.amazon.com/dp/B0BBGRS1C6'],
  ['Mystery Tales|The Reel Horror', 'https://www.amazon.com/dp/B0B9P18X67'],
  ["Mystery Tales|Dealer's Choices", 'https://www.amazon.com/dp/B0BBRV19YK'],
  ['Mystery Tales|Art and Souls', 'https://www.amazon.com/dp/B0B94H1CN7'],
  ['Mystery Tales|Til Death', ''],
  ['Mystery Tales|Master of Puppets', 'https://www.amazon.com/dp/B0B9XT3CBV'],
  ['Fairy Godmother Stories|Cinderella', 'https://www.amazon.com/dp/B0BD2ZWZSJ'],
  ['Fairy Godmother Stories|Dark Deal', 'https://www.amazon.com/dp/B0BBH1MFH8'],
  ['Fairy Godmother Stories|Little Red Riding Hood', 'https://www.amazon.com/dp/B0BD2Q3RN7'],
  ['Fairy Godmother Stories|Puss in Boots', 'https://www.amazon.com/dp/B0BD7H5LVQ'],
  ['Fairy Godmother Stories|Miraculous Dream in Taleville', 'https://www.amazon.com/dp/B0B9N1NFJS'],
  ['Hidden Expedition|The Price of Paradise', ''],
  ['Hidden Expedition|Reign of Flames', 'https://www.amazon.com/dp/B0B94GCJQ6'],
  ["Hidden Expedition|A King's Line", 'https://www.amazon.com/dp/B0BBN7Y9J2']
]);

const dominiGamesLogo = `
  <svg class="resume-project-image company-logo" viewBox="4 4 180 64" aria-hidden="true">
    <g fill="#f3a25f">
      <path d="M9 17 32 7l-4 25L9 17Z"/>
      <path d="m33 7 23 10-19 15-4-25Z"/>
      <path d="M9 20 28 35 9 52V20Z"/>
      <path d="m56 20-19 15 19 17V20Z"/>
      <path d="m29 35 4-8 4 8-4 25-4-25Z"/>
    </g>
    <g fill="#f3a25f" font-family="Arial, Helvetica, sans-serif" font-weight="700">
      <text x="69" y="36" font-size="27" letter-spacing="1.2">DOMINI</text>
      <text x="69" y="65" font-size="27" letter-spacing="1.2">GAMES</text>
    </g>
  </svg>`;

const dominiSeriesProjects = [
  { label: 'DominiGames', markup: dominiGamesLogo, url: 'https://dominigames.com/' },
  {
    label: 'Secret City', image: 'https://api.dominigames.com/img/c9eef9fd-f8c0-43a5-82ba-f416b0451b84/sc1.jpg?q=80&fit=max&crop=1536%2C1536%2C0%2C0&w=320&fm=webp',
    games: [
      ['London Calling', 'https://apps.apple.com/us/app/secret-city-london-calling/id1449950524', 'https://play.google.com/store/apps/details?id=com.dominigames.sc1', 'https://www.amazon.com/gp/product/B07N41R4LM'],
      ['The Sunken Kingdom', 'https://apps.apple.com/us/app/secret-city-sunken-kingdom/id1470936794', 'https://play.google.com/store/apps/details?id=com.dominigames.sc2', 'https://www.amazon.com/gp/product/B07TY1Q8JM'],
      ['The Human Threat', 'https://apps.apple.com/us/app/secret-city-the-human-threat/id1492069458', 'https://play.google.com/store/apps/details?id=com.dominigames.sc3', 'https://www.amazon.com/gp/product/B08427H95M'],
      ['The Chalk of Fate', 'https://apps.apple.com/us/app/secret-city-chalk-of-fate/id1517023285', 'https://play.google.com/store/apps/details?id=com.dominigames.sc4', 'https://www.amazon.com/gp/product/B08B61KT3H'],
      ['Mysterious Collection', '', 'https://dominigames.onelink.me/q9JO/ua0o5o95', ''],
      ['Sacred Fire', 'https://apps.apple.com/us/app/secret-city-sacred-fire/id1575232097', 'https://play.google.com/store/apps/details?id=com.dominigames.sc6', 'https://www.amazon.com/gp/product/B098R1ZRBL']
    ]
  },
  {
    label: 'Mystery Tales', image: 'https://api.dominigames.com/img/112f7cb5-a074-43fe-9057-5848fcab76f4/mt4.jpg?q=80&fit=max&crop=1536%2C1536%2C0%2C0&w=320&fm=webp',
    games: [
      ['Her Own Eyes', '', 'https://play.google.com/store/apps/details?id=com.dominigames.mysterytales', 'https://www.amazon.com/gp/product/B07NZ6D1D1'],
      ['Eye of the Fire', '', 'https://play.google.com/store/apps/details?id=com.dominigames.mt5', 'https://www.amazon.com/gp/product/B07PPQGYY3'],
      ['The Hangman Returns', '', 'https://play.google.com/store/apps/details?id=com.dominigames.mt6', 'https://www.amazon.com/gp/product/B07QPMRPP7'],
      ['The House of Others', '', 'https://play.google.com/store/apps/details?id=com.dominigames.mt7', 'https://www.amazon.com/gp/product/B081LDBYW4'],
      ['Dangerous Desires', '', 'https://play.google.com/store/apps/details?id=com.dominigames.mt8', 'https://www.amazon.com/gp/product/B081K1T8G6'],
      ['The Other Side', '', 'https://play.google.com/store/apps/details?id=com.dominigames.mt9', 'https://www.amazon.com/gp/product/B083M34KLB'],
      ['The Reel Horror', 'https://apps.apple.com/us/app/mystery-tales-the-reel-horror/id1455952703', 'https://play.google.com/store/apps/details?id=com.dominigames.mt10', 'https://www.amazon.com/gp/product/B086T1DYTG'],
      ["Dealer's Choices", 'https://apps.apple.com/us/app/mystery-tales-dealers-choice/id1481569040', 'https://play.google.com/store/apps/details?id=com.dominigames.mt11', 'https://www.amazon.com/gp/product/B08CRK2WCZ'],
      ['Art and Souls', 'https://apps.apple.com/us/app/mystery-tales-art-and-souls/id1503568676', 'https://play.google.com/store/apps/details?id=com.dominigames.mt12', 'https://www.amazon.com/gp/product/B08JNGPMMF'],
      ['Til Death', 'https://apps.apple.com/us/app/mystery-tales-til-death/id1524245100', 'https://play.google.com/store/apps/details?id=com.dominigames.mt13', 'https://www.amazon.com/gp/product/B08PFGL1MK'],
      ['Master of Puppets', 'https://apps.apple.com/us/app/mystery-tales-master/id1564112150', 'https://dominigames.onelink.me/vI29/23ah7ps6', '']
    ]
  },
  {
    label: 'Fairy Godmother Stories', image: 'https://api.dominigames.com/img/0f2f1ab6-91eb-4ba7-bc2d-2f59b5a24cac/fg1.jpg?q=80&fit=max&crop=1536%2C1536%2C0%2C0&w=320&fm=webp',
    games: [
      ['Cinderella', 'https://apps.apple.com/us/app/fairy-godmother-cinderella/id1507170351', 'https://play.google.com/store/apps/details?id=com.dominigames.fg1', 'https://www.amazon.com/gp/product/B089DN96HC'],
      ['Dark Deal', 'https://apps.apple.com/us/app/fairy-godmother-dark-deal/id1529464814', 'https://play.google.com/store/apps/details?id=com.dominigames.fg2', 'https://www.amazon.com/gp/product/B08SVMS9GS'],
      ['Little Red Riding Hood', 'https://apps.apple.com/us/app/fairy-godmother-red-hood/id1540954629', 'https://play.google.com/store/apps/details?id=com.dominigames.fg3', 'https://www.amazon.com/gp/product/B08X1W7QDD'],
      ['Puss in Boots', 'https://apps.apple.com/us/app/fairy-godmother-puss-in-boots/id1578867906', 'https://play.google.com/store/apps/details?id=com.dominigames.fg4', 'https://www.amazon.com/gp/product/B09CZ4JXDB'],
      ['Miraculous Dream in Taleville', '', 'https://dominigames.onelink.me/PDoT/v1vpivsf', '']
    ]
  },
  {
    label: 'Twin Mind', image: 'https://api.dominigames.com/img/ca6f12fa-0dac-46d3-991e-4e8569af3770/tm1-350x440.jpg?q=80&fit=max&crop=350%2C350%2C0%2C0&w=320&fm=webp',
    games: [
      ['Murderous Jealousy', 'https://apps.apple.com/us/app/twin-mind-jealousy/id1560304407', 'https://play.google.com/store/apps/details?id=com.dominigames.tm1', 'https://www.amazon.com/Hidden-Objects-Murderous-Jealousy-Collectors/dp/B0BD7ZY7HH/'],
      ['Power of Love', 'https://apps.apple.com/us/app/twin-mind-power-of-love/id1588054017', 'https://play.google.com/store/apps/details?id=com.dominigames.tm2', 'https://www.amazon.com/Hidden-Objects-Twin-Power-Collectors/dp/B0B97PCDR1/'],
      ['Ghost Hunter', 'https://apps.apple.com/us/app/twin-mind-ghost/id1616684046', 'https://play.google.com/store/apps/details?id=com.dominigames.tm3', 'https://www.amazon.com/Hidden-Objects-Ghost-Hunter-Collectors/dp/B0B2RY2XSH/'],
      ["Nobody's Here", 'https://apps.apple.com/us/app/twin-mind-nobodys-here/id6444770203', 'https://play.google.com/store/apps/details?id=com.dominigames.tm4', 'https://www.amazon.com/gp/product/B0BNN7T46K']
    ]
  },
  {
    label: 'Magic City', image: 'https://api.dominigames.com/img/ca6f12fa-0dac-46d3-991e-4e8569af3770/mc1-350x440.jpg?q=80&fit=max&crop=350%2C350%2C0%2C14&w=320&fm=webp',
    games: [
      ['Detective Wings of Revenge', 'https://apps.apple.com/us/app/magic-city-detective-revenge/id1606698189', 'https://play.google.com/store/apps/details?id=com.dominigames.mc1', 'https://www.amazon.com/Hidden-Objects-Detective-Revenge-Collectors/dp/B0B94NSL6N/'],
      ['Secret Desire', 'https://apps.apple.com/us/app/magic-%D1%81ity-detective-secret/id1628277001', 'https://play.google.com/store/apps/details?id=com.dominigames.mc2', 'https://www.amazon.com/Hidden-Objects-Detective-Secret-Collectors/dp/B0B5VJ4W1X/']
    ]
  },
  {
    label: 'Royal Romances', image: 'https://api.dominigames.com/img/f9ad1ffb-e457-4ef6-a269-3336eea6379f/-games-350-440-cut.jpg?q=80&fit=max&crop=348%2C440%2C0%2C0&w=320&fm=webp', cover: true,
    games: [
      ['Battle of the Woods', 'https://apps.apple.com/us/app/royal-romances-battle/id6463634983', 'https://play.google.com/store/apps/details?id=com.dominigames.rr1full', 'https://www.amazon.com/gp/product/B0CGSFML6K']
    ]
  },
  {
    label: 'Hidden Expedition', image: 'https://api.dominigames.com/img/efbca7ef-6ec9-46a5-95cf-9506a2ae87e4/he19.jpg?q=80&fit=max&crop=1536%2C1536%2C0%2C0&w=320&fm=webp',
    games: [
      ['The Price of Paradise', 'https://apps.apple.com/us/app/hidden-expedition-paradise/id1531061347', 'https://play.google.com/store/apps/details?id=com.dominigames.he19.ext', 'https://www.amazon.com/gp/product/B08RK336T4'],
      ['Reign of Flames', 'https://apps.apple.com/us/app/hidden-expedition-reign/id1549490791', 'https://play.google.com/store/apps/details?id=com.dominigames.he20', 'https://www.amazon.com/gp/product/B08WLZZ8GN'],
      ["A King's Line", 'https://apps.apple.com/us/app/hidden-expedition-kings-line/id1580732535', 'https://play.google.com/store/apps/details?id=com.dominigames.he21', 'https://www.amazon.com/gp/product/B09DGK4TH7']
    ]
  },
  {
    label: 'The Christmas Spirit', image: 'https://play-lh.googleusercontent.com/jBSg9deFPA-INSsy3Z1RKwsGuXpwImRdOUJyo0zcTMowILE5JuZmT3XceH_CVv6fFPwIpLDDgfNtGLy7HqdA=s160-rw',
    games: [
      ['Trouble in Oz', '', 'https://play.google.com/store/apps/details?id=com.dominigames.ch1.free2play', ''],
      ["Mother Goose's Untold Tales", '', 'https://play.google.com/store/apps/details?id=com.dominigames.ch2.free2play', ''],
      ['Grimm Tales', '', 'https://play.google.com/store/apps/details?id=com.dominigames.ch3.free2play', ''],
      ['Journey Before Christmas', '', 'https://play.google.com/store/apps/details?id=com.dominigames.ch4.free2play', ''],
      ['Golden Ticket', '', 'https://play.google.com/store/apps/details?id=com.dominigames.ch5.free2play', '']
    ]
  }
].map(project => ({
  ...project,
  games: project.games?.map(([title, appStore, googlePlay, amazon]) => {
    const amazonKey = `${project.label}|${title}`;
    const amazonUrl = amazonStoreOverrides.has(amazonKey)
      ? amazonStoreOverrides.get(amazonKey)
      : amazon.replace('https://www.amazon.com/gp/product/', 'https://www.amazon.com/dp/');

    return {
      title,
      stores: {
        'app-store': appStore,
        'google-play': googlePlay,
        amazon: amazonUrl
      }
    };
  })
}));

const resumeExperience = [
  {
    period: 'Jan 2025 — Present',
    eyebrow: 'Strikerz Inc. · Tbilisi',
    title: 'Senior QA Engineer',
    role: 'Core Gameplay Team · Quality & Systems Validation',
    projects: [
      { label: 'Strikerz Inc.', icon: 'S', image: '/assets/images/games/strikerz-logo.png', monochrome: true, url: 'https://www.strikerz.inc/' },
      { label: 'UFL', icon: 'UFL', image: '/assets/images/games/ufl-logo.png', monochrome: true, url: 'https://uflgame.com/' }
    ],
    text: 'Systemic validation of Core Gameplay mechanics with a focus on movement, interaction, and consistency across features.',
    responsibilities: [
      'Constant improvement and validation of Core Gameplay mechanics, ensuring integrity across multiple systems;',
      'Acceptance testing of cross-team features at the intersection with Core Gameplay mechanics;',
      'Data-driven gameplay analysis using telemetry (ClickHouse, SQL) to validate Core Gameplay behavior at scale and identify systemic issues beyond subjective playtesting;',
      'Functional validation of locomotion system, including animation blending, state transitions, and edge-case movement scenarios in Core Gameplay;',
      'Design and development of test automation systems for Core Gameplay mechanics to improve validation consistency and reduce regression risk;',
      'Cross-disciplinary collaboration with teams such as:',
      { text: 'Motion Team;', type: 'subitem' },
      { text: 'AI Team;', type: 'subitem' },
      { text: 'Telemetry & Data Quality Team*;', type: 'subitem' },
      'Creation of QA documentation and structured bug reporting focused on reproducibility and gameplay impact.'
    ],
    achievements: [
      'Rapid onboarding into the Core Gameplay team, independently mastering Unreal Engine 5 and Blueprint-based testing in a high-pressure post-release environment;',
      'Implemented a cross-team, data-driven QA analysis process between Core Gameplay and Telemetry & Data Quality teams, enabling deeper gameplay validation based on metrics and numbers rather than subjective opinions;',
      'Designed and implemented test automation systems for Core Gameplay mechanics, improving test coverage and reducing long-term maintenance risks.',
      { text: '*Telemetry & Data Quality Team - a team that deals with orders for the implementation of analytical events, and also takes direct part in working with the results of their analysis.', type: 'footnote' }
    ],
    chips: ['Unreal Engine 5', 'Test Automation', 'Blueprint'],
    skills: ['Unreal Engine 5', 'Test Automation', 'Blueprint']
  },
  {
    period: 'Apr 2024 — Jan 2025',
    eyebrow: 'Strikerz Inc. · Tbilisi',
    title: 'Senior QA Engineer',
    role: 'Quality Control Team · Cross-Platform & Feature Validation',
    projects: [
      { label: 'Strikerz Inc.', icon: 'S', image: '/assets/images/games/strikerz-logo.png', monochrome: true, url: 'https://www.strikerz.inc/' },
      { label: 'UFL', icon: 'UFL', image: '/assets/images/games/ufl-logo.png', monochrome: true, url: 'https://uflgame.com/' }
    ],
    text: 'Console product quality during pre-production and release, with cross-team coordination and feature-level ownership.',
    responsibilities: [
      'Daily regression testing on DevKits and TestKits (PS5, Xbox Series X|S);',
      'Acceptance testing on pre-production environments;',
      'TRC (Technical Requirements Checklist) validation for PlayStation Retail Kits;',
      'Cross-team collaboration with multiple teams, including:',
      { text: 'Meta Gameplay Team (UI/UX);', type: 'subitem' },
      { text: 'Core Gameplay Team;', type: 'subitem' },
      { text: 'AI Team;', type: 'subitem' },
      { text: 'Backend Integration Team;', type: 'subitem' },
      { text: 'Network Team;', type: 'subitem' },
      { text: 'Art and DevArt Teams;', type: 'subitem' },
      { text: 'Sound Team;', type: 'subitem' },
      { text: 'Localization Team, etc.', type: 'subitem' },
      'Preparation of QA documentation and detailed bug reports to support efficient issue resolution.'
    ],
    achievements: [
      'Successfully completed the probationary period ahead of schedule;',
      'Acted as a KeyQA* specialist for one of the most important pre-release features, coordinating cross-team testing and quality validation for ambassador-related content involving football players such as Cristiano Ronaldo, Paulo Dybala, and Kevin De Bruyne.',
      { text: '*KeyQA - position is an internal company term that reflects a key engineer from the QA department who organizes, controls, and improves the processes of cross-team testing of a feature. Someone like a feature owner, based on the principles and goals of QA engineering.', type: 'footnote' }
    ],
    chips: ['Play Station 5', 'xBox Series X', 'xBox Series S', 'Console DevKits', 'Console TestKits'],
    skills: ['Play Station 5', 'xBox Series X', 'xBox Series S', 'Console DevKits', 'Console TestKits', 'TestRail', 'Jira', 'Confluence']
  },
  {
    period: 'Oct 2022 — Apr 2024',
    eyebrow: 'Beresnev Games · Prague',
    title: 'Senior QA Engineer',
    role: 'QA Process Ownership · Mobile Game Development',
    projects: [
      { label: 'Beresnev Games', image: '/assets/images/games/beresnev-icon.ico', url: 'https://beresnev.games/' },
      { label: 'Pixelwoods · Google Play', image: '/assets/images/games/pixelwoods-icon.png', store: 'google-play', url: 'https://play.google.com/store/apps/details?id=com.beresnevgames.pixelgallery&hl=en_US' },
      { label: 'Pixelwoods · App Store', image: '/assets/images/games/pixelwoods-icon.png', store: 'app-store', url: 'https://apps.apple.com/us/app/pixelwoods-coloring-by-pixel/id1541658506' },
      { label: 'Flippy Knife · Google Play', image: '/assets/images/games/flippy-knife-icon.png', store: 'google-play', url: 'https://play.google.com/store/apps/details?id=com.BeresnevGames.Knife&hl=en_US' },
      { label: 'Flippy Knife · App Store', image: '/assets/images/games/flippy-knife-icon.png', store: 'app-store', url: 'https://apps.apple.com/us/app/flippy-knife-throw-spin-hit/id1208359453' }
    ],
    text: 'Primary QA specialist responsible for product quality from feature design through release and post-release support.',
    responsibilities: [
      'QA management;',
      'QA analysis;',
      'Functional/non-Functional testing (android/iOS);',
      'Testing GDD and Analytics requirements;',
      'ANR projects controlling;',
      'Writing test-documentation;',
      'Using test-design techniques;',
      'Stable support project on post-release stage;',
      'Ensuring fixing some types of bugs;',
      'Ensuring projects localization process;',
      'Ensuring management project releases and updates (soft/hard).'
    ],
    achievements: [
      'QA process management on 4 projects in amount;',
      'Writing over 1000 bug-reports and tasks;',
      'Training of 3 interns for the QA Engineer position;',
      'Conducted 4 technical interviews for the position of Senior QA Engineer;',
      'Building an analytics testing process using a database through SQL.'
    ],
    chips: ['Xcode', 'Unity', 'SQL', 'JetBrains DataGrip', 'ClickHouse'],
    skills: ['Xcode', 'Unity', 'SQL', 'JetBrains DataGrip', 'ClickHouse', 'Tableau', 'GitLab', 'JSON', 'Asana', 'C#', 'DBeaver', 'Notion', 'Charles Proxy', 'TeamCity']
  },
  {
    period: 'Mar 2022 — Sep 2022',
    eyebrow: 'DominiGames · Voronezh',
    title: 'Senior QA Engineer',
    role: 'QA Leadership & Process Ownership · Mobile Games',
    projects: dominiSeriesProjects,
    text: 'Combined hands-on testing with team leadership, mentoring, interviews, and structured QA processes across studio projects.',
    responsibilities: [
      'Functional/non-Functional testing (android/iOS/kindle fire amazon);',
      'Writing test-documentation;',
      'Writing bug-reports;',
      'Training test-design techniques;',
      'Training of interns for the QA Junior;',
      'Team Lead replacement.'
    ],
    achievements: [
      'Over 1300 bug-reports;',
      'Over 20 projects sent for release;',
      'Over 100 releases in amount;',
      'Written more than 50 test-cases;',
      'Written more than 5 test-cases using test-design techniques;',
      'Written 1 book, 11 chapters and more than 100 pages on BookStack;',
      'Compilation and updating of more than 5 check-lists;',
      'Managing a team of 6 employees;',
      'Over 2 months on Team Lead’s position;',
      'Conducted 4 technical interviews for the position of Junior QA Engineer;',
      '2/2 my trainees successfully passed the probationary period;',
      'Average rating of my released projects is 4,8/5;',
      'The best QA Engineer of the company for 3 months.'
    ],
    chips: ['Bookstack', 'Jenkins', 'Test design', 'Scrum'],
    skills: ['Bookstack', 'Jenkins', 'Test design', 'Scrum']
  },
  {
    period: 'Dec 2021 — Mar 2022',
    eyebrow: 'DominiGames · Voronezh',
    title: 'Middle QA Engineer',
    role: 'QA Process Development & Test Design · Mobile Games',
    projects: dominiSeriesProjects,
    text: 'Expanded from test execution into test design, documentation, and automation foundations in production game development.',
    responsibilities: [
      'Functional/non-Functional testing (android/iOS/kindle fire amazon);',
      'Writing test-documentation;',
      'Writing bug-reports;',
      'Training automated testing.'
    ],
    achievements: [
      'Written 3 test-scripts for automation testing on Python;',
      "Test-documentation on the classification of levels and types of testing based on project of the developer's company."
    ],
    chips: ['XML', 'Trello', 'Automated Testing', 'Python'],
    skills: ['XML', 'Trello', 'Automated Testing', 'Python']
  },
  {
    period: 'Sep 2021 — Dec 2021',
    eyebrow: 'DominiGames · Voronezh',
    title: 'Junior QA Engineer',
    role: 'Entry-Level QA · Mobile Game Production',
    projects: dominiSeriesProjects,
    text: 'First commercial game development role, focused on quality validation within active production environments.',
    responsibilities: [
      'Functional/non-Functional testing (android/iOS/kindle fire amazon);',
      'Using test-documentation;',
      'Writing bug-reports.'
    ],
    achievements: [
      'The best QA Engineer of the company for 1 month'
    ],
    chips: ['TestFlight', 'App Store Connect', 'Android Studio', 'remote config', 'Waterfall'],
    skills: ['TestFlight', 'App Store Connect', 'Android Studio', 'remote config', 'Waterfall', 'Android', 'amazon', 'Firebase', 'Google Play Console', 'adb', 'SVN', 'Redmine', 'iOS']
  }
];

const resumeSections = {
  education: {
    eyebrow: 'September 2017 — August 2021',
    title: 'Analytical Chemistry',
    role: 'Bachelor’s degree · Lipetsk State Technical University',
    text: 'A scientific foundation in structured investigation and analytical thinking that continues to inform data-driven QA work and gameplay health analysis.',
    chips: ['Bachelor’s degree', 'Analytical Chemistry', 'Data analysis']
  }
};

const resumeYearWheel = document.getElementById('resumeYearWheel');
const resumeYearList = document.getElementById('resumeYearList');
const resumeCard = document.getElementById('resumeCard');
const resumeTabs = document.querySelectorAll('[data-resume-tab]');
const resumeModal = document.getElementById('resumeModal');
const resumeModalClose = document.getElementById('resumeModalClose');
const resumeModalEyebrow = document.getElementById('resumeModalEyebrow');
const resumeModalTitle = document.getElementById('resumeModalTitle');
const resumeModalRole = document.getElementById('resumeModalRole');
const resumeModalContent = document.getElementById('resumeModalContent');
const resumeProjectRail = document.getElementById('resumeProjectRail');
let resumeYearIndex = 0;
let activeResumeTab = 'experience';
const resumeProjectIndexes = new Map();
let resumeModalScrollY = 0;
let pickerAudioContext;

function playPickerFeedback() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  navigator.vibrate?.(12);

  try {
    pickerAudioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (pickerAudioContext.state === 'suspended') pickerAudioContext.resume();
    const oscillator = pickerAudioContext.createOscillator();
    const gain = pickerAudioContext.createGain();
    const now = pickerAudioContext.currentTime;
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(720, now);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    oscillator.connect(gain).connect(pickerAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.04);
  } catch {
    // Audio and vibration are optional enhancements and may be blocked by iOS.
  }
}

const resumeStoreIcons = {
  'google-play': `<svg viewBox="0 0 18 18" role="img" aria-label="Google Play"><path fill="#00d4ff" d="M2.5 1.6 10.8 9l-8.3 7.4a1.7 1.7 0 0 1-.3-1V2.6c0-.4.1-.7.3-1Z"/><path fill="#00e676" d="m2.5 1.6 10.4 5.9L10.8 9 2.5 1.6Z"/><path fill="#ffea00" d="m10.8 9 2.1 1.5-10.4 5.9L10.8 9Z"/><path fill="#ff3d5a" d="m12.9 7.5 2.2 1.2c.6.3.6.9 0 1.2l-2.2.6L10.8 9l2.1-1.5Z"/></svg>`,
  'app-store': `<svg viewBox="0 0 18 18" role="img" aria-label="App Store"><rect width="18" height="18" rx="4" fill="#087ff5"/><path d="M5 12.8 9.2 5.5m3.8 7.3L8.8 5.5M4.2 10.9h9.6" fill="none" stroke="#fff" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  amazon: `<svg viewBox="0 0 18 18" role="img" aria-label="Amazon"><rect width="18" height="18" rx="4" fill="#111"/><path d="M5.2 10.6c2.5 1.6 5.2 1.7 7.7.3" fill="none" stroke="#ffb000" stroke-width="1.35" stroke-linecap="round"/><path d="m11.9 10.7 1.3.1-.7 1" fill="none" stroke="#ffb000" stroke-width="1" stroke-linecap="round"/><path d="M9.7 5.1c1.9 0 2.5.8 2.5 2.3v3h-1.5l-.2-.7c-.5.6-1.1.9-1.9.9-1.2 0-2-.7-2-1.8 0-1.5 1.3-2.1 3.8-2.1v-.2c0-.6-.3-.8-1-.8-.7 0-1.4.2-2 .5L7 5.5c.8-.3 1.7-.4 2.7-.4Zm.7 2.7c-1.4 0-2 .3-2 .9 0 .4.3.7.8.7.5 0 .9-.2 1.2-.6v-1Z" fill="#fff"/></svg>`
};

function resumeCardMarkup(item) {
  const hiddenSkillsCount = item.skills ? Math.max(item.skills.length - item.chips.length, 0) : 0;

  return `
    <p class="resume-eyebrow">${item.eyebrow}</p>
    <h1>${item.title}</h1>
    <h2>${item.role}</h2>
    <p class="resume-description">${item.text}</p>
    <div class="resume-chips">
      ${item.chips.map(chip => `<span class="resume-chip">${chip}</span>`).join('')}
      ${hiddenSkillsCount ? `<button class="resume-chip resume-more-skills" type="button">+${hiddenSkillsCount} more</button>` : ''}
    </div>
    ${item.responsibilities ? '<button class="resume-see-more" type="button">See more <span aria-hidden="true">↗</span></button>' : ''}
  `;
}

function resumeSkillsMarkup(item) {
  return resumeCardMarkup({
    eyebrow: `${item.period} · ${item.eyebrow}`,
    title: 'Skills',
    role: `${item.title} · ${item.role}`,
    text: 'Skills explicitly reflected in this role’s responsibilities and achievements.',
    chips: item.skills
  });
}

function renderActiveResumeCard() {
  const item = resumeExperience[resumeYearIndex];
  resumeCard.innerHTML = activeResumeTab === 'skills'
    ? resumeSkillsMarkup(item)
    : resumeCardMarkup(item);
}

function renderResumeProjects() {
  const item = resumeExperience[resumeYearIndex];
  const projects = item.projects || [];
  const isScrollable = projects.length > 3;
  const selectedIndex = Math.min(resumeProjectIndexes.get(resumeYearIndex) || 0, Math.max(projects.length - 1, 0));
  const selectedProject = projects[selectedIndex];

  resumeProjectRail.classList.toggle('hidden', activeResumeTab !== 'experience' || !projects.length);
  resumeProjectRail.classList.toggle('scrollable', isScrollable);
  if (activeResumeTab !== 'experience' || !projects.length) {
    resumeProjectRail.innerHTML = '';
    return;
  }

  resumeProjectRail.innerHTML = `
    <p class="resume-project-label">Games</p>
    <div class="resume-project-window">
      <div class="resume-project-list" style="--project-index: ${selectedIndex}">
        ${projects.map((project, index) => {
          const icon = project.markup || (project.image
            ? `<img class="resume-project-image${project.monochrome ? ' monochrome' : ''}${project.contained ? ' contained' : ''}${project.cover ? ' cover' : ''}${project.logo ? ' company-logo' : ''}" src="${project.image}" alt="">`
            : `<span class="resume-project-icon">${project.icon}</span>`);
          const store = project.store ? `<span class="resume-project-store" aria-hidden="true">${resumeStoreIcons[project.store]}</span>` : '';
          const content = `${icon}${store}<span class="resume-project-name">${project.label}</span>`;
          const classes = `resume-project-item${index === selectedIndex ? ' selected' : Math.abs(index - selectedIndex) === 1 ? ' near' : ''}`;
          return project.url
            ? `<a class="${classes}" href="${project.url}" target="_blank" rel="noopener noreferrer" data-project-index="${index}" aria-label="Open ${project.label}">${content}</a>`
            : `<button class="${classes}" type="button" data-project-index="${index}" aria-label="Select ${project.label}">${content}</button>`;
        }).join('')}
      </div>
    </div>
    ${isScrollable ? '<p class="resume-project-hint">scroll</p>' : ''}
    ${selectedProject?.games ? resumeSeriesPanelMarkup(selectedProject) : ''}
  `;

  if (window.matchMedia('(max-width: 600px)').matches) {
    requestAnimationFrame(() => {
      const list = resumeProjectRail.querySelector('.resume-project-list');
      const items = list ? Array.from(list.children) : [];
      if (!list || !items.length) return;
      const step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : 72;
      list.style.transform = `translateX(-${selectedIndex * step}px)`;
    });
  }
}

function resumeSeriesPanelMarkup(series) {
  return `
    <section class="resume-series-panel" aria-label="${series.label} games">
      <header class="resume-series-header">
        <div>
          <p>Series</p>
          <h3>${series.label}</h3>
        </div>
        <button type="button" data-project-close aria-label="Close ${series.label} games">×</button>
      </header>
      <div class="resume-series-games">
        ${series.games.map((game, index) => `
          <article class="resume-series-game">
            <span class="resume-series-number">${String(index + 1).padStart(2, '0')}</span>
            <span class="resume-series-title">${game.title}</span>
            <span class="resume-series-stores">
              ${Object.entries(game.stores).filter(([, url]) => url).map(([store, url]) => `
                <a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${game.title} in ${store.replace('-', ' ')}">${resumeStoreIcons[store]}</a>
              `).join('')}
            </span>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function selectResumeProject(index) {
  const projects = resumeExperience[resumeYearIndex].projects || [];
  resumeProjectIndexes.set(resumeYearIndex, Math.max(0, Math.min(projects.length - 1, index)));
  renderResumeProjects();
}

function openResumeModal() {
  const item = resumeExperience[resumeYearIndex];
  if (!item.responsibilities) return;

  resumeModalEyebrow.textContent = `${item.period} · ${item.eyebrow}`;
  resumeModalTitle.textContent = item.title;
  resumeModalRole.textContent = item.role;
  resumeModalContent.innerHTML = `
    <section>
      <h3>Responsibilities</h3>
      ${resumeDetailListMarkup(item.responsibilities)}
    </section>
    <section>
      <h3>Achievements</h3>
      ${resumeDetailListMarkup(item.achievements)}
    </section>
  `;
  resumeModalScrollY = window.scrollY;
  document.body.style.setProperty('--resume-modal-scroll-y', `-${resumeModalScrollY}px`);
  document.body.classList.add('resume-modal-open');
  resumeModal.showModal();
  resumeModalContent.scrollTop = 0;
}

function resumeDetailListMarkup(points) {
  return `<ul>${points.map(point => {
    const detail = typeof point === 'string' ? { text: point } : point;
    const className = detail.type ? ` class="resume-detail-${detail.type}"` : '';
    return `<li${className}>${detail.text}</li>`;
  }).join('')}</ul>`;
}

function closeResumeModal() {
  if (!resumeModal.open) return;
  resumeModal.close();
  document.body.classList.remove('resume-modal-open');
  document.body.style.removeProperty('--resume-modal-scroll-y');
  window.scrollTo(0, resumeModalScrollY);
}

function renderResumeYears() {
  resumeYearList.innerHTML = '';
  resumeExperience.forEach((item, index) => {
    const yearButton = document.createElement('button');
    yearButton.type = 'button';
    yearButton.className = `resume-year${index === resumeYearIndex ? ' selected' : Math.abs(index - resumeYearIndex) === 1 ? ' near' : ''}`;
    yearButton.textContent = item.period;
    yearButton.setAttribute('aria-current', index === resumeYearIndex ? 'true' : 'false');
    yearButton.addEventListener('click', () => selectResumeYear(index));
    resumeYearList.appendChild(yearButton);
  });

  resumeYearList.style.transform = `translateY(-${resumeYearIndex * 3.5}rem)`;
}

function closeResumeSeriesPanelForYear(yearIndex) {
  const projects = resumeExperience[yearIndex]?.projects || [];
  const selectedIndex = resumeProjectIndexes.get(yearIndex) || 0;
  if (projects[selectedIndex]?.games) {
    resumeProjectIndexes.set(yearIndex, 0);
  }
}

function selectResumeYear(index) {
  closeResumeModal();
  const nextIndex = Math.max(0, Math.min(resumeExperience.length - 1, index));
  if (nextIndex !== resumeYearIndex) {
    closeResumeSeriesPanelForYear(resumeYearIndex);
  }
  resumeYearIndex = nextIndex;
  renderResumeYears();
  renderActiveResumeCard();
  renderResumeProjects();
}

function changeResumeYear(direction) {
  if (!['experience', 'skills'].includes(activeResumeTab)) return;
  selectResumeYear(resumeYearIndex + direction);
}

function selectResumeTab(tabName) {
  activeResumeTab = tabName;
  resumeTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.resumeTab === tabName));
  resumeYearWheel.classList.toggle('placeholder-mode', !['experience', 'skills'].includes(tabName));

  if (['experience', 'skills'].includes(tabName)) {
    selectResumeYear(resumeYearIndex);
  } else {
    resumeCard.innerHTML = resumeCardMarkup(resumeSections[tabName]);
    renderResumeProjects();
  }
}

// Mouse wheels send coarse, fixed deltas and keep the original one-click / one-step
// behaviour. High-resolution trackpads get a continuous, iOS-style picker motion
// which follows the gesture and snaps to the closest item after momentum ends.
function createHybridWheelHandler({
  getIndex,
  getCount,
  getList,
  onStep,
  onLiveSelect,
  onSelect,
  pixelsPerStep,
  fallbackStep,
  selectedScale,
  nearScale,
  restingScale,
  nearOpacity,
  restingOpacity
}) {
  let mode = null;
  let position = 0;
  let liveIndex = 0;
  let settleTimer;
  let finishTimer;

  const resetItems = list => {
    Array.from(list.children).forEach(item => {
      item.style.opacity = '';
      item.style.transform = '';
      item.style.transition = '';
    });
  };

  const renderTrackpadPosition = (list, step, animate = false) => {
    list.style.transition = animate
      ? 'transform 0.24s cubic-bezier(0.22, 1, 0.36, 1)'
      : 'none';
    list.style.transform = `translateY(-${position * step}px)`;

    Array.from(list.children).forEach((item, index) => {
      const distance = Math.abs(index - position);
      const firstStage = Math.min(distance, 1);
      const secondStage = Math.max(0, Math.min(distance - 1, 1));
      const scale = selectedScale
        + (nearScale - selectedScale) * firstStage
        + (restingScale - nearScale) * secondStage;
      const opacity = 1
        + (nearOpacity - 1) * firstStage
        + (restingOpacity - nearOpacity) * secondStage;
      item.style.transition = animate
        ? 'opacity 0.24s ease, transform 0.24s ease'
        : 'none';
      item.style.transform = `scale(${scale})`;
      item.style.opacity = opacity;
    });
  };

  return event => {
    const list = getList();
    if (!list) return;

    clearTimeout(settleTimer);
    clearTimeout(finishTimer);

    // A wheel normally reports line deltas or large fixed pixel deltas. A trackpad
    // starts a gesture with small pixel deltas and then supplies momentum events.
    if (!mode) {
      mode = event.deltaMode === 0 && Math.abs(event.deltaY) < 50 ? 'trackpad' : 'wheel';
      position = getIndex();
      liveIndex = getIndex();
    }

    if (mode === 'wheel') {
      onStep(event.deltaY > 0 ? 1 : -1);
      mode = null;
      return;
    }

    const items = list.children;
    const step = items.length > 1 ? items[1].offsetTop - items[0].offsetTop : fallbackStep;
    position = Math.max(0, Math.min(getCount() - 1, position + event.deltaY / pixelsPerStep));
    renderTrackpadPosition(list, step);

    const nextLiveIndex = Math.round(position);
    if (nextLiveIndex !== liveIndex) {
      liveIndex = nextLiveIndex;
      onLiveSelect(liveIndex);
    }

    settleTimer = setTimeout(() => {
      const settledIndex = Math.round(position);
      position = settledIndex;
      renderTrackpadPosition(list, step, true);

      finishTimer = setTimeout(() => {
        mode = null;
        onSelect(settledIndex);
        const currentList = getList();
        if (currentList) {
          currentList.style.transition = '';
          resetItems(currentList);
        }
      }, 140);
    }, 55);
  };
}

function selectResumeYearDuringWheel(index) {
  closeResumeModal();
  const nextIndex = Math.max(0, Math.min(resumeExperience.length - 1, index));
  const didChange = nextIndex !== resumeYearIndex;
  if (nextIndex !== resumeYearIndex) {
    closeResumeSeriesPanelForYear(resumeYearIndex);
  }
  resumeYearIndex = nextIndex;
  Array.from(resumeYearList.children).forEach((year, yearIndex) => {
    year.classList.toggle('selected', yearIndex === resumeYearIndex);
    year.classList.toggle('near', Math.abs(yearIndex - resumeYearIndex) === 1);
    year.setAttribute('aria-current', yearIndex === resumeYearIndex ? 'true' : 'false');
  });
  renderActiveResumeCard();
  renderResumeProjects();
  if (didChange) playPickerFeedback();
}

const handleResumeYearWheel = createHybridWheelHandler({
  getIndex: () => resumeYearIndex,
  getCount: () => resumeExperience.length,
  getList: () => resumeYearList,
  onStep: direction => {
    const previousIndex = resumeYearIndex;
    changeResumeYear(direction);
    if (resumeYearIndex !== previousIndex) playPickerFeedback();
  },
  onLiveSelect: selectResumeYearDuringWheel,
  onSelect: selectResumeYear,
  pixelsPerStep: 85,
  fallbackStep: 56,
  selectedScale: 1.18,
  nearScale: 0.93,
  restingScale: 0.82,
  nearOpacity: 0.5,
  restingOpacity: 0.22
});

resumeYearWheel.addEventListener('wheel', event => {
  if (!['experience', 'skills'].includes(activeResumeTab)) return;
  event.preventDefault();
  handleResumeYearWheel(event);
}, { passive: false });

resumeYearWheel.addEventListener('keydown', event => {
  if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;
  event.preventDefault();
  changeResumeYear(event.key === 'ArrowDown' ? 1 : -1);
});

function updatePickerClasses(items, selectedIndex) {
  Array.from(items).forEach((item, index) => {
    item.classList.toggle('selected', index === selectedIndex);
    item.classList.toggle('near', Math.abs(index - selectedIndex) === 1);
  });
}

function setupTouchYearPicker() {
  let touching = false;
  let startY = 0;
  let startIndex = 0;
  let previewIndex = 0;
  let step = 56;
  let moved = false;

  resumeYearWheel.addEventListener('touchstart', event => {
    if (!['experience', 'skills'].includes(activeResumeTab)) return;
    const items = resumeYearList.children;
    step = items.length > 1 ? items[1].offsetTop - items[0].offsetTop : 56;
    touching = true;
    startY = event.touches[0].clientY;
    startIndex = resumeYearIndex;
    previewIndex = resumeYearIndex;
    moved = false;
    resumeYearList.style.transition = 'none';
  }, { passive: true });

  resumeYearWheel.addEventListener('touchmove', event => {
    if (!touching) return;
    event.preventDefault();
    const delta = event.touches[0].clientY - startY;
    moved ||= Math.abs(delta) > 5;
    const position = Math.max(0, Math.min(resumeExperience.length - 1, startIndex - delta / step));
    resumeYearList.style.transform = `translateY(-${position * step}px)`;

    const nextIndex = Math.round(position);
    if (nextIndex !== previewIndex) {
      previewIndex = nextIndex;
      updatePickerClasses(resumeYearList.children, previewIndex);
      playPickerFeedback();
    }
  }, { passive: false });

  const finish = () => {
    if (!touching) return;
    touching = false;
    resumeYearList.style.transition = '';
    if (moved) selectResumeYear(previewIndex);
    else renderResumeYears();
  };

  resumeYearWheel.addEventListener('touchend', finish);
  resumeYearWheel.addEventListener('touchcancel', finish);
}

function setupTouchProjectPicker() {
  let touching = false;
  let startX = 0;
  let startY = 0;
  let startIndex = 0;
  let previewIndex = 0;
  let step = 72;
  let moved = false;
  let horizontalGesture = false;

  const projectList = () => resumeProjectRail.querySelector('.resume-project-list');
  const projectItems = () => resumeProjectRail.querySelectorAll('[data-project-index]');

  resumeProjectRail.addEventListener('touchstart', event => {
    if (activeResumeTab !== 'experience' || event.target.closest('.resume-series-panel')) return;
    const list = projectList();
    const items = Array.from(projectItems());
    if (!list || items.length < 2) return;
    touching = true;
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    startIndex = resumeProjectIndexes.get(resumeYearIndex) || 0;
    previewIndex = startIndex;
    step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : 72;
    moved = false;
    horizontalGesture = false;
    list.style.transition = 'none';
  }, { passive: true });

  resumeProjectRail.addEventListener('touchmove', event => {
    if (!touching) return;
    const list = projectList();
    const items = Array.from(projectItems());
    if (!list || !items.length) return;
    const delta = event.touches[0].clientX - startX;
    const verticalDelta = event.touches[0].clientY - startY;
    if (!horizontalGesture && Math.abs(delta) <= Math.abs(verticalDelta)) return;
    horizontalGesture = true;
    event.preventDefault();
    moved ||= Math.abs(delta) > 5;
    const position = Math.max(0, Math.min(items.length - 1, startIndex - delta / step));
    list.style.transform = `translateX(-${position * step}px)`;

    const nextIndex = Math.round(position);

    if (nextIndex !== previewIndex) {
      previewIndex = nextIndex;
      updatePickerClasses(items, previewIndex);
      playPickerFeedback();
    }
  }, { passive: false });

  const finish = () => {
    if (!touching) return;
    touching = false;
    const list = projectList();
    if (list) list.style.transition = '';
    if (moved) selectResumeProject(previewIndex);
    else renderResumeProjects();
  };

  resumeProjectRail.addEventListener('touchend', finish);
  resumeProjectRail.addEventListener('touchcancel', finish);
  resumeProjectRail.addEventListener('click', event => {
    if (!moved) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    moved = false;
  }, true);
}

setupTouchYearPicker();
setupTouchProjectPicker();

resumeTabs.forEach(tab => tab.addEventListener('click', () => selectResumeTab(tab.dataset.resumeTab)));
resumeCard.addEventListener('click', event => {
  if (event.target.closest('.resume-more-skills')) {
    selectResumeTab('skills');
    return;
  }
  if (event.target.closest('.resume-see-more')) openResumeModal();
});
resumeModalClose.addEventListener('click', closeResumeModal);
resumeModal.addEventListener('click', event => {
  if (event.target === resumeModal) closeResumeModal();
});
resumeModal.addEventListener('cancel', event => {
  event.preventDefault();
  closeResumeModal();
});
resumeProjectRail.addEventListener('click', event => {
  if (event.target.closest('[data-project-close]')) {
    selectResumeProject(0);
    return;
  }
  const projectItem = event.target.closest('[data-project-index]');
  if (!projectItem || projectItem.matches('a')) return;
  selectResumeProject(Number(projectItem.dataset.projectIndex));
});

document.addEventListener('click', event => {
  const seriesPanel = resumeProjectRail.querySelector('.resume-series-panel');
  if (!seriesPanel) return;
  if (event.target.closest('.resume-series-panel')) return;
  if (event.target.closest('[data-project-index]')) return;
  selectResumeProject(0);
});

function selectResumeProjectDuringWheel(index) {
  const projects = resumeExperience[resumeYearIndex].projects || [];
  const selectedIndex = Math.max(0, Math.min(projects.length - 1, index));
  const previousIndex = resumeProjectIndexes.get(resumeYearIndex) || 0;
  resumeProjectIndexes.set(resumeYearIndex, selectedIndex);
  resumeProjectRail.querySelectorAll('[data-project-index]').forEach((project, projectIndex) => {
    project.classList.toggle('selected', projectIndex === selectedIndex);
    project.classList.toggle('near', Math.abs(projectIndex - selectedIndex) === 1);
  });
  if (selectedIndex !== previousIndex) playPickerFeedback();
}

const handleResumeProjectWheel = createHybridWheelHandler({
  getIndex: () => resumeProjectIndexes.get(resumeYearIndex) || 0,
  getCount: () => (resumeExperience[resumeYearIndex].projects || []).length,
  getList: () => resumeProjectRail.querySelector('.resume-project-list'),
  onStep: direction => {
    const current = resumeProjectIndexes.get(resumeYearIndex) || 0;
    selectResumeProject(current + direction);
    const next = resumeProjectIndexes.get(resumeYearIndex) || 0;
    if (next !== current) playPickerFeedback();
  },
  onLiveSelect: selectResumeProjectDuringWheel,
  onSelect: selectResumeProject,
  pixelsPerStep: 105,
  fallbackStep: 72,
  selectedScale: 1,
  nearScale: 0.9,
  restingScale: 0.78,
  nearOpacity: 0.62,
  restingOpacity: 0.34
});

resumeProjectRail.addEventListener('wheel', event => {
  if (event.target.closest('.resume-series-games')) return;
  const projects = resumeExperience[resumeYearIndex].projects || [];
  if (projects.length <= 3 || activeResumeTab !== 'experience') return;
  event.preventDefault();
  handleResumeProjectWheel(event);
}, { passive: false });
selectResumeTab('experience');
