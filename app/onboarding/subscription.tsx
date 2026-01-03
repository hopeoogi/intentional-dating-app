
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { authenticatedGet, authenticatedPost } from '@/utils/api';

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [tiers, setTiers] = useState<any[]>([]);

  useEffect(() => {
    loadSubscriptionTiers();
  }, []);

  const loadSubscriptionTiers = async () => {
    try {
      console.log('[Subscription] Fetching subscription tiers');
      const response = await authenticatedGet('/api/subscription/tiers');
      console.log('[Subscription] Tiers fetched:', response);
      
      if (response.tiers && response.tiers.length > 0) {
        setTiers(response.tiers);
        setSelectedPlan(response.tiers[0].id);
      }
    } catch (error) {
      console.error('[Subscription] Failed to load tiers:', error);
    }
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$29.99',
      period: '/month',
      features: ['Unlimited daily matches', 'Unlimited conversations', 'Priority support'],
    },
    {
      id: 'annual',
      name: 'Annual',
      price: '$199.99',
      period: '/year',
      savings: 'Save 44%',
      features: [
        'Unlimited daily matches',
        'Unlimited conversations',
        'Priority support',
        'Exclusive events access',
      ],
    },
  ];

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      console.log('[Subscription] Processing subscription:', selectedPlan);

      const subscriptionData = {
        tierId: selectedPlan,
        // In a real app, you would integrate with Apple/Google IAP here
        // and pass the receipt/purchase token
      };

      const response = await authenticatedPost('/api/subscription', subscriptionData);
      console.log('[Subscription] Subscription created:', response);

      Alert.alert('Success', 'Welcome to Intentional!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (error) {
      console.error('[Subscription] Subscription error:', error);
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Choose Your Plan</Text>
          <Text style={commonStyles.subtitle}>
            Join our intentional community and start meaningful connections
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {(tiers.length > 0 ? tiers : plans).map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.savings && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>{plan.savings}</Text>
                </View>
              )}
              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
              </View>
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <IconSymbol
                      ios_icon_name="checkmark.circle.fill"
                      android_material_icon_name="check-circle"
                      size={20}
                      color={colors.success}
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>What you get:</Text>
          <View style={styles.benefitItem}>
            <IconSymbol
              ios_icon_name="heart.fill"
              android_material_icon_name="favorite"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.benefitText}>
              Curated daily matches based on compatibility
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <IconSymbol
              ios_icon_name="message.fill"
              android_material_icon_name="message"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.benefitText}>
              Conversation-first approach (no mindless swiping)
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <IconSymbol
              ios_icon_name="shield.fill"
              android_material_icon_name="verified-user"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.benefitText}>
              Verified community with manual approval
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.benefitText}>
              Premium experience designed for intentional dating
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[buttonStyles.primary, loading && styles.buttonDisabled]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          <Text style={commonStyles.buttonText}>
            {loading ? 'Processing...' : 'Subscribe Now'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By subscribing, you agree to our Terms of Service. Subscription automatically
          renews unless cancelled 24 hours before the end of the current period.
        </Text>
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
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 32,
  },
  plansContainer: {
    marginBottom: 32,
    gap: 16,
  },
  planCard: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  savingsBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  featuresContainer: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
  },
  benefitsContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
