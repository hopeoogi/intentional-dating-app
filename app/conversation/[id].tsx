
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { authenticatedGet, authenticatedPost } from '@/utils/api';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  isOpener?: boolean;
}

export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      loadMessages();
    }
  }, [id]);

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authenticatedGet(`/api/messages/${id}`);
      console.log('[Conversation] Loaded messages:', data);
      
      // Transform the API response to match our interface
      const formattedMessages = (data.messages || []).map((msg: any) => ({
        id: msg.id || msg._id || Date.now().toString(),
        text: msg.text || msg.content || '',
        senderId: msg.senderId || msg.sender || 'unknown',
        timestamp: new Date(msg.timestamp || msg.createdAt || Date.now()),
        isOpener: msg.isOpener || false,
      }));
      
      setMessages(formattedMessages);
      
      // Mark messages as read
      try {
        await authenticatedPost(`/api/messages/${id}/mark-read`, {});
      } catch (markReadError) {
        console.error('[Conversation] Failed to mark messages as read:', markReadError);
      }
    } catch (error: any) {
      console.error('[Conversation] Failed to load messages:', error);
      Alert.alert('Error', error.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleSend = async () => {
    const trimmedMessage = newMessage.trim();

    // Check if this is the first message (opener)
    if (messages.length === 0 && trimmedMessage.length < 36) {
      Alert.alert(
        'Opener Too Short',
        'Your first message must be at least 36 characters to show genuine interest. This helps create meaningful conversations.'
      );
      return;
    }

    if (trimmedMessage.length === 0) {
      return;
    }

    try {
      setSending(true);
      console.log('[Conversation] Sending message:', { conversationId: id, text: trimmedMessage });
      
      const response = await authenticatedPost('/api/messages', {
        conversationId: id,
        text: trimmedMessage,
      });
      
      console.log('[Conversation] Message sent:', response);

      const newMsg: Message = {
        id: response.id || response._id || Date.now().toString(),
        text: trimmedMessage,
        senderId: 'me',
        timestamp: new Date(response.timestamp || response.createdAt || Date.now()),
        isOpener: messages.length === 0,
      };

      setMessages([...messages, newMsg]);
      setNewMessage('');

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      console.error('[Conversation] Failed to send message:', error);
      Alert.alert('Error', error.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleEndConversation = () => {
    Alert.alert(
      'End Conversation',
      'Are you sure you want to end this conversation? You won&apos;t see this person again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('[Conversation] Ending conversation:', id);
              await authenticatedPost(`/api/conversations/${id}/end`, {});
              console.log('[Conversation] Conversation ended successfully');
              Alert.alert('Success', 'Conversation ended', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error: any) {
              console.error('[Conversation] Failed to end conversation:', error);
              Alert.alert('Error', error.message || 'Failed to end conversation');
            }
          },
        },
      ]
    );
  };

  const handleSnooze = () => {
    Alert.alert(
      'Snooze Conversation',
      'How long would you like to snooze this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '12 Hours',
          onPress: async () => {
            try {
              console.log('[Conversation] Snoozing conversation for 12 hours:', id);
              await authenticatedPost(`/api/conversations/${id}/snooze`, {
                duration: 12,
              });
              console.log('[Conversation] Conversation snoozed successfully');
              Alert.alert('Success', 'Conversation snoozed for 12 hours', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error: any) {
              console.error('[Conversation] Failed to snooze conversation:', error);
              Alert.alert('Error', error.message || 'Failed to snooze conversation');
            }
          },
        },
        {
          text: '24 Hours',
          onPress: async () => {
            try {
              console.log('[Conversation] Snoozing conversation for 24 hours:', id);
              await authenticatedPost(`/api/conversations/${id}/snooze`, {
                duration: 24,
              });
              console.log('[Conversation] Conversation snoozed successfully');
              Alert.alert('Success', 'Conversation snoozed for 24 hours', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error: any) {
              console.error('[Conversation] Failed to snooze conversation:', error);
              Alert.alert('Error', error.message || 'Failed to snooze conversation');
            }
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === 'me';
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={[styles.messageText, isMe && styles.myMessageText]}>
          {item.text}
        </Text>
        <Text style={[styles.timestamp, isMe && styles.myTimestamp]}>
          {item.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const characterCount = newMessage.trim().length;
  const isFirstMessage = messages.length === 0;
  const showCharacterCount = isFirstMessage && characterCount < 36;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Conversation',
          headerBackTitle: 'Back',
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={handleSnooze} style={styles.headerButton}>
                <IconSymbol ios_icon_name="moon.fill" android_material_icon_name="notifications-off" size={22} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEndConversation} style={styles.headerButton}>
                <IconSymbol ios_icon_name="xmark.circle.fill" android_material_icon_name="cancel" size={22} color={colors.error} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          <View style={styles.inputContainer}>
            {showCharacterCount && (
              <View style={styles.characterCountBanner}>
                <Text style={styles.characterCountText}>
                  First message: {characterCount} / 36 characters minimum
                </Text>
              </View>
            )}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder={
                  isFirstMessage
                    ? 'Write a thoughtful opener (36+ chars)...'
                    : 'Type a message...'
                }
                placeholderTextColor={colors.textLight}
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (sending || newMessage.trim().length === 0) &&
                    styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={sending || newMessage.trim().length === 0}
              >
                {sending ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <IconSymbol ios_icon_name="paperplane.fill" android_material_icon_name="send" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  headerButton: {
    marginLeft: 16,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '75%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  myTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  characterCountBanner: {
    backgroundColor: '#FFF3CD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE69C',
  },
  characterCountText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
});
