
import React, { useState, useEffect } from 'react';
import { colors, commonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authenticatedGet } from '@/utils/api';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
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

const { width } = Dimensions.get('window');

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
      const response = await authenticatedGet('/api/matches/daily');
      setMatches(response.matches || []);
    } catch (error) {
      console.error('Failed to load matches:', error);
      Alert.alert('Error', 'Failed to load daily matches');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (matchId: string) => {
    router.push(`/profile/${matchId}`);
  };

  const handleStartConversation = (matchId: string) => {
    router.push(`/conversation/new?matchId=${matchId}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={[commonStyles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Matches</Text>
        <Text style={styles.headerSubtitle}>{matches.length} intentional connections</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {matches.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="heart.fill" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No matches today</Text>
            <Text style={styles.emptySubtitle}>Check back tomorrow for new connections</Text>
          </View>
        ) : (
          matches.map((match) => (
            <View key={match.id} style={styles.matchCard}>
              <Image
                source={{ uri: match.photos[0] || 'https://via.placeholder.com/400' }}
                style={styles.matchImage}
                resizeMode="cover"
              />
              <View style={styles.matchInfo}>
                <View style={styles.matchHeader}>
                  <Text style={styles.matchName}>{match.name}, {match.age}</Text>
                  {match.status && (
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{match.status}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.matchLocation}>{match.location}</Text>
                <Text style={styles.matchBio} numberOfLines={3}>{match.bio}</Text>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.viewProfileButton}
                    onPress={() => handleViewProfile(match.id)}
                  >
                    <Text style={styles.viewProfileText}>View Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.startChatButton}
                    onPress={() => handleStartConversation(match.id)}
                  >
                    <IconSymbol name="message.fill" size={20} color="#fff" />
                    <Text style={styles.startChatText}>Start Conversation</Text>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  matchCard: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: colors.card,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  matchImage: {
    width: '100%',
    height: width - 32,
  },
  matchInfo: {
    padding: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  matchName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statusBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  matchLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  matchBio: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  viewProfileButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  viewProfileText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  startChatButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startChatText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
