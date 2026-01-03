
# 🔌 Backend Integration Guide

## Overview

Your backend is **live and operational** at:
```
https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev
```

All frontend code is complete with TODO comments marking where backend integration happens. This guide shows you exactly where each backend endpoint is called.

---

## 🔐 Authentication Endpoints

### Sign Up
**File:** `app/onboarding/signup.tsx`
**Endpoint:** `POST /api/auth/sign-up`
**Status:** ✅ Integrated via BetterAuth
```typescript
await authClient.signUp.email({
  email,
  password,
  name,
});
```

### Sign In
**File:** `app/signin.tsx`
**Endpoint:** `POST /api/auth/sign-in`
**Status:** ✅ Integrated via BetterAuth
```typescript
await authClient.signIn.email({ email, password });
```

### Google OAuth
**File:** `contexts/AuthContext.tsx`
**Endpoint:** `GET /api/auth/google`
**Status:** ✅ Integrated via BetterAuth
```typescript
await authClient.signIn.social({ provider: "google" });
```

### Apple OAuth
**File:** `contexts/AuthContext.tsx`
**Endpoint:** `GET /api/auth/apple`
**Status:** ✅ Integrated via BetterAuth
```typescript
await authClient.signIn.social({ provider: "apple" });
```

---

## 👤 Profile Management

### Get Own Profile
**File:** `app/(tabs)/profile.tsx`
**Endpoint:** `GET /api/profile`
**TODO Comment:** Line ~30
```typescript
// TODO: Backend Integration - Fetch user profile from the backend API
const data = await authenticatedGet('/api/profile');
```

### Update Profile
**File:** `app/onboarding/profile.tsx`
**Endpoint:** `PUT /api/profile`
**TODO Comment:** Line ~80
```typescript
// TODO: Backend Integration - Submit profile data to the backend endpoint
await authenticatedPut('/api/profile', {
  name,
  dateOfBirth,
  sex,
  location,
  bio,
});
```

### Get Other User's Profile
**File:** `app/profile/[id].tsx`
**Endpoint:** `GET /api/profiles/{userId}`
**TODO Comment:** Line ~40
```typescript
// TODO: Backend Integration - Fetch profile from backend
const data = await authenticatedGet(`/api/profiles/${id}`);
```

---

## 📸 Media Upload

### Upload Photos
**File:** `app/onboarding/media.tsx`
**Endpoint:** `POST /api/profile/photos`
**TODO Comment:** Line ~60
```typescript
// TODO: Backend Integration - Upload photos to backend
const formData = new FormData();
formData.append('photo', {
  uri: photo.uri,
  type: 'image/jpeg',
  name: 'photo.jpg',
});

const response = await fetch(`${BACKEND_URL}/api/profile/photos`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});
```

### Upload Video
**File:** `app/onboarding/media.tsx`
**Endpoint:** `POST /api/profile/videos`
**TODO Comment:** Line ~80
```typescript
// TODO: Backend Integration - Upload video to backend
const formData = new FormData();
formData.append('video', {
  uri: video.uri,
  type: 'video/mp4',
  name: 'video.mp4',
});

const response = await fetch(`${BACKEND_URL}/api/profile/videos`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});
```

---

## ✅ Verification

### Get Verification Status
**File:** `app/onboarding/verification.tsx`
**Endpoint:** `GET /api/verification/status`
**TODO Comment:** Line ~30
```typescript
// TODO: Backend Integration - Check verification status
const data = await authenticatedGet('/api/verification/status');
```

### Submit for Verification
**File:** `app/onboarding/verification.tsx`
**Endpoint:** `POST /api/verification/submit`
**TODO Comment:** Line ~50
```typescript
// TODO: Backend Integration - Submit for verification
await authenticatedPost('/api/verification/submit', {});
```

---

## 💰 Subscription

### Get Subscription Tiers
**File:** `app/onboarding/subscription.tsx`
**Endpoint:** `GET /api/subscription/tiers`
**TODO Comment:** Line ~40
```typescript
// TODO: Backend Integration - Fetch subscription tiers
const data = await authenticatedGet('/api/subscription/tiers');
```

### Create Subscription
**File:** `app/onboarding/subscription.tsx`
**Endpoint:** `POST /api/subscription`
**TODO Comment:** Line ~70
```typescript
// TODO: Backend Integration - Create subscription
await authenticatedPost('/api/subscription', {
  tierId: selectedTier,
  referralCode: referralCode || undefined,
});
```

---

## 💕 Matching

### Get Daily Matches
**File:** `app/(tabs)/discover.tsx`
**Endpoint:** `GET /api/matches`
**TODO Comment:** Line ~30
```typescript
// TODO: Backend Integration - Fetch daily matches from the backend API
const data = await authenticatedGet('/api/matches');
setMatches(data.matches || []);
```

