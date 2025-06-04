import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

// Favori filmleri getir
export const getFavorites = async () => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Favoriler alınırken hata:', error);
    return [];
  }
};

// Filmi favorilere ekle
export const addToFavorites = async (movie) => {
  try {
    const favorites = await getFavorites();
    
    // Film zaten favorilerde mi kontrol et
    const isMovieInFavorites = favorites.some(m => m.id === movie.id);
    if (isMovieInFavorites) {
      return; // Film zaten favorilerde, işlem yapma
    }

    // Film bilgilerini düzenle
    const movieToAdd = {
      id: movie.id || movie.imdbID,
      title: movie.title || movie.Title,
      poster: movie.poster || movie.Poster,
      year: movie.year || movie.Year,
      type: movie.type || movie.Type,
      addedAt: new Date().toISOString()
    };

    favorites.push(movieToAdd);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Film favorilere eklenirken hata:', error);
    throw error;
  }
};

// Filmi favorilerden kaldır
export const removeFromFavorites = async (movieId) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(m => m.id !== movieId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Film favorilerden kaldırılırken hata:', error);
    throw error;
  }
};

// Favorileri temizle
export const clearFavorites = async () => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Favoriler temizlenirken hata:', error);
    throw error;
  }
}; 