
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { authenticatedGet } from '@/utils/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await authenticatedGet('/api/profile');
      console.log('[Profile] Loaded profile data:', data);
      setProfileData(data);
    } catch (error: any) {
      console.error('[Profile] Failed to load profile:', error);
      // Use fallback data if API fails
      setProfileData({
        name: user?.name || 'User',
        email: user?.email || 'user@example.com',
        profilePicture: user?.image,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/signin');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const displayName = profileData?.name || user?.name || 'User';
  const displayEmail = profileData?.email || user?.email || '';
  const displayImage = profileData?.profilePicture || user?.image || 'https://via.placeholder.com/120';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{ uri: displayImage }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{displayEmail}</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol name="person.fill" size={24} color={colors.primary} />
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol name="photo.fill" size={24} color={colors.primary} />
            <Text style={styles.menuItemText}>Manage Photos</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol name="gearshape.fill" size={24} color={colors.primary} />
            <Text style={styles.menuItemText}>Settings</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol name="shield.fill" size={24} color={colors.primary} />
            <Text style={styles.menuItemText}>Privacy & Safety</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol name="questionmark.circle.fill" size={24} color={colors.primary} />
            <Text style={styles.menuItemText}>Help & Support</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[buttonStyles.secondary, styles.signOutButton]}
          onPress={handleSignOut}
        >
          <Text style={buttonStyles.secondaryText}>Sign Out</Text>
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
    marginTop: 20,
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textLight,
  },
  section: {
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 16,
  },
  signOutButton: {
    marginTop: 'auto',
  },
});
