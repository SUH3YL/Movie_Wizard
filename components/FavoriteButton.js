import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteButton = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkIfFavorite();
  }, [movie.imdbID]);

  const checkIfFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        const favoritesArray = JSON.parse(favorites);
        setIsFavorite(favoritesArray.some(fav => fav.imdbID === movie.imdbID));
      }
    } catch (error) {
      console.error('Favori kontrolü hatası:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let favoritesArray = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        // Remove from favorites
        favoritesArray = favoritesArray.filter(fav => fav.imdbID !== movie.imdbID);
      } else {
        // Add to favorites
        favoritesArray.push(movie);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Favori güncelleme hatası:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, isFavorite ? styles.favoriteButton : styles.notFavoriteButton]}
      onPress={toggleFavorite}
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        <Icon
          name={isFavorite ? 'favorite' : 'favorite-border'}
          size={20}
          color={isFavorite ? '#fff' : '#ff4081'}
          style={styles.icon}
        />
        <Text style={[styles.buttonText, isFavorite ? styles.favoriteText : styles.notFavoriteText]}>
          {isFavorite ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 25,
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteButton: {
    backgroundColor: '#ff4081',
  },
  notFavoriteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff4081',
  },
  favoriteText: {
    color: '#fff',
  },
  notFavoriteText: {
    color: '#ff4081',
  },
});

export default FavoriteButton; 