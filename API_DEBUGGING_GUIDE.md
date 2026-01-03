
# API Debugging Guide

## Quick Debug Checklist

### 1. Check Backend URL
```typescript
import { BACKEND_URL, isBackendConfigured } from '@/utils/api';

console.log('Backend URL:', BACKEND_URL);
console.log('Is configured:', isBackendConfigured());
```

Expected output:
```
Backend URL: https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev
Is configured: true
```

### 2. Check Authentication Token
```typescript
import { getBearerToken } from '@/utils/api';

const token = await getBearerToken();
console.log('Token exists:', !!token);
console.log('Token preview:', token?.substring(0, 20) + '...');
```

### 3. Test API Call
```typescript
import { authenticatedGet } from '@/utils/api';

try {
  const result = await authenticatedGet('/api/profile');
  console.log('API call successful:', result);
} catch (error) {
  console.error('API call failed:', error);
}
```

## Common Issues

### Issue: "Authentication token not found"
**Cause**: User is not signed in or token was cleared
**Solution**: 
1. Check if user is signed in: `const { user } = useAuth()`
2. Sign in again if needed
3. Check token storage: `await getBearerToken()`

### Issue: "Backend URL not configured"
**Cause**: app.json missing backendUrl or app needs rebuild
**Solution**:
1. Verify `app.json` has `expo.extra.backendUrl`
2. Restart Expo dev server
3. Clear cache: `npx expo start -c`

### Issue: 401 Unauthorized
**Cause**: Invalid or expired token
**Solution**:
1. Sign out and sign in again
2. Check token in storage
3. Verify backend is accepting the token format

### Issue: 403 Forbidden
**Cause**: User doesn't have permission for this endpoint
**Solution**:
1. Check user role/permissions
2. Verify endpoint requires correct subscription tier
3. Check if profile is verified

### Issue: Network request failed
**Cause**: Backend is down or unreachable
**Solution**:
1. Check internet connection
2. Verify backend URL is correct
3. Test backend directly: `curl https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev/api/profile`

## Logging Best Practices

All API calls automatically log:
- Request method and URL
- Request body (if present)
- Response status
- Response data
- Errors

Example log output:
```
[API] GET https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev/api/matches
[API] Response status: 200
[API] Response data: { matches: [...] }
```

## Testing API Endpoints

### Test Profile Endpoint
```typescript
import { authenticatedGet, authenticatedPut } from '@/utils/api';

// Get profile
const profile = await authenticatedGet('/api/profile');
console.log('Profile:', profile);

// Update profile
const updated = await authenticatedPut('/api/profile', {
  name: 'John Doe',
  bio: 'Hello world'
});
console.log('Updated:', updated);
```

### Test Matches Endpoint
```typescript
import { authenticatedGet } from '@/utils/api';

const matches = await authenticatedGet('/api/matches');
console.log('Matches:', matches);
```

### Test Conversations Endpoint
```typescript
import { authenticatedGet, authenticatedPost } from '@/utils/api';

// Get conversations
const conversations = await authenticatedGet('/api/conversations');
console.log('Conversations:', conversations);

// Create conversation
const newConv = await authenticatedPost('/api/conversations', {
  matchId: '123',
  opener: 'Hello! I noticed we both love hiking...'
});
console.log('New conversation:', newConv);
```

### Test Messages Endpoint
```typescript
import { authenticatedGet, authenticatedPost } from '@/utils/api';

const conversationId = '123';

// Get messages
const messages = await authenticatedGet(`/api/messages/${conversationId}`);
console.log('Messages:', messages);

// Send message
const sent = await authenticatedPost('/api/messages', {
  conversationId,
  content: 'How are you?'
});
console.log('Sent:', sent);
```

## Network Inspector

### Enable Network Logging (React Native Debugger)
1. Open React Native Debugger
2. Go to Network tab
3. See all API requests/responses

### Enable Network Logging (Chrome DevTools)
1. Open Chrome DevTools (web only)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. See all API requests/responses

## Token Debugging

### View Token (Web)
```javascript
// In browser console
localStorage.getItem('intentionaldating.session-token')
```

### View Token (Native)
```typescript
import * as SecureStore from 'expo-secure-store';

const token = await SecureStore.getItemAsync('intentionaldating.session-token');
console.log('Token:', token);
```

### Clear Token (Web)
```javascript
// In browser console
localStorage.removeItem('intentionaldating.session-token')
localStorage.removeItem('intentional-dating_bearer_token')
```

### Clear Token (Native)
```typescript
import * as SecureStore from 'expo-secure-store';

await SecureStore.deleteItemAsync('intentionaldating.session-token');
await SecureStore.deleteItemAsync('intentional-dating_bearer_token');
```

## API Response Formats

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
  "statusCode": 400
}
```

## Troubleshooting Steps

1. **Check logs**: Look for `[API]` prefixed logs in console
2. **Verify token**: Ensure user is authenticated
3. **Test endpoint**: Use curl or Postman to test backend directly
4. **Check network**: Verify internet connection
5. **Clear cache**: Restart app with `npx expo start -c`
6. **Reinstall**: Delete node_modules and reinstall

## Support Commands

```bash
# Clear cache and restart
npx expo start -c

# Check dependencies
npm list better-auth @better-auth/expo

# Reinstall dependencies
rm -rf node_modules
npm install

# Check Expo config
npx expo config

# View logs
npx expo start --dev-client
```

## Contact

For backend API issues, check:
- Backend logs at deployment URL
- API documentation
- Backend health endpoint: `GET /health`
