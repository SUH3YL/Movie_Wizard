import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { getMovieById, getPosterUrl } from '../services/api';
import FavoriteButton from '../components/FavoriteButton';

const MovieInfoScreen = ({ route }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { imdbId } = route.params;

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  const fetchMovieDetails = async () => {
    try {
      const movieData = await getMovieById(imdbId);
      setMovie(movieData);
    } catch (error) {
      console.error('Film detayları yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text>Film bilgileri yüklenemedi.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: getPosterUrl(imdbId) }}
          style={styles.poster}
          resizeMode="contain"
        />
        <View style={styles.favoriteButtonContainer}>
          <FavoriteButton movie={movie} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{movie.Title}</Text>
          <Text style={styles.year}>{movie.Year}</Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>IMDb Puanı: {movie.imdbRating}</Text>
            <Text style={styles.votes}>Oylar: {movie.imdbVotes}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Tür:</Text>
            <Text style={styles.value}>{movie.Genre}</Text>

            <Text style={styles.label}>Yönetmen:</Text>
            <Text style={styles.value}>{movie.Director}</Text>

            <Text style={styles.label}>Oyuncular:</Text>
            <Text style={styles.value}>{movie.Actors}</Text>

            <Text style={styles.label}>Süre:</Text>
            <Text style={styles.value}>{movie.Runtime}</Text>

            <Text style={styles.label}>Dil:</Text>
            <Text style={styles.value}>{movie.Language}</Text>

            <Text style={styles.label}>Ülke:</Text>
            <Text style={styles.value}>{movie.Country}</Text>

            <Text style={styles.label}>Ödüller:</Text>
            <Text style={styles.value}>{movie.Awards}</Text>
          </View>

          <View style={styles.plotContainer}>
            <Text style={styles.label}>Özet:</Text>
            <Text style={styles.plot}>{movie.Plot}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poster: {
    width: '100%',
    height: 400,
    backgroundColor: '#f0f0f0',
  },
  favoriteButtonContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  year: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f5c518',
  },
  votes: {
    fontSize: 16,
    color: '#666',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  plotContainer: {
    marginTop: 16,
  },
  plot: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginTop: 8,
  },
});

export default MovieInfoScreen; 