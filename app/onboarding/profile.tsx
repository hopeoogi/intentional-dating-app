
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authenticatedPut } from '@/utils/api';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

export default function ProfileScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: new Date(2000, 0, 1),
    sex: '',
    location: '',
    bio: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = useCallback(async () => {
    console.log('[Profile] Starting profile save process');
    
    // Validation
    if (!formData.name || !formData.sex || !formData.location) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Sex, Location)');
      return;
    }

    // Age validation (must be 18+)
    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      Alert.alert('Age Requirement', 'You must be at least 18 years old to join Intentional');
      return;
    }

    try {
      setLoading(true);
      console.log('[Profile] Saving profile data:', {
        name: formData.name,
        dateOfBirth: formData.dateOfBirth.toISOString(),
        sex: formData.sex,
        location: formData.location,
        bio: formData.bio,
      });
      
      // TODO: Backend Integration - Save profile data to the backend API
      await authenticatedPut('/api/profile', {
        name: formData.name,
        dateOfBirth: formData.dateOfBirth.toISOString(),
        sex: formData.sex,
        location: formData.location,
        bio: formData.bio,
      });

      console.log('[Profile] Profile saved successfully, navigating to media upload');
      
      // Navigate to media upload
      router.push('/onboarding/media');
    } catch (error: any) {
      console.error('[Profile] Profile save error:', error);
      Alert.alert(
        'Save Failed', 
        error.message || 'Failed to save profile. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [formData, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
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
            <Text style={styles.title}>Tell Us About You</Text>
            <Text style={styles.subtitle}>Step 1 of 4</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <Text style={styles.label}>Date of Birth *</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formData.dateOfBirth.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={formData.dateOfBirth}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setFormData({ ...formData, dateOfBirth: selectedDate });
                  }
                }}
                maximumDate={new Date()}
              />
            )}

            <Text style={styles.label}>Sex *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.sex}
                onValueChange={(value) => setFormData({ ...formData, sex: value })}
                style={styles.picker}
              >
                <Picker.Item label="Select..." value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Non-binary" value="non-binary" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>

            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="City, State"
              placeholderTextColor="#999"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />

            <Text style={styles.label}>Bio (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us a bit about yourself..."
              placeholderTextColor="#999"
              value={formData.bio}
              onChangeText={(text) => setFormData({ ...formData, bio: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.continueButton, loading && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  dateText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  pickerContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  continueButton: {
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
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
