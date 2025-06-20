import axios from 'axios';

// API anahtarınızı buraya ekleyin
const API_KEY = '154cf159';
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

// Yüksek puanlı filmleri getirme
export const getHighRatedMovies = async () => {
  try {
    // Popüler filmleri aramak için genel terimler
    const searchTerms = ['movie', 'film', 'cinema', 'theatre'];
    const allMovies = [];

    // Her terim için arama yap
    for (const term of searchTerms) {
      const response = await searchMovies(term);
      if (response.Response === 'True' && response.Search) {
        allMovies.push(...response.Search);
      }
    }

    // Film detaylarını al ve yüksek puanlıları filtrele
    const movieDetails = await Promise.all(
      allMovies.map(movie => getMovieById(movie.imdbID))
    );

    // 8.5 ve üzeri puanlı filmleri filtrele
    const highRatedMovies = movieDetails.filter(movie => {
      const rating = parseFloat(movie.imdbRating);
      return !isNaN(rating) && rating >= 8.5;
    });

    return highRatedMovies;
  } catch (error) {
    console.error('Yüksek puanlı filmler getirilirken hata:', error);
    throw error;
  }
};

export default {
  searchMovies,
  getMovieById,
  getMovieByTitle,
  getPosterUrl,
  getMoviesByType,
  getHighRatedMovies
}; 