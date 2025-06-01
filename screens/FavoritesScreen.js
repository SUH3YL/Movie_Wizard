import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { getPosterUrl } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  // Favorileri yükle
  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoritesData = await AsyncStorage.getItem('favorites');
      if (favoritesData) {
        setFavorites(JSON.parse(favoritesData));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ekran her odaklandığında favorileri yeniden yükle
  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  // Favorilerden kaldır
  const removeFavorite = async (imdbId) => {
    try {
      const updatedFavorites = favorites.filter(movie => movie.imdbID !== imdbId);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Favori kaldırılırken hata:', error);
    }
  };

  const renderMovieItem = ({ item }) => (
    <View style={styles.movieCardContainer}>
      <TouchableOpacity
        style={styles.movieCard}
        onPress={() => navigation.navigate('MovieInfo', { imdbId: item.imdbID })}
      >
        <Image
          source={{ uri: getPosterUrl(item.imdbID) }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.movieInfo}>
          <Text style={styles.title} numberOfLines={2}>{item.Title}</Text>
          <Text style={styles.year}>{item.Year}</Text>
          <Text style={styles.type}>{item.Type}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFavorite(item.imdbID)}
      >
        <Icon name="close" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz favori filminiz bulunmuyor.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.imdbID}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    padding: 10,
  },
  movieCardContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  movieCard: {
    flexDirection: 'row',
    padding: 6,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 4,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  year: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  type: {
    fontSize: 10,
    color: '#888',
    textTransform: 'capitalize',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default FavoritesScreen; 