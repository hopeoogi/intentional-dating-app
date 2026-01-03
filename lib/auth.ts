
import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const API_URL = "https://6ytjugugmhrw5w5dguny2u79uz83r3tz.app.specular.dev";

const BEARER_TOKEN_KEY = "intentionaldating_bearer_token";
const SESSION_TOKEN_KEY = "better-auth.session_token";

// Platform-specific storage: localStorage for web, SecureStore for native
const storage = Platform.OS === "web"
  ? {
      getItem: (key: string) => {
        const value = localStorage.getItem(key);
        console.log(`[Auth Storage] Getting ${key}:`, value ? 'found' : 'not found');
        return value;
      },
      setItem: (key: string, value: string) => {
        console.log(`[Auth Storage] Setting ${key}`);
        localStorage.setItem(key, value);
        // Also store in our expected location for API calls
        if (key.includes('session')) {
          localStorage.setItem(SESSION_TOKEN_KEY, value);
        }
      },
      deleteItem: (key: string) => {
        console.log(`[Auth Storage] Deleting ${key}`);
        localStorage.removeItem(key);
        if (key.includes('session')) {
          localStorage.removeItem(SESSION_TOKEN_KEY);
        }
      },
    }
  : {
      getItem: async (key: string) => {
        const value = await SecureStore.getItemAsync(key);
        console.log(`[Auth Storage] Getting ${key}:`, value ? 'found' : 'not found');
        return value;
      },
      setItem: async (key: string, value: string) => {
        console.log(`[Auth Storage] Setting ${key}`);
        await SecureStore.setItemAsync(key, value);
        // Also store in our expected location for API calls
        if (key.includes('session')) {
          await SecureStore.setItemAsync(SESSION_TOKEN_KEY, value);
        }
      },
      deleteItem: async (key: string) => {
        console.log(`[Auth Storage] Deleting ${key}`);
        await SecureStore.deleteItemAsync(key);
        if (key.includes('session')) {
          await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
        }
      },
    };

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: "intentionaldating",
      storagePrefix: "intentionaldating",
      storage,
    }),
  ],
  // On web, use bearer token for authenticated requests
  ...(Platform.OS === "web" && {
    fetchOptions: {
      auth: {
        type: "Bearer" as const,
        token: () => localStorage.getItem(SESSION_TOKEN_KEY) || localStorage.getItem(BEARER_TOKEN_KEY) || "",
      },
    },
  }),
});

export function storeWebBearerToken(token: string) {
  if (Platform.OS === "web") {
    console.log('[Auth] Storing web bearer token');
    localStorage.setItem(BEARER_TOKEN_KEY, token);
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  }
}

export function clearAuthTokens() {
  if (Platform.OS === "web") {
    console.log('[Auth] Clearing auth tokens');
    localStorage.removeItem(BEARER_TOKEN_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
  }
}

export { API_URL };
