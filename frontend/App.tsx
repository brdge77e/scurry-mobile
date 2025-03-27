import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MapPin, Layout, User } from 'lucide-react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/contexts/AuthContext';
import { ToastProvider } from './src/hooks/useToast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList, MainTabParamList } from './src/types/navigation';
import { View, StyleSheet } from 'react-native';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

// Import screens
import { HomeScreen } from './src/screens/HomeScreen';
import { LinkResultsScreen } from './src/screens/LinkResultsScreen';
import { SelectedLocationsScreen } from './src/screens/SelectedLocationsScreen';
import { AllLocationsScreen } from './src/screens/AllLocationsScreen';
import { AllBoardsScreen } from './src/screens/AllBoardsScreen';
import { BoardScreen } from './src/screens/BoardScreen';
import { LocationDetailsScreen } from './src/screens/LocationDetailsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import NotFoundScreen from './src/screens/NotFoundScreen';
import { BoardDetailsScreen } from './src/screens/BoardDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const queryClient = new QueryClient();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6A62B7',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AllLocations"
        component={AllLocationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AllBoards"
        component={AllBoardsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Layout size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Auth-aware navigation component
function AppNavigator() {
  // This component will be rendered inside AuthProvider
  const { useAuth } = require('./src/contexts/AuthContext');
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="SelectedLocations" component={SelectedLocationsScreen} />
          <Stack.Screen name="LinkResults" component={LinkResultsScreen} />
          <Stack.Screen name="Board" component={BoardScreen} />
          <Stack.Screen
            name="LocationDetails"
            component={LocationDetailsScreen}
            options={{
              headerShown: true,
              title: 'Location Details',
            }}
          />
          <Stack.Screen
            name="BoardDetails"
            component={BoardDetailsScreen}
            options={{
              headerShown: true,
              title: 'Board Details',
            }}
          />
        </>
      )}
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
}

// ToastWrapper to render the toast
function ToastWrapper({ children }: { children: React.ReactNode }) {
  const { useToast } = require('./src/hooks/useToast');
  const { toast } = useToast();

  return (
    <View style={styles.container}>
      {children}
      {toast}
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <ToastProvider>
            <AuthProvider>
              <ToastWrapper>
                <AppNavigator />
              </ToastWrapper>
            </AuthProvider>
          </ToastProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 