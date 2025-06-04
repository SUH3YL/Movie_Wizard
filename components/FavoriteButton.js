import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFavorites, addToFavorites, removeFromFavorites } from '../services/favoritesService';

const FavoriteButton = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    try {
      setIsLoading(true);
      const favorites = await getFavorites();
      const movieId = movie.id || movie.imdbID;
      const isMovieInFavorites = favorites.some(m => m.id === movieId);
      setIsFavorite(isMovieInFavorites);
    } catch (error) {
      console.error('Favori durumu kontrol edilirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoritePress = async () => {
    try {
      if (isFavorite) {
        const movieId = movie.id || movie.imdbID;
        await removeFromFavorites(movieId);
        setIsFavorite(false);
        Alert.alert('Başarılı', 'Film favorilerden kaldırıldı.');
      } else {
        await addToFavorites(movie);
        setIsFavorite(true);
        Alert.alert('Başarılı', 'Film favorilere eklendi.');
      }
    } catch (error) {
      console.error('Favori işlemi sırasında hata:', error);
      Alert.alert('Hata', 'İşlem sırasında bir hata oluştu.');
    }
  };

  if (isLoading) {
    return (
      <TouchableOpacity style={styles.favoriteButton} disabled>
        <Icon name="favorite-border" size={24} color="#666" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.favoriteButton}
      onPress={handleFavoritePress}
    >
      <Icon
        name={isFavorite ? 'favorite' : 'favorite-border'}
        size={24}
        color={isFavorite ? '#FF3B30' : '#666'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  favoriteButton: {
    padding: 8,
  },
});

export default FavoriteButton; 