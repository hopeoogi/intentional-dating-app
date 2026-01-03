
# Intentional Dating App - Setup Instructions

## Background Images Required

Please add the following background images to complete the app setup:

### 1. NYC Skyline (Welcome Screen)
- **Path**: `assets/images/nyc-skyline.jpg`
- **Description**: Nighttime skyline view of New York City
- **Recommended size**: 1080x1920px (portrait)
- **Source suggestions**: 
  - Unsplash: Search "new york skyline night"
  - Pexels: Search "nyc skyline evening"

### 2. SF Park (Sign-In Screen)
- **Path**: `assets/images/sf-park.jpg`
- **Description**: Park during daytime with San Francisco Bay in the distance
- **Recommended size**: 1080x1920px (portrait)
- **Source suggestions**:
  - Unsplash: Search "san francisco park bay"
  - Pexels: Search "golden gate park san francisco"

## Installation Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Clear caches**:
   ```bash
   npm start -- --clear
   ```

3. **Add background images** to `assets/images/` folder

4. **Run the app**:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

5. **Build for TestFlight**:
   ```bash
   # First time setup
   eas build:configure
   
   # Build for iOS
   npm run build:ios
   
   # Submit to TestFlight
   npm run submit:ios
   ```

## Key Features Implemented

✅ Welcome screen with 3-second display
✅ Enhanced sign-in page with background and "Join the Community" button
✅ Complete onboarding flow (signup → profile → media → verification → pending)
✅ Logo integration throughout the app
✅ Profile data saved to backend database
✅ Admin approval workflow
✅ Clear cache command in package.json

## Onboarding Flow

1. **Welcome Screen** (3 seconds) → Auto-navigates to Sign In
2. **Sign In** → Existing users sign in, new users click "Join the Community"
3. **Sign Up** → Email, phone, password creation
4. **Profile** → Name, DOB, sex, location, bio (saved to database)
5. **Media Upload** → Photos and videos
6. **Verification** → Status/profession and proof
7. **Pending Approval** → Waiting for admin review
8. **Subscription** → After approval, complete payment
9. **Main App** → Access to Discover, Conversations, Profile tabs

## Notes

- The app now properly saves profile data to the backend after the first onboarding step
- Users cannot proceed without filling required fields
- Age validation ensures users are 18+
- All data is stored in the database for admin approval
- The logo is integrated on all onboarding screens
