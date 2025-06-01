import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LuckyButton from '../components/LuckyButton';

const HomeScreen = ({ navigation }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    updateGreeting();
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

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.greeting}>{greeting}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <LuckyButton navigation={navigation} />
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>Home Screen</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 