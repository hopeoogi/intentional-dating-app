
import * as React from "react";
import { createContext, useCallback, useContext } from "react";
import { Platform } from "react-native";

// Conditionally import iOS-only package
let ExtensionStorage: any = null;
if (Platform.OS === 'ios') {
  try {
    // Dynamic require to avoid ESLint import resolution errors
    ExtensionStorage = require("@bacons/apple-targets").ExtensionStorage;
  } catch (error) {
    console.log("@bacons/apple-targets not available on this platform");
  }
}

// Initialize storage with your group ID (iOS only)
const storage = Platform.OS === 'ios' && ExtensionStorage 
  ? new ExtensionStorage("group.com.<user_name>.<app_name>")
  : null;

type WidgetContextType = {
  refreshWidget: () => void;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  // Update widget state whenever what we want to show changes (iOS only)
  React.useEffect(() => {
    if (Platform.OS === 'ios' && ExtensionStorage) {
      // set widget_state to null if we want to reset the widget
      // storage?.set("widget_state", null);

      // Refresh widget
      ExtensionStorage.reloadWidget();
    }
  }, []);

  const refreshWidget = useCallback(() => {
    if (Platform.OS === 'ios' && ExtensionStorage) {
      ExtensionStorage.reloadWidget();
    }
  }, []);

  return (
    <WidgetContext.Provider value={{ refreshWidget }}>
      {children}
    </WidgetContext.Provider>
  );
}

export const useWidget = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
