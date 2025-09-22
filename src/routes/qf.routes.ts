import { Router, type Router as ExpressRouter } from 'express';
import { getChapter, getChapters, getVersesByChapterId } from '@/services/qfClient.js';
import type { GetVerseByChapterIdQueryReq } from '@/types/qf.js';
import { z } from 'zod';

const router: ExpressRouter = Router();

router.get('/chapters', async (req, res, next) => {
  try {
    const language = (req.query.language as string) || 'en';
    const data = await getChapters(language);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/chapters/:chapterId', async (req, res, next) => {
  try {
    const chapterId = Number(req.params.chapterId);
    const language = (req.query.language as string) || 'en';
    const data = await getChapter(chapterId, language);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/chapters/:chapterId/verses', async (req, res, next) => {
  try {
    const chapterId = Number(req.params.chapterId);
    const queries: GetVerseByChapterIdQueryReq = z
      .object({
        language: z.string().optional().default('en'),
        words: z
          .union([z.literal('true'), z.literal('false')])
          .transform((v) => v === 'true')
          .optional()
          .default(true),
        translations: z.string().optional(),
        audio: z.coerce.number().optional(),
        tafsirs: z.string().optional(),
        word_fields: z.string().optional(),
        translation_fields: z.string().optional(),
        fields: z.string().optional(),
        page: z.coerce.number().min(1).optional().default(1),
        per_page: z.coerce.number().min(1).max(50).optional().default(10)
      })
      .parse({ ...req.query, ...req.params });
    const data = await getVersesByChapterId(chapterId, queries);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
