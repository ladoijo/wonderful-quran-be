import {
  QF_CHAPTER_PATH,
  QF_CHAPTERS_PATH,
  QF_VERSES_BY_CHAPTER_ID_PATH
} from '@/const/endpoints.js';
import type {
  GetAccessTokenResp,
  GetChapterResp,
  GetVerseByChapterIdQueryReq,
  GetVerseByChapterIdResp
} from '@/types/qf.js';
import { ContentBaseURL, OAuthTokenURL } from '@utils/env.js';
import { CLIENT_ID, CLIENT_SECRET } from '@utils/env.js';
import axios from 'axios';

let cachedToken: { token: string; expiresAt: number } | null = null;
export async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const body = new URLSearchParams();
  body.set('grant_type', 'client_credentials');
  body.set('scope', 'content');

  try {
    const { data } = await axios.post<GetAccessTokenResp>(OAuthTokenURL, body.toString(), {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 10000
    });
    const expiresAt = now + data.expires_in;
    const token = data.access_token;
    cachedToken = { token, expiresAt };
    return token;
  } catch (error) {
    console.error('Failed to get access token:', error);
    throw error;
  }
}

async function qfGet<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const token = await getAccessToken();
  const urlPath = ContentBaseURL + path;

  try {
    const { data } = await axios.get<T>(urlPath, {
      headers: {
        'x-auth-token': token,
        'x-client-id': CLIENT_ID
      },
      params,
      timeout: 10000
    });
    return data;
  } catch (error) {
    console.error(`Failed to get ${path}:`, error);
    throw error;
  }
}

export async function getChapters(language: string = 'en'): Promise<GetChapterResp[]> {
  return await qfGet<GetChapterResp[]>(QF_CHAPTERS_PATH, { language });
}

export async function getChapter(
  chapterId: number,
  language: string = 'en'
): Promise<GetChapterResp> {
  return await qfGet<GetChapterResp>(QF_CHAPTER_PATH.replace(':chapterId', chapterId.toString()), {
    language
  });
}

export async function getVersesByChapterId(
  chapterId: number,
  query: GetVerseByChapterIdQueryReq
): Promise<GetVerseByChapterIdResp[]> {
  const {
    language = 'en',
    words = true,
    per_page = 10,
    page = 1,
    translations,
    tafsirs,
    ...otherQueries
  } = query;

  return await qfGet<GetVerseByChapterIdResp[]>(
    QF_VERSES_BY_CHAPTER_ID_PATH.replace(':chapterId', chapterId.toString()),
    {
      language,
      words,
      per_page,
      page,
      translations,
      tafsirs,
      ...otherQueries
    }
  );
}
