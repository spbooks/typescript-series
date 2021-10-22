import { isPhoto, Resource } from './pexels';
import { html } from 'lit-html';

export function renderResource(
  resource: Resource,
  onLikeClick: (resource: Resource) => void,
  resourceIsLiked: boolean
) {
  const imageURl = isPhoto(resource) ? resource.src.small : resource.image;

  return html`<li class="photo">
    <img src=${imageURl} />
    <button class="like" @click=${() => onLikeClick(resource)}>
      ${resourceIsLiked ? 'Dislike' : 'Like'}
    </button>
  </li>`;
}
