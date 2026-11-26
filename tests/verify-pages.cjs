'use strict';
const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const { join } = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');

const root = join(__dirname, '../Pfert');
const versionPattern = /class="title-version">Version (\d+\.\d+\.\d+)</;
const releaseFiles = [
 'style.css', 'sound.js', 'assets.js', 'art.js', 'meta.js', 'meta-data.js', 'game.js',
 'assets/pfert-wordmark.png', 'assets/horse-v3.png', 'assets/bosporus-v1.png'
];

async function main() {
 const [siteUrl, commit] = process.argv.slice(2);
 assert.ok(siteUrl, 'Die URL der GitHub-Pages-Veröffentlichung fehlt');
 assert.match(commit ?? '', /^[a-f0-9]{40}$/, 'Ein vollständiger Commit-SHA ist erforderlich');
 const site = new URL(siteUrl.endsWith('/') ? siteUrl : siteUrl + '/');
 const index = await readFile(join(root, 'index.html'), 'utf8');
 const version = index.match(versionPattern)?.[1];
 assert.ok(version, 'Versionsanzeige fehlt in Pfert/index.html');
 const expectedFiles = await Promise.all(releaseFiles.map(async file => [
  file, await readFile(join(root, file))
 ]));

 async function liveFile(path) {
  const url = new URL(path, site);
  url.searchParams.set('check', commit + '-' + Date.now());
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  assert.equal(response.status, 200, url.pathname + ' liefert HTTP ' + response.status);
  return response;
 }

 const deadline = Date.now() + 120000;
 while (true) {
  try {
   const liveIndex = await (await liveFile('')).text();
   assert.match(liveIndex, new RegExp('<meta name="pfert-commit" content="' + commit + '">'),
    'GitHub Pages zeigt noch einen anderen Commit');
   assert.equal(liveIndex.match(versionPattern)?.[1], version, 'Die Live-Version stimmt nicht überein');
   const mismatches = await Promise.all(expectedFiles.map(async ([file, expected]) => {
    const live = Buffer.from(await (await liveFile(file)).arrayBuffer());
    return live.equals(expected) ? null : file;
   }));
   assert.ok(mismatches.every(file => file === null),
    'Abweichende Live-Dateien: ' + mismatches.filter(Boolean).join(', '));
   console.log('OK: GitHub Pages liefert Pfert ' + version + ', Commit ' + commit + ' und die geprüften Dateien.');
   return;
  } catch (error) {
   if (Date.now() >= deadline) throw error;
   console.log(error.message + ' – erneuter Abruf in 5 Sekunden.');
   await delay(5000);
  }
 }
}

main().catch(error => {
 console.error(error);
 process.exitCode = 1;
});
