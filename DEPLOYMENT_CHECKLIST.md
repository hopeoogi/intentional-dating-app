
# 🚀 Intentional Dating App - Deployment Checklist

## ✅ Pre-Deployment Setup

### 1. Install EAS CLI
- [ ] Run: `npm install -g eas-cli`
- [ ] Verify: `eas --version`

### 2. Expo Account Setup
- [ ] Create Expo account at https://expo.dev
- [ ] Login: `eas login`
- [ ] Verify: `eas whoami`

### 3. Initialize EAS Project
- [ ] Run: `npm run eas:init` (or `eas init`)
- [ ] This creates a project ID and updates app.json
- [ ] Verify `expo.extra.eas.projectId` is populated in app.json

### 4. Update App Configuration
- [ ] Update `expo.owner` in app.json with your Expo username
- [ ] Update `expo.name` if needed (currently "Intentional Dating")
- [ ] Update `expo.slug` if needed (currently "intentional-dating")
- [ ] Verify bundle identifiers:
  - iOS: `com.intentionaldating.app`
  - Android: `com.intentionaldating.app`

## 📱 iOS Deployment

### 5. Apple Developer Account
- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Create App ID in Apple Developer Portal
- [ ] Note your Apple Team ID

### 6. App Store Connect
- [ ] Create app in App Store Connect
- [ ] Note the ASC App ID (numeric ID)
- [ ] Prepare app metadata (description, screenshots, etc.)

### 7. Configure iOS Credentials
- [ ] Update `eas.json` → `submit.production.ios`:
  - `appleId`: Your Apple ID email
  - `ascAppId`: Your App Store Connect App ID
  - `appleTeamId`: Your Apple Developer Team ID
- [ ] Run: `eas credentials` to configure signing

### 8. Build iOS App
- [ ] Preview build: `npm run eas:build:preview -- --platform ios`
- [ ] Test on TestFlight
- [ ] Production build: `npm run eas:build:ios`

### 9. Submit to App Store
- [ ] Run: `npm run eas:submit:ios`
- [ ] Complete App Store Review information
- [ ] Submit for review

## 🤖 Android Deployment

### 10. Google Play Console
- [ ] Create Google Play Developer account ($25 one-time)
- [ ] Create app in Google Play Console
- [ ] Prepare store listing (description, screenshots, etc.)

### 11. Service Account Setup
- [ ] In Google Play Console → Setup → API access
- [ ] Create service account
- [ ] Grant permissions (Release Manager or Admin)
- [ ] Download JSON key file
- [ ] Save as `google-service-account.json` in project root
- [ ] Verify it's in `.gitignore`

### 12. Build Android App
- [ ] Preview build: `npm run eas:build:preview -- --platform android`
- [ ] Test APK on device
- [ ] Production build: `npm run eas:build:android`

### 13. Submit to Google Play
- [ ] Run: `npm run eas:submit:android`
- [ ] Complete store listing
- [ ] Submit for review (starts in Internal Testing track)

## 🔧 Backend Integration

### 14. Verify Backend Status
- [ ] Backend is building at: https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev
- [ ] Wait for backend build to complete
- [ ] Test API endpoints
- [ ] Verify authentication flows work

### 15. Backend Configuration
- [ ] Backend URL is configured in `app.json` → `expo.extra.backendUrl`
- [ ] Test API calls from app
- [ ] Verify OAuth redirects work (Google, Apple)
- [ ] Test file uploads (photos/videos)

## 🧪 Testing

### 16. Development Testing
- [ ] Run: `npm run dev`
- [ ] Test all onboarding flows
- [ ] Test authentication (email, Google, Apple)
- [ ] Test profile creation and media upload
- [ ] Test matching system
- [ ] Test conversations (36-char minimum, reply/end/snooze)
- [ ] Test blocking and reporting

### 17. Preview Build Testing
- [ ] Build preview: `npm run eas:build:preview`
- [ ] Install on physical devices
- [ ] Test on iOS (TestFlight)
- [ ] Test on Android (APK)
- [ ] Verify push notifications work
- [ ] Test offline functionality

### 18. Production Testing
- [ ] Build production: `npm run eas:build:prod`
- [ ] Final QA pass
- [ ] Test payment flows (IAP)
- [ ] Verify analytics tracking
- [ ] Test deep linking

## 📊 Post-Deployment

### 19. Monitoring Setup
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics
- [ ] Set up crash reporting
- [ ] Monitor backend logs

### 20. OTA Updates
- [ ] For minor updates: `npm run eas:update:prod`
- [ ] For major updates: Rebuild and resubmit

### 21. Store Optimization
- [ ] Monitor app store reviews
- [ ] Respond to user feedback
- [ ] Update screenshots and descriptions
- [ ] A/B test store listing

## 🎯 Quick Commands Reference

```bash
# Initialize project
npm run eas:init

# Development builds
npm run eas:build:dev

# Preview builds (testing)
npm run eas:build:preview

# Production builds
npm run eas:build:prod
npm run eas:build:ios
npm run eas:build:android

# Submit to stores
npm run eas:submit:ios
npm run eas:submit:android

# OTA updates
npm run eas:update:dev
npm run eas:update:prod

# Check build status
eas build:list

# Check credentials
eas credentials
```

## 📝 Important Notes

1. **First Build**: Takes 15-30 minutes
2. **Subsequent Builds**: 10-15 minutes
3. **App Store Review**: 1-3 days typically
4. **Google Play Review**: Few hours to 1 day
5. **OTA Updates**: Instant (no review needed for minor changes)

## 🆘 Troubleshooting

### Build Fails
- Check `eas build:list` for logs
- Verify all dependencies are compatible
- Check iOS/Android credentials

### Backend Connection Issues
- Verify backend URL in app.json
- Check API endpoint availability
- Review authentication token handling

### Store Rejection
- Review store guidelines
- Check privacy policy and terms
- Verify all required permissions are explained

## ✨ Ready to Deploy!

Once all checkboxes are complete, you're ready to launch! 🎉

For detailed instructions, see `README_DEPLOYMENT.md`
