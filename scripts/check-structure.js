// Structure and security-boundary check.
//
// The grading pipeline runs its own pinned copy of this file, so it never evaluates the
// candidate's code: the window configuration is read as text and asserted on, and imports are
// matched on import/require/import() forms only, so a comment that merely names a privileged
// module is not a violation. Under the grader (GRADER=1) the problems are also written out so the
// submission's result names the rule that failed.
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const problems = [];

const REQUIRED_FILES = [
  'electron/main.js',
  'electron/preload.js',
  'electron/ipc/channels.js',
  'src/app/App.jsx',
  'docs/ARCHITECTURE.md',
];

for (const file of REQUIRED_FILES) {
  if (!fs.existsSync(path.join(root, file))) problems.push(`Missing required file: ${file}`);
}

// Comments are prose, not code — strip them before matching.
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

// Security boundary: the window must keep context isolation on and Node off.
const appConfigPath = path.join(root, 'electron/config/appConfig.js');
if (!fs.existsSync(appConfigPath)) {
  problems.push('Missing required file: electron/config/appConfig.js');
} else {
  const appConfig = stripComments(fs.readFileSync(appConfigPath, 'utf8'));
  if (!/['"]?contextIsolation['"]?\s*:\s*true\b/.test(appConfig)) problems.push('contextIsolation must be true');
  if (!/['"]?nodeIntegration['"]?\s*:\s*false\b/.test(appConfig)) problems.push('nodeIntegration must be false');
}

// Renderer code must never import Electron or any Node built-in — statically or dynamically.
function listSourceFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listSourceFiles(full);
    return /\.(js|jsx|mjs|cjs)$/.test(entry.name) ? [full] : [];
  });
}

const PRIVILEGED = String.raw`(?:electron|node:[\w/]+|fs|path|child_process|os|module|worker_threads|vm|net|http|https|crypto|process)(?:/[\w/]*)?`;
const FORBIDDEN = new RegExp(
  String.raw`(?:\bfrom\s*|\bimport\s*|\bimport\s*\(\s*|\brequire\s*\(\s*)['"\x60]${PRIVILEGED}['"\x60]`,
);
for (const file of listSourceFiles(path.join(root, 'src'))) {
  if (FORBIDDEN.test(stripComments(fs.readFileSync(file, 'utf8')))) {
    problems.push(`Renderer file imports a privileged module: ${path.relative(root, file)}`);
  }
}

if (problems.length) {
  console.error(problems.map((p) => `✖ ${p}`).join('\n'));
  if (process.env.GRADER === '1') {
    fs.writeFileSync(
      path.join(root, '.grading-integrity-failure.json'),
      JSON.stringify({ check: 'structure', violations: problems }, null, 2),
    );
  }
  process.exitCode = 1;
} else {
  console.log('Structure OK');
}
