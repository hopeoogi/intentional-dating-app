
import React, { useState, useCallback } from 'react';
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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authenticatedPut, getBearerToken } from '@/utils/api';
import * as Location from 'expo-location';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sex, setSex] = useState<'male' | 'female' | 'other' | ''>('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleSave = useCallback(async () => {
    console.log('[Profile] Starting save process...');
    console.log('[Profile] User from context:', user);
    
    // Validate token first
    const token = await getBearerToken();
    console.log('[Profile] Token check:', token ? 'Token found' : 'No token');
    
    if (!token) {
      Alert.alert(
        'Authentication Required', 
        'Please sign in to continue. You will be redirected to the sign-in page.',
        [{ 
          text: 'OK', 
          onPress: () => router.replace('/signin') 
        }]
      );
      return;
    }

    // Validate required fields
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter your name');
      return;
    }

    if (!sex) {
      Alert.alert('Missing Information', 'Please select your sex');
      return;
    }

    if (!city.trim()) {
      Alert.alert('Missing Information', 'Please enter your location');
      return;
    }

    // Calculate age
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      Alert.alert('Age Requirement', 'You must be at least 18 years old to use this app');
      return;
    }

    try {
      setLoading(true);
      console.log('[Profile] Sending profile data:', {
        name: name.trim(),
        dateOfBirth: dateOfBirth.toISOString(),
        sex,
        location: city.trim(),
      });

      // TODO: Backend Integration - Save profile data to the backend
      await authenticatedPut('/api/profile', {
        name: name.trim(),
        dateOfBirth: dateOfBirth.toISOString(),
        sex,
        location: city.trim(),
      });
      
      console.log('[Profile] Profile saved successfully');
      Alert.alert('Success', 'Profile saved successfully!', [
        { text: 'Continue', onPress: () => router.push('/onboarding/media') }
      ]);
    } catch (error: any) {
      console.error('[Profile] Save error:', error);
      
      // Provide more helpful error messages
      let errorMessage = 'Unable to save profile. Please try again.';
      
      if (error.message.includes('Authentication')) {
        errorMessage = 'Your session has expired. Please sign in again.';
        Alert.alert('Session Expired', errorMessage, [
          { text: 'Sign In', onPress: () => router.replace('/signin') }
        ]);
        return;
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      Alert.alert('Save Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [name, dateOfBirth, sex, city, router, user]);

  const requestLocationPermission = async () => {
    try {
      setLocationLoading(true);
      console.log('[Profile] Requesting location permission...');
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('[Profile] Location permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is needed to auto-fill your city. You can still enter it manually.'
        );
        return;
      }

      console.log('[Profile] Getting current position...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      console.log('[Profile] Got location:', location.coords);
      
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      console.log('[Profile] Geocode result:', geocode);
      
      if (geocode[0]) {
        const cityName = geocode[0].city || geocode[0].subregion || geocode[0].region;
        const stateName = geocode[0].region || geocode[0].country;
        const locationString = `${cityName}, ${stateName}`;
        console.log('[Profile] Setting location:', locationString);
        setCity(locationString);
        Alert.alert('Success', 'Location detected successfully!');
      } else {
        Alert.alert('Location Error', 'Could not determine your location. Please enter it manually.');
      }
    } catch (error) {
      console.error('[Profile] Location error:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your location. Please enter your city manually.'
      );
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Tell us about you</Text>
            <Text style={styles.subtitle}>This information will be visible on your profile</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />

            <Text style={styles.label}>Date of Birth *</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
              disabled={loading}
            >
              <Text style={styles.dateText}>
                {dateOfBirth.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <IconSymbol 
                ios_icon_name="calendar" 
                android_material_icon_name="calendar-today" 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setDateOfBirth(selectedDate);
                  }
                }}
                maximumDate={new Date()}
                minimumDate={new Date(1940, 0, 1)}
              />
            )}

            <Text style={styles.label}>Sex *</Text>
            <View style={styles.sexContainer}>
              <TouchableOpacity
                style={[styles.sexButton, sex === 'male' && styles.sexButtonSelected]}
                onPress={() => setSex('male')}
                disabled={loading}
              >
                <IconSymbol 
                  ios_icon_name="person" 
                  android_material_icon_name="person" 
                  size={24} 
                  color={sex === 'male' ? '#FFF' : '#666'} 
                />
                <Text style={[styles.sexButtonText, sex === 'male' && styles.sexButtonTextSelected]}>
                  Male
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.sexButton, sex === 'female' && styles.sexButtonSelected]}
                onPress={() => setSex('female')}
                disabled={loading}
              >
                <IconSymbol 
                  ios_icon_name="person" 
                  android_material_icon_name="person" 
                  size={24} 
                  color={sex === 'female' ? '#FFF' : '#666'} 
                />
                <Text style={[styles.sexButtonText, sex === 'female' && styles.sexButtonTextSelected]}>
                  Female
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.sexButton, sex === 'other' && styles.sexButtonSelected]}
                onPress={() => setSex('other')}
                disabled={loading}
              >
                <IconSymbol 
                  ios_icon_name="person.2" 
                  android_material_icon_name="group" 
                  size={24} 
                  color={sex === 'other' ? '#FFF' : '#666'} 
                />
                <Text style={[styles.sexButtonText, sex === 'other' && styles.sexButtonTextSelected]}>
                  Other
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Location *</Text>
            <View style={styles.locationContainer}>
              <TextInput
                style={[styles.input, styles.locationInput]}
                placeholder="City, State (e.g., San Francisco, CA)"
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
                editable={!loading && !locationLoading}
              />
              <TouchableOpacity
                style={[styles.locationButton, locationLoading && styles.locationButtonLoading]}
                onPress={requestLocationPermission}
                disabled={loading || locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <IconSymbol 
                    ios_icon_name="location.fill" 
                    android_material_icon_name="my-location" 
                    size={24} 
                    color="#FFF" 
                  />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>
              Tap the location button to auto-detect your city, or enter it manually
            </Text>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
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
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
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
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  dateInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  sexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sexButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  sexButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sexButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },
  sexButtonTextSelected: {
    color: '#FFF',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  locationButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButtonLoading: {
    opacity: 0.6,
  },
  helperText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
    fontStyle: 'italic',
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
