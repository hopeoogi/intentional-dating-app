
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authenticatedPost } from '@/utils/api';

export default function VerificationScreen() {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [proof, setProof] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!status || !proof) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await authenticatedPost('/api/verification/submit', {
        status,
        proof,
      });

      Alert.alert(
        'Application Submitted',
        'Your application is under review. You will be notified once approved.',
        [{ text: 'OK', onPress: () => router.push('/onboarding/subscription') }]
      );
    } catch (error: any) {
      Alert.alert('Submission Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Verification</Text>
          <Text style={styles.subtitle}>
            Help us verify your identity to maintain a trusted community
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Status/Profession</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Software Engineer, Student, etc."
            value={status}
            onChangeText={setStatus}
            editable={!loading}
          />

          <Text style={styles.label}>Verification Proof</Text>
          <Text style={styles.helperText}>
            Provide a link to your LinkedIn, company email, or other verification
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter verification details or links"
            value={proof}
            onChangeText={setProof}
            multiline
            numberOfLines={4}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Submit for Review</Text>
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
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
