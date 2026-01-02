
import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  isOpener?: boolean;
}

export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
  }, [id]);

  const loadMessages = async () => {
    try {
      // TODO: Backend Integration - Fetch conversation messages from API
      // Mock data for now
      const mockMessages: Message[] = [
        {
          id: '1',
          text: 'Hi! I noticed you love hiking too. What are your favorite trails in the Bay Area?',
          senderId: 'other',
          timestamp: new Date(Date.now() - 3600000),
          isOpener: true,
        },
      ];
      setMessages(mockMessages);
      setIsFirstMessage(mockMessages.length === 0);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) {
      return;
    }

    if (isFirstMessage && inputText.length < 36) {
      Alert.alert(
        'Opener Too Short',
        'Your first message must be at least 36 characters to show genuine interest and start a meaningful conversation.'
      );
      return;
    }

    try {
      setLoading(true);
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        senderId: 'me',
        timestamp: new Date(),
        isOpener: isFirstMessage,
      };

      // TODO: Backend Integration - Send message to API
      setMessages([...messages, newMessage]);
      setInputText('');
      setIsFirstMessage(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setLoading(false);
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
            // TODO: Backend Integration - End conversation via API
            router.back();
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
          text: '12 hours',
          onPress: async () => {
            // TODO: Backend Integration - Snooze conversation for 12 hours
            Alert.alert('Snoozed', 'Conversation snoozed for 12 hours');
            router.back();
          },
        },
        {
          text: '24 hours',
          onPress: async () => {
            // TODO: Backend Integration - Snooze conversation for 24 hours
            Alert.alert('Snoozed', 'Conversation snoozed for 24 hours');
            router.back();
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
          isMe ? styles.messageContainerMe : styles.messageContainerOther,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
          ]}
        >
          {item.isOpener && (
            <View style={styles.openerBadge}>
              <Text style={styles.openerBadgeText}>Opener</Text>
            </View>
          )}
          <Text
            style={[
              styles.messageText,
              isMe ? styles.messageTextMe : styles.messageTextOther,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isMe ? styles.messageTimeMe : styles.messageTimeOther,
            ]}
          >
            {item.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
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
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isFirstMessage && (
          <View style={styles.openerHint}>
            <IconSymbol
              ios_icon_name="info.circle"
              android_material_icon_name="info"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.openerHintText}>
              First message must be at least 36 characters to show genuine interest
            </Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={
                isFirstMessage
                  ? 'Write a thoughtful opener (36+ chars)...'
                  : 'Type a message...'
              }
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || loading}
            >
              <IconSymbol
                ios_icon_name="arrow.up.circle.fill"
                android_material_icon_name="send"
                size={32}
                color={inputText.trim() ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSnooze}>
              <IconSymbol
                ios_icon_name="clock"
                android_material_icon_name="schedule"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={styles.actionButtonText}>Snooze</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleEndConversation}>
              <IconSymbol
                ios_icon_name="xmark.circle"
                android_material_icon_name="cancel"
                size={20}
                color={colors.error}
              />
              <Text style={[styles.actionButtonText, { color: colors.error }]}>
                End Conversation
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  messageContainerMe: {
    alignSelf: 'flex-end',
  },
  messageContainerOther: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  messageBubbleMe: {
    backgroundColor: colors.primary,
  },
  messageBubbleOther: {
    backgroundColor: colors.card,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextMe: {
    color: '#FFFFFF',
  },
  messageTextOther: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  messageTimeMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  messageTimeOther: {
    color: colors.textSecondary,
  },
  openerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  openerBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  openerHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  openerHintText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  inputContainer: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
