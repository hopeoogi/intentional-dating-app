
# Backend Integration Complete ✅

## Overview
The backend API has been successfully integrated into the Intentional Dating App. All endpoints are now connected and functional.

## Backend URL
- **Production URL**: `https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev`
- **Configuration**: Set in `app.json` at `expo.extra.backendUrl`
- **Access**: Available via `BACKEND_URL` constant in `utils/api.ts`

## Authentication Setup ✅

### BetterAuth Integration
- **Email/Password Authentication**: Fully configured
- **Google OAuth**: Web popup flow + native deep linking
- **Apple OAuth**: Web popup flow + native deep linking (iOS only)
- **GitHub OAuth**: Web popup flow + native deep linking

### Auth Files
- `lib/auth.ts` - BetterAuth client configuration
- `contexts/AuthContext.tsx` - Auth provider with hooks
- `app/auth-popup.tsx` - OAuth popup handler (web)
- `app/auth-callback.tsx` - OAuth callback handler (web)
- `app/onboarding/auth.tsx` - Authentication screen
- `app/signin.tsx` - Sign-in screen
- `app/onboarding/signup.tsx` - Sign-up screen

### Token Management
- **Web**: localStorage for session tokens
- **Native**: SecureStore for session tokens
- **API Calls**: Automatic Bearer token injection via `authenticatedApiCall()`

## API Integration Status

### ✅ Profiles API
- **PUT /api/profile** - Create/update user profile (onboarding/profile.tsx)
- **GET /api/profile** - Get current user profile
- **GET /api/profiles/{userId}** - Get user profile by ID (profile/[id].tsx)
- **POST /api/profile/photos** - Upload profile photos (onboarding/media.tsx)
- **POST /api/profile/videos** - Upload profile videos (onboarding/media.tsx)

### ✅ Verification API
- **POST /api/verification/submit** - Submit verification application (onboarding/verification.tsx)
- **GET /api/verification/status** - Get verification status

### ✅ Matching API
- **GET /api/matches** - Get daily match batch ((tabs)/discover.tsx)
- **GET /api/matches/{matchId}** - Get match profile details
- **POST /api/matches/{matchId}/interact** - Record match interaction

### ✅ Conversations API
- **GET /api/conversations** - Get user conversations ((tabs)/conversations.tsx)
- **GET /api/conversations/{conversationId}** - Get conversation details
- **POST /api/conversations** - Create new conversation
- **POST /api/conversations/{conversationId}/snooze** - Snooze conversation (conversation/[id].tsx)
- **POST /api/conversations/{conversationId}/end** - End conversation (conversation/[id].tsx)

### ✅ Messages API
- **GET /api/messages/{conversationId}** - Get conversation messages (conversation/[id].tsx)
- **POST /api/messages** - Send message (conversation/[id].tsx)
- **POST /api/messages/{conversationId}/mark-read** - Mark messages as read (conversation/[id].tsx)
- **GET /api/messages/unread-count** - Get unread message count

### ✅ Subscription API
- **GET /api/subscription/tiers** - Get subscription tiers (onboarding/subscription.tsx)
- **POST /api/subscription** - Create/upgrade subscription (onboarding/subscription.tsx)
- **GET /api/subscription/status** - Get subscription status
- **POST /api/subscription/cancel** - Cancel subscription

### 🔄 Not Yet Integrated (Future Features)
- Admin endpoints (admin dashboard not yet built)
- Block/Report endpoints (moderation features pending)
- Match preferences endpoints (settings screen pending)

## API Utilities

### Core Functions (`utils/api.ts`)
```typescript
// Basic API calls
apiCall(endpoint, options) - Generic API call
apiGet(endpoint) - GET request
apiPost(endpoint, data) - POST request

// Authenticated API calls (auto-includes Bearer token)
authenticatedApiCall(endpoint, options) - Generic authenticated call
authenticatedGet(endpoint) - Authenticated GET
authenticatedPost(endpoint, data) - Authenticated POST
authenticatedPut(endpoint, data) - Authenticated PUT
authenticatedDelete(endpoint) - Authenticated DELETE

// Token management
getBearerToken() - Get stored auth token
isBackendConfigured() - Check if backend URL is set
```

### Usage Example
```typescript
import { authenticatedGet, authenticatedPost } from '@/utils/api';

// Fetch data
const matches = await authenticatedGet('/api/matches');

// Send data
const result = await authenticatedPost('/api/messages', {
  conversationId: '123',
  content: 'Hello!'
});
```

## Error Handling

