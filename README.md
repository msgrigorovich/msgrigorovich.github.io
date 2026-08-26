# dianagrigorovich.com

Static portfolio hosted with GitHub Pages.

## Project structure

```text
.
├── index.html              # Home page
├── resume.html             # Resume page
├── projects.html           # Projects page
├── contact.html            # Contact page
├── signature.html          # Standalone email signature
├── assets/
│   ├── css/
│   │   └── style.css       # Shared site styles
│   ├── js/
│   │   ├── main.js         # Shared interactions and animations
│   │   ├── analytics.js    # Shared analytics integration
│   │   └── resume.js       # Resume data and interactions
│   └── images/
│       ├── branding/       # Site-only branding assets
│       └── games/          # Company and game artwork
├── CNAME                   # Custom domain configuration
└── favicon.png
```

The root-level images referenced by `signature.html` intentionally remain in
place. Existing email signatures use their public URLs, so moving them would
break images in previously sent emails.
