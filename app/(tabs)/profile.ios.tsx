
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useRouter } from 'expo-router';
import { GlassView } from 'expo-glass-effect';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  signOutButton: {
    ...buttonStyles.primary,
    backgroundColor: '#FF3B30',
    marginTop: 20,
  },
  signOutButtonText: {
    ...buttonStyles.primaryText,
  },
});

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

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
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  // TODO: Backend Integration - Fetch user profile data from the backend API
  const mockUserData = {
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    age: 28,
    location: 'San Francisco, CA',
    status: 'Verified',
    bio: 'Looking for meaningful connections',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <GlassView style={styles.profileHeader} glassEffectStyle="regular">
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {mockUserData.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{mockUserData.name}</Text>
          <Text style={styles.email}>{mockUserData.email}</Text>
          <View style={styles.statusBadge}>
            <IconSymbol
              ios_icon_name="checkmark.seal.fill"
              android_material_icon_name="verified"
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.statusText}>{mockUserData.status}</Text>
          </View>
        </GlassView>

        <GlassView style={styles.section} glassEffectStyle="regular">
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          <View style={styles.infoRow}>
            <IconSymbol
              ios_icon_name="person.fill"
              android_material_icon_name="person"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{mockUserData.age}</Text>
          </View>

          <View style={styles.infoRow}>
            <IconSymbol
              ios_icon_name="location.fill"
              android_material_icon_name="location-on"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{mockUserData.location}</Text>
          </View>

          <View style={[styles.infoRow, styles.infoRowLast]}>
            <IconSymbol
              ios_icon_name="text.alignleft"
              android_material_icon_name="description"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.infoLabel}>Bio</Text>
          </View>
          <Text style={[styles.infoValue, { marginTop: 8 }]}>{mockUserData.bio}</Text>
        </GlassView>

        <GlassView style={styles.section} glassEffectStyle="regular">
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.infoRow}>
            <IconSymbol
              ios_icon_name="gear"
              android_material_icon_name="settings"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.infoLabel}>Account Settings</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoRow}>
            <IconSymbol
              ios_icon_name="bell.fill"
              android_material_icon_name="notifications"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.infoLabel}>Notifications</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.infoRow, styles.infoRowLast]}>
            <IconSymbol
              ios_icon_name="lock.fill"
              android_material_icon_name="lock"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.infoLabel}>Privacy</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </GlassView>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
