import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import LuckyButton from '../components/LuckyButton';
import NewsCard from '../components/NewsCard';
import { getMovieNews } from '../services/MovieNewsService';

const HomeScreen = ({ navigation }) => {
  const [greeting, setGreeting] = useState('');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    updateGreeting();
    loadNews();
  }, []);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    let greetingText = '';

    if (hour >= 5 && hour < 12) {
      greetingText = 'Günaydın';
    } else if (hour >= 12 && hour < 18) {
      greetingText = 'İyi Günler';
    } else if (hour >= 18 && hour < 22) {
      greetingText = 'İyi Akşamlar';
    } else {
      greetingText = 'İyi Geceler';
    }

    setGreeting(greetingText);
  };

  const loadNews = async (pageNum = 1) => {
    try {
      setLoading(true);
      console.log('Haberler yükleniyor...');
      const response = await getMovieNews({ page: pageNum });
      console.log('API Yanıtı:', response);
      
      if (response && response.status === 'ok' && response.results && response.results.length > 0) {
        if (pageNum === 1) {
          setNews(response.results);
        } else {
          setNews(prev => [...prev, ...response.results]);
        }
        setHasMore(response.has_next_pages);
        console.log('Yüklenen haber sayısı:', response.results.length);
      } else {
        console.log('Haber bulunamadı veya boş yanıt');
        setHasMore(false);
        if (pageNum === 1) {
          Alert.alert(
            'Bilgi',
            'Şu anda film haberleri bulunamadı. Lütfen daha sonra tekrar deneyin.'
          );
        }
      }
    } catch (error) {
      console.error('Haberler yüklenirken hata:', error);
      Alert.alert(
        'Hata',
        'Haberler yüklenirken bir hata oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadNews(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNews(nextPage);
    }
  };

  const renderNewsItem = ({ item }) => (
    <NewsCard news={item} navigation={navigation} />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Film haberleri bulunamadı</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.greeting}>{greeting}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <LuckyButton navigation={navigation} />
      </View>

      <View style={styles.newsContainer}>
        <Text style={styles.newsTitle}>Film Haberleri</Text>
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={(item, index) => item.url || index.toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
            />
          }
          contentContainerStyle={styles.newsList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  topBar: {
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  newsContainer: {
    flex: 1,
    marginTop: 20,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  newsList: {
    paddingBottom: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen; 