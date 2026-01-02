
# ✅ Pre-Deployment Verification Checklist

Run through this checklist before deploying to ensure everything is configured correctly.

## 🔍 Configuration Verification

### 1. Check app.json
```bash
cat app.json | grep -E "(owner|projectId|bundleIdentifier|package)"
```

**Verify:**
- [ ] `expo.owner` is set to your Expo username (not "YOUR_EXPO_USERNAME")
- [ ] `expo.extra.eas.projectId` will be filled after `eas init`
- [ ] `expo.ios.bundleIdentifier` is `com.intentionaldating.app`
- [ ] `expo.android.package` is `com.intentionaldating.app`

### 2. Check eas.json
```bash
cat eas.json
```

**Verify:**
- [ ] Three build profiles exist: development, preview, production
- [ ] Submit configuration exists for iOS and Android
- [ ] iOS credentials placeholders are present (will update later)
- [ ] Android service account path is `./google-service-account.json`

### 3. Check package.json scripts
```bash
npm run | grep eas
```

**Verify these scripts exist:**
- [ ] `eas:init`
- [ ] `eas:build:dev`
- [ ] `eas:build:preview`
- [ ] `eas:build:prod`
- [ ] `eas:build:ios`
- [ ] `eas:build:android`
- [ ] `eas:submit:ios`
- [ ] `eas:submit:android`
- [ ] `eas:update:dev`
- [ ] `eas:update:prod`

### 4. Check .gitignore
```bash
cat .gitignore | grep google-service-account
```

**Verify:**
- [ ] `google-service-account.json` is in .gitignore
- [ ] `.env` files are ignored
- [ ] `.expo/` is ignored

---

## 🔧 Environment Setup

### 5. EAS CLI Installation
```bash
eas --version
```

**Expected:** Version number (e.g., `13.2.0` or higher)
- [ ] EAS CLI is installed
- [ ] Version is 13.2.0 or higher

**If not installed:**
```bash
npm install -g eas-cli
```

### 6. Expo Account
```bash
eas whoami
```

**Expected:** Your Expo username
- [ ] Logged into Expo account

**If not logged in:**
```bash
eas login
```

### 7. Project Initialization
```bash
eas project:info
```

**Expected:** Project details or prompt to initialize
- [ ] Project is initialized OR ready to run `eas init`

**If not initialized:**
```bash
npm run eas:init
```

---

## 📱 Platform-Specific Checks

### iOS (if deploying to iOS)

#### 8. Apple Developer Account
- [ ] Enrolled in Apple Developer Program ($99/year)
- [ ] Have Apple Team ID
- [ ] Have access to App Store Connect

#### 9. App Store Connect
- [ ] App created in App Store Connect
- [ ] Have ASC App ID (numeric)
- [ ] App metadata prepared (description, screenshots, etc.)

#### 10. iOS Configuration in eas.json
- [ ] `appleId` ready to be filled
- [ ] `ascAppId` ready to be filled
- [ ] `appleTeamId` ready to be filled

### Android (if deploying to Android)

#### 11. Google Play Console
- [ ] Google Play Developer account created ($25 one-time)
- [ ] App created in Google Play Console
- [ ] Store listing prepared

#### 12. Service Account
- [ ] Service account created in Google Cloud Console
- [ ] Service account has Release Manager or Admin role
- [ ] JSON key downloaded
- [ ] JSON key saved as `google-service-account.json` in project root
- [ ] File is in .gitignore

---

## 🔌 Backend Verification

### 13. Backend URL
```bash
cat app.json | grep backendUrl
```

**Expected:** `https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev`
- [ ] Backend URL is configured
- [ ] Backend is building/built

### 14. Backend Features
- [ ] Authentication endpoints (email, Google, Apple)
- [ ] Profile management
- [ ] Media upload
- [ ] Verification system
- [ ] Matching algorithm
- [ ] Conversation system
- [ ] Admin panel

---

## 🧪 Testing Checklist

### 15. Local Development
```bash
npm run dev
```

**Verify:**
- [ ] App starts without errors
- [ ] Can navigate through onboarding
- [ ] Authentication flows work
- [ ] Profile creation works
- [ ] Media upload works
- [ ] Conversations work

### 16. Build Test (Optional but Recommended)
```bash
npm run eas:build:preview
```

**Verify:**
- [ ] Build completes successfully
- [ ] Can install on device
- [ ] App runs on physical device
- [ ] All features work on device

---

## 📋 Documentation Check

### 17. Required Documents
- [ ] Privacy Policy URL ready
- [ ] Terms of Service URL ready
- [ ] Support URL/email ready
- [ ] App description written
- [ ] App screenshots prepared (multiple sizes)
- [ ] App icon finalized

### 18. Store Metadata
- [ ] App name finalized
- [ ] App subtitle/short description
- [ ] Keywords for search
- [ ] Category selected
- [ ] Age rating determined
- [ ] Content rating questionnaire completed (Android)

---

## 🚀 Ready to Deploy?

### All Checks Passed? ✅

If all items above are checked, you're ready to deploy!

**Next Steps:**
1. Run `npm run eas:init` (if not done)
2. Update `app.json` with your Expo username
3. Run `npm run eas:build:preview` to test
4. Run `npm run eas:build:prod` for production
5. Run `npm run eas:submit:ios` and/or `npm run eas:submit:android`

### Some Checks Failed? ⚠️

Review the failed items and:
1. Follow the instructions in `DEPLOYMENT_GUIDE.md`
2. Fix configuration issues
3. Re-run this checklist
4. Proceed when all checks pass

---

## 🆘 Need Help?

- **EAS Build Issues:** https://docs.expo.dev/build/introduction/
- **Store Submission:** https://docs.expo.dev/submit/introduction/
- **Backend Issues:** Check backend build status
- **General Questions:** https://forums.expo.dev/

---

## 📝 Quick Command Summary

```bash
# Verify EAS CLI
eas --version

# Login to Expo
eas login

# Check who you're logged in as
eas whoami

# Initialize project
npm run eas:init

# Check project info
eas project:info

# Build preview
npm run eas:build:preview

# Build production
npm run eas:build:prod

# Submit to stores
npm run eas:submit:ios
npm run eas:submit:android
```

---

Good luck with your deployment! 🎉
