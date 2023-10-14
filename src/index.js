// API: 39874564-0f11a439c7c25eb7f8c6d4ea1
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '39874564-0f11a439c7c25eb7f8c6d4ea1';
const BASE_URL = 'https://pixabay.com/api/';
const perPage = 20;
let page = 1;
let isLoading = false;

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const searchQuery = document.querySelector('input[name="searchQuery"]').value;
  page = 1;
  clearGallery();
  searchImages(searchQuery);
});

window.addEventListener('scroll', () => {
  if (isLoading) return;
  if (isAtBottom()) {
    page++;
    const searchQuery = document.querySelector(
      'input[name="searchQuery"]'
    ).value;
    searchImages(searchQuery);
  }
});

async function searchImages(query) {
  isLoading = true;
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });

    const { hits, totalHits } = response.data;
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      isLoading = false;
      return;
    }

    if (page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    displayImages(hits);
  } catch (error) {
    console.error('Error searching for images:', error);
    Notiflix.Notify.failure(
      'An error occurred while searching for images. Please try again later.'
    );
    isLoading = false;
  }
}

function displayImages(images) {
  images.forEach(image => {
    const card = createImageCard(image);
    gallery.appendChild(card);
  });

  lightbox.refresh();
  isLoading = false;
}

function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const link = document.createElement('a');
  link.href = image.largeImageURL;
  link.classList.add('lightbox-item');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = createInfoItem('Likes', image.likes);
  const views = createInfoItem('Views', image.views);
  const comments = createInfoItem('Comments', image.comments);
  const downloads = createInfoItem('Downloads', image.downloads);

  info.appendChild(likes);
  info.appendChild(views);
  info.appendChild(comments);
  info.appendChild(downloads);

  link.appendChild(img);
  card.appendChild(link);
  card.appendChild(info);

  return card;
}

function createInfoItem(label, value) {
  const item = document.createElement('p');
  item.classList.add('info-item');
  item.innerHTML = `<b>${label}:</b></br> ${value}`;
  return item;
}

function clearGallery() {
  gallery.innerHTML = '';
}

function isAtBottom() {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  return scrollY + windowHeight >= documentHeight;
}

loadMoreBtn.style.visibility = 'hidden';
