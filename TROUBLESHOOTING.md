
# 🔧 Troubleshooting Guide - Deployment Issues

Common issues and solutions for deploying the Intentional Dating app.

---

## 🚨 EAS CLI Issues

### Issue: `eas: command not found`
**Problem:** EAS CLI not installed or not in PATH

**Solution:**
```bash
# Install globally
npm install -g eas-cli

# Verify installation
eas --version

# If still not found, try with npx
npx eas-cli --version
```

### Issue: `eas login` fails
**Problem:** Authentication issues

**Solution:**
```bash
# Logout and login again
eas logout
eas login

# If using 2FA, make sure to enter the code

# Check if logged in
eas whoami
```

---

## 🏗️ Build Issues

### Issue: Build fails with "Project not configured"
**Problem:** Project not initialized with EAS

**Solution:**
```bash
# Initialize project
npm run eas:init

# Verify project info
eas project:info
```

### Issue: Build fails with dependency errors
**Problem:** Incompatible dependencies or missing packages

**Solution:**
```bash
# Clear cache and rebuild
eas build --clear-cache --profile preview

# Check package.json for incompatible versions
# Ensure all dependencies are compatible with Expo SDK 54

# Try local build first
npm install
npm run dev
```

### Issue: Build fails with "Invalid bundle identifier"
**Problem:** Bundle ID format incorrect

**Solution:**
Edit `app.json`:
```json
"ios": {
  "bundleIdentifier": "com.intentionaldating.app"
},
"android": {
  "package": "com.intentionaldating.app"
}
```
- Must be reverse domain format
- No spaces or special characters
- All lowercase

### Issue: Build takes too long or times out
**Problem:** Network issues or EAS server load

**Solution:**
```bash
# Check build status
eas build:list

# Cancel and retry
eas build:cancel [BUILD_ID]
npm run eas:build:preview

# Try building one platform at a time
npm run eas:build:preview -- --platform ios
npm run eas:build:preview -- --platform android
```

---

## 🍎 iOS-Specific Issues

### Issue: "No valid code signing identity found"
**Problem:** iOS credentials not configured

**Solution:**
```bash
# Configure credentials
eas credentials

# Select iOS → Production → Manage credentials
# Follow prompts to set up signing

# Or let EAS manage automatically
eas build --profile production --platform ios
# Select "Yes" when asked to generate credentials
```

### Issue: "Invalid Apple ID or password"
**Problem:** Apple credentials incorrect in eas.json

**Solution:**
Edit `eas.json`:
```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-actual-email@example.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCD123456"
    }
  }
}
```
- Use your actual Apple ID email
- Get ASC App ID from App Store Connect
- Get Team ID from Apple Developer portal

### Issue: "App Store Connect operation failed"
**Problem:** App not created in App Store Connect

**Solution:**
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in app information
4. Note the App ID (numeric)
5. Update `eas.json` with the App ID
6. Retry submission

### Issue: TestFlight build not appearing
**Problem:** Build uploaded but not processed

**Solution:**
- Wait 5-10 minutes for processing
- Check email for processing status
- Verify build in App Store Connect → TestFlight
- If still missing after 30 minutes, rebuild

---

## 🤖 Android-Specific Issues

### Issue: "Service account authentication failed"
**Problem:** Google service account not configured correctly

**Solution:**
```bash
# Verify file exists
ls -la google-service-account.json

# Verify file is valid JSON
cat google-service-account.json | python -m json.tool

# Verify path in eas.json
cat eas.json | grep serviceAccountKeyPath
```

Should show: `"serviceAccountKeyPath": "./google-service-account.json"`

### Issue: "Service account lacks permissions"
**Problem:** Service account doesn't have correct roles

**Solution:**
1. Go to Google Play Console → Setup → API access
2. Find your service account
3. Click "Grant access"
4. Select "Release Manager" or "Admin" role
5. Save changes
6. Wait 5 minutes for permissions to propagate
7. Retry submission

### Issue: "App not found in Google Play Console"
**Problem:** App not created in Play Console

**Solution:**
1. Go to https://play.google.com/console
2. Click "Create app"
3. Fill in app details
4. Complete store listing
5. Retry submission

### Issue: APK/AAB upload fails
**Problem:** Build format or signing issues

**Solution:**
```bash
# Verify build profile uses AAB for production
cat eas.json | grep -A 5 "production"

# Should show:
# "android": {
#   "buildType": "aab"
# }

# Rebuild if necessary
npm run eas:build:android
```

---

## 🔐 Authentication Issues

### Issue: OAuth redirects not working
**Problem:** Deep linking not configured correctly

**Solution:**
Verify `app.json`:
```json
"scheme": "intentionaldating",
"ios": {
  "bundleIdentifier": "com.intentionaldating.app"
},
"android": {
  "package": "com.intentionaldating.app"
}
```

Test deep linking:
```bash
# iOS
xcrun simctl openurl booted intentionaldating://oauth/callback

# Android
adb shell am start -W -a android.intent.action.VIEW -d "intentionaldating://oauth/callback"
```

### Issue: "Backend URL not configured"
**Problem:** Backend URL missing or incorrect

**Solution:**
Edit `app.json`:
```json
"extra": {
  "backendUrl": "https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev"
}
```

