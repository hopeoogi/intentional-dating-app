
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.backendUrl || "";
const AUTH_TOKEN_KEY = "natively_auth_token";
const USER_DATA_KEY = "natively_user_data";

// Simple storage abstraction
const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === "web") {
        return localStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error("[Auth Storage] Error getting item:", error);
      return null;
    }
  },
  
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error("[Auth Storage] Error setting item:", error);
    }
  },
  
  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error("[Auth Storage] Error removing item:", error);
    }
  },
};

export const authClient = {
  // Get stored auth token
  async getToken(): Promise<string | null> {
    return await storage.getItem(AUTH_TOKEN_KEY);
  },

  // Store auth token
  async setToken(token: string): Promise<void> {
    await storage.setItem(AUTH_TOKEN_KEY, token);
  },

  // Remove auth token
  async clearToken(): Promise<void> {
    await storage.removeItem(AUTH_TOKEN_KEY);
    await storage.removeItem(USER_DATA_KEY);
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<any> {
    console.log("[Auth] Signing in with email:", email);
    
    const response = await fetch(`${API_URL}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Auth] Sign in failed:", error);
      throw new Error(error || "Sign in failed");
    }

    const data = await response.json();
    console.log("[Auth] Sign in successful");
    
    if (data.token) {
      await this.setToken(data.token);
    }
    
    if (data.user) {
      await storage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
    }
    
    return data;
  },

  // Sign up with email, phone, and password
  async signUp(email: string, phone: string, password: string): Promise<any> {
    console.log("[Auth] Signing up with email:", email);
    
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, phone, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Auth] Sign up failed:", error);
      throw new Error(error || "Sign up failed");
    }

    const data = await response.json();
    console.log("[Auth] Sign up successful");
    
    if (data.token) {
      await this.setToken(data.token);
    }
    
    if (data.user) {
      await storage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
    }
    
    return data;
  },

  // Get current user
  async getCurrentUser(): Promise<any | null> {
    try {
      const token = await this.getToken();
      if (!token) {
        return null;
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("[Auth] Failed to get current user");
        return null;
      }

      const user = await response.json();
      await storage.setItem(USER_DATA_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error("[Auth] Error getting current user:", error);
      return null;
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    console.log("[Auth] Signing out");
    await this.clearToken();
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  },
};

export function storeWebBearerToken(token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function clearAuthTokens() {
  if (Platform.OS === "web") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }
}
