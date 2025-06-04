import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getPosterUrl } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getFavoriteLists,
  removeMovieFromFavoriteList,
  createFavoriteList,
  deleteFavoriteList,
} from '../services/favoritesService';

const FavoritesScreen = ({ navigation }) => {
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    loadFavoriteLists();
  }, []);

  // Favori listelerini yükle
  const loadFavoriteLists = async () => {
    try {
      setLoading(true);
      const lists = await getFavoriteLists();
      setFavoriteLists(lists);
      if (lists.length > 0 && !selectedList) {
        setSelectedList(lists[0].name);
      }
    } catch (error) {
      console.error('Favori listeleri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ekran her odaklandığında favorileri yeniden yükle
  useFocusEffect(
    React.useCallback(() => {
      loadFavoriteLists();
    }, [])
  );

  // Favorilerden kaldır
  const removeFavorite = async (imdbId) => {
    try {
      await removeMovieFromFavoriteList(selectedList, imdbId);
      await loadFavoriteLists();
    } catch (error) {
      console.error('Favori kaldırılırken hata:', error);
      Alert.alert('Hata', 'Film favorilerden kaldırılırken bir hata oluştu.');
    }
  };

  // Yeni liste oluştur
  const createList = async () => {
    if (!newListName.trim()) {
      Alert.alert('Hata', 'Lütfen bir liste adı girin.');
      return;
    }

    try {
      await createFavoriteList(newListName.trim());
      setNewListName('');
      setModalVisible(false);
      await loadFavoriteLists();
    } catch (error) {
      Alert.alert('Hata', 'Liste oluşturulurken bir hata oluştu.');
    }
  };

  // Liste sil
  const handleDeleteList = async (listName) => {
    try {
      await deleteFavoriteList(listName);
      await loadFavoriteLists();
    } catch (error) {
      Alert.alert('Hata', 'Liste silinirken bir hata oluştu.');
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

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <FlatList
        horizontal
        data={favoriteLists}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.listTab,
              selectedList === item.name && styles.selectedListTab
            ]}
            onPress={() => setSelectedList(item.name)}
          >
            <Text style={[
              styles.listTabText,
              selectedList === item.name && styles.selectedListTabText
            ]}>
              {item.name}
            </Text>
            {item.name !== 'Favoriler' && (
              <TouchableOpacity
                style={styles.deleteListButton}
                onPress={() => handleDeleteList(item.name)}
              >
                <Icon name="close" size={16} color="#666" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listTabsContainer}
      />
      <TouchableOpacity
        style={styles.addListButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={24} color="#007AFF" />
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

  const selectedListData = favoriteLists.find(list => list.name === selectedList);

  if (!selectedListData || selectedListData.movies.length === 0) {
    return (
      <View style={styles.container}>
        {renderListHeader()}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bu listede henüz film bulunmuyor.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderListHeader()}
      <FlatList
        data={selectedListData.movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.imdbID}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yeni Liste Oluştur</Text>
            <TextInput
              style={styles.input}
              placeholder="Liste adı"
              value={newListName}
              onChangeText={setNewListName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewListName('');
                }}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={createList}
              >
                <Text style={[styles.buttonText, styles.createButtonText]}>Oluştur</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listTabsContainer: {
    flexGrow: 1,
  },
  listTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedListTab: {
    backgroundColor: '#007AFF',
  },
  listTabText: {
    fontSize: 14,
    color: '#666',
  },
  selectedListTabText: {
    color: '#fff',
  },
  deleteListButton: {
    marginLeft: 8,
    padding: 4,
  },
  addListButton: {
    padding: 8,
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  createButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  createButtonText: {
    color: '#fff',
  },
});

export default FavoritesScreen; 