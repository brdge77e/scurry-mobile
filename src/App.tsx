import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MapPin, Layout, User } from 'lucide-react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './hooks/useToast';
import { RootStackParamList, MainTabParamList } from './types/navigation';

// Import screens
import { HomeScreen } from './screens/HomeScreen';
import { LinkResultsScreen } from './screens/LinkResultsScreen';
import { SelectedLocationsScreen } from './screens/SelectedLocationsScreen';
import { AllLocationsScreen } from './screens/AllLocationsScreen';
import { AllBoardsScreen } from './screens/AllBoardsScreen';
import { BoardScreen } from './screens/BoardScreen';
import { LocationDetailsScreen } from './screens/LocationDetailsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LoginScreen } from './screens/LoginScreen';
import { NotFoundScreen } from './screens/NotFoundScreen';
import { BoardDetailsScreen } from './screens/BoardDetailsScreen';

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
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <NavigationContainer>
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
          </NavigationContainer>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
} 