import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useToast } from '../hooks/useToast';

interface User {
  email: string;
  id: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, provider?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define protected routes that require authentication
const protectedRoutes = [
  "MainTabs",
  "SelectedLocations",
  "LinkResults",
  "AllLocations",
  "AllBoards",
  "Board",
  "LocationDetails",
  "Profile"
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { showToast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("auth_user");
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        setIsLoading(false);
        
        // If no user is logged in and we're on a protected route, redirect to login
        if (!storedUser && isProtectedRoute(navigation.getState().routes[0].name)) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigation]);

  // Helper function to check if the current route is protected
  const isProtectedRoute = (routeName: string | undefined) => {
    return protectedRoutes.some(route => routeName === route);
  };

  const login = async (email: string, provider = "email") => {
    setIsLoading(true);
    try {
      // In a real app, you would call an API here
      // For now, we'll simulate a successful login
      const mockUser = {
        email,
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: email.split("@")[0]
      };
      
      // Save to AsyncStorage
      await AsyncStorage.setItem("auth_user", JSON.stringify(mockUser));
      setUser(mockUser);
      
      showToast(`Successfully logged in with ${provider}`);
      
      // Reset navigation to MainTabs
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (error) {
      console.error("Error logging in:", error);
      showToast("Failed to login. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("auth_user");
      setUser(null);
      
      // Reset navigation to Login
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      
      showToast("You have been logged out");
    } catch (error) {
      console.error("Error logging out:", error);
      showToast("Failed to logout. Please try again.", "error");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 