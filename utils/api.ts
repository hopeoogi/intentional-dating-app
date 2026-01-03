
/**
 * API Utilities for Intentional Dating App
 */

import Constants from "expo-constants";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || "";
const BEARER_TOKEN_KEY = "intentional-dating_bearer_token";
const SESSION_TOKEN_KEY = "intentionaldating.session-token";
const BETTER_AUTH_SESSION_KEY = "better-auth.session_token";

export const isBackendConfigured = (): boolean => {
  return !!BACKEND_URL && BACKEND_URL.length > 0;
};

export const getBearerToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      // Try multiple token locations for BetterAuth compatibility
      const betterAuthToken = localStorage.getItem(BETTER_AUTH_SESSION_KEY);
      if (betterAuthToken) {
        console.log('[API] Found better-auth session token (web)');
        return betterAuthToken;
      }
      
      const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);
      if (sessionToken) {
        console.log('[API] Found session token (web)');
        return sessionToken;
      }
      
      const bearerToken = localStorage.getItem(BEARER_TOKEN_KEY);
      if (bearerToken) {
        console.log('[API] Found bearer token (web)');
        return bearerToken;
      }
      
      console.log('[API] No token found (web)');
      return null;
    } else {
      // Try multiple token locations for BetterAuth compatibility
      const betterAuthToken = await SecureStore.getItemAsync(BETTER_AUTH_SESSION_KEY);
      if (betterAuthToken) {
        console.log('[API] Found better-auth session token (native)');
        return betterAuthToken;
      }
      
      const sessionToken = await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
      if (sessionToken) {
        console.log('[API] Found session token (native)');
        return sessionToken;
      }
      
      const bearerToken = await SecureStore.getItemAsync(BEARER_TOKEN_KEY);
      if (bearerToken) {
        console.log('[API] Found bearer token (native)');
        return bearerToken;
      }
      
      console.log('[API] No token found (native)');
      return null;
    }
  } catch (error) {
    console.error("[API] Error retrieving bearer token:", error);
    return null;
  }
};

export const apiCall = async <T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  if (!isBackendConfigured()) {
    throw new Error("Backend URL not configured. Please rebuild the app.");
  }

  const url = `${BACKEND_URL}${endpoint}`;
  console.log(`[API] ${options?.method || "GET"} ${url}`);
  if (options?.body) {
    console.log("[API] Request body:", options.body);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      const text = await response.text();
      console.error("[API] Error response:", response.status, text);
      
      // Handle specific error cases
      if (response.status === 401) {
        throw new Error("Authentication required. Please sign in again.");
      } else if (response.status === 403) {
        throw new Error("Access denied. Please check your permissions.");
      } else {
        throw new Error(`API error: ${response.status} - ${text}`);
      }
    }

    const data = await response.json();
    console.log("[API] Response data:", data);
    return data;
  } catch (error) {
    console.error("[API] Request failed:", error);
    throw error;
  }
};

export const authenticatedApiCall = async <T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const token = await getBearerToken();

  if (!token) {
    console.error('[API] No authentication token found');
    throw new Error("Authentication required. Please sign in to continue.");
  }

  console.log('[API] Using authentication token');
  return apiCall<T>(endpoint, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

// Convenience methods
export const apiGet = async <T = any>(endpoint: string): Promise<T> => 
  apiCall<T>(endpoint, { method: "GET" });

export const apiPost = async <T = any>(endpoint: string, data: any): Promise<T> => 
  apiCall<T>(endpoint, { method: "POST", body: JSON.stringify(data) });

export const authenticatedGet = async <T = any>(endpoint: string): Promise<T> => 
  authenticatedApiCall<T>(endpoint, { method: "GET" });

export const authenticatedPost = async <T = any>(endpoint: string, data: any): Promise<T> => 
  authenticatedApiCall<T>(endpoint, { method: "POST", body: JSON.stringify(data) });

export const authenticatedPut = async <T = any>(endpoint: string, data: any): Promise<T> => 
  authenticatedApiCall<T>(endpoint, { method: "PUT", body: JSON.stringify(data) });

export const authenticatedDelete = async <T = any>(endpoint: string): Promise<T> => 
  authenticatedApiCall<T>(endpoint, { method: "DELETE" });
