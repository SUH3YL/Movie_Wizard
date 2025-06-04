import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITE_LISTS_KEY = 'favorite_lists';
const DEFAULT_LIST_NAME = 'Favoriler';

// Favori listelerini getir
export const getFavoriteLists = async () => {
  try {
    const lists = await AsyncStorage.getItem(FAVORITE_LISTS_KEY);
    if (!lists) {
      // İlk kez çalıştırıldığında varsayılan listeyi oluştur
      const defaultList = {
        name: DEFAULT_LIST_NAME,
        movies: []
      };
      await AsyncStorage.setItem(FAVORITE_LISTS_KEY, JSON.stringify([defaultList]));
      return [defaultList];
    }
    return JSON.parse(lists);
  } catch (error) {
    console.error('Favori listeleri yüklenirken hata:', error);
    return [];
  }
};

// Yeni favori listesi oluştur
export const createFavoriteList = async (listName) => {
  try {
    const lists = await getFavoriteLists();
    const newList = {
      name: listName,
      movies: []
    };
    lists.push(newList);
    await AsyncStorage.setItem(FAVORITE_LISTS_KEY, JSON.stringify(lists));
    return lists;
  } catch (error) {
    console.error('Favori listesi oluşturulurken hata:', error);
    throw error;
  }
};

// Filmi favori listesine ekle
export const addMovieToFavoriteList = async (listName, movie) => {
  try {
    const lists = await getFavoriteLists();
    const listIndex = lists.findIndex(list => list.name === listName);
    
    if (listIndex === -1) {
      throw new Error('Liste bulunamadı');
    }

    // Film zaten listede var mı kontrol et
    const movieExists = lists[listIndex].movies.some(m => m.imdbID === movie.imdbID);
    if (!movieExists) {
      lists[listIndex].movies.push(movie);
      await AsyncStorage.setItem(FAVORITE_LISTS_KEY, JSON.stringify(lists));
    }
    
    return lists;
  } catch (error) {
    console.error('Film favori listesine eklenirken hata:', error);
    throw error;
  }
};

// Filmi favori listesinden kaldır
export const removeMovieFromFavoriteList = async (listName, imdbId) => {
  try {
    const lists = await getFavoriteLists();
    const listIndex = lists.findIndex(list => list.name === listName);
    
    if (listIndex === -1) {
      throw new Error('Liste bulunamadı');
    }

    lists[listIndex].movies = lists[listIndex].movies.filter(movie => movie.imdbID !== imdbId);
    await AsyncStorage.setItem(FAVORITE_LISTS_KEY, JSON.stringify(lists));
    
    return lists;
  } catch (error) {
    console.error('Film favori listesinden kaldırılırken hata:', error);
    throw error;
  }
};

// Favori listesini sil
export const deleteFavoriteList = async (listName) => {
  try {
    const lists = await getFavoriteLists();
    const updatedLists = lists.filter(list => list.name !== listName);
    
    // Varsayılan liste silinmeye çalışılıyorsa engelle
    if (listName === DEFAULT_LIST_NAME) {
      throw new Error('Varsayılan liste silinemez');
    }
    
    await AsyncStorage.setItem(FAVORITE_LISTS_KEY, JSON.stringify(updatedLists));
    return updatedLists;
  } catch (error) {
    console.error('Favori listesi silinirken hata:', error);
    throw error;
  }
}; 