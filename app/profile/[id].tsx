
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

const { width } = Dimensions.get('window');

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

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // TODO: Backend Integration - Fetch profile from API
      // Mock data for now
      const mockProfile: Profile = {
        id: id as string,
        name: 'Sarah',
        age: 28,
        location: 'San Francisco, CA',
        bio: 'Product designer who loves hiking and trying new restaurants. Looking for someone who values deep conversations and shared adventures. I believe in being intentional about connections and building something meaningful.',
        photos: [
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
        ],
        status: 'Verified Professional',
        interests: ['Hiking', 'Photography', 'Cooking', 'Travel', 'Reading'],
      };
      setProfile(mockProfile);
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = () => {
    router.push(`/conversation/${id}`);
  };

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.text}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.photosContainer}
        >
          {profile.photos.map((photo, index) => (
            <Image key={index} source={{ uri: photo }} style={styles.photo} />
          ))}
        </ScrollView>

        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.name}>
                {profile.name}, {profile.age}
              </Text>
              <Text style={styles.location}>{profile.location}</Text>
            </View>
            <View style={commonStyles.badge}>
              <Text style={commonStyles.badgeText}>{profile.status}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {profile.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.messageButton} onPress={handleStartConversation}>
          <IconSymbol
            ios_icon_name="message.fill"
            android_material_icon_name="message"
            size={24}
            color="#FFFFFF"
          />
          <Text style={styles.messageButtonText}>Start Conversation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  photosContainer: {
    height: width * 1.2,
  },
  photo: {
    width: width,
    height: width * 1.2,
    backgroundColor: colors.border,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
