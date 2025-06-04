import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const NewsCard = ({ news, navigation }) => {
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

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handlePress = () => {
    navigation.navigate('News', { news });
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

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
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
        <Text style={styles.title}>{truncateText(news.title, 100)}</Text>
        <Text style={styles.description}>{truncateText(news.description, 150)}</Text>
        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(news.published_at)}</Text>
          <Text style={styles.source}>{getSourceName()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  source: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default NewsCard; 