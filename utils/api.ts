
/**
 * API Utilities for Intentional Dating App
 */

import Constants from "expo-constants";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || "";
const BEARER_TOKEN_KEY = "intentional-dating_bearer_token";

export const isBackendConfigured = (): boolean => {
  return !!BACKEND_URL && BACKEND_URL.length > 0;
};

export const getBearerToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      // Try BetterAuth token first, then fallback to bearer token
      const betterAuthToken = localStorage.getItem("intentionaldating.session-token");
      if (betterAuthToken) {
        return betterAuthToken;
      }
      return localStorage.getItem(BEARER_TOKEN_KEY);
    } else {
      // Try BetterAuth token first, then fallback to bearer token
      const betterAuthToken = await SecureStore.getItemAsync("intentionaldating.session-token");
      if (betterAuthToken) {
        return betterAuthToken;
      }
      return await SecureStore.getItemAsync(BEARER_TOKEN_KEY);
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
      throw new Error(`API error: ${response.status} - ${text}`);
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
    throw new Error("Authentication token not found. Please sign in.");
  }

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
