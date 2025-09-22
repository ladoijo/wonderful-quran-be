import { QF_CONTENT_BASE_PATH, QF_OAUTH_TOKEN_PATH } from '@/const/endpoints.js';
import 'dotenv/config';

const ENV = process.env.QF_ENV ?? 'prelive';
const CLIENT_ID = process.env.QF_CLIENT_ID;
const CLIENT_SECRET = process.env.QF_CLIENT_SECRET;
const QF_AUTH_URL = process.env.QF_AUTH_URL;
const QF_API_BASE_URL = process.env.QF_API_BASE_URL;
const PORT = Number(process.env.PORT ?? 3000);

if (!CLIENT_ID || !CLIENT_SECRET || !QF_AUTH_URL || !QF_API_BASE_URL) {
  throw new Error(
    'Missing required environment variables: QF_CLIENT_ID, QF_CLIENT_SECRET, QF_AUTH_URL, or QF_API_BASE_URL in .env'
  );
}

const isProd = ENV === 'production';
const OAuthTokenURL = QF_AUTH_URL + QF_OAUTH_TOKEN_PATH;
const ContentBaseURL = QF_API_BASE_URL + QF_CONTENT_BASE_PATH;
const LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';

export { ENV, isProd, CLIENT_ID, CLIENT_SECRET, PORT, OAuthTokenURL, ContentBaseURL, LOG_LEVEL };
