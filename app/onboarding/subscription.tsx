
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { authenticatedGet, authenticatedPost } from '@/utils/api';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface SubscriptionTier {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export default function SubscriptionScreen() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadTiers();
  }, []);

  const loadTiers = async () => {
    try {
      const data = await authenticatedGet('/api/subscription/tiers');
      setTiers(data.tiers || []);
      if (data.tiers?.length > 0) {
        setSelectedTier(data.tiers[0].id);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load subscription tiers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedTier) return;

    setSubscribing(true);
    try {
      await authenticatedPost('/api/subscription', {
        tierId: selectedTier,
      });
      Alert.alert(
        'Success!',
        'Your subscription is active. Welcome to Intentional!',
        [
          {
            text: 'Start Exploring',
            onPress: () => router.replace('/(tabs)/discover'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create subscription');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>Start your intentional dating journey</Text>
        </View>

        {tiers.map((tier) => (
          <TouchableOpacity
            key={tier.id}
            style={[
              styles.tierCard,
              selectedTier === tier.id && styles.tierCardSelected,
            ]}
            onPress={() => setSelectedTier(tier.id)}
          >
            <View style={styles.tierHeader}>
              <Text style={styles.tierName}>{tier.name}</Text>
              <Text style={styles.tierPrice}>{tier.price}</Text>
            </View>
            {tier.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[buttonStyles.primary, subscribing && styles.buttonDisabled]}
          onPress={handleSubscribe}
          disabled={subscribing || !selectedTier}
        >
          {subscribing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={buttonStyles.primaryText}>Continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace('/(tabs)/discover')}
        >
          <Text style={styles.skipText}>Skip for now</Text>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  tierCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tierCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFF5F9',
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  tierPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  skipButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 16,
  },
  skipText: {
    fontSize: 16,
    color: colors.textLight,
  },
});
