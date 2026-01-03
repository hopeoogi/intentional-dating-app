
import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || "";
const SESSION_TOKEN_KEY = "better-auth.session_token";

// Web-specific token storage
export const storeWebBearerToken = (token: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    console.log("[Auth] Stored web bearer token");
  }
};

export const getWebBearerToken = (): string | null => {
  if (Platform.OS === "web") {
    return localStorage.getItem(SESSION_TOKEN_KEY);
  }
  return null;
};

// Create the auth client with Expo support
export const authClient = createAuthClient({
  baseURL: BACKEND_URL,
  plugins: [
    expoClient({
      scheme: "intentional",
      storagePrefix: "intentional-dating",
      secureStorage: {
        getItem: async (key: string) => {
          try {
            if (Platform.OS === "web") {
              return localStorage.getItem(key);
            }
            return await SecureStore.getItemAsync(key);
          } catch (error) {
            console.error("[Auth] Error getting item from storage:", error);
            return null;
          }
        },
        setItem: async (key: string, value: string) => {
          try {
            if (Platform.OS === "web") {
              localStorage.setItem(key, value);
            } else {
              await SecureStore.setItemAsync(key, value);
            }
          } catch (error) {
            console.error("[Auth] Error setting item in storage:", error);
          }
        },
        removeItem: async (key: string) => {
          try {
            if (Platform.OS === "web") {
              localStorage.removeItem(key);
            } else {
              await SecureStore.deleteItemAsync(key);
            }
          } catch (error) {
            console.error("[Auth] Error removing item from storage:", error);
          }
        },
      },
    }),
  ],
});

// Helper to get the current session token
export const getSessionToken = async (): Promise<string | null> => {
  try {
    const session = await authClient.getSession();
    if (session?.data?.session?.token) {
      return session.data.session.token;
    }
    
    // Fallback to direct storage access
    if (Platform.OS === "web") {
      return localStorage.getItem(SESSION_TOKEN_KEY);
    } else {
      return await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
    }
  } catch (error) {
    console.error("[Auth] Error getting session token:", error);
    return null;
  }
};
