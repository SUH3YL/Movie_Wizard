import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFavoriteLists, addMovieToFavoriteList, removeMovieFromFavoriteList } from '../services/favoritesService';

const FavoriteButton = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    checkFavoriteStatus();
    loadFavoriteLists();
  }, [movie]);

  const loadFavoriteLists = async () => {
    try {
      const lists = await getFavoriteLists();
      setFavoriteLists(lists);
    } catch (error) {
      console.error('Favori listeleri yüklenirken hata:', error);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const lists = await getFavoriteLists();
      const isInAnyList = lists.some(list => 
        list.movies.some(m => m.imdbID === movie.imdbID)
      );
      setIsFavorite(isInAnyList);
    } catch (error) {
      console.error('Favori durumu kontrol edilirken hata:', error);
    }
  };

  const handleFavoritePress = () => {
    if (isFavorite) {
      // Film favorilerde ise, hangi listeden kaldırmak istediğini sor
      const listsWithMovie = favoriteLists.filter(list => 
        list.movies.some(m => m.imdbID === movie.imdbID)
      );
      
      if (listsWithMovie.length === 1) {
        // Film sadece bir listede ise direkt kaldır
        removeFromList(listsWithMovie[0].name);
      } else {
        // Film birden fazla listede ise seçim yaptır
        setSelectedList(listsWithMovie[0].name);
        setModalVisible(true);
      }
    } else {
      // Film favorilerde değilse, hangi listeye eklemek istediğini sor
      setModalVisible(true);
    }
  };

  const addToList = async (listName) => {
    try {
      await addMovieToFavoriteList(listName, movie);
      setIsFavorite(true);
      setModalVisible(false);
      Alert.alert('Başarılı', 'Film favori listesine eklendi.');
    } catch (error) {
      Alert.alert('Hata', 'Film favori listesine eklenirken bir hata oluştu.');
    }
  };

  const removeFromList = async (listName) => {
    try {
      await removeMovieFromFavoriteList(listName, movie.imdbID);
      await checkFavoriteStatus();
      setModalVisible(false);
      Alert.alert('Başarılı', 'Film favori listesinden kaldırıldı.');
    } catch (error) {
      Alert.alert('Hata', 'Film favori listesinden kaldırılırken bir hata oluştu.');
    }
  };

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        if (isFavorite) {
          removeFromList(item.name);
        } else {
          addToList(item.name);
        }
      }}
    >
      <Text style={styles.listItemText}>{item.name}</Text>
      {item.movies.some(m => m.imdbID === movie.imdbID) && (
        <Icon name="check" size={20} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={handleFavoritePress}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isFavorite ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
            </Text>
            <FlatList
              data={favoriteLists}
              renderItem={renderListItem}
              keyExtractor={(item) => item.name}
              style={styles.listContainer}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  listContainer: {
    maxHeight: 300,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
});

export default FavoriteButton; 