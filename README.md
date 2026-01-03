
# Intentional Dating App

A conversation-first dating app built with React Native, Expo 54, and BetterAuth.

## Features

### Core Features
- **Conversation-First Approach**: No swipes or likes - start with meaningful conversations
- **36-Character Minimum Opener**: Ensures genuine interest and reduces spam
- **Daily Match Batches**: Curated matches delivered daily to prevent burnout
- **Manual Verification**: Admin-approved profiles with verified badges
- **Anti-Ghosting Mechanics**: Reply, End Conversation, or Snooze options
- **Inbound Limits**: Max 10 pending conversations to prevent overwhelming users

### Authentication
- Email/password with verification
- Google OAuth
- Apple OAuth (iOS)
- Secure session management with BetterAuth

### User Flow
1. **Sign Up**: Create account with email or social auth
2. **Profile Setup**: Add name, DOB, sex, location, and bio
3. **Media Upload**: Upload 3-6 photos and optional video
4. **Verification**: Submit profile for manual admin review
5. **Subscription**: Choose subscription tier (or skip)
6. **Discover**: View daily matches and start conversations

## Tech Stack

- **Frontend**: React Native + Expo 54
- **Backend**: Fastify + PostgreSQL + Drizzle ORM
- **Authentication**: BetterAuth
- **Deployment**: Specular (Backend), EAS (Mobile)

## Backend API

Backend URL: `https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev`

### Key Endpoints
- `/api/auth/*` - Authentication (BetterAuth)
- `/api/profile` - User profile management
- `/api/matches` - Daily match batches
- `/api/conversations` - Conversation management
- `/api/messages` - Messaging system
- `/api/verification` - Profile verification
- `/api/subscription` - Subscription management
- `/api/admin/*` - Admin panel APIs

## Development

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Building for Production

#### iOS Build
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

#### Android Build
```bash
# Build for Android
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

## Configuration

### Environment Variables
Backend URL is configured in `app.json`:
```json
{
  "expo": {
    "extra": {
      "backendUrl": "https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev"
    }
  }
}
```

### iOS Permissions
Required permissions are configured in `app.json`:
- Camera access (for profile photos)
- Photo library access (for uploading photos)
- Location access (for showing nearby matches)

### Android Permissions
Required permissions are configured in `app.json`:
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION

## Project Structure

```
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Main tab navigation
│   │   ├── discover.tsx   # Daily matches
│   │   ├── conversations.tsx  # Chat list
│   │   └── profile.tsx    # User profile
│   ├── onboarding/        # Onboarding flow
│   │   ├── signup.tsx     # Account creation
│   │   ├── profile.tsx    # Profile setup
│   │   ├── media.tsx      # Photo/video upload
│   │   ├── verification.tsx  # Submit for review
│   │   └── subscription.tsx  # Choose plan
│   ├── conversation/      # Conversation screens
│   │   └── [id].tsx       # Chat screen
│   ├── profile/           # Profile screens
│   │   └── [id].tsx       # View other user's profile
│   ├── welcome.tsx        # Welcome screen
│   ├── signin.tsx         # Sign in screen
│   └── _layout.tsx        # Root layout with auth
├── components/            # Reusable components
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Libraries
│   └── auth.ts            # BetterAuth client
├── utils/                 # Utilities
│   └── api.ts             # API client
├── styles/                # Styles
│   └── commonStyles.ts    # Common styles
└── assets/                # Images, fonts, etc.
```

## Key Features Implementation

### 36-Character Minimum Opener
Enforced in `app/conversation/[id].tsx`:
```typescript
if (messages.length === 0 && newMessage.length < 36) {
  Alert.alert('Opener Too Short', 'Your first message must be at least 36 characters...');
  return;
}
```

### Daily Match Batches
Backend generates daily matches based on:
- Location proximity
- Age preferences
- Interests
- Activity level

### Anti-Ghosting Mechanics
Users must:
- Reply to messages
- End conversation (won't see them again)
- Snooze for 12h/24h

### Inbound Limits
- Max 10 pending conversation requests
- Daily new conversation caps
- "Accepting new chats" toggle

## Troubleshooting

### iOS Build Errors
If you encounter iOS build errors:
1. Ensure Xcode is up to date
2. Clear build cache: `expo prebuild --clean`
3. Check bundle identifier is unique
4. Verify all required permissions are in `app.json`

### Android Build Errors
If you encounter Android build errors:
1. Ensure Android Studio is installed
2. Check Java version (11 or 17)
3. Clear gradle cache: `cd android && ./gradlew clean`

### Backend Connection Issues
If the app can't connect to backend:
1. Check backend URL in `app.json`
2. Verify backend is running: Visit backend URL in browser
3. Check network connectivity
4. Review API logs in console

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend API documentation
3. Check Expo documentation: https://docs.expo.dev

## License

Proprietary - All rights reserved
