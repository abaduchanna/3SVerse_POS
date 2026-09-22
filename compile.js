/*
 * 3S Verse POS - compile the application snapshots to V8 bytecode.
 * MUST run under Electron (npx electron compile.js) so the .jsc files
 * match the V8 version of the packaged runtime.
 * Developed by www.3SVerse.com
 */
'use strict';
const bytenode = require('bytenode');

(async () => {
  await bytenode.compileFile({ filename: 'main.jsc_source.js',
                               output: 'main.jsc' });
  console.log('compiled: main.jsc');
  await bytenode.compileFile({ filename: 'preload.jsc_source.js',
                               output: 'preload.jsc' });
  console.log('compiled: preload.jsc');
  process.exit(0);
})().catch((err) => {
  console.error('compile failed:', err);
  process.exit(1);
});
