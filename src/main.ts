import { render, html, nothing } from 'lit-html';
import { renderResource } from './photo-renderer';
import {
  fetchImagesFromAPI,
  fetchVideosFromAPI,
  isPhoto,
  Resource,
} from './pexels';
import './style.css';
import { LikedResource, loadLikes, saveLikes } from './storage';

async function onFormSubmit(event: SubmitEvent) {
  event.preventDefault();
  if (!event.target) {
    return;
  }

  const formData = new FormData(event.target as HTMLFormElement);

  const query = formData.get('search-query');
  if (query && typeof query === 'string') {
    const results = await fetchImagesFromAPI(query, 10);
    const videos = await fetchVideosFromAPI(query, 10);

    const photosAndVideos: Resource[] = [];
    for (let i = 0; i < results.photos.length; i++) {
      photosAndVideos.push(results.photos[i]);
      photosAndVideos.push(videos.videos[i]);
    }

    renderApp(photosAndVideos);
  }
}

function renderApp(results: readonly Resource[] | null): void {
  const div = document.getElementById('app');
  const likedData = loadLikes() || [];

  if (!div) {
    throw new Error('could not find app div');
  }

  function onUserLikeClick(resource: Resource): void {
    const enumResourceType = isPhoto(resource)
      ? LikedResource.Photo
      : LikedResource.Video;

    const likedResourceEntry = likedData.find((entry) => {
      return (
        entry.id === resource.id && entry.resourceType === enumResourceType
      );
    });
    const resourceIsLiked = likedResourceEntry !== undefined;

    let newLikedResources = likedData;

    if (resourceIsLiked) {
      newLikedResources = newLikedResources.filter(
        (entry) => entry !== likedResourceEntry
      );
    } else {
      newLikedResources.push({
        id: resource.id,
        resourceType: enumResourceType,
      });
    }

    saveLikes(newLikedResources);
    renderApp(results);
  }

  const htmlToRender = html`
    <h1>Amazing Photo App</h1>

    <form id="search" @submit=${onFormSubmit}>
      <input type="text" name="search-query" placeholder="dogs" />
      <input type="submit" value="Search" />
    </form>
    <ul>
      ${results
        ? results.map((resource) => {
            const resourceIsLiked = likedData.some((entry) => {
              const enumResourceType = isPhoto(resource)
                ? LikedResource.Photo
                : LikedResource.Video;
              return (
                entry.id === resource.id &&
                entry.resourceType === enumResourceType
              );
            });
            return renderResource(resource, onUserLikeClick, resourceIsLiked);
          })
        : nothing}
    </ul>
  `;
  render(htmlToRender, div);
}
renderApp(null);
