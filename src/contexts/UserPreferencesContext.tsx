import React, { createContext, useContext, useEffect, useState } from "react";

interface UserPreferencesState {
  theme: "light" | "dark" | "system";
  fontSize: "default" | "large" | "extra-large";
  animations: boolean;
  dashboardLayout: string[];
  quickActions: string[];
  keyboardShortcuts: Record<string, string>;
  compactMode: boolean;
  timezone?: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

const defaultPreferences: UserPreferencesState = {
  theme: "system",
  fontSize: "default",
  animations: true,
  dashboardLayout: ["healthMetrics", "appointments", "medications", "recentActivity"],
  quickActions: ["book-appointment", "add-medication", "add-record", "emergency"],
  keyboardShortcuts: {
    search: "/",
    settings: "Ctrl+,",
    emergency: "Ctrl+E",
    appointments: "g a",
    medications: "g m",
    records: "g r",
    home: "g h",
  },
  compactMode: false,
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h",
  notificationPreferences: {
    email: true,
    push: true,
    sms: false,
    inApp: true,
  },
};

interface UserPreferencesContextValue {
  preferences: UserPreferencesState;
  updatePreference: <K extends keyof UserPreferencesState>(
    key: K,
    value: UserPreferencesState[K]
  ) => void;
  resetPreferences: () => void;
  updateLayout: (layout: string[]) => void;
  addQuickAction: (actionId: string) => void;
  removeQuickAction: (actionId: string) => void;
  reorderQuickActions: (actionIds: string[]) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextValue | undefined>(
  undefined
);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [preferences, setPreferences] = useState<UserPreferencesState>(defaultPreferences);

  useEffect(() => {
    // Load preferences from localStorage
    const storedPreferences = localStorage.getItem("healthspectrum-preferences");
    if (storedPreferences) {
      try {
        const parsedPreferences = JSON.parse(storedPreferences);
        // Merge with default preferences to ensure all fields exist even if
        // the stored preferences are from an older version
        setPreferences((prev) => ({ ...prev, ...parsedPreferences }));
      } catch (error) {
        console.error("Failed to parse user preferences:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme
    if (preferences.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (preferences.theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    // Apply font size
    document.documentElement.dataset.fontSize = preferences.fontSize;

    // Apply animations setting
    if (!preferences.animations) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }

    // Save preferences to localStorage
    localStorage.setItem("healthspectrum-preferences", JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof UserPreferencesState>(
    key: K,
    value: UserPreferencesState[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem("healthspectrum-preferences");
  };

  const updateLayout = (layout: string[]) => {
    setPreferences((prev) => ({ ...prev, dashboardLayout: layout }));
  };

  const addQuickAction = (actionId: string) => {
    if (!preferences.quickActions.includes(actionId)) {
      setPreferences((prev) => ({
        ...prev,
        quickActions: [...prev.quickActions, actionId],
      }));
    }
  };

  const removeQuickAction = (actionId: string) => {
    setPreferences((prev) => ({
      ...prev,
      quickActions: prev.quickActions.filter((id) => id !== actionId),
    }));
  };

  const reorderQuickActions = (actionIds: string[]) => {
    setPreferences((prev) => ({
      ...prev,
      quickActions: actionIds,
    }));
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updatePreference,
        resetPreferences,
        updateLayout,
        addQuickAction,
        removeQuickAction,
        reorderQuickActions,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextValue => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider");
  }
  return context;
};
