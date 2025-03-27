import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationState, CommonActions } from "@react-navigation/native";

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
  "Main",
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
  const [isInitialized, setIsInitialized] = useState(false);
  const navigation = useNavigation();
  const navigationRef = useRef(navigation);

  // API Integration Comments:
  // This authentication context should be connected to your backend API
  // The implementation should include these API calls:
  //
  // 1. Authentication check on app start:
  // Replace the AsyncStorage check with an API token validation:
  // const checkAuth = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("auth_token");
  //     
  //     if (token) {
  //       // Validate token with the backend
  //       const response = await api.validateToken(token);
  //       
  //       if (response.valid) {
  //         setUser(response.user);
  //       } else {
  //         // Token is invalid or expired
  //         await AsyncStorage.removeItem("auth_token");
  //         await AsyncStorage.removeItem("user");
  //       }
  //     }
  //     
  //     setIsLoading(false);
  //     setIsInitialized(true);
  //     
  //     // Redirect logic remains the same...
  //   } catch (error) {
  //     console.error("Error checking auth:", error);
  //     setIsLoading(false);
  //     setIsInitialized(true);
  //   }
  // };
  //
  // 2. Login function with API integration:
  // const login = async (email: string, password: string, provider = "email") => {
  //   setIsLoading(true);
  //   try {
  //     let response;
  //     
  //     if (provider === "email") {
  //       response = await api.login(email, password);
  //     } else {
  //       // Handle social login
  //       response = await api.socialAuth(provider, token);
  //     }
  //     
  //     await AsyncStorage.setItem("auth_token", response.token);
  //     await AsyncStorage.setItem("user", JSON.stringify(response.user));
  //     
  //     setUser(response.user);
  //     
  //     // Navigation logic remains the same...
  //   } catch (error) {
  //     console.error("Error logging in:", error);
  //     throw error; // Rethrow so the login screen can handle it
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  //
  // 3. Logout function with API integration:
  // const logout = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("auth_token");
  //     
  //     if (token) {
  //       // Notify the backend about logout (optional)
  //       await api.logout(token);
  //     }
  //     
  //     await AsyncStorage.removeItem("auth_token");
  //     await AsyncStorage.removeItem("user");
  //     setUser(null);
  //     
  //     // Navigation logic remains the same...
  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //   }
  // };

  // Update the navigation reference whenever it changes
  useEffect(() => {
    navigationRef.current = navigation;
  }, [navigation]);

  // Check if user is already logged in
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("auth_user");
        
        if (isMounted) {
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          
          setIsLoading(false);
          setIsInitialized(true);
          
          // Only redirect if navigation is available, we're on a protected route and not authenticated
          if (!storedUser && navigation && navigation.getState) {
            try {
              const state = navigation.getState();
              const currentRoute = state?.routes[0]?.name;
              
              if (currentRoute && protectedRoutes.includes(currentRoute)) {
                // Use CommonActions instead of reset
                navigation.dispatch(
                  CommonActions.navigate({
                    name: 'Login'
                  })
                );
              }
            } catch (navError) {
              console.error("Navigation error:", navError);
              // Navigation might not be fully initialized yet, that's ok
            }
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        if (isMounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

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
      
      // Reset navigation to Main if navigation is available
      if (navigationRef.current) {
        setTimeout(() => {
          navigationRef.current.dispatch(
            CommonActions.navigate({
              name: 'Main'
            })
          );
        }, 100);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("auth_user");
      setUser(null);
      
      // Reset navigation to Login if navigation is available
      if (navigationRef.current) {
        setTimeout(() => {
          navigationRef.current.dispatch(
            CommonActions.navigate({
              name: 'Login'
            })
          );
        }, 100);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Don't render children until initialization is complete
  if (!isInitialized) {
    return null;
  }

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