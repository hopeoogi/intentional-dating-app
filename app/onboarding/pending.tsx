
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function PendingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={commonStyles.centerContent}>
        <View style={styles.iconContainer}>
          <IconSymbol
            ios_icon_name="clock.fill"
            android_material_icon_name="schedule"
            size={80}
            color={colors.primary}
          />
        </View>

        <Text style={commonStyles.title}>Application Under Review</Text>
        <Text style={[commonStyles.subtitle, styles.subtitle]}>
          Thank you for applying! Our team is reviewing your application. This
          typically takes 24-48 hours.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>1.</Text>
            <Text style={styles.infoText}>
              Our team reviews your profile and verification details
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>2.</Text>
            <Text style={styles.infoText}>
              You&apos;ll receive an email notification once approved
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>3.</Text>
            <Text style={styles.infoText}>
              Complete your subscription to activate your account
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>4.</Text>
            <Text style={styles.infoText}>
              Start connecting with intentional matches!
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={buttonStyles.outline}
          onPress={() => {
            // TODO: Backend Integration - Sign out user
            router.replace('/onboarding/signup');
          }}
        >
          <Text style={commonStyles.buttonTextOutline}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  infoCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  infoBullet: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
