import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const MovieCard = ({ movie, onPress }) => {
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image 
        source={{ uri: movie.poster || movie.Poster }} 
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {movie.title || movie.Title}
        </Text>
        <Text style={styles.year}>
          {movie.year || movie.Year}
        </Text>
        <Text style={styles.plot} numberOfLines={2}>
          {truncateText(movie.plot || movie.Plot || '', 100)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    height: 120,
  },
  poster: {
    width: 80,
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  plot: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});

export default MovieCard; 