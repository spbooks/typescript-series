const PEXELS_API_KEY =
  '563492ad6f91700001000001067f45b7dfea4e3e8fa164f5dea03991';

export interface Photo {
  readonly id: number;
  readonly width: number;
  readonly height: number;
  readonly url: string;
  readonly photographer: string;
  readonly photographer_url: string;
  readonly photographer_id: string;
  readonly avg_color: string;
  readonly src: Readonly<{
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  }>;
}

export interface PhotoSearchAPIResult {
  readonly total_results: number;
  readonly page: number;
  readonly per_page: number;
  readonly photos: readonly Photo[];
  readonly next_page: string;
}

export interface VideoFile {
  id: number;
  quality: 'hd' | 'sd';
  file_type: string;
  width: number;
  height: number;
  link: string;
}

export interface Video {
  readonly id: number;
  readonly url: string;
  readonly image: string;
  readonly duration: number;
  readonly video_files: readonly VideoFile[];
}

export interface VideoSearchAPIResult {
  readonly page: number;
  readonly per_page: number;
  readonly next_page: number;
  readonly total_results: number;
  readonly videos: readonly Video[];
}

export async function fetchImagesFromAPI(
  searchTerm: string,
  perPage: number
): Promise<PhotoSearchAPIResult> {
  const result = await fetch(
    `https://api.pexels.com/v1/search?query=${searchTerm}&per_page=${perPage}`,
    {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    }
  );

  const json = (await result.json()) as PhotoSearchAPIResult;
  return json;
}

export async function fetchVideosFromAPI(
  searchTerm: string,
  perPage: number
): Promise<VideoSearchAPIResult> {
  const result = await fetch(
    `https://api.pexels.com/v1/videos/search?query=${searchTerm}&per_page=${perPage}`,
    {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    }
  );

  const json = (await result.json()) as VideoSearchAPIResult;
  return json;
}

export function isPhoto(object: Resource): object is Photo {
  const hasDuration = 'duration' in object;
  return !hasDuration;
}

export type Resource = Photo | Video;
