
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { authenticatedPost } from '@/utils/api';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function VerificationScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await authenticatedPost('/api/verification/submit', {});
      Alert.alert(
        'Application Submitted',
        'Your profile has been submitted for review. We\'ll notify you once approved!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/onboarding/subscription'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <IconSymbol name="checkmark.seal.fill" size={80} color={colors.primary} />
          <Text style={styles.title}>Verification</Text>
          <Text style={styles.subtitle}>
            Submit your profile for manual review to join our verified community
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
            <Text style={styles.infoText}>Profile reviewed by real people</Text>
          </View>
          <View style={styles.infoItem}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
            <Text style={styles.infoText}>Verified badge on your profile</Text>
          </View>
          <View style={styles.infoItem}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
            <Text style={styles.infoText}>Access to premium features</Text>
          </View>
          <View style={styles.infoItem}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
            <Text style={styles.infoText}>Safe and trusted community</Text>
          </View>
        </View>

        <View style={styles.noteCard}>
          <IconSymbol name="info.circle.fill" size={24} color={colors.warning} />
          <Text style={styles.noteText}>
            Review typically takes 24-48 hours. You'll receive an email once your profile is approved.
          </Text>
        </View>

        <TouchableOpacity
          style={[buttonStyles.primary, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={buttonStyles.primaryText}>Submit for Review</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  noteText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
