
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import Constants from 'expo-constants';
import { getBearerToken } from '@/utils/api';

export default function IndexScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!loading) {
        if (user) {
          try {
            // Check user profile and onboarding status
            const response = await fetch(`${Constants.expoConfig?.extra?.backendUrl}/api/profile`, {
              headers: {
                'Authorization': `Bearer ${await getBearerToken()}`,
              },
            });

            if (response.ok) {
              const profile = await response.json();
              console.log('[Index] User profile:', profile);

              // Check verification status
              const verificationResponse = await fetch(
                `${Constants.expoConfig?.extra?.backendUrl}/api/verification/status`,
                {
                  headers: {
                    'Authorization': `Bearer ${await getBearerToken()}`,
                  },
                }
              );

              if (verificationResponse.ok) {
                const verificationStatus = await verificationResponse.json();
                console.log('[Index] Verification status:', verificationStatus);

                // Route based on onboarding status
                if (verificationStatus.status === 'pending') {
                  router.replace('/onboarding/pending');
                } else if (verificationStatus.status === 'approved') {
                  router.replace('/(tabs)');
                } else if (!profile.name || !profile.dateOfBirth) {
                  router.replace('/onboarding/profile');
                } else if (!profile.photos || profile.photos.length < 2) {
                  router.replace('/onboarding/media');
                } else {
                  router.replace('/onboarding/verification');
                }
              } else {
                // No verification status yet, continue onboarding
                router.replace('/onboarding/profile');
              }
            } else if (response.status === 404) {
              // Profile doesn't exist yet, start onboarding
              router.replace('/onboarding/profile');
            } else {
              console.error('[Index] Failed to fetch profile:', response.status);
              router.replace('/onboarding/profile');
            }
          } catch (error) {
            console.error('[Index] Error checking onboarding status:', error);
            router.replace('/onboarding/profile');
          }
        } else {
          router.replace('/onboarding/auth');
        }
      }
    };

    checkOnboardingStatus();
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