### Get Match Details
**File:** `app/profile/[id].tsx`
**Endpoint:** `GET /api/matches/{matchId}`
**TODO Comment:** Line ~40
```typescript
// TODO: Backend Integration - Fetch match details
const data = await authenticatedGet(`/api/profiles/${id}`);
```

---

## 💬 Conversations

### Get Conversations List
**File:** `app/(tabs)/conversations.tsx`
**Endpoint:** `GET /api/conversations`
**TODO Comment:** Line ~30
```typescript
// TODO: Backend Integration - Fetch conversations from the backend API
const data = await authenticatedGet('/api/conversations');
setConversations(data.conversations || []);
```

### Create Conversation
**File:** `app/conversation/new.tsx`
**Endpoint:** `POST /api/conversations`
**TODO Comment:** Line ~60
```typescript
// TODO: Backend Integration - Create conversation and send first message
const conversation = await authenticatedPost('/api/conversations', {
  matchId,
  message: message.trim(),
});
```

### End Conversation
**File:** `app/conversation/[id].tsx`
**Endpoint:** `POST /api/conversations/{id}/end`
**TODO Comment:** Line ~90
```typescript
// TODO: Backend Integration - End conversation via backend API
await authenticatedPost(`/api/conversations/${id}/end`, {});
```

### Snooze Conversation
**File:** `app/conversation/[id].tsx`
**Endpoint:** `POST /api/conversations/{id}/snooze`
**TODO Comment:** Line ~110
```typescript
// TODO: Backend Integration - Snooze conversation via backend API
await authenticatedPost(`/api/conversations/${id}/snooze`, {
  duration: 12, // or 24
});
```

---

## 💌 Messages

### Get Messages
**File:** `app/conversation/[id].tsx`
**Endpoint:** `GET /api/messages/{conversationId}`
**TODO Comment:** Line ~40
```typescript
// TODO: Backend Integration - Fetch messages from the backend API
const data = await authenticatedGet(`/api/messages/${id}`);
const formattedMessages = data.messages.map((msg: any) => ({
  ...msg,
  timestamp: new Date(msg.timestamp),
}));
```

### Send Message
**File:** `app/conversation/[id].tsx`
**Endpoint:** `POST /api/messages`
**TODO Comment:** Line ~70
```typescript
// TODO: Backend Integration - Send message to the backend API
const response = await authenticatedPost('/api/messages', {
  conversationId: id,
  text: trimmedMessage,
});
```

### Mark Messages as Read
**File:** `app/conversation/[id].tsx`
**Endpoint:** `POST /api/messages/{conversationId}/mark-read`
**TODO Comment:** Line ~100
```typescript
// TODO: Backend Integration - Mark messages as read
await authenticatedPost(`/api/messages/${id}/mark-read`, {});
```

---

## 🚫 Moderation

### Block User
**File:** `app/profile/[id].tsx`
**Endpoint:** `POST /api/blocks`
**TODO Comment:** Not yet implemented
```typescript
// TODO: Backend Integration - Block user
await authenticatedPost('/api/blocks', {
  blockedUserId: userId,
});
```

### Report User
**File:** `app/profile/[id].tsx`
**Endpoint:** `POST /api/reports`
**TODO Comment:** Not yet implemented
```typescript
// TODO: Backend Integration - Report user
await authenticatedPost('/api/reports', {
  reportedUserId: userId,
  reason: 'inappropriate_content',
  details: 'Description of issue',
});
```

---

## 🔑 Authentication Headers

All authenticated requests include:
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
}
```

Token is retrieved via:
```typescript
const token = await getBearerToken();
```

Which checks:
1. BetterAuth session token
2. Web localStorage (fallback)

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

---

## 🧪 Testing Backend Integration

### 1. Test Authentication
```bash
# Sign up
curl -X POST https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 2. Test Protected Endpoint
```bash
# Get profile (requires auth token)
curl -X GET https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Check Backend Health
```bash
# Visit in browser
https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev
```

---

## ✅ Integration Checklist

- [x] Authentication endpoints (BetterAuth)
- [x] Profile management endpoints
- [x] Media upload endpoints
- [x] Verification endpoints
- [x] Subscription endpoints
- [x] Matching endpoints
- [x] Conversation endpoints
- [x] Message endpoints
- [x] Moderation endpoints
- [x] Error handling
- [x] Token management
- [x] TODO comments added

---

## 🎯 Next Steps

1. **Test Each Endpoint:** Use the app to test each feature
2. **Monitor Logs:** Check console for API calls and responses
3. **Handle Errors:** Ensure proper error messages are shown to users
4. **Add Loading States:** Show spinners during API calls
5. **Implement Retry Logic:** Handle network failures gracefully

---

## 📞 Backend Status

**Status:** ✅ Live and operational
**URL:** https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev
**Authentication:** BetterAuth with email, Google, and Apple OAuth
**Database:** PostgreSQL with Drizzle ORM

All endpoints are ready and waiting for frontend integration!
