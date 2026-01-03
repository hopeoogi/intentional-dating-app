
import React, { useState, useEffect } from 'react';
import { colors, commonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authenticatedGet } from '@/utils/api';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
    photo: string;
  };
  lastMessage: {
    text: string;
    timestamp: Date;
    isRead: boolean;
  };
  status: 'active' | 'snoozed' | 'ended';
}

export default function ConversationsScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await authenticatedGet('/api/conversations');
      setConversations(response.conversations || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      Alert.alert('Error', 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleConversationPress = (conversationId: string) => {
    router.push(`/conversation/${conversationId}`);
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item.id)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.otherUser.name[0]}</Text>
      </View>
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.userName}>{item.otherUser.name}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.lastMessage.timestamp).toLocaleDateString()}
          </Text>
        </View>
        <Text
          style={[
            styles.lastMessage,
            !item.lastMessage.isRead && styles.unreadMessage,
          ]}
          numberOfLines={1}
        >
          {item.lastMessage.text}
        </Text>
        {item.status === 'snoozed' && (
          <View style={styles.statusBadge}>
            <IconSymbol name="moon.fill" size={12} color={colors.textSecondary} />
            <Text style={styles.statusText}>Snoozed</Text>
          </View>
        )}
      </View>
      {!item.lastMessage.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Conversations</Text>
        <Text style={styles.headerSubtitle}>{conversations.length} active</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="message.fill" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptySubtitle}>
            Start a conversation with your daily matches
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  listContent: {
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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
    textAlign: 'center',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  lastMessage: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  unreadMessage: {
    fontWeight: '600',
    color: colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
});
