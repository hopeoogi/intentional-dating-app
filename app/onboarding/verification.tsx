
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function VerificationScreen() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [proofText, setProofText] = useState('');
  const [loading, setLoading] = useState(false);

  const statuses = [
    { id: 'verified', label: 'Verified Professional', icon: 'verified' },
    { id: 'student', label: 'Student', icon: 'school' },
    { id: 'entrepreneur', label: 'Entrepreneur', icon: 'business' },
    { id: 'creative', label: 'Creative', icon: 'palette' },
    { id: 'other', label: 'Other', icon: 'person' },
  ];

  const handleSubmit = async () => {
    if (!selectedStatus) {
      Alert.alert('Error', 'Please select a status');
      return;
    }

    if (!proofText.trim()) {
      Alert.alert('Error', 'Please provide verification details');
      return;
    }

    try {
      setLoading(true);
      // TODO: Backend Integration - Submit verification application for admin review
      console.log('Verification data:', { selectedStatus, proofText });
      router.push('/onboarding/pending');
    } catch (error) {
      console.error('Verification submit error:', error);
      Alert.alert('Error', 'Failed to submit verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Verification</Text>
          <Text style={commonStyles.subtitle}>
            Help us verify your identity and build a trusted community
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Your Status</Text>
          <View style={styles.statusGrid}>
            {statuses.map((status) => (
              <TouchableOpacity
                key={status.id}
                style={[
                  styles.statusCard,
                  selectedStatus === status.id && styles.statusCardSelected,
                ]}
                onPress={() => setSelectedStatus(status.id)}
              >
                <IconSymbol
                  ios_icon_name={status.icon}
                  android_material_icon_name={status.icon as any}
                  size={32}
                  color={
                    selectedStatus === status.id ? colors.primary : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.statusLabel,
                    selectedStatus === status.id && styles.statusLabelSelected,
                  ]}
                >
                  {status.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Details</Text>
          <Text style={commonStyles.textSecondary}>
            Provide information to help us verify your status (e.g., LinkedIn profile,
            company name, university, portfolio link)
          </Text>
          <TextInput
            style={[commonStyles.input, styles.proofInput]}
            placeholder="Enter verification details..."
            placeholderTextColor={colors.textSecondary}
            value={proofText}
            onChangeText={setProofText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.infoBox}>
          <IconSymbol
            ios_icon_name="info.circle"
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            Your application will be reviewed by our team. This usually takes 24-48
            hours. You&apos;ll be notified once approved.
          </Text>
        </View>

        <TouchableOpacity
          style={[buttonStyles.primary, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={commonStyles.buttonText}>
            {loading ? 'Submitting...' : 'Submit for Review'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statusCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  statusLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  proofInput: {
    height: 120,
    paddingTop: 14,
    marginTop: 12,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
