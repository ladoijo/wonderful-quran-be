import { createApp } from './app.js';
import { ENV, PORT } from './utils/env.js';

const app = createApp();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on http://localhost:${PORT} (env=${ENV})`);
});
