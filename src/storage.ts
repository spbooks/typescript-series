export enum LikedResource {
  Photo = 'PHOTO',
  Video = 'VIDEO',
}

export interface StoredLike {
  id: number;
  resourceType: LikedResource;
}

export type StoredLikes = StoredLike[];

const LOCAL_STORAGE_KEY = '__PEXELS_LIKES__';

export function saveLikes(likes: StoredLikes): void {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(likes));
}
export function loadLikes(): StoredLikes | null {
  const data = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    return null;
  }
  return JSON.parse(data);
}
