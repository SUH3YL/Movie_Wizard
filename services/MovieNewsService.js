import axios from 'axios';

const API_KEY = 'api_live_ZV89HeAUA5tQ2jTy9XRYG08VngPDCyabklxTdmFxcvJcZ';
const BASE_URL = 'https://api.apitube.io/v1/news';

// API istekleri için axios instance oluşturma
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY
  }
});

export const getMovieNews = async ({ page = 1, pageSize = 10 }) => {
  try {
    console.log('API isteği gönderiliyor...');
    const response = await api.get('/everything', {
      params: {
        title: 'movie,film,cinema',
        language: 'tr',
        sort_by: 'published_at',
        sort_order: 'desc',
        limit: pageSize,
        offset: (page - 1) * pageSize
      }
    });
    console.log('API yanıtı alındı:', response.data);
    return response.data;
  } catch (error) {
    console.error('Haberler alınırken hata oluştu:', error.response || error);
    throw error;
  }
};

export const getMovieNewsByTitle = async (title) => {
  try {
    const response = await api.get('/everything', {
      params: {
        title: title,
        language: 'tr',
        sort_by: 'published_at',
        sort_order: 'desc',
        limit: 10
      }
    });
    return response.data;
  } catch (error) {
    console.error('Film haberleri alınırken hata oluştu:', error.response || error);
    throw error;
  }
};

export const getMovieNewsByCategory = async (category) => {
  try {
    const response = await api.get('/everything', {
      params: {
        category_id: 'medtop:01000000', // Entertainment category
        title: 'movie,film,cinema',
        language: 'tr',
        sort_by: 'published_at',
        sort_order: 'desc',
        limit: 10
      }
    });
    return response.data;
  } catch (error) {
    console.error('Kategori haberleri alınırken hata oluştu:', error.response || error);
    throw error;
  }
};

export const getMovieNewsByDateRange = async (from, to) => {
  try {
    const response = await api.get('/everything', {
      params: {
        title: 'movie,film,cinema',
        language: 'tr',
        published_at_start: from,
        published_at_end: to,
        sort_by: 'published_at',
        sort_order: 'desc',
        limit: 10
      }
    });
    return response.data;
  } catch (error) {
    console.error('Tarih aralığı haberleri alınırken hata oluştu:', error.response || error);
    throw error;
  }
};

export const getPopularMovieNews = async () => {
  try {
    const response = await api.get('/everything', {
      params: {
        title: 'movie,film,cinema',
        language: 'tr',
        sort_by: 'popularity',
        sort_order: 'desc',
        sentiment_overall_polarity: 'positive',
        limit: 10
      }
    });
    return response.data;
  } catch (error) {
    console.error('Popüler haberler alınırken hata oluştu:', error.response || error);
    throw error;
  }
}; 