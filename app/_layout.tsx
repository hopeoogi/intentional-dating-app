
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
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
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onboarding";
    const inTabs = segments[0] === "(tabs)";
    const isWelcome = segments[0] === "welcome";
    const isSignIn = segments[0] === "signin";

    if (!user && !inAuthGroup && !isWelcome && !isSignIn && !inOnboarding) {
      router.replace("/welcome");
    } else if (user && (isWelcome || isSignIn)) {
      router.replace("/(tabs)/discover");
    }
  }, [user, loading, segments]);

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "#FF6B9D",
      background: "#FFFFFF",
      card: "#FFFFFF",
      text: "#333333",
      border: "#E0E0E0",
      notification: "#FF3B30",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "#FF6B9D",
      background: "#1A1A1A",
      card: "#2C2C2C",
      text: "#FFFFFF",
      border: "#3C3C3C",
      notification: "#FF3B30",
    },
  };

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="welcome" />
          <Stack.Screen name="signin" />
          <Stack.Screen name="onboarding/signup" />
          <Stack.Screen name="onboarding/profile" />
          <Stack.Screen name="onboarding/media" />
          <Stack.Screen name="onboarding/verification" />
          <Stack.Screen name="onboarding/subscription" />
          <Stack.Screen name="onboarding/pending" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="conversation/[id]" />
          <Stack.Screen name="conversation/new" />
          <Stack.Screen name="profile/[id]" />
        </Stack>
        <SystemBars style="auto" />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

export default function RootLayout() {
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

  return (
    <>
      <StatusBar style="auto" animated />
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </>
  );
}
