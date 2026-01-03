
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#FF6B9D',
  secondary: '#4ECDC4',
  background: '#FFFFFF',
  backgroundDark: '#1A1A1A',
  text: '#333333',
  textLight: '#666666',
  textSecondary: '#999999',
  textDark: '#FFFFFF',
  border: '#E0E0E0',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  card: '#F8F8F8',
  cardDark: '#2C2C2C',
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
