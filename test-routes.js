const routes = [
  'http://localhost:5510/',
  'http://localhost:5510/collection',
  'http://localhost:5510/about',
  'http://localhost:5510/contact',
  'http://localhost:5510/pickup',
  'http://localhost:5510/cart',
];

console.log('Testing Kobby\'s Threads Routes...\n');

async function testRoutes() {
  for (const route of routes) {
    try {
      const response = await fetch(route);
      const status = response.ok ? '✅' : '❌';
      console.log(`${status} ${route} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${route} - Error: ${error.message}`);
    }
  }
}

testRoutes();