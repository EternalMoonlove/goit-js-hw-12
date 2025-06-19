import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery, IMAGES_PER_PAGE } from './js/pixabay-api.js';

import {
  clearGallery,
  createGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';

const formEl = document.querySelector('.js-form');
const inputEl = document.querySelector('input[name="search-text"]');
const loadMoreBtnEl = document.querySelector('.js-load-more-btn');

hideLoadMoreBtn();

let currentPage = 1;
let currentQuery = '';

function showLoadMoreBtn() {
  loadMoreBtnEl.classList.remove('hidden');
}

function hideLoadMoreBtn() {
  loadMoreBtnEl.classList.add('hidden');
}

formEl.addEventListener('submit', async event => {
  event.preventDefault();

  const inputValue = inputEl.value.trim();

  if (inputValue === '') {
    iziToast.error({
      title: 'Error',
      message: 'Будь ласка, введіть щось для пошуку!',
      position: 'topRight',
    });
    return;
  }

  currentQuery = inputValue;
  currentPage = 1;

  hideLoadMoreBtn();
  clearGallery();
  showLoader();

  try {
    const responseData = await getImagesByQuery(currentQuery, currentPage);

    if (responseData.hits.length === 0) {
      iziToast.info({
        title: 'No results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        backgroundColor: '#ef4040',
        messageColor: '#fff',
        titleColor: '#fff',
      });
    } else {
      createGallery(responseData.hits);

      const totalPages = Math.ceil(responseData.totalHits / IMAGES_PER_PAGE);

      if (currentPage < totalPages) {
        showLoadMoreBtn();
      } else {
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'bottomRight',
        });
      }
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
      position: 'topRight',
    });
    console.error('Помилка під час пошуку зображень:', error);
  } finally {
    hideLoader();
    inputEl.value = '';
  }
});

loadMoreBtnEl.addEventListener('click', async () => {
  currentPage += 1;

  hideLoadMoreBtn();
  showLoader();

  try {
    const responseData = await getImagesByQuery(currentQuery, currentPage);

    if (responseData.hits.length > 0) {
      createGallery(responseData.hits);

      const firstGalleryItem = document.querySelector('.gallery-item');
      if (firstGalleryItem) {
        const cardHeight = firstGalleryItem.getBoundingClientRect().height;
        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }

      const totalPages = Math.ceil(responseData.totalHits / IMAGES_PER_PAGE);

      if (currentPage < totalPages) {
        showLoadMoreBtn();
      } else {
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'bottomRight',
        });
      }
    } else {
      iziToast.info({
        message: 'No more images found for this query.',
        position: 'bottomRight',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images. Please try again later.',
      position: 'topRight',
    });
    console.error('Помилка під час завантаження додаткових зображень:', error);
  } finally {
    hideLoader();
  }
});
