import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FavoriteButton = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [movie]);

  const checkFavoriteStatus = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        const favoritesArray = JSON.parse(favorites);
        setIsFavorite(favoritesArray.some(fav => fav.imdbID === movie.imdbID));
      }
    } catch (error) {
      console.error('Favori durumu kontrol edilirken hata:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let favoritesArray = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        favoritesArray = favoritesArray.filter(fav => fav.imdbID !== movie.imdbID);
      } else {
        favoritesArray.push(movie);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Favori durumu güncellenirken hata:', error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={toggleFavorite}
    >
      <Icon
        name={isFavorite ? 'favorite' : 'favorite-border'}
        size={24}
        color={isFavorite ? '#ff4081' : '#666'}
      />
      <Text style={[styles.buttonText, isFavorite && styles.activeText]}>
        {isFavorite ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginVertical: 10,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  activeText: {
    color: '#ff4081',
  },
});

export default FavoriteButton; 