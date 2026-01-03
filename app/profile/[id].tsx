
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { authenticatedGet } from '@/utils/api';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  photos: string[];
  status: string;
  interests: string[];
}

const { width } = Dimensions.get('window');

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      loadProfile();
    }
  }, [id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await authenticatedGet(`/api/profiles/${id}`);
      setProfile(data);
    } catch (error: any) {
      console.error('Failed to load profile:', error);
      Alert.alert('Error', error.message || 'Failed to load profile');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = () => {
    router.push(`/conversation/new?matchId=${id}`);
  };

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity>
          <IconSymbol ios_icon_name="ellipsis.circle" android_material_icon_name="more-horiz" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.photosScroll}
        >
          {profile.photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo || 'https://via.placeholder.com/400x500' }}
              style={styles.photo}
            />
          ))}
        </ScrollView>

        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.name}, {profile.age}</Text>
            {profile.status === 'verified' && (
              <IconSymbol ios_icon_name="checkmark.seal.fill" android_material_icon_name="verified" size={28} color={colors.primary} />
            )}
          </View>

          <View style={styles.locationRow}>
            <IconSymbol ios_icon_name="location.fill" android_material_icon_name="location-on" size={18} color={colors.textLight} />
            <Text style={styles.location}>{profile.location}</Text>
          </View>

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{profile.bio}</Text>

          {profile.interests && profile.interests.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Interests</Text>
              <View style={styles.interestsContainer}>
                {profile.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleStartConversation}
        >
          <Text style={styles.primaryButtonText}>Start Conversation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  photosScroll: {
    height: width * 1.2,
  },
  photo: {
    width: width,
    height: width * 1.2,
  },
  infoSection: {
    padding: 24,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  location: {
    fontSize: 16,
    color: colors.textLight,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  bio: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  interestTag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    color: colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
