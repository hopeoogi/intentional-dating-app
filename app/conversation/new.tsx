
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { authenticatedPost, authenticatedGet } from '@/utils/api';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface Match {
  id: string;
  name: string;
  age: number;
  location: string;
}

export default function NewConversationScreen() {
  const { matchId } = useLocalSearchParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (matchId) {
      loadMatch();
    }
  }, [matchId]);

  const loadMatch = async () => {
    try {
      setLoading(true);
      const data = await authenticatedGet(`/api/profiles/${matchId}`);
      setMatch(data);
    } catch (error: any) {
      console.error('Failed to load match:', error);
      Alert.alert('Error', error.message || 'Failed to load match');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (message.trim().length < 36) {
      Alert.alert(
        'Opener Too Short',
        'Your first message must be at least 36 characters to show genuine interest. This helps create meaningful conversations.'
      );
      return;
    }

    try {
      setSending(true);
      console.log('[NewConversation] Creating conversation with:', { matchId, message: message.trim() });
      
      const conversation = await authenticatedPost('/api/conversations', {
        matchId,
        message: message.trim(),
      });
      
      console.log('[NewConversation] Conversation created:', conversation);

      Alert.alert('Success', 'Your conversation has been started!', [
        {
          text: 'OK',
          onPress: () => router.replace(`/conversation/${conversation.id || conversation._id}`),
        },
      ]);
    } catch (error: any) {
      console.error('[NewConversation] Failed to start conversation:', error);
      Alert.alert('Error', error.message || 'Failed to start conversation');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!match) {
    return null;
  }

  const characterCount = message.trim().length;
  const isValid = characterCount >= 36;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Message ${match.name}`,
          headerBackTitle: 'Back',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Start a Meaningful Conversation</Text>
              <Text style={styles.infoText}>
                Your first message to {match.name} must be at least 36 characters. This ensures genuine interest and helps create meaningful connections.
              </Text>
              <View style={styles.matchInfo}>
                <IconSymbol ios_icon_name="person.circle.fill" android_material_icon_name="account-circle" size={24} color={colors.primary} />
                <Text style={styles.matchName}>{match.name}, {match.age}</Text>
              </View>
              <View style={styles.matchLocation}>
                <IconSymbol ios_icon_name="location.fill" android_material_icon_name="location-on" size={18} color={colors.textLight} />
                <Text style={styles.locationText}>{match.location}</Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Opening Message</Text>
              <TextInput
                style={styles.input}
                placeholder="Write a thoughtful message..."
                placeholderTextColor={colors.textLight}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={500}
              />
              <View style={styles.characterCount}>
                <Text style={[
                  styles.countText,
                  isValid ? styles.countValid : styles.countInvalid
                ]}>
                  {characterCount} / 36 minimum
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!isValid || sending) && styles.sendButtonDisabled
              ]}
              onPress={handleSend}
              disabled={!isValid || sending}
            >
              {sending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.sendButtonText}>Send Message</Text>
                  <IconSymbol ios_icon_name="paperplane.fill" android_material_icon_name="send" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
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
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  infoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  matchLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 150,
  },
  characterCount: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  countText: {
    fontSize: 14,
    fontWeight: '500',
  },
  countValid: {
    color: colors.success,
  },
  countInvalid: {
    color: colors.textLight,
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
  sendButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
