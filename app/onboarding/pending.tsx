
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';

export default function PendingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/96e0c1f0-fcef-4b76-b942-74280a3296cb.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={styles.iconContainer}>
          <IconSymbol ios_icon_name="clock.fill" android_material_icon_name="schedule" size={80} color="#5B4FE9" />
        </View>

        <Text style={styles.title}>Application Submitted!</Text>
        
        <Text style={styles.message}>
          Thank you for applying to join Intentional. Our team is reviewing your application.
        </Text>

        <Text style={styles.submessage}>
          We&apos;ll notify you via email once your application has been reviewed. This typically takes 24-48 hours.
        </Text>

        <View style={styles.infoBox}>
          <IconSymbol ios_icon_name="info.circle.fill" android_material_icon_name="info" size={24} color="#5B4FE9" />
          <Text style={styles.infoText}>
            You&apos;ll be able to complete your subscription and start matching once approved.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/signin')}
        >
          <Text style={styles.buttonText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0EDFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  submessage: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0EDFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#5B4FE9',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#5B4FE9',
    borderRadius: 12,
    padding: 18,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
