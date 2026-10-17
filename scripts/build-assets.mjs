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

console.log(`Built and fingerprinted ${cssEntries.length} CSS, ${jsEntries.length} JavaScript and ${vendorEntries.size} vendor assets.`);
