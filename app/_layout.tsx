import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../src/contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="selected-locations" options={{ headerShown: false }} />
            <Stack.Screen name="link-results" options={{ headerShown: false }} />
            <Stack.Screen name="all-locations" options={{ headerShown: false }} />
            <Stack.Screen name="all-boards" options={{ headerShown: false }} />
            <Stack.Screen name="board/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="location/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
          </Stack>
          <Toast />
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
