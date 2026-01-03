
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

// Prevent the splash screen from auto-hiding before asset loading is complete.
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

  if (!loaded) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "#5B4FE9",
      background: "#FFFFFF",
      card: "#FFFFFF",
      text: "#2C3E50",
      border: "#E1E8ED",
      notification: "#FF6B6B",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "#7C6FFF",
      background: "#1A1A1A",
      card: "#2C2C2C",
      text: "#FFFFFF",
      border: "#3A3A3A",
      notification: "#FF6B6B",
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
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="signin" />
              <Stack.Screen name="onboarding/signup" />
              <Stack.Screen name="onboarding/profile" />
              <Stack.Screen name="onboarding/media" />
              <Stack.Screen name="onboarding/verification" />
              <Stack.Screen name="onboarding/pending" />
              <Stack.Screen name="onboarding/subscription" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="conversation/[id]" />
              <Stack.Screen name="profile/[id]" />
            </Stack>
            <SystemBars style="auto" />
          </GestureHandlerRootView>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
