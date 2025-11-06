import https from 'https';

const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes
const RENDER_URL = 'https://team-barbaad-ecommercestore.onrender.com';

export function keepAlive() {
  setInterval(() => {
    https.get(`${RENDER_URL}/healthcheck`, (resp) => {
      if (resp.statusCode === 200) {
        console.log('Warmup ping successful');
      }
    }).on('error', (err) => {
      console.error('Warmup ping failed:', err.message);
    });
  }, PING_INTERVAL);
}
