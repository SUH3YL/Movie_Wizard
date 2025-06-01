import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../services/api';

const CategoriesScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('Movies');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categories = [
    { id: '1', title: 'Movies' },
    { id: '2', title: 'Series' },
  ];

  const genres = {
    Movies: [
      'Action', 'Adventure', 'Animation', 'Biography', 'Comedy',
      'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy',
      'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi',
      'Thriller', 'War', 'Western'
    ],
    Series: [
      'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
      'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror',
      'Mystery', 'Romance', 'Sci-Fi', 'Thriller'
    ]
  };

  const loadMovies = async (genre, pageNum = 1) => {
    try {
      setLoading(true);
      const response = await searchMovies(genre, pageNum);
      
      if (response.Response === 'True') {
        const newMovies = response.Search.map(movie => ({
          ...movie,
          Type: selectedCategory.toLowerCase()
        }));
        
        if (pageNum === 1) {
          setMovies(newMovies);
        } else {
          setMovies(prev => [...prev, ...newMovies]);
        }
        
        setHasMore(response.Search.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedGenre) {
      setPage(1);
      loadMovies(selectedGenre, 1);
    }
  }, [selectedGenre, selectedCategory]);

  const handleGenrePress = (genre) => {
    setSelectedGenre(genre);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMovies(selectedGenre, nextPage);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.title && styles.selectedCategory
      ]}
      onPress={() => {
        setSelectedCategory(item.title);
        setSelectedGenre(null);
        setMovies([]);
      }}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item.title && styles.selectedCategoryText
      ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderGenreItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.genreButton,
        selectedGenre === item && styles.selectedGenre
      ]}
      onPress={() => handleGenrePress(item)}
    >
      <Text style={[
        styles.genreText,
        selectedGenre === item && styles.selectedGenreText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderMovieItem = ({ item }) => (
    <View style={styles.movieCardContainer}>
      <MovieCard 
        movie={item}
        onPress={() => navigation.navigate('MovieInfo', { imdbId: item.imdbID })}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
      />
      {!selectedGenre ? (
        <FlatList
          data={genres[selectedCategory]}
          renderItem={renderGenreItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.genresList}
        />
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={(item, index) => item.imdbID + index}
          numColumns={2}
          contentContainerStyle={styles.moviesList}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            loading ? <ActivityIndicator size="large" color="#007AFF" style={styles.loader} /> : null
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  categoriesList: {
    maxHeight: 60,
    paddingVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  genresList: {
    padding: 10,
  },
  genreButton: {
    flex: 1,
    margin: 5,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedGenre: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  genreText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedGenreText: {
    color: '#fff',
  },
  moviesList: {
    padding: 10,
  },
  movieCardContainer: {
    flex: 1,
    margin: 5,
  },
  loader: {
    paddingVertical: 20,
  },
});

export default CategoriesScreen; 