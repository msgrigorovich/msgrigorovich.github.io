import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { transform } from 'lightningcss';
import { minify } from 'terser';

const cssEntries = ['assets/css/style.css'];
const jsEntries = [
  'assets/js/main.js',
  'assets/js/projects.js',
  'assets/js/resume.js',
  'assets/js/contact.js',
  'assets/js/analytics.js'
];
const htmlEntries = ['index.html', 'projects.html', 'resume.html', 'contact.html'];
const qaProjectRoutes = [
  {
    output: 'projects/qalab/index.html',
    url: 'https://dianagrigorovich.com/projects/qalab/',
    title: 'qalab – Preventive Regression Signaling | Diana Grigorovich',
    description: 'A production-minded Unreal Engine QA case study combining gameplay automation, test stands, telemetry and preventive regression analysis.',
    image: 'https://dianagrigorovich.com/assets/images/og/qalab.jpg',
    imageAlt: 'qalab QA case study cover'
  },
  {
    output: 'projects/testing-scope-framework/index.html',
    url: 'https://dianagrigorovich.com/projects/testing-scope-framework/',
    title: 'Testing Scope Framework – QA Scope for AAA | Diana Grigorovich',
    description: 'An interactive QA framework for turning impact and implementation complexity into an explainable minimum testing scope for AAA systems.',
    image: 'https://dianagrigorovich.com/assets/images/og/testing-scope-framework.jpg',
    imageAlt: 'Testing Scope Framework QA case study cover'
  },
  {
    output: 'projects/analytical-driven-qa/index.html',
    url: 'https://dianagrigorovich.com/projects/analytical-driven-qa/',
    title: 'Analytical-driven QA – From Action to Evidence | Diana Grigorovich',
    description: 'A practical ClickHouse and SQL case study for validating product analytics, event sequences and behavioral evidence in mobile games.',
    image: 'https://dianagrigorovich.com/assets/images/og/analytical-driven-qa.jpg',
    imageAlt: 'Analytical-driven QA case study cover'
  }
];
const vendorEntries = new Map([
  ['node_modules/gsap/dist/gsap.min.js', 'assets/vendor/gsap.min.js']
]);
const productionHashes = new Map();

function productionPath(path) {
  return path.replace(/\.(css|js)$/, '.min.$1');
}

for (const path of cssEntries) {
  const source = await readFile(path);
  const result = transform({ filename: path, code: source, minify: true });
  const output = productionPath(path);
  await writeFile(output, result.code);
  productionHashes.set(output, createHash('sha256').update(result.code).digest('hex').slice(0, 10));
}

for (const [sourcePath, output] of vendorEntries) {
  const code = await readFile(sourcePath);
  await mkdir(new URL('../assets/vendor/', import.meta.url), { recursive: true });
  await writeFile(output, code);
  productionHashes.set(output, createHash('sha256').update(code).digest('hex').slice(0, 10));
}

function rewriteHashedPaths(text) {
  for (const [path, hash] of productionHashes) {
    const publicPath = `/${path.replaceAll('\\', '/')}`;
    const escapedPath = publicPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    text = text.replace(new RegExp(`${escapedPath}(?:\\?v=[^"']*)?`, 'g'), `${publicPath}?v=${hash}`);
  }
  return text;
}

// A production script can reference another fingerprinted asset at runtime (e.g. main.js
// lazy-loads the gsap vendor bundle), so rewrite those references before hashing the JS
// output itself - otherwise the HTML's <script> tag would point at a stale fingerprint.
for (const path of jsEntries) {
  const source = await readFile(path, 'utf8');
  const result = await minify(source, {
    compress: true,
    mangle: true,
    format: { comments: false }
  });
  if (!result.code) throw new Error(`Terser produced no output for ${path}`);
  const output = productionPath(path);
  const code = rewriteHashedPaths(`${result.code}\n`);
  await writeFile(output, code);
  productionHashes.set(output, createHash('sha256').update(code).digest('hex').slice(0, 10));
}

for (const page of htmlEntries) {
  const html = await readFile(page, 'utf8');
  await writeFile(page, rewriteHashedPaths(html));
}

const projectsTemplate = await readFile('projects.html', 'utf8');
await mkdir(new URL('../projects/', import.meta.url), { recursive: true });
await writeFile('projects/index.html', projectsTemplate);
for (const route of qaProjectRoutes) {
  const metadata = `<!-- project-sharing-meta:start -->
  <meta name="description" content="${route.description}">
  <link rel="canonical" href="${route.url}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Diana Grigorovich">
  <meta property="og:title" content="${route.title}">
  <meta property="og:description" content="${route.description}">
  <meta property="og:url" content="${route.url}">
  <meta property="og:image" content="${route.image}">
  <meta property="og:image:secure_url" content="${route.image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${route.imageAlt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${route.title}">
  <meta name="twitter:description" content="${route.description}">
  <meta name="twitter:image" content="${route.image}">
  <!-- project-sharing-meta:end -->`;
  const html = projectsTemplate
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    .replace(/<!-- project-sharing-meta:start -->[\s\S]*?<!-- project-sharing-meta:end -->/, metadata);
  await mkdir(new URL(`../${route.output.replace(/\/[^/]+$/, '/')}`, import.meta.url), { recursive: true });
  await writeFile(route.output, html);
}

console.log(`Built and fingerprinted ${cssEntries.length} CSS, ${jsEntries.length} JavaScript, ${vendorEntries.size} vendor assets and ${qaProjectRoutes.length} QA route pages.`);
