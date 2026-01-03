
# 🌟 Intentional Dating App

A conversation-first dating app that prioritizes meaningful connections over endless swiping.

## ✨ Key Features

### 🎯 Intentional Matching
- **No Swipes, No Likes** - Conversation-first approach
- **Daily Match Batches** - Curated matches delivered daily
- **36-Character Minimum Opener** - Ensures thoughtful first messages
- **Limited New Conversations** - Prevents burnout and promotes quality

### 🔐 Verified Community
- **Manual Approval Process** - Every user is reviewed
- **Status Badges** - Verified community members
- **Photo & Video Requirements** - Authentic profiles only
- **Quality Checks** - Ensures high-quality media

### 💬 Anti-Ghosting Mechanics
- **Reply, End, or Snooze** - Close the loop on every conversation
- **No Ghosting** - Users must respond or end conversations
- **Snooze Option** - Reply later without pressure
- **Conversation Limits** - Prevents overwhelming message floods

### 🛡️ Safety & Moderation
- **Block & Report** - User safety tools
- **Admin Panel** - Manual review and moderation
- **Inbound Controls** - Limit new conversation requests
- **Pending Requests Inbox** - Manage incoming messages

### 💎 Premium Experience
- **Subscription-Based** - After approval, activate with IAP
- **Referral Code Bypass** - Invite-only access option
- **Multiple Tiers** - Different feature levels

---

## 🚀 Deployment

This app is ready to deploy to iOS App Store and Google Play Store using Expo Application Services (EAS).

### Quick Start

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Initialize Project**
   ```bash
   npm run eas:init
   ```

4. **Build & Deploy**
   ```bash
   # Preview build (testing)
   npm run eas:build:preview
   
   # Production build
   npm run eas:build:prod
   
   # Submit to stores
   npm run eas:submit:ios
   npm run eas:submit:android
   ```

### 📚 Deployment Documentation

- **[Complete Deployment Guide](DEPLOYMENT_GUIDE.md)** - Step-by-step instructions
- **[Pre-Deployment Checklist](PRE_DEPLOYMENT_CHECK.md)** - Verify everything is ready
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Track your progress

---

## 🏗️ Architecture

### Frontend
- **React Native** with Expo SDK 54
- **Expo Router** for file-based navigation
- **BetterAuth** for authentication (email, Google, Apple)
- **TypeScript** for type safety

### Backend
- **Building at:** `https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev`
- **Features:**
  - User authentication & OAuth
  - Profile management
  - Photo/video upload
  - Verification system
  - Admin approval workflow
  - Subscription/payment handling
  - Daily matching algorithm
  - Conversation system
  - Blocking & reporting
  - Admin panel

---

## 📱 App Structure

### Onboarding Flow
1. **Signup** - Email/phone verification
2. **Profile Creation** - Basic info (name, DOB, location)
3. **Media Upload** - Photos & videos with quality checks
4. **Verification** - Status badges & proof submission
5. **Pending Approval** - Manual admin review
6. **Subscription** - IAP activation after approval

### Main App
- **Discover Tab** - Daily matches with profile viewer
- **Conversations Tab** - Active, snoozed, and ended chats
- **Profile Tab** - User settings and account management

### Conversation Mechanics
- **36-Character Minimum** - Thoughtful openers required
- **Reply** - Continue the conversation
- **End Conversation** - Close gracefully (won't see again)
- **Snooze** - Reply later (12h or 24h)

---

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Setup
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

### Project Structure
```
intentional-dating/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Main app tabs
│   ├── onboarding/        # Onboarding flow
│   ├── conversation/      # Chat screens
│   └── profile/           # Profile screens
├── components/            # Reusable components
├── contexts/              # React contexts (Auth, etc.)
├── lib/                   # Libraries (auth client)
├── styles/                # Common styles
├── utils/                 # Utilities (API, error logging)
├── app.json               # Expo configuration
├── eas.json               # EAS Build configuration
└── package.json           # Dependencies & scripts
```

---

## 🔧 Configuration

### Environment Variables
The backend URL is configured in `app.json`:
```json
"extra": {
  "backendUrl": "https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev"
}
```

### Bundle Identifiers
- **iOS:** `com.intentionaldating.app`
- **Android:** `com.intentionaldating.app`

### Permissions
- Camera (profile photos/videos)
- Photo Library (upload media)
- Microphone (video recording)

---

## 📦 Available Scripts

### Development
- `npm run dev` - Start development server with tunnel
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser

### Building
- `npm run eas:build:dev` - Development build
- `npm run eas:build:preview` - Preview build (testing)
- `npm run eas:build:prod` - Production build (both platforms)
- `npm run eas:build:ios` - iOS production build
- `npm run eas:build:android` - Android production build

### Deployment
- `npm run eas:submit:ios` - Submit to App Store
- `npm run eas:submit:android` - Submit to Google Play

### Updates
- `npm run eas:update:dev` - Push OTA update to development
- `npm run eas:update:prod` - Push OTA update to production

---

## 🎨 Design Philosophy

### Intentional by Design
- **Conversation-First** - No swipes, no likes, just conversations
- **Quality Over Quantity** - Limited matches promote meaningful connections
- **Anti-Ghosting** - Close the loop on every conversation
- **Verified Community** - Manual approval ensures quality

### User Experience
- **Clean, Breathable Design** - Modern and minimalistic
- **Smooth Animations** - Polished interactions
- **Dark Mode Support** - Comfortable viewing in any light
- **Accessible** - Designed for all users

---

## 🔒 Privacy & Security

- **Manual Approval** - Every user is reviewed before activation
- **Verified Profiles** - Photo/video requirements with quality checks
- **Block & Report** - User safety tools
- **Secure Authentication** - BetterAuth with OAuth support
- **Data Protection** - Secure backend with proper authentication

---

## 📄 License

Private - All rights reserved

---

## 🆘 Support

For deployment help, see:
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Pre-Deployment Checklist](PRE_DEPLOYMENT_CHECK.md)
- [EAS Documentation](https://docs.expo.dev/eas/)

---

## 🎉 Ready to Launch!

Your Intentional Dating app is fully configured and ready for deployment. Follow the deployment guide to get started!

**Next Steps:**
1. Review [Pre-Deployment Checklist](PRE_DEPLOYMENT_CHECK.md)
2. Follow [Deployment Guide](DEPLOYMENT_GUIDE.md)
3. Deploy to iOS and Android stores
4. Launch your intentional dating community! 🚀
