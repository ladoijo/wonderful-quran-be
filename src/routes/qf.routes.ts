import { type Router as ExpressRouter, Router } from 'express';
import { z } from 'zod';
import {
  getChapter,
  getChapters,
  getJuzs,
  getVersesByChapterId,
  getVersesByJuzNumber
} from '@/services/qfClient.js';
import type { GetVerseByChapterIdQueryReq } from '@/types/qf.js';

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

router.get('/juzs', async (_, res, next) => {
  try {
    const data = await getJuzs();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/juzs/:juzNumber/verses', async (req, res, next) => {
  try {
    const juzNumber = Number(req.params.juzNumber);
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
    const data = await getVersesByJuzNumber(juzNumber, queries);
    res.json(data);
  } catch (error) {
    next(error);
  }
});
export default router;
