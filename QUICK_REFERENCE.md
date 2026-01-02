
# 🚀 Quick Reference - Deployment Commands

## 🎯 First Time Setup (Do Once)

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Login to your Expo account
eas login

# 3. Verify you're logged in
eas whoami

# 4. Initialize your project (creates project ID)
npm run eas:init
# OR
eas init

# 5. Update app.json with your Expo username
# Change "owner": "YOUR_EXPO_USERNAME" to your actual username
```

---

## 📱 Building Your App

### Development Build (for testing with Expo Go)
```bash
npm run eas:build:dev
```

### Preview Build (internal testing - TestFlight/APK)
```bash
# Both platforms
npm run eas:build:preview

# iOS only
npm run eas:build:preview -- --platform ios

# Android only
npm run eas:build:preview -- --platform android
```

### Production Build (for App Store/Google Play)
```bash
# Both platforms
npm run eas:build:prod

# iOS only
npm run eas:build:ios

# Android only
npm run eas:build:android
```

---

## 🏪 Submitting to Stores

### iOS (App Store)
```bash
npm run eas:submit:ios
```

**Prerequisites:**
- Apple Developer account ($99/year)
- App created in App Store Connect
- Update `eas.json` with Apple credentials

### Android (Google Play)
```bash
npm run eas:submit:android
```

**Prerequisites:**
- Google Play Developer account ($25 one-time)
- App created in Google Play Console
- Service account JSON key saved as `google-service-account.json`

---

## 🔄 Over-the-Air (OTA) Updates

Push updates without rebuilding (for JS/React Native changes only):

```bash
# Development channel
npm run eas:update:dev

# Production channel
npm run eas:update:prod
```

**Note:** Native code changes require a new build.

---

## 📊 Monitoring & Management

### View Build History
```bash
eas build:list
```

### View Update History
```bash
eas update:list
```

### Check Project Info
```bash
eas project:info
```

### Manage Credentials
```bash
eas credentials
```

### View Build Logs
```bash
# Get build ID from eas build:list
eas build:view [BUILD_ID]
```

---

## 🔧 Troubleshooting Commands

### Clear Build Cache
```bash
eas build --clear-cache --profile production
```

### Re-configure Credentials
```bash
eas credentials
```

### Check EAS CLI Version
```bash
eas --version
```

### Update EAS CLI
```bash
npm install -g eas-cli@latest
```

---

## 🎯 Common Workflows

### First Deployment
```bash
# 1. Setup
npm install -g eas-cli
eas login
npm run eas:init

# 2. Update app.json with your username

# 3. Test with preview build
npm run eas:build:preview

# 4. Build for production
npm run eas:build:prod

# 5. Submit to stores
npm run eas:submit:ios
npm run eas:submit:android
```

### Quick Update (OTA)
```bash
# Make your code changes, then:
npm run eas:update:prod
```

### New Version Release
```bash
# 1. Update version in app.json
# 2. Build new version
npm run eas:build:prod

# 3. Submit to stores
npm run eas:submit:ios
npm run eas:submit:android
```

---

## 📝 Configuration Files

### app.json
- App name, version, bundle IDs
- Permissions and capabilities
- Backend URL
- Expo project ID (after `eas init`)

### eas.json
- Build profiles (dev, preview, production)
- Submit configuration (iOS/Android)
- Environment variables

### google-service-account.json
- Android submission credentials
- **Keep secure** - already in .gitignore

---

## 🔗 Useful Links

- **EAS Dashboard:** https://expo.dev/accounts/[username]/projects/intentional-dating
- **Build Docs:** https://docs.expo.dev/build/introduction/
- **Submit Docs:** https://docs.expo.dev/submit/introduction/
- **Update Docs:** https://docs.expo.dev/eas-update/introduction/

---

## 💡 Pro Tips

1. **First build takes longer** (15-30 min) - subsequent builds are faster
2. **Use preview builds** to test before production
3. **OTA updates are instant** - no store review needed for minor changes
4. **Monitor builds** with `eas build:list`
5. **Keep credentials secure** - never commit `google-service-account.json`
6. **Test on real devices** before submitting to stores
7. **Prepare store metadata** before submission (screenshots, descriptions)

---

## 🆘 Quick Help

### Build Failed?
```bash
# Check logs
eas build:list
eas build:view [BUILD_ID]

# Try clearing cache
eas build --clear-cache --profile production
```

### Credentials Issue?
```bash
# Reconfigure
eas credentials
```

### Can't Login?
```bash
# Logout and login again
eas logout
eas login
```

### Backend Not Working?
- Check backend URL in `app.json`
- Verify backend build is complete
- Test API endpoints manually

---

## ✅ Pre-Flight Checklist

Before deploying, verify:
- [ ] `eas whoami` shows your username
- [ ] `app.json` has your username in `owner` field
- [ ] Backend URL is correct in `app.json`
- [ ] iOS credentials configured (if deploying to iOS)
- [ ] Android service account JSON ready (if deploying to Android)
- [ ] Store metadata prepared (descriptions, screenshots)
- [ ] Privacy policy and terms of service URLs ready

---

## 🎉 You're Ready!

Keep this reference handy during deployment. For detailed instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

Good luck with your launch! 🚀
