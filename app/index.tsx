
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';

export default function IndexScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // TODO: Backend Integration - Check user onboarding status
        // If user has completed onboarding and subscription, go to main app
        // If user is pending approval, go to pending screen
        // If user needs to complete onboarding steps, go to appropriate step
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding/signup');
      }
    }
  }, [user, loading]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={commonStyles.centerContent}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[commonStyles.text, styles.loadingText]}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    color: colors.textSecondary,
  },
});
