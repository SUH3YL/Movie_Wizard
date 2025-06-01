import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getHighRatedMovies } from '../services/api';

const LuckyButton = ({ navigation }) => {
  const [countdown, setCountdown] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [buttonColor] = useState(new Animated.Value(0));

  const startAnimation = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCountdown(3);

    // Renk animasyonu
    Animated.sequence([
      Animated.timing(buttonColor, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(buttonColor, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();

    // Geri sayma
    const timer = setInterval(async () => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsAnimating(false);
          selectRandomMovie();
          return 3;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  const selectRandomMovie = async () => {
    try {
      const highRatedMovies = await getHighRatedMovies();
      if (highRatedMovies.length > 0) {
        const randomIndex = Math.floor(Math.random() * highRatedMovies.length);
        const selectedMovie = highRatedMovies[randomIndex];
        navigation.navigate('MovieInfo', { imdbId: selectedMovie.imdbID });
      }
    } catch (error) {
      console.error('Film seçilirken hata:', error);
    }
  };

  const backgroundColor = buttonColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#4CAF50', '#FF5722']
  });

  return (
    <Animated.View style={[styles.buttonContainer, { backgroundColor }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={startAnimation}
        disabled={isAnimating}
      >
        <Icon 
          name={isAnimating ? "timer" : "casino"} 
          size={24} 
          color="#fff" 
        />
        <Text style={styles.buttonText}>
          {isAnimating ? `${countdown}...` : 'Kendimi Şanslı Hissediyorum'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default LuckyButton; 