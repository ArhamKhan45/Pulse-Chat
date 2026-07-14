import "../global.css";
import { Stack } from "expo-router";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#0B0B0B",
            },
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              animation: "fade",
            }}
          />
          <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
        </Stack>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
