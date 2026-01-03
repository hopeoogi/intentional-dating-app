
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { authenticatedGet } from '@/utils/api';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
    photo: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
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
      const data = await authenticatedGet('/api/conversations');
      setConversations(data.conversations || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => router.push(`/conversation/${item.id}`)}
    >
      <Image
        source={{ uri: item.otherUser.photo || 'https://via.placeholder.com/60' }}
        style={styles.avatar}
      />
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.otherUser.name}</Text>
          <Text style={styles.conversationTime}>
            {new Date(item.lastMessage.timestamp).toLocaleDateString()}
          </Text>
        </View>
        <Text
          style={[
            styles.conversationMessage,
            !item.lastMessage.isRead && styles.conversationMessageUnread,
          ]}
          numberOfLines={1}
        >
          {item.lastMessage.text}
        </Text>
      </View>
      {!item.lastMessage.isRead && <View style={styles.unreadBadge} />}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversations</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="message" size={64} color={colors.textLight} />
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>Start chatting with your matches!</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 8,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  conversationTime: {
    fontSize: 14,
    color: colors.textLight,
  },
  conversationMessage: {
    fontSize: 16,
    color: colors.textLight,
  },
  conversationMessageUnread: {
    fontWeight: '600',
    color: colors.text,
  },
  unreadBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
});
