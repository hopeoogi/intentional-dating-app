
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as ImagePicker from 'expo-image-picker';
import { BACKEND_URL, getBearerToken } from '@/utils/api';

interface MediaItem {
  uri: string;
  type: 'photo' | 'video';
}

export default function MediaScreen() {
  const router = useRouter();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setMedia([
        ...media,
        {
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'photo',
        },
      ]);
    }
  }, [media]);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setMedia([
        ...media,
        {
          uri: result.assets[0].uri,
          type: 'photo',
        },
      ]);
    }
  }, [media]);

  const removeMedia = useCallback((index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  }, [media]);

  const handleContinue = useCallback(async () => {
    if (media.length < 2) {
      Alert.alert('More Photos Needed', 'Please upload at least 2 photos or videos to continue');
      return;
    }

    try {
      setLoading(true);
      console.log('[Media] Uploading media files:', media.length);

      // TODO: Backend Integration - Upload each media file to the backend API
      for (const item of media) {
        const formData = new FormData();
        
        // Create file object from URI
        const filename = item.uri.split('/').pop() || 'media';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `${item.type}/${match[1]}` : item.type;

        formData.append('file', {
          uri: item.uri,
          name: filename,
          type,
        } as any);

        const endpoint = item.type === 'photo' ? '/api/profile/photos' : '/api/profile/videos';
        
        const response = await fetch(`${BACKEND_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await getBearerToken()}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[Media] Failed to upload ${item.type}:`, response.status, errorText);
          throw new Error(`Failed to upload ${item.type}`);
        }

        const result = await response.json();
        console.log(`[Media] ${item.type} uploaded successfully:`, result);
      }

      console.log('[Media] All media uploaded successfully');
      router.push('/onboarding/verification');
    } catch (error) {
      console.error('[Media] Media upload error:', error);
      Alert.alert('Upload Failed', 'Failed to upload media. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [media, router]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/96e0c1f0-fcef-4b76-b942-74280a3296cb.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={commonStyles.title}>Add Photos & Videos</Text>
          <Text style={commonStyles.subtitle}>
            Upload at least 2 photos or videos. Quality matters!
          </Text>
          <Text style={styles.stepText}>Step 2 of 4</Text>
        </View>

        <View style={styles.mediaGrid}>
          {media.map((item, index) => (
            <View key={index} style={styles.mediaItem}>
              <Image source={{ uri: item.uri }} style={styles.mediaImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeMedia(index)}
              >
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
              {item.type === 'video' && (
                <View style={styles.videoIndicator}>
                  <IconSymbol
                    ios_icon_name="play.circle.fill"
                    android_material_icon_name="play-circle-filled"
                    size={32}
                    color="#FFFFFF"
                  />
                </View>
              )}
            </View>
          ))}

          {media.length < 6 && (
            <TouchableOpacity style={styles.addButton} onPress={pickImage}>
              <IconSymbol
                ios_icon_name="plus"
                android_material_icon_name="add"
                size={32}
                color={colors.primary}
              />
              <Text style={styles.addButtonText}>Add Media</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
            <IconSymbol
              ios_icon_name="camera.fill"
              android_material_icon_name="camera"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.actionButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <IconSymbol
              ios_icon_name="photo.fill"
              android_material_icon_name="photo"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.actionButtonText}>Choose from Library</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.requirements}>
          <Text style={styles.requirementsTitle}>Photo Requirements:</Text>
          <Text style={styles.requirementItem}>• Clear face photos</Text>
          <Text style={styles.requirementItem}>• No group photos as primary</Text>
          <Text style={styles.requirementItem}>• No filters or heavy editing</Text>
          <Text style={styles.requirementItem}>• Recent photos only</Text>
        </View>

        <TouchableOpacity
          style={[
            buttonStyles.primary,
            (loading || media.length < 2) && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={loading || media.length < 2}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={commonStyles.buttonText}>
              Continue ({media.length}/6)
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  headerLogo: {
    width: 50,
    height: 50,
    marginBottom: 16,
  },
  stepText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 8,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  mediaItem: {
    width: '48%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 14,
  },
  videoIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  addButton: {
    width: '48%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  addButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  requirements: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
