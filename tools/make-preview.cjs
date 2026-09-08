const { chromium } = require('playwright');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: `
    .site-header,.site-footer,.hero-description,.author-line,.hero-actions,.scroll-cue,.exhibit-note,.exhibit-source,.exhibit-spark{display:none!important}
    .hero{padding-top:37px;width:1100px}.hero h1{font-size:74px;margin-top:18px;line-height:1.04;letter-spacing:-3px}
    .paper-subtitle{margin-top:20px;font-size:18px}.hero-eyebrow{font-size:9px}
    .drawing-exhibit{margin-top:30px;height:250px;padding:0 50px 12px;gap:25px}
    .art-card{padding:12px 18px}.art-card img{height:121px;width:121px}.art-index{font-size:7px}.art-label{font-size:11px}
    .seed img{height:116px;width:111px}.tape{height:15px;top:-7px}.section{display:none}
  ` });
  await page.screenshot({ path: path.resolve(__dirname, '../assets/images/social-preview.png') });
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.locator('#system').scrollIntoViewIfNeeded();
  await page.locator('#tab-withdraw').click();
  await page.locator('#restore-ai').waitFor({ state: 'visible' });
  await page.locator('.interaction-card').screenshot({ path: path.resolve(__dirname, '../qa/interaction-final.png') });
  await page.locator('[data-figure="trajectories"]').click();
  await page.screenshot({ path: path.resolve(__dirname, '../qa/figure-viewer.png') });
  console.log('Social preview and final detail screenshots saved.');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
