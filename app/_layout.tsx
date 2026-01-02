
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Log backend URL on startup
  useEffect(() => {
    const backendUrl = require('expo-constants').default.expoConfig?.extra?.backendUrl;
    console.log('[App] Backend URL configured:', backendUrl);
  }, []);

  if (!loaded) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "#E91E63",
      background: "#FFFFFF",
      card: "#F8F9FA",
      text: "#1A1A1A",
      border: "#E5E7EB",
      notification: "#E91E63",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "#FF6B9D",
      background: "#1A1A1A",
      card: "#2A2A2A",
      text: "#FFFFFF",
      border: "#3A3A3A",
      notification: "#FF6B9D",
    },
  };

  return (
    <>
      <StatusBar style="auto" animated />
      <ThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
      >
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding/auth" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding/signup" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding/profile" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding/media" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding/verification" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding/pending" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding/subscription" options={{ headerShown: false }} />
              <Stack.Screen name="auth-popup" options={{ headerShown: false }} />
              <Stack.Screen name="auth-callback" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen 
                name="conversation/[id]" 
                options={{ 
                  headerShown: true,
                  title: "Conversation",
                  headerBackTitle: "Back"
                }} 
              />
              <Stack.Screen 
                name="profile/[id]" 
                options={{ 
                  headerShown: true,
                  title: "Profile",
                  headerBackTitle: "Back"
                }} 
              />
            </Stack>
            <SystemBars style="auto" />
          </GestureHandlerRootView>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
