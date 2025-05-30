import axios from 'axios';

// API anahtarınızı buraya ekleyin
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'http://www.omdbapi.com/';
const POSTER_URL = 'http://img.omdbapi.com/';

// API istekleri için axios instance oluşturma
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    apikey: API_KEY,
    r: 'json',
    v: 1
  }
});

// Film arama fonksiyonu
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get('', {
      params: {
        s: query,
        page: page
      }
    });
    return response.data;
  } catch (error) {
    console.error('Film arama hatası:', error);
    throw error;
  }
};

// Film detaylarını ID ile getirme
export const getMovieById = async (imdbId) => {
  try {
    const response = await api.get('', {
      params: {
        i: imdbId,
        plot: 'full'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Film detayı getirme hatası:', error);
    throw error;
  }
};

// Film detaylarını başlık ile getirme
export const getMovieByTitle = async (title, year = null) => {
  try {
    const params = {
      t: title,
      plot: 'full'
    };
    
    if (year) {
      params.y = year;
    }

    const response = await api.get('', { params });
    return response.data;
  } catch (error) {
    console.error('Film detayı getirme hatası:', error);
    throw error;
  }
};

// Film poster URL'sini oluşturma
export const getPosterUrl = (imdbId) => {
  return `${POSTER_URL}?apikey=${API_KEY}&i=${imdbId}`;
};

// Belirli bir türdeki filmleri getirme
export const getMoviesByType = async (type, page = 1) => {
  try {
    const response = await api.get('', {
      params: {
        type: type,
        page: page
      }
    });
    return response.data;
  } catch (error) {
    console.error('Film türü getirme hatası:', error);
    throw error;
  }
};

export default {
  searchMovies,
  getMovieById,
  getMovieByTitle,
  getPosterUrl,
  getMoviesByType
}; 