
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authenticatedGet } from '@/utils/api';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';

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
      const data = await authenticatedGet('/api/matches');
      console.log('[Discover] Loaded matches:', data);
      
      // Transform the API response to match our interface
      const transformedMatches = (data.matches || []).map((match: any) => ({
        id: match.id || match.userId,
        name: match.name || 'Unknown',
        age: match.age || 0,
        location: match.location || 'Unknown',
        bio: match.bio || '',
        photos: match.photos || [],
        status: match.status || 'unverified',
      }));
      
      setMatches(transformedMatches);
    } catch (error: any) {
      console.error('[Discover] Failed to load matches:', error);
      Alert.alert('Error', error.message || 'Failed to load matches');
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
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today&apos;s Matches</Text>
        <TouchableOpacity onPress={loadDailyMatches}>
          <IconSymbol ios_icon_name="arrow.clockwise" android_material_icon_name="refresh" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {matches.length === 0 ? (
        <View style={commonStyles.centered}>
          <IconSymbol ios_icon_name="heart.slash" android_material_icon_name="favorite-border" size={64} color={colors.textLight} />
          <Text style={styles.emptyTitle}>No Matches Today</Text>
          <Text style={styles.emptyText}>
            Check back tomorrow for new matches!
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {matches.map((match) => (
            <View key={match.id} style={styles.matchCard}>
              <TouchableOpacity
                onPress={() => handleViewProfile(match.id)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: match.photos[0] || 'https://via.placeholder.com/400x500' }}
                  style={styles.matchImage}
                />
                <View style={styles.matchInfo}>
                  <View style={styles.matchHeader}>
                    <Text style={styles.matchName}>{match.name}, {match.age}</Text>
                    {match.status === 'verified' && (
                      <IconSymbol ios_icon_name="checkmark.seal.fill" android_material_icon_name="verified" size={20} color={colors.primary} />
                    )}
                  </View>
                  <View style={styles.locationRow}>
                    <IconSymbol ios_icon_name="location.fill" android_material_icon_name="location-on" size={16} color={colors.textLight} />
                    <Text style={styles.matchLocation}>{match.location}</Text>
                  </View>
                  <Text style={styles.matchBio} numberOfLines={2}>
                    {match.bio}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => handleViewProfile(match.id)}
                >
                  <Text style={styles.viewButtonText}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.messageButton}
                  onPress={() => handleStartConversation(match.id)}
                >
                  <IconSymbol ios_icon_name="paperplane.fill" android_material_icon_name="send" size={18} color="#FFFFFF" />
                  <Text style={styles.messageButtonText}>Start Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollContent: {
    padding: 16,
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  matchImage: {
    width: '100%',
    height: width * 1.2,
  },
  matchInfo: {
    padding: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchLocation: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  matchBio: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  viewButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  messageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
