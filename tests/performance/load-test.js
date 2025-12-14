import autocannon from 'autocannon';

const instance = autocannon({
  url: 'http://localhost:3000',
  connections: 100,
  pipelining: 1,
  duration: 60,
  requests: [
    {
      method: 'GET',
      path: '/api/menu',
    },
    {
      method: 'GET',
      path: '/api/analytics/daily-revenue?date=2025-11-04',
    },
    {
      method: 'POST',
      path: '/api/orders',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        customerName: 'LoadTester',
        items: [{ menu_id: 'M001', quantity: 1 }],
      }),
    },
  ],
});

autocannon.track(instance, { renderProgressBar: true });
