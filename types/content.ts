// ============================================
// File: types/content.ts
// ============================================

export interface ContentMedia {
  type: 'youtube' | 'spotify' | 'article'
  data: {
    videourl?: string
    previewurl?: string
    description?: string
    body?: string
  }
  _id?: string
}

export interface Content {
  _id: string
  category: string
  contentType: string
  title: string
  thumbnail: string
  media: ContentMedia[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type ContentType = 'article' | 'Youtube-videos' | 'Spotify-audios'
export type Category =
  | 'playLists'
  | 'art'
  | 'news'
  | 'fashion'
  | 'sports'
  | 'music'
