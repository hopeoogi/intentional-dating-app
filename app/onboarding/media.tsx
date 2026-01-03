
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BACKEND_URL, getBearerToken } from '@/utils/api';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface MediaItem {
  uri: string;
  type: 'photo' | 'video';
}

export default function MediaScreen() {
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickMedia = async () => {
    if (photos.length >= 6) {
      Alert.alert('Limit Reached', 'You can upload up to 6 photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPhotos([...photos, {
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'photo',
      }]);
    }
  };

  const removeMedia = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleContinue = async () => {
    if (photos.length < 3) {
      Alert.alert('More Photos Needed', 'Please upload at least 3 photos');
      return;
    }

    setLoading(true);
    try {
      const token = await getBearerToken();
      
      for (const media of photos) {
        const formData = new FormData();
        formData.append('file', {
          uri: media.uri,
          type: media.type === 'video' ? 'video/mp4' : 'image/jpeg',
          name: `${media.type}.${media.type === 'video' ? 'mp4' : 'jpg'}`,
        } as any);

        const endpoint = media.type === 'video' ? '/api/profile/videos' : '/api/profile/photos';
        
        await fetch(`${BACKEND_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }

      router.push('/onboarding/verification');
    } catch (error: any) {
      Alert.alert('Upload Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Photos & Video</Text>
          <Text style={styles.subtitle}>Upload at least 3 photos (max 6)</Text>
        </View>

        <View style={styles.grid}>
          {photos.map((media, index) => (
            <View key={index} style={styles.mediaItem}>
              <Image source={{ uri: media.uri }} style={styles.mediaImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeMedia(index)}
              >
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={24}
                  color="#FF3B30"
                />
              </TouchableOpacity>
              {media.type === 'video' && (
                <View style={styles.videoBadge}>
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

          {photos.length < 6 && (
            <TouchableOpacity style={styles.addButton} onPress={pickMedia}>
              <IconSymbol
                ios_icon_name="plus.circle.fill"
                android_material_icon_name="add-circle"
                size={48}
                color={colors.primary}
              />
              <Text style={styles.addButtonText}>Add Photo/Video</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[buttonStyles.primary, (loading || photos.length < 3) && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={loading || photos.length < 3}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={buttonStyles.primaryText}>Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  mediaItem: {
    width: '48%',
    aspectRatio: 4 / 5,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  videoBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  addButton: {
    width: '48%',
    aspectRatio: 4 / 5,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  addButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textLight,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
