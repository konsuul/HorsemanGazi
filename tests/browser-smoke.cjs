'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

async function main() {
 const browser = await chromium.launch();
 try {
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('console', message => {
   if (message.type() === 'error') failures.push(message.text());
  });
  page.on('requestfailed', request => {
   failures.push(request.url() + ' ' + request.failure()?.errorText);
  });
  page.on('response', response => {
   if (response.status() >= 400) failures.push(response.status() + ' ' + response.url());
  });

  const url = 'http://127.0.0.1:8000/';
  // Pfert has no favicon, but Chromium may request its default path.
  await page.route(url + 'favicon.ico', route => route.fulfill({ status: 204 }));
  const horse = page.waitForResponse(url + 'assets/horse-v3.png');
  const [document, sprite] = await Promise.all([page.goto(url), horse]);
  assert.ok(document?.ok() && sprite.ok(), 'Startseite und Pferde-Sprite werden geladen');
  assert.ok(await page.locator('#game').isVisible(), 'Das Spiel-Canvas ist sichtbar');
  await page.locator('#start').click();
  await page.locator('#skill-0').click();
  await page.locator('#overlay').waitFor({ state: 'hidden' });
  await page.keyboard.press('Escape');
  await page.getByRole('heading', { name: 'Pause', exact: true }).waitFor();
  await page.locator('#resume').click();
  await page.locator('#overlay').waitFor({ state: 'hidden' });

  assert.deepEqual(failures, [], 'Chromium meldet keine JavaScript- oder Ladefehler');
  console.log('OK: Pfert lädt in Chromium, startet eine Runde, pausiert und setzt sie fort.');
 } finally {
  await browser.close();
 }
}

main().catch(error => {
 console.error(error);
 process.exitCode = 1;
});
