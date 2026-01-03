
import * as SecureStore from 'expo-secure-store';

export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export async function getBearerToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('authToken');
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
}

export async function authenticatedGet(endpoint: string) {
  const token = await getBearerToken();
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function authenticatedPost(endpoint: string, data: any) {
  const token = await getBearerToken();
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function authenticatedPut(endpoint: string, data: any) {
  const token = await getBearerToken();
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
