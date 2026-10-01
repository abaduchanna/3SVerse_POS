/*
 * 3S Verse POS - source protection (V8 bytecode via bytenode).
 * Developed by www.3SVerse.com
 *
 *   node protect.js prepare   -> snapshot main.js/preload.js, make them
 *                                compile-ready, patch webPreferences
 *   npx electron compile.js   -> compile snapshots to main.jsc/preload.jsc
 *                                (compiled with Electron's own V8 so the
 *                                bytecode matches the packaged runtime)
 *   node protect.js finish    -> replace main.js/preload.js with tiny
 *                                loaders, patch package.json (files +
 *                                bytenode dependency)
 *
 * Result: the packaged app contains no readable JavaScript source for the
 * application logic - only V8 bytecode (.jsc), which cannot be extracted
 * back into source code.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const ENTRIES = ['main', 'preload'];
const MARKER = '.jsc_source.js';
const mode = process.argv[2] || '';

function read(f) {
  return fs.readFileSync(path.join(ROOT, f), 'utf8');
}
function write(f, data) {
  fs.writeFileSync(path.join(ROOT, f), data);
}

function prepare() {
  for (const name of ENTRIES) {
    const src = `${name}.js`;
    const snap = `${name}${MARKER}`;
    write(snap, read(src));
    console.log('snapshot:', snap);
  }
  // The preload loader must require('bytenode'), which needs a
  // non-sandboxed preload (contextIsolation stays enabled).
  let main = read('main.js');
  const before = main;
  main = main.replace(
      /webPreferences:\s*\{/,
      'webPreferences: { sandbox: false,');
  if (main !== before) {
    write('main.js', main);
    console.log('webPreferences: sandbox:false added');
  } else if (!/sandbox:\s*false/.test(main)) {
    console.warn('WARNING: could not patch webPreferences - preload may'
        + ' fail to load its loader in a sandboxed context');
  }
}

function finish() {
  for (const name of ENTRIES) {
    const snap = `${name}${MARKER}`;
    const jsc = `${name}.jsc`;
    if (!fs.existsSync(path.join(ROOT, jsc))) {
      throw new Error(`${jsc} missing - run "npx electron compile.js" first`);
    }
    write(`${name}.js`,
        `/* bytecode loader - source compiled to ${jsc} */\n`
        + `require('bytenode');\n`
        + `require('./${jsc}');\n`);
    fs.unlinkSync(path.join(ROOT, snap));
    console.log('loader written:', `${name}.js`, '->', jsc);
  }
  // package.json: ship the .jsc files + bytenode as a runtime dependency
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies.bytenode = pkg.dependencies.bytenode || '^1.5.7';
  const files = new Set(pkg.build && pkg.build.files ? pkg.build.files : []);
  files.add('*.jsc');
  pkg.build.files = Array.from(files);
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('package.json: build.files += *.jsc, dependencies.bytenode set');
}

if (mode === 'prepare') prepare();
else if (mode === 'finish') finish();
else {
  console.error('usage: node protect.js prepare|finish');
  process.exit(1);
}
