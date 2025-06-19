import axios from 'axios';

const PIXABAY_API_URL = 'https://pixabay.com/api/';
const PIXABAY_API_KEY = '50784112-005c51f7743801558c0ea8079';
export const IMAGES_PER_PAGE = 15;

export async function getImagesByQuery(query, page) {
  const encodedQuery = encodeURIComponent(query);

  try {
    const response = await axios.get(PIXABAY_API_URL, {
      params: {
        key: PIXABAY_API_KEY,
        q: encodedQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: IMAGES_PER_PAGE,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Помилка під час отримання зображень:', error);
    throw error;
  }
}
