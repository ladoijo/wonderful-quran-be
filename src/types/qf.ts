export type GetAccessTokenResp = {
  access_token: string;
  token_type: string;
  expires_in: number; // seconds
  scope?: string;
};

export type GetChapterResp = {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
};

export type Pagination = {
  per_page: number;
  current_page: number;
  next_page: number;
  total_pages: number;
  total_records: number;
};

export type Verse = {
  id: number;
  chapter_id?: number;
  verse_number: number;
  verse_key: string;
  verse_index?: number;
  text_uthmani?: string;
  text_uthmani_simple?: string;
  text_imlaei?: string;
  text_imlaei_simple?: string;
  text_indopak?: string;
  text_uthmani_tajweed?: string;
  juz_number: number;
  hizb_number: number;
  rub_number: number;
  page_number: number;
  image_url?: string;
  image_width?: number;
  words?: {
    id?: number;
    position: number;
    text_uthmani?: string;
    text_indopak?: string;
    text_imlaei?: string;
    verse_key?: string;
    page_number?: number;
    line_number?: number;
    audio_url: string;
    location?: string;
    char_type_name: string;
    code_v1?: string;
    code_v2?: string;
    translation: {
      text?: string;
      language_name?: string;
    };
    transliteration: {
      text?: string;
      language_name?: string;
    };
    v1_page?: number;
    v2_page?: number;
  }[];
  audio: {
    url: string;
    duration: number;
    format: string;
    segments: object[];
  };
  translations: {
    resource_id: number;
    resource_name?: string;
    id?: number;
    text: string;
    verse_id?: number;
    language_id?: number;
    language_name?: string;
    verse_key?: string;
    chapter_id?: number;
    verse_number?: number;
    juz_number?: number;
    hizb_number?: number;
    rub_number?: number;
    page_number?: number;
  }[];
  code_v1: string;
  code_v2: string;
  v1_page: number;
  v2_page: number;
};

export type GetVerseByChapterIdQueryReq = {
  language?: string | undefined;
  words?: boolean | undefined;
  translations?: string | undefined;
  audio?: number | undefined;
  tafsirs?: string | undefined;
  word_fields?: string | undefined;
  translation_fields?: string | undefined;
  fields?: string | undefined;
  page?: number | undefined;
  per_page?: number | undefined;
};

export type GetVerseByChapterIdResp = {
  verses: Verse[];
  pagination: Pagination;
};