All API calls include:
- ✅ Try-catch blocks
- ✅ Console logging for debugging
- ✅ User-friendly error alerts
- ✅ Loading states
- ✅ 401/403 authentication error handling

## Onboarding Flow

1. **Welcome Screen** (`app/index.tsx`) - Splash screen
2. **Sign In** (`app/signin.tsx`) - Email/password or OAuth
3. **Sign Up** (`app/onboarding/signup.tsx`) - Create account
4. **Profile** (`app/onboarding/profile.tsx`) - Basic info (name, DOB, sex, location)
5. **Media** (`app/onboarding/media.tsx`) - Upload photos/videos
6. **Verification** (`app/onboarding/verification.tsx`) - Submit verification
7. **Subscription** (`app/onboarding/subscription.tsx`) - Choose plan
8. **Main App** (`app/(tabs)`) - Access full features

## Main App Features

### Home Tab (`app/(tabs)/(home)/index.tsx`)
- Demo cards for testing modals

### Discover Tab (`app/(tabs)/discover.tsx`)
- Daily curated matches
- View profiles
- Start conversations
- **API**: GET /api/matches

### Conversations Tab (`app/(tabs)/conversations.tsx`)
- Active conversations list
- Unread message indicators
- Navigate to conversation details
- **API**: GET /api/conversations

### Profile Tab (`app/(tabs)/profile.tsx`)
- User profile display
- Settings menu
- Sign out functionality

### Conversation Detail (`app/conversation/[id].tsx`)
- Message history
- Send messages (36+ char opener required)
- Snooze conversation
- End conversation
- **API**: GET /api/messages/{id}, POST /api/messages

### Profile Detail (`app/profile/[id].tsx`)
- View match profile
- Photo gallery
- Bio and interests
- Start conversation button
- **API**: GET /api/profiles/{userId}

## Configuration

### Backend URL
The backend URL is configured in `app.json`:
```json
{
  "expo": {
    "extra": {
      "backendUrl": "https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev"
    }
  }
}
```

**IMPORTANT**: Never hardcode the backend URL in code. Always use:
```typescript
import { BACKEND_URL } from '@/utils/api';
```

### Authentication Scheme
- **App Scheme**: `intentional`
- **Storage Prefix**: `intentionaldating`
- **Token Keys**: 
  - `intentionaldating.session-token` (BetterAuth)
  - `intentional-dating_bearer_token` (fallback)

## Testing Checklist

### Authentication
- [x] Email/password sign up
- [x] Email/password sign in
- [x] Google OAuth (web popup)
- [x] Apple OAuth (web popup, iOS only)
- [x] Token storage and retrieval
- [x] Sign out

### Onboarding
- [x] Profile creation with location detection
- [x] Photo/video upload
- [x] Verification submission
- [x] Subscription selection

### Main Features
- [x] Load daily matches
- [x] View match profiles
- [x] Load conversations
- [x] Send messages
- [x] Snooze/end conversations
- [x] Mark messages as read

## Known Issues & Limitations

1. **Subscription Tiers**: If API endpoint fails, falls back to hardcoded tiers
2. **Media Upload**: Currently uploads one file at a time (could be optimized)
3. **Real-time Updates**: Messages don't auto-refresh (requires manual pull-to-refresh)
4. **Admin Features**: Not yet implemented in frontend
5. **Match Preferences**: Settings screen not yet built

## Next Steps

### Recommended Enhancements
1. Add pull-to-refresh on conversations and matches
2. Implement real-time messaging with WebSockets
3. Add push notifications for new messages
4. Build admin dashboard
5. Add match preferences settings screen
6. Implement block/report functionality
7. Add profile editing screen
8. Add photo management screen

### Performance Optimizations
1. Implement pagination for conversations/matches
2. Add image caching
3. Optimize API call frequency
4. Add offline support with local storage

## Dependencies Installed

```json
{
  "better-auth": "^1.1.4",
  "@better-auth/expo": "^1.1.4",
  "expo-secure-store": "~14.0.0",
  "expo-web-browser": "~14.0.1",
  "expo-image-picker": "~16.0.4",
  "expo-location": "~18.0.4",
  "expo-linear-gradient": "^15.0.8",
  "@react-native-community/datetimepicker": "^8.2.0"
}
```

## Support

For issues or questions:
1. Check console logs (all API calls are logged)
2. Verify backend URL in app.json
3. Check authentication token storage
4. Review API documentation for endpoint details

---

**Integration Status**: ✅ COMPLETE
**Last Updated**: 2026-01-03
**Backend Version**: 1.0.0
