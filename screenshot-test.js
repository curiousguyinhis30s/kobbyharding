const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const pages = [
    { url: 'http://localhost:5174/', name: '01_homepage' },
    { url: 'http://localhost:5174/collection', name: '02_collection' },
    { url: 'http://localhost:5174/festival-pickup', name: '03_festival' },
    { url: 'http://localhost:5174/contact', name: '04_contact' },
  ];

  for (const { url, name } of pages) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
      await page.screenshot({ path: `${name}.png`, fullPage: true });
      console.log(`✓ Captured: ${name}`);
    } catch (err) {
      console.log(`✗ Failed: ${name} - ${err.message}`);
    }
  }

  await browser.close();
})();
