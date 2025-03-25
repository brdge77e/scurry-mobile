import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onHide: () => void;
}

function Toast({ message, type, onHide }: ToastProps) {
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
  const [fadeAnim] = useState(new Animated.Value(0));

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type });
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

  const Toast = () => {
    if (!toast) return null;

    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => {
            fadeAnim.setValue(0);
            setToast(null);
          }}
        />
      </Animated.View>
    );
  };

  return (
    <ToastContext.Provider value={{ showToast, toast: Toast() }}>
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