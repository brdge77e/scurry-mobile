import { useState, useCallback } from 'react';
import { ToastProps } from '../types';

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = useCallback((props: ToastProps) => {
    setToast(props);
    setTimeout(() => {
      setToast(null);
    }, props.duration || 3000);
  }, []);

  return {
    toast,
    showToast,
  };
} 