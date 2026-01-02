
# 🚀 Intentional Dating App - Complete Deployment Guide

## ✅ What's Already Configured

Your app is **ready for deployment**! Here's what's already set up:

- ✅ **EAS Build Configuration** (`eas.json`) - Development, Preview, and Production profiles
- ✅ **App Configuration** (`app.json`) - Bundle IDs, permissions, and backend URL
- ✅ **Backend API** - Building at: `https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev`
- ✅ **NPM Scripts** - All deployment commands ready in `package.json`
- ✅ **Authentication** - BetterAuth configured with email, Google, and Apple OAuth
- ✅ **Security** - Sensitive files in `.gitignore`

---

## 📋 Step-by-Step Deployment Process

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

Verify installation:
```bash
eas --version
```

---

### Step 2: Login to Expo

```bash
eas login
```

If you don't have an Expo account:
1. Go to https://expo.dev
2. Sign up for a free account
3. Run `eas login` again

---

### Step 3: Initialize EAS Project

```bash
npm run eas:init
```

Or directly:
```bash
eas init
```

This will:
- Create a unique project ID
- Update `app.json` with the project ID
- Link your project to your Expo account

**Important:** After running this, update `app.json`:
- Change `"owner": "YOUR_EXPO_USERNAME"` to your actual Expo username
- The `projectId` will be auto-filled

---

### Step 4: Configure for iOS (Optional - if deploying to iOS)

#### 4.1 Apple Developer Account
- Enroll in Apple Developer Program ($99/year): https://developer.apple.com/programs/
- Note your **Team ID** from your account

#### 4.2 App Store Connect
- Create a new app in App Store Connect: https://appstoreconnect.apple.com
- Note the **ASC App ID** (numeric ID)

#### 4.3 Update eas.json
Edit `eas.json` and update the iOS submit section:
```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-email@example.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCD123456"
    }
  }
}
```

#### 4.4 Configure Credentials
```bash
eas credentials
```
Follow prompts to set up signing certificates and provisioning profiles.

---

### Step 5: Configure for Android (Optional - if deploying to Android)

#### 5.1 Google Play Console
- Create a Google Play Developer account ($25 one-time): https://play.google.com/console
- Create a new app

#### 5.2 Service Account Setup
1. In Google Play Console → **Setup** → **API access**
2. Click **Create new service account**
3. Follow the link to Google Cloud Console
4. Create service account with name like "eas-submit"
5. Grant **Release Manager** or **Admin** role
6. Create and download JSON key
7. Save as `google-service-account.json` in project root
8. **Verify it's in `.gitignore`** (already done)

---

### Step 6: Build Your App

#### Development Build (for testing)
```bash
npm run eas:build:dev
```

#### Preview Build (internal testing)
```bash
npm run eas:build:preview
```

#### Production Build
```bash
# iOS only
npm run eas:build:ios

# Android only
npm run eas:build:android

# Both platforms
npm run eas:build:prod
```

**Note:** First build takes 15-30 minutes. Subsequent builds are faster (10-15 minutes).

---

### Step 7: Monitor Build Progress

```bash
eas build:list
```

Or visit: https://expo.dev/accounts/[your-username]/projects/intentional-dating/builds

---

### Step 8: Test Your Build

#### iOS (TestFlight)
1. Build completes → Download IPA or use TestFlight link
2. Install on device via TestFlight
3. Test all features thoroughly

#### Android (APK/AAB)
1. Build completes → Download APK
2. Install on device: `adb install app.apk`
3. Test all features thoroughly

---

### Step 9: Submit to App Stores

#### iOS (App Store)
```bash
npm run eas:submit:ios
```

Complete App Store metadata:
- App description
- Screenshots (required sizes)
- Privacy policy URL
- Support URL
- Keywords
- Category

#### Android (Google Play)
```bash
npm run eas:submit:android
```

Complete Google Play listing:
- App description
- Screenshots
- Feature graphic
- Privacy policy URL
- Content rating questionnaire

---

### Step 10: Wait for Review

- **iOS:** Typically 1-3 days
- **Android:** Few hours to 1 day

You'll receive email notifications about review status.

---

## 🔄 Over-the-Air (OTA) Updates

After your app is live, push updates instantly without rebuilding:

```bash
# Development updates
npm run eas:update:dev

# Production updates
npm run eas:update:prod
```

**Note:** OTA updates work for JavaScript/React Native changes only. Native code changes require a new build.

---

