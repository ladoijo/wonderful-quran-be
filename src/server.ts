import serverless from 'serverless-http';
import { createApp } from './app.js';

const app = createApp();

// app.listen(PORT, () => {
//   // eslint-disable-next-line no-console
//   console.log(`[server] listening on http://localhost:${PORT} (env=${ENV})`);
// });

export const handler = serverless(app);
