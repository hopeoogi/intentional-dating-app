
import React, { useState, useCallback } from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { authenticatedPost } from '@/utils/api';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerificationScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    status: '',
    proof: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!formData.status || !formData.proof) {
      Alert.alert('Missing Information', 'Please fill in all fields to continue');
      return;
    }

    try {
      setLoading(true);
      console.log('[Verification] Submitting verification data');
      
      // TODO: Backend Integration - Submit verification data to the backend API
      await authenticatedPost('/api/verification/submit', {
        status: formData.status,
        proof: formData.proof,
      });

      console.log('[Verification] Verification submitted successfully');
      
      // Navigate to pending approval screen
      router.replace('/onboarding/pending');
    } catch (error: any) {
      console.error('[Verification] Verification submit error:', error);
      Alert.alert('Submission Failed', error.message || 'Failed to submit verification. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [formData, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/96e0c1f0-fcef-4b76-b942-74280a3296cb.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Verification</Text>
          <Text style={styles.subtitle}>Step 3 of 4</Text>
        </View>

        <View style={styles.infoBox}>
          <IconSymbol ios_icon_name="checkmark.shield.fill" android_material_icon_name="verified-user" size={24} color="#5B4FE9" />
          <Text style={styles.infoText}>
            Verification helps us maintain a trusted community. This information will be reviewed by our team.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Status/Profession *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Software Engineer, Doctor, Student"
            placeholderTextColor="#999"
            value={formData.status}
            onChangeText={(text) => setFormData({ ...formData, status: text })}
          />

          <Text style={styles.label}>Verification Proof *</Text>
          <Text style={styles.helperText}>
            Provide LinkedIn profile, company email, or other professional verification
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="LinkedIn URL, company email, or other proof"
            placeholderTextColor="#999"
            value={formData.proof}
            onChangeText={(text) => setFormData({ ...formData, proof: text })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styles.privacyNote}>
            <IconSymbol ios_icon_name="lock.fill" android_material_icon_name="lock" size={20} color="#7F8C8D" />
            <Text style={styles.privacyText}>
              Your verification information is kept private and only used for approval purposes
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit for Review</Text>
            )}
          </TouchableOpacity>
        </View>
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
    marginBottom: 24,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0EDFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#5B4FE9',
    lineHeight: 20,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    marginTop: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  privacyText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 12,
    color: '#7F8C8D',
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: '#5B4FE9',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#5B4FE9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
