import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFavorites, removeFromFavorites } from '../services/favoritesService';
import MovieCard from '../components/MovieCard';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
      Alert.alert('Hata', 'Favoriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRemoveFromFavorites = async (movie) => {
    try {
      const movieId = movie.id || movie.imdbID;
      await removeFromFavorites(movieId);
      await loadFavorites();
      Alert.alert('Başarılı', 'Film favorilerden kaldırıldı.');
    } catch (error) {
      console.error('Film favorilerden kaldırılırken hata:', error);
      Alert.alert('Hata', 'Film favorilerden kaldırılırken bir hata oluştu.');
    }
  };

  const renderMovieItem = ({ item }) => (
    <View style={styles.movieItem}>
      <MovieCard
        movie={item}
        onPress={() => navigation.navigate('MovieInfo', { imdbId: item.id || item.imdbID })}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFromFavorites(item)}
      >
        <Icon name="delete" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorilerim</Text>
        <Text style={styles.subtitle}>{favorites.length} film</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="favorite-border" size={64} color="#666" />
          <Text style={styles.emptyText}>Henüz favori filminiz yok</Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>Film Keşfet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderMovieItem}
          keyExtractor={item => `favorite-${item.id || item.imdbID}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  list: {
    padding: 12,
  },
  movieItem: {
    marginBottom: 12,
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FavoritesScreen; 