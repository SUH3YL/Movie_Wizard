import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import { searchMovies, getPosterUrl } from '../services/api';

const TRENDING_SEARCHES = [
  'Avengers',
  'Star Wars',
  'Harry Potter',
  'Lord of the Rings',
  'The Matrix',
  'Inception',
  'Interstellar',
  'The Dark Knight',
  'Pulp Fiction',
  'Forrest Gump'
];

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  const loadTrendingMovies = async () => {
    try {
      const randomTrends = [...TRENDING_SEARCHES]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const moviesPromises = randomTrends.map(trend => searchMovies(trend));
      const results = await Promise.all(moviesPromises);
      
      const allMovies = results
        .filter(response => response.Response === 'True')
        .flatMap(response => response.Search)
        .sort(() => Math.random() - 0.5)
        .slice(0, 20);

      setTrendingMovies(allMovies);
    } catch (error) {
      console.error('Trend filmler yüklenirken hata:', error);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchMovies(query);
      if (response.Response === 'True') {
        setSearchResults(response.Search);
      } else {
        setSearchResults([]);
        setError('Film bulunamadı');
      }
    } catch (error) {
      setError('Arama sırasında bir hata oluştu');
      console.error('Arama hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrendingSearch = (trend) => {
    setSearchQuery(trend);
    handleSearch(trend);
  };

  const renderMovieItem = ({ item }) => (
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
        <Text style={styles.title}>{item.Title}</Text>
        <Text style={styles.year}>{item.Year}</Text>
        <Text style={styles.type}>{item.Type}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTrendingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.trendingItem}
      onPress={() => handleTrendingSearch(item)}
    >
      <Text style={styles.trendingText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Film ara..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            handleSearch(text);
          }}
        />
      </View>

      {!searchQuery && (
        <>
          <View style={styles.trendingContainer}>
            <Text style={styles.trendingTitle}>Trend Aramalar</Text>
            <FlatList
              data={TRENDING_SEARCHES}
              renderItem={renderTrendingItem}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingList}
            />
          </View>

          <View style={styles.trendingMoviesContainer}>
            <Text style={styles.trendingTitle}>Trend Filmler</Text>
            <FlatList
              data={trendingMovies}
              renderItem={renderMovieItem}
              keyExtractor={(item) => item.imdbID}
              contentContainerStyle={styles.trendingMoviesList}
            />
          </View>
        </>
      )}

      {searchQuery && (
        loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.imdbID}
            contentContainerStyle={styles.resultsList}
          />
        )
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
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  trendingContainer: {
    padding: 15,
  },
  trendingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  trendingList: {
    paddingRight: 15,
  },
  trendingItem: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  trendingText: {
    color: '#666',
    fontSize: 14,
  },
  trendingMoviesContainer: {
    flex: 1,
    padding: 15,
  },
  trendingMoviesList: {
    paddingBottom: 20,
  },
  resultsList: {
    padding: 10,
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  poster: {
    width: 100,
    height: 150,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  movieInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  year: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  type: {
    fontSize: 12,
    color: '#888',
    textTransform: 'capitalize',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
});

export default SearchScreen; 