
import React, { useState, useEffect } from 'react';
import { colors, commonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { authenticatedGet } from '@/utils/api';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';

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
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadDailyMatches();
  }, []);

  const loadDailyMatches = async () => {
    try {
      setLoading(true);
      // TODO: Backend Integration - Fetch daily matches from the backend API
      const response = await authenticatedGet('/api/matches/daily');
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
      Alert.alert('Error', 'Failed to load daily matches');
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today&apos;s Matches</Text>
        <Text style={styles.headerSubtitle}>
          {matches.length} intentional connections
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading matches...</Text>
          </View>
        ) : matches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol 
              ios_icon_name="heart.slash" 
              android_material_icon_name="heart-broken" 
              size={64} 
              color={colors.textSecondary} 
            />
            <Text style={styles.emptyText}>No matches today</Text>
            <Text style={styles.emptySubtext}>
              Check back tomorrow for new connections
            </Text>
          </View>
        ) : (
          matches.map((match, index) => (
            <View key={index} style={styles.matchCard}>
              <Image
                source={{ uri: match.photos[0] || 'https://via.placeholder.com/400' }}
                style={styles.matchImage}
              />
              <View style={styles.matchInfo}>
                <View style={styles.matchHeader}>
                  <Text style={styles.matchName}>
                    {match.name}, {match.age}
                  </Text>
                  {match.status && (
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{match.status}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.matchLocation}>{match.location}</Text>
                <Text style={styles.matchBio} numberOfLines={3}>
                  {match.bio}
                </Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => handleViewProfile(match.id)}
                  >
                    <Text style={styles.secondaryButtonText}>View Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => handleStartConversation(match.id)}
                  >
                    <Text style={styles.primaryButtonText}>Start Chat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...commonStyles.title,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...commonStyles.subtitle,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    ...commonStyles.body,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    ...commonStyles.title,
    marginTop: 16,
  },
  emptySubtext: {
    ...commonStyles.subtitle,
    marginTop: 8,
  },
  matchCard: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...commonStyles.shadow,
  },
  matchImage: {
    width: '100%',
    height: Dimensions.get('window').width - 32,
    backgroundColor: colors.border,
  },
  matchInfo: {
    padding: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchName: {
    ...commonStyles.title,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  matchLocation: {
    ...commonStyles.subtitle,
    marginBottom: 12,
  },
  matchBio: {
    ...commonStyles.body,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
