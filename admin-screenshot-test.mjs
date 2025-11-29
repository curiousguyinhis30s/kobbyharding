import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Setting up authentication...');

    // Navigate to the site first to establish context
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 10000 });

    // Set localStorage with admin user data
    await page.evaluate(() => {
      const adminUser = {
        id: '1',
        email: 'admin@kobysthreads.com',
        name: 'Admin User',
        role: 'admin',
        orders: [],
        favorites: [],
        tryOnRequests: [],
        joinDate: '2024-01-01',
        lastLogin: new Date().toISOString()
      };
      localStorage.setItem('koby_user', JSON.stringify(adminUser));
    });

    console.log('✓ localStorage set, reloading page to hydrate auth context...');

    // Reload the page so React can read localStorage and hydrate AuthContext
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Give React time to hydrate

    console.log('✓ Authentication ready');

    // Now capture the admin pages
    const pages = [
      { url: 'http://localhost:5174/admin', name: 'admin_01_dashboard' },
      { url: 'http://localhost:5174/admin/orders', name: 'admin_02_orders' },
      { url: 'http://localhost:5174/admin/docs', name: 'admin_03_docs' },
    ];

    for (const { url, name } of pages) {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
        await page.waitForTimeout(1500); // Wait for any animations
        await page.screenshot({ path: `${name}.png`, fullPage: false });
        console.log(`✓ Captured: ${name}`);
      } catch (error) {
        console.log(`✗ Failed to capture ${name}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Error during admin screenshot capture:', error.message);
  }

  await browser.close();
})();
