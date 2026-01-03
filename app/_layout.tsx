
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, Alert } from "react-native";
import { useNetworkState } from "expo-network";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { AuthProvider } from "@/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const networkState = useNetworkState();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  React.useEffect(() => {
    if (
      !networkState.isConnected &&
      networkState.isInternetReachable === false
    ) {
      Alert.alert(
        "🔌 You are offline",
        "You can keep using the app! Your changes will be saved locally and synced when you are back online."
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  if (!loaded) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "rgb(0, 122, 255)",
      background: "rgb(242, 242, 247)",
      card: "rgb(255, 255, 255)",
      text: "rgb(0, 0, 0)",
      border: "rgb(216, 216, 220)",
      notification: "rgb(255, 59, 48)",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(10, 132, 255)",
      background: "rgb(1, 1, 1)",
      card: "rgb(28, 28, 30)",
      text: "rgb(255, 255, 255)",
      border: "rgb(44, 44, 46)",
      notification: "rgb(255, 69, 58)",
    },
  };

  return (
    <>
      <StatusBar style="auto" animated />
      <ThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
      >
        <AuthProvider>
          <WidgetProvider>
            <GestureHandlerRootView>
              <Stack>
                {/* Welcome Screen (index.tsx) */}
                <Stack.Screen name="index" options={{ headerShown: false }} />
                
                {/* Auth Screens */}
                <Stack.Screen name="signin" options={{ headerShown: false }} />
                <Stack.Screen name="auth-callback" options={{ headerShown: false }} />
                <Stack.Screen name="auth-popup" options={{ headerShown: false }} />
                
                {/* Onboarding Flow */}
                <Stack.Screen 
                  name="onboarding/signup" 
                  options={{ 
                    title: "Sign Up",
                    headerBackTitle: "Back"
                  }} 
                />
                <Stack.Screen 
                  name="onboarding/profile" 
                  options={{ 
                    title: "Profile",
                    headerBackTitle: "Back"
                  }} 
                />
                <Stack.Screen 
                  name="onboarding/media" 
                  options={{ 
                    title: "Photos & Videos",
                    headerBackTitle: "Back"
                  }} 
                />
                <Stack.Screen 
                  name="onboarding/verification" 
                  options={{ 
                    title: "Verification",
                    headerBackTitle: "Back"
                  }} 
                />
                <Stack.Screen 
                  name="onboarding/pending" 
                  options={{ 
                    title: "Pending Approval",
                    headerBackTitle: "Back"
                  }} 
                />
                <Stack.Screen 
                  name="onboarding/subscription" 
                  options={{ 
                    title: "Choose Your Plan",
                    headerBackTitle: "Back"
                  }} 
                />

                {/* Profile Detail */}
                <Stack.Screen 
                  name="profile/[id]" 
                  options={{ 
                    title: "Profile",
                    headerBackTitle: "Back"
                  }} 
                />

                {/* Conversation Detail */}
                <Stack.Screen 
                  name="conversation/[id]" 
                  options={{ 
                    title: "Conversation",
                    headerBackTitle: "Back"
                  }} 
                />

                {/* Main app with tabs */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                {/* Modal Demo Screens */}
                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: "modal",
                    title: "Standard Modal",
                  }}
                />
                <Stack.Screen
                  name="formsheet"
                  options={{
                    presentation: "formSheet",
                    title: "Form Sheet Modal",
                    sheetGrabberVisible: true,
                    sheetAllowedDetents: [0.5, 0.8, 1.0],
                    sheetCornerRadius: 20,
                  }}
                />
                <Stack.Screen
                  name="transparent-modal"
                  options={{
                    presentation: "transparentModal",
                    headerShown: false,
                  }}
                />
              </Stack>
              <SystemBars style={"auto"} />
            </GestureHandlerRootView>
          </WidgetProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