## 🔧 Backend Integration Status

Your backend is building at:
```
https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev
```

### Backend Features Included:
- ✅ User authentication (email, Google, Apple OAuth)
- ✅ Profile management
- ✅ Photo/video upload
- ✅ Verification system
- ✅ Admin approval workflow
- ✅ Subscription/payment handling
- ✅ Daily matching algorithm
- ✅ Conversation system (36-char minimum)
- ✅ Reply/End/Snooze mechanics
- ✅ Blocking and reporting
- ✅ Admin panel

### Check Backend Status:
The backend builds asynchronously. Once complete, you can:
1. Test API endpoints
2. View OpenAPI documentation
3. Verify authentication flows

---

## 📱 Quick Command Reference

```bash
# Initialize project
npm run eas:init

# Build commands
npm run eas:build:dev        # Development build
npm run eas:build:preview    # Preview build (testing)
npm run eas:build:prod       # Production build (both platforms)
npm run eas:build:ios        # iOS production build
npm run eas:build:android    # Android production build

# Submit to stores
npm run eas:submit:ios       # Submit to App Store
npm run eas:submit:android   # Submit to Google Play

# OTA updates
npm run eas:update:dev       # Push update to development
npm run eas:update:prod      # Push update to production

# Monitoring
eas build:list               # View build history
eas update:list              # View update history
eas credentials              # Manage credentials
```

---

## 🎯 Deployment Checklist

Use this checklist to track your progress:

### Pre-Deployment
- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login to Expo: `eas login`
- [ ] Initialize project: `npm run eas:init`
- [ ] Update `app.json` with your Expo username

### iOS Setup (if deploying to iOS)
- [ ] Enroll in Apple Developer Program
- [ ] Create app in App Store Connect
- [ ] Update `eas.json` with Apple credentials
- [ ] Configure signing: `eas credentials`
- [ ] Prepare App Store metadata

### Android Setup (if deploying to Android)
- [ ] Create Google Play Developer account
- [ ] Create app in Google Play Console
- [ ] Set up service account
- [ ] Download and save `google-service-account.json`
- [ ] Prepare Play Store listing

### Building
- [ ] Run preview build: `npm run eas:build:preview`
- [ ] Test preview build thoroughly
- [ ] Run production build: `npm run eas:build:prod`
- [ ] Verify production build

### Submission
- [ ] Complete store metadata (descriptions, screenshots)
- [ ] Submit iOS: `npm run eas:submit:ios`
- [ ] Submit Android: `npm run eas:submit:android`
- [ ] Monitor review status

### Post-Launch
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor user feedback
- [ ] Plan OTA updates for minor fixes
- [ ] Respond to app store reviews

---

## 🆘 Troubleshooting

### Build Fails
**Problem:** Build fails with dependency errors
**Solution:** 
- Check `eas build:list` for detailed logs
- Ensure all dependencies are compatible with Expo SDK 54
- Try clearing cache: `eas build --clear-cache`

### iOS Signing Issues
**Problem:** Code signing errors
**Solution:**
- Run `eas credentials` to reconfigure
- Ensure Apple Developer account is active
- Verify Team ID is correct

### Android Submission Fails
**Problem:** Service account authentication fails
**Solution:**
- Verify `google-service-account.json` is in project root
- Check service account has correct permissions in Google Play Console
- Ensure JSON file is valid (not corrupted)

### Backend Connection Issues
**Problem:** App can't connect to backend
**Solution:**
- Verify backend URL in `app.json` is correct
- Check backend build status
- Test API endpoints manually
- Review authentication token handling

### App Store Rejection
**Problem:** App rejected during review
**Solution:**
- Review rejection reason carefully
- Common issues:
  - Missing privacy policy
  - Incomplete app description
  - Insufficient test account info
  - Permissions not explained
- Fix issues and resubmit

---

## 📚 Additional Resources

- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **EAS Submit Docs:** https://docs.expo.dev/submit/introduction/
- **EAS Update Docs:** https://docs.expo.dev/eas-update/introduction/
- **App Store Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policies:** https://play.google.com/about/developer-content-policy/

---

## 🎉 You're Ready to Deploy!

Your Intentional Dating app is fully configured and ready for deployment. Follow the steps above, and you'll have your app in the stores soon!

**Next Steps:**
1. Run `npm run eas:init`
2. Update your Expo username in `app.json`
3. Run `npm run eas:build:preview` to test
4. Deploy to production when ready!

Good luck with your launch! 🚀
