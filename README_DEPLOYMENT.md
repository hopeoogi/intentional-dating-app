
# Intentional Dating App - Deployment Guide

## Prerequisites

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure Project**
   ```bash
   eas init
   ```
   This will create a project ID and update your app.json

## Configuration Steps

### 1. Update app.json
After running `eas init`, update these fields in `app.json`:
- `expo.owner`: Your Expo username
- `expo.extra.eas.projectId`: Auto-filled by `eas init`
- `expo.updates.url`: Auto-filled by `eas init`

### 2. iOS Configuration (if deploying to iOS)
In `eas.json` under `submit.production.ios`:
- `appleId`: Your Apple ID email
- `ascAppId`: Your App Store Connect App ID
- `appleTeamId`: Your Apple Developer Team ID

### 3. Android Configuration (if deploying to Android)
- Create a Google Service Account in Google Play Console
- Download the JSON key file
- Save as `google-service-account.json` in project root
- Add to `.gitignore` to keep it secure

### 4. Environment Variables (Optional)
Create `.env` files for different environments:
```bash
# .env.development
EXPO_PUBLIC_ENV=development

# .env.production
EXPO_PUBLIC_ENV=production
```

## Build Commands

### Development Build (for testing)
```bash
# iOS Simulator
eas build --profile development --platform ios

# Android Emulator/Device
eas build --profile development --platform android
```

### Preview Build (internal testing)
```bash
# iOS (TestFlight)
eas build --profile preview --platform ios

# Android (APK for direct install)
eas build --profile preview --platform android
```

### Production Build
```bash
# iOS (App Store)
eas build --profile production --platform ios

# Android (Google Play)
eas build --profile production --platform android

# Both platforms
eas build --profile production --platform all
```

## Submit to Stores

### iOS (App Store)
```bash
eas submit --platform ios --latest
```

### Android (Google Play)
```bash
eas submit --platform android --latest
```

## Update Over-the-Air (OTA)

After initial deployment, push updates without rebuilding:

```bash
# Development channel
eas update --branch development --message "Bug fixes"

# Production channel
eas update --branch production --message "New features"
```

## Monitoring

View build status:
```bash
eas build:list
```

View update status:
```bash
eas update:list
```

## Backend Integration

The backend URL is configured in `app.json`:
```json
"extra": {
  "backendUrl": "https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev"
}
```

Backend is building asynchronously. Check status and get API documentation:
```bash
# In your development environment, the backend status will be available
```

## Troubleshooting

### Build Fails
- Check `eas build:list` for error logs
- Ensure all dependencies are compatible with Expo SDK 54
- Verify iOS/Android credentials are properly configured

### Backend Connection Issues
- Verify `backendUrl` in `app.json` is correct
- Check network connectivity
- Review API logs for authentication errors

### Store Submission Issues
- iOS: Ensure app complies with App Store Review Guidelines
- Android: Verify app signing configuration
- Both: Complete all required metadata in store consoles

## Next Steps

1. Run `eas init` to get your project ID
2. Update `app.json` with your Expo username
3. Configure iOS/Android credentials
4. Run your first build: `eas build --profile preview --platform all`
5. Test the build thoroughly
6. Submit to stores when ready

## Support

- EAS Documentation: https://docs.expo.dev/eas/
- Expo Forums: https://forums.expo.dev/
- Backend API Docs: Check OpenAPI spec at backend URL
