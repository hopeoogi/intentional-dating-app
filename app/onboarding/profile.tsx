
import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!name || !gender || !location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const age = new Date().getFullYear() - dateOfBirth.getFullYear();
    if (age < 18) {
      Alert.alert('Error', 'You must be at least 18 years old');
      return;
    }

    try {
      setLoading(true);
      // TODO: Backend Integration - Save profile data
      console.log('Profile data:', { name, dateOfBirth, gender, location, bio });
      router.push('/onboarding/media');
    } catch (error) {
      console.error('Profile save error:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={commonStyles.title}>Create Your Profile</Text>
            <Text style={commonStyles.subtitle}>
              Tell us a bit about yourself
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Your name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Date of Birth *</Text>
            <TouchableOpacity
              style={[commonStyles.input, styles.dateButton]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {dateOfBirth.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setDateOfBirth(selectedDate);
                  }
                }}
                maximumDate={new Date()}
              />
            )}

            <Text style={styles.label}>Gender *</Text>
            <View style={styles.genderContainer}>
              {['Man', 'Woman', 'Non-binary', 'Other'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderButton,
                    gender === option && styles.genderButtonSelected,
                  ]}
                  onPress={() => setGender(option)}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === option && styles.genderButtonTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="City, State"
              placeholderTextColor={colors.textSecondary}
              value={location}
              onChangeText={setLocation}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Bio (Optional)</Text>
            <TextInput
              style={[commonStyles.input, styles.bioInput]}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.textSecondary}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[buttonStyles.primary, loading && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={loading}
            >
              <Text style={commonStyles.buttonText}>
                {loading ? 'Saving...' : 'Continue'}
              </Text>
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
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  dateButton: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  genderButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  genderButtonTextSelected: {
    color: '#FFFFFF',
  },
  bioInput: {
    height: 100,
    paddingTop: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
