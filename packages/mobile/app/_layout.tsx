import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Dimensions, Platform } from "react-native";
import "react-native-reanimated";

import { SeriesTrackerProvider } from "@/context/series-tracker-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotifierWrapper } from "react-native-notifier";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  const windowWidth = Dimensions.get("window").width;
  const { background: backgroundColor } = useThemeColor({}, ["background"]);

  useEffect(() => {
    // Ensure the app remains upright even when the device is in landscape
    if (Platform.OS !== "web") {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      ).catch(() => {
        // no-op
      });
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor }}
          edges={["top", "bottom", "left", "right"]}
        >
          <StatusBar style="auto" />
          <QueryClientProvider client={queryClient}>
            <SeriesTrackerProvider>
              <PaperProvider>
                <ThemeProvider
                  value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                  <NotifierWrapper>
                    <Stack
                      screenOptions={{
                        contentStyle: {
                          maxWidth: Math.min(windowWidth, 400),
                          width: "100%",
                          alignSelf: "center",
                          backgroundColor,
                        },
                      }}
                    >
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="import"
                        options={{
                          presentation: "modal",
                          title: "Modal",
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name="export"
                        options={{
                          presentation: "modal",
                          title: "Modal",
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name="search"
                        options={{
                          presentation: "modal",
                          title: "Modal",
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name="show/[imdbId]"
                        options={{
                          headerShown: false,
                          contentStyle: { backgroundColor },
                        }}
                      />
                      <Stack.Screen
                        name="preview/[imdbId]"
                        options={{
                          headerShown: false,
                          contentStyle: { backgroundColor },
                        }}
                      />
                    </Stack>
                  </NotifierWrapper>
                </ThemeProvider>
              </PaperProvider>
            </SeriesTrackerProvider>
          </QueryClientProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
