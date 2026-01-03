
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to sign-in after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/signin');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1080&q=80' }}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/96e0c1f0-fcef-4b76-b942-74280a3296cb.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Intentional</Text>
          <Text style={styles.tagline}>Meaningful Connections</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  appName: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 12,
  },
  tagline: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 12,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
});
