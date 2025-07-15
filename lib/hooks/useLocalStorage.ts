'use client';

import { useState, useEffect } from 'react';
import { UseLocalStorageReturn } from '@/lib/types/todo';

/**
 * Custom hook for localStorage operations with error handling
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Object with value, setValue, loading, and error states
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load value from localStorage on mount
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      if (typeof window === 'undefined') {
        // Server-side rendering
        setLoading(false);
        return;
      }

      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedValue = JSON.parse(item);
        setValue(parsedValue);
      }
    } catch (err) {
      console.error(`Error loading from localStorage key "${key}":`, err);
      setError('Failed to load data from storage');
      // Keep initial value on error
    } finally {
      setLoading(false);
    }
  }, [key]);

  // Function to update both state and localStorage
  const updateValue = (newValue: T) => {
    try {
      setError(null);
      setValue(newValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (err) {
      console.error(`Error saving to localStorage key "${key}":`, err);
      setError('Failed to save data to storage');
    }
  };

  return {
    value,
    setValue: updateValue,
    loading,
    error
  };
}