
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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authenticatedGet, authenticatedPost } from '@/utils/api';

interface SubscriptionTier {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export default function SubscriptionScreen() {
  const router = useRouter();
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubscriptionTiers();
  }, []);

  const loadSubscriptionTiers = async () => {
    try {
      const data = await authenticatedGet('/api/subscription/tiers');
      setTiers(data.tiers || data);
    } catch (error) {
      console.error('Failed to load tiers:', error);
      // Set default tiers if API fails
      setTiers([
        {
          id: 'basic',
          name: 'Basic',
          price: '$9.99/month',
          features: ['5 daily matches', '3 new conversations/day', 'Basic profile'],
        },
        {
          id: 'premium',
          name: 'Premium',
          price: '$19.99/month',
          features: ['10 daily matches', '10 new conversations/day', 'Priority support', 'Verified badge'],
        },
      ]);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedTier) {
      Alert.alert('Error', 'Please select a subscription plan');
      return;
    }

    try {
      setLoading(true);
      await authenticatedPost('/api/subscription', {
        tierId: selectedTier,
      });

      Alert.alert(
        'Welcome to Intentional!',
        'Your subscription is active. Start discovering meaningful connections!',
        [{ text: 'Get Started', onPress: () => router.replace('/(tabs)/(home)') }]
      );
    } catch (error: any) {
      Alert.alert('Subscription Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>Select a subscription to activate your account</Text>
        </View>

        <View style={styles.tiersContainer}>
          {tiers.map((tier) => (
            <TouchableOpacity
              key={tier.id}
              style={[
                styles.tierCard,
                selectedTier === tier.id && styles.tierCardSelected,
              ]}
              onPress={() => setSelectedTier(tier.id)}
              disabled={loading}
            >
              <Text style={styles.tierName}>{tier.name}</Text>
              <Text style={styles.tierPrice}>{tier.price}</Text>
              <View style={styles.featuresContainer}>
                {tier.features.map((feature, index) => (
                  <Text key={index} style={styles.feature}>
                    ✓ {feature}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, (loading || !selectedTier) && styles.buttonDisabled]}
          onPress={handleSubscribe}
          disabled={loading || !selectedTier}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Subscribe & Activate</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  tiersContainer: {
    marginBottom: 32,
  },
  tierCard: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  tierCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tierPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 16,
  },
  featuresContainer: {
    marginTop: 8,
  },
  feature: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
