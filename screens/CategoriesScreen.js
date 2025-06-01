import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';

const CategoriesScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('Movies');

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

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.title && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(item.title)}
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
    <TouchableOpacity style={styles.genreButton}>
      <Text style={styles.genreText}>{item}</Text>
    </TouchableOpacity>
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
      <FlatList
        data={genres[selectedCategory]}
        renderItem={renderGenreItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.genresList}
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
  genreText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default CategoriesScreen; 