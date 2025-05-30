import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import api from '../services/api';

const HomeScreen = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      // Test için 3 farklı film ID'si
      const movieIds = ['tt3896198', 'tt0111161', 'tt0468569']; // Guardians of the Galaxy, The Shawshank Redemption, The Dark Knight
      const moviePromises = movieIds.map(id => api.getMovieById(id));
      const results = await Promise.all(moviePromises);
      setMovies(results);
      setLoading(false);
    } catch (error) {
      console.error('Film getirme hatası:', error);
      setLoading(false);
    }
  };

  const renderMovieItem = ({ item }) => (
    <View style={styles.movieCard}>
      <Image 
        source={{ uri: item.Poster }} 
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.movieInfo}>
        <Text style={styles.title}>{item.Title}</Text>
        <Text style={styles.year}>{item.Year}</Text>
        <Text style={styles.genre}>{item.Genre}</Text>
        <Text style={styles.plot} numberOfLines={3}>{item.Plot}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={item => item.imdbID}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  movieCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 200,
  },
  movieInfo: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  plot: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});

export default HomeScreen; 