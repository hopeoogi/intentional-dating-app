
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

const { width } = Dimensions.get('window');

interface Match {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  photos: string[];
  status: string;
}

export default function DiscoverScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyMatches();
  }, []);

  const loadDailyMatches = async () => {
    try {
      setLoading(true);
      // TODO: Backend Integration - Fetch daily matches from API
      // Mock data for now
      const mockMatches: Match[] = [
        {
          id: '1',
          name: 'Sarah',
          age: 28,
          location: 'San Francisco, CA',
          bio: 'Product designer who loves hiking and trying new restaurants. Looking for someone who values deep conversations and shared adventures.',
          photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'],
          status: 'Verified Professional',
        },
        {
          id: '2',
          name: 'Alex',
          age: 30,
          location: 'San Francisco, CA',
          bio: 'Software engineer and coffee enthusiast. Passionate about building meaningful connections and exploring the city.',
          photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
          status: 'Entrepreneur',
        },
      ];
      setMatches(mockMatches);
    } catch (error) {
      console.error('Failed to load matches:', error);
      Alert.alert('Error', 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (matchId: string) => {
    router.push(`/profile/${matchId}`);
  };

  const handleStartConversation = (matchId: string) => {
    router.push(`/conversation/${matchId}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.text}>Loading your daily matches...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Today&apos;s Matches</Text>
        <Text style={commonStyles.textSecondary}>
          {matches.length} curated matches for you
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {matches.map((match) => (
          <View key={match.id} style={styles.matchCard}>
            <Image source={{ uri: match.photos[0] }} style={styles.matchImage} />
            <View style={styles.matchInfo}>
              <View style={styles.matchHeader}>
                <View>
                  <Text style={styles.matchName}>
                    {match.name}, {match.age}
                  </Text>
                  <Text style={styles.matchLocation}>{match.location}</Text>
                </View>
                <View style={commonStyles.badge}>
                  <Text style={commonStyles.badgeText}>{match.status}</Text>
                </View>
              </View>
              <Text style={styles.matchBio} numberOfLines={3}>
                {match.bio}
              </Text>
              <View style={styles.matchActions}>
                <TouchableOpacity
                  style={styles.actionButtonSecondary}
                  onPress={() => handleViewProfile(match.id)}
                >
                  <Text style={styles.actionButtonSecondaryText}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButtonPrimary}
                  onPress={() => handleStartConversation(match.id)}
                >
                  <IconSymbol
                    ios_icon_name="message.fill"
                    android_material_icon_name="message"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.actionButtonPrimaryText}>Start Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {matches.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="heart"
              android_material_icon_name="favorite-border"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyTitle}>No matches today</Text>
            <Text style={styles.emptyText}>
              Check back tomorrow for new curated matches!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  matchCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  matchImage: {
    width: '100%',
    height: width - 40,
    backgroundColor: colors.border,
  },
  matchInfo: {
    padding: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  matchName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  matchLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  matchBio: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  matchActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  actionButtonPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonPrimaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