Verify in code:
```bash
cat utils/api.ts | grep BACKEND_URL
```

### Issue: "Authentication token not found"
**Problem:** Token storage not working

**Solution:**
```typescript
// Check token storage (in your code)
import * as SecureStore from 'expo-secure-store';

// Test storage
await SecureStore.setItemAsync('test', 'value');
const value = await SecureStore.getItemAsync('test');
console.log('Storage works:', value === 'value');
```

---

## 🌐 Backend Connection Issues

### Issue: "Network request failed"
**Problem:** Can't connect to backend

**Solution:**
```bash
# Test backend URL
curl https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev/health

# Check if backend is running
# Verify URL in app.json is correct
cat app.json | grep backendUrl

# Test from device (not simulator)
# Simulators may have network restrictions
```

### Issue: "401 Unauthorized" errors
**Problem:** Authentication token missing or invalid

**Solution:**
```typescript
// Check token in API calls
const token = await getBearerToken();
console.log('Token:', token);

// Verify token is included in headers
// Check utils/api.ts authenticatedApiCall function

// Re-authenticate if token expired
await authClient.signOut();
await authClient.signIn.email({ email, password });
```

### Issue: "CORS errors" (web only)
**Problem:** Backend not configured for web requests

**Solution:**
- CORS is a backend configuration issue
- Backend should allow requests from your domain
- For development, use tunnel: `npm run dev`
- For production, backend must allow your domain

---

## 📦 Submission Issues

### Issue: "Missing required metadata"
**Problem:** Store listing incomplete

**Solution:**

**iOS (App Store Connect):**
- App name
- Subtitle
- Description (4000 chars max)
- Keywords
- Support URL
- Marketing URL (optional)
- Screenshots (required sizes)
- App icon (1024x1024)
- Privacy policy URL
- Age rating

**Android (Google Play Console):**
- App name
- Short description (80 chars)
- Full description (4000 chars)
- Screenshots (at least 2)
- Feature graphic (1024x500)
- App icon (512x512)
- Privacy policy URL
- Content rating questionnaire

### Issue: "App rejected during review"
**Problem:** Violates store guidelines

**Common reasons:**
1. **Incomplete functionality** - App crashes or features don't work
2. **Missing privacy policy** - Required for apps collecting data
3. **Misleading content** - Description doesn't match functionality
4. **Permissions not explained** - Camera/photo access not justified
5. **Inappropriate content** - Violates content guidelines

**Solution:**
- Read rejection reason carefully
- Fix the specific issue mentioned
- Update app if needed (rebuild and resubmit)
- Update metadata if needed (no rebuild required)
- Respond to reviewer if clarification needed

---

## 🔄 Update Issues

### Issue: OTA update not appearing
**Problem:** Update not reaching devices

**Solution:**
```bash
# Check update status
eas update:list

# Verify channel matches build
cat eas.json | grep channel

# Force update check in app
# Add this to your app code:
import * as Updates from 'expo-updates';
await Updates.fetchUpdateAsync();
await Updates.reloadAsync();
```

### Issue: "Update not compatible"
**Problem:** Runtime version mismatch

**Solution:**
Edit `app.json`:
```json
"runtimeVersion": {
  "policy": "appVersion"
}
```
- OTA updates only work within same runtime version
- Native code changes require new build
- Increment app version for new builds

---

## 🐛 General Debugging

### Enable Verbose Logging
```bash
# Build with verbose output
eas build --profile preview --platform ios --verbose

# Check logs
eas build:view [BUILD_ID]
```

### Test Locally First
```bash
# Always test locally before building
npm run dev

# Test on physical device
npm run ios
npm run android

# Check for errors in console
```

### Clear All Caches
```bash
# Clear EAS cache
eas build --clear-cache

# Clear npm cache
npm cache clean --force

# Clear Expo cache
rm -rf .expo
rm -rf node_modules
npm install
```

---

## 📞 Getting Help

### EAS Build Support
- **Documentation:** https://docs.expo.dev/eas/
- **Forums:** https://forums.expo.dev/
- **Discord:** https://chat.expo.dev/

### Store Support
- **Apple Developer:** https://developer.apple.com/support/
- **Google Play:** https://support.google.com/googleplay/android-developer/

### Backend Issues
- Check backend build status
- Review API documentation
- Test endpoints with curl/Postman

---

## ✅ Prevention Checklist

Avoid issues by checking these before building:

- [ ] Run `npm run dev` and test locally
- [ ] All dependencies installed: `npm install`
- [ ] No TypeScript errors: `npm run lint`
- [ ] Backend URL correct in `app.json`
- [ ] Bundle IDs correct in `app.json`
- [ ] Expo username set in `app.json`
- [ ] EAS CLI up to date: `npm install -g eas-cli@latest`
- [ ] Logged into Expo: `eas whoami`
- [ ] Project initialized: `eas project:info`

---

## 🎯 Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Build fails | `eas build --clear-cache` |
| Can't login | `eas logout && eas login` |
| Credentials issue | `eas credentials` |
| Backend not working | Check URL in `app.json` |
| OAuth not working | Verify `scheme` in `app.json` |
| Update not appearing | Check runtime version |
| Store rejection | Read reason, fix, resubmit |

---

**Still stuck? Check the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions or reach out to Expo support.**
