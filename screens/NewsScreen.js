import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NewsScreen = ({ route, navigation }) => {
  const { news } = route.params;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSourcePress = () => {
    if (news.href) {
      Linking.openURL(news.href);
    }
  };

  const getSourceName = () => {
    if (news.source && typeof news.source === 'object' && news.source.name) {
      return news.source.name;
    }
    if (news.source && typeof news.source === 'string') {
      return news.source;
    }
    return 'Kaynak Belirtilmemiş';
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      headerLeft: () => (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (!news) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {news.image ? (
          <Image
            source={{ uri: news.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Görsel Yok</Text>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{news.title}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Icon name="access-time" size={16} color="#666" />
              <Text style={styles.metaText}>{formatDate(news.published_at)}</Text>
            </View>

            <TouchableOpacity
              style={styles.sourceContainer}
              onPress={handleSourcePress}
            >
              <Icon name="link" size={16} color="#007AFF" />
              <Text style={styles.sourceText}>{getSourceName()}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>{news.description}</Text>

          {news.body && (
            <Text style={styles.body}>{news.body}</Text>
          )}

          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={handleSourcePress}
          >
            <Text style={styles.readMoreText}>Haberi Kaynağında Oku</Text>
            <Icon name="arrow-forward" size={16} color="#007AFF" />
          </TouchableOpacity>
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
  backButton: {
    marginLeft: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
  },
  placeholderImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
    textDecorationLine: 'underline',
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 24,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginTop: 16,
  },
  readMoreText: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 8,
    fontWeight: '500',
  },
});

export default NewsScreen; 