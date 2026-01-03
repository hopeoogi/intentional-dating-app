
import Constants from 'expo-constants';
import { authClient } from '@/lib/auth';
import { Platform } from 'react-native';

export const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || 'https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev';

// Log the backend URL on startup for debugging
console.log('[API] Backend URL configured:', BACKEND_URL);
console.log('[API] Platform:', Platform.OS);

export async function getBearerToken(): Promise<string | null> {
  try {
    const session = await authClient.getSession();
    if (session?.session?.token) {
      return session.session.token;
    }

    // Check web localStorage as fallback
    if (Platform.OS === 'web') {
      const webToken = localStorage.getItem('intentional_bearer_token');
      if (webToken) {
        return webToken;
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting bearer token:', error);
    return null;
  }
}

async function apiCall(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<any> {
  try {
    const token = await getBearerToken();
    const url = `${BACKEND_URL}${endpoint}`;

    console.log(`[API] ${method} ${url}`);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return null;
  } catch (error: any) {
    console.error(`[API] Error in ${method} ${endpoint}:`, error);
    throw error;
  }
}

export async function authenticatedGet(endpoint: string): Promise<any> {
  return apiCall(endpoint, 'GET');
}

export async function authenticatedPost(endpoint: string, body: any): Promise<any> {
  return apiCall(endpoint, 'POST', body);
}

export async function authenticatedPut(endpoint: string, body: any): Promise<any> {
  return apiCall(endpoint, 'PUT', body);
}

export async function authenticatedDelete(endpoint: string): Promise<any> {
  return apiCall(endpoint, 'DELETE');
}
