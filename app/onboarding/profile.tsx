
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { authenticatedPut } from '@/utils/api';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sex, setSex] = useState<'male' | 'female' | 'other' | ''>('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (address[0]) {
          setLocation(`${address[0].city}, ${address[0].region}`);
        }
      }
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const handleContinue = async () => {
    if (!name || !sex || !location || !bio) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const age = new Date().getFullYear() - dateOfBirth.getFullYear();
    if (age < 18) {
      Alert.alert('Error', 'You must be at least 18 years old');
      return;
    }

    setLoading(true);
    try {
      await authenticatedPut('/api/profile', {
        name,
        dateOfBirth: dateOfBirth.toISOString(),
        sex,
        location,
        bio,
      });
      router.push('/onboarding/media');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Your Profile</Text>
            <Text style={styles.subtitle}>Tell us about yourself</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
              disabled={loading}
            >
              <Text style={styles.inputText}>
                Date of Birth: {dateOfBirth.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDateOfBirth(selectedDate);
                }}
                maximumDate={new Date()}
              />
            )}

            <Text style={styles.label}>Sex</Text>
            <View style={styles.sexButtons}>
              <TouchableOpacity
                style={[styles.sexButton, sex === 'male' && styles.sexButtonActive]}
                onPress={() => setSex('male')}
                disabled={loading}
              >
                <Text style={[styles.sexButtonText, sex === 'male' && styles.sexButtonTextActive]}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sexButton, sex === 'female' && styles.sexButtonActive]}
                onPress={() => setSex('female')}
                disabled={loading}
              >
                <Text style={[styles.sexButtonText, sex === 'female' && styles.sexButtonTextActive]}>
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sexButton, sex === 'other' && styles.sexButtonActive]}
                onPress={() => setSex('other')}
                disabled={loading}
              >
                <Text style={[styles.sexButtonText, sex === 'other' && styles.sexButtonTextActive]}>
                  Other
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.locationContainer}>
              <TextInput
                style={[styles.input, styles.locationInput]}
                placeholder="Location (City, State)"
                value={location}
                onChangeText={setLocation}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.locationButton}
                onPress={requestLocationPermission}
                disabled={loading}
              >
                <IconSymbol
                  ios_icon_name="location.fill"
                  android_material_icon_name="location-on"
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Bio (Tell us about yourself)"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              editable={!loading}
            />

            <TouchableOpacity
              style={[buttonStyles.primary, loading && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={buttonStyles.primaryText}>Continue</Text>
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
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputText: {
    fontSize: 16,
    color: colors.text,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  sexButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sexButton: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  sexButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sexButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  sexButtonTextActive: {
    color: '#FFFFFF',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  locationButton: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
