import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onHide: () => void;
}

function ToastMessage({ message, type, onHide }: ToastProps) {
  const backgroundColor = {
    success: '#10B981',
    error: '#EF4444',
    info: '#3B82F6',
  }[type];

  return (
    <View style={[styles.toast, { backgroundColor }]}>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.closeButton} onPress={onHide}>
        ×
      </Text>
    </View>
  );
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  toast: JSX.Element | null;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset animation value
    fadeAnim.setValue(0);
    setToast({ message, type });

    // Start animation sequence
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast(null);
    });
  }, [fadeAnim]);

  const hideToast = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setToast(null);
    });
  }, [fadeAnim]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const renderToast = () => {
    if (!toast) return null;

    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onHide={hideToast}
        />
      </Animated.View>
    );
  };

  return (
    <ToastContext.Provider value={{ showToast, toast: renderToast() }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  closeButton: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
}); 