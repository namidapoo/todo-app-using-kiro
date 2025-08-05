import { useState, useEffect, useCallback } from 'react';
import { safeParseJSON } from '@/utils/todoHelpers';

/**
 * LocalStorageと同期するカスタムフック
 * @param key LocalStorageのキー
 * @param initialValue 初期値
 * @returns [value, setValue, error] のタプル
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, string | null] {
  const [error, setError] = useState<string | null>(null);
  
  // 初期値を取得する関数
  const getStoredValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return safeParseJSON(item, initialValue);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setError(`データの読み込みに失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // 値を設定する関数
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setError(null);
      
      // 関数の場合は現在の値を渡して実行
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      setError(`データの保存に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [key, storedValue]);

  // コンポーネントマウント時にLocalStorageから値を読み込む
  useEffect(() => {
    const value = getStoredValue();
    if (JSON.stringify(value) !== JSON.stringify(storedValue)) {
      setStoredValue(value);
    }
  }, [getStoredValue, storedValue]);

  // 他のタブでLocalStorageが変更された場合の同期
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = safeParseJSON(e.newValue, initialValue);
          setStoredValue(newValue);
          setError(null);
        } catch (error) {
          console.error(`Error syncing localStorage key "${key}":`, error);
          setError(`データの同期に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, error];
}

/**
 * LocalStorageからキーを削除するヘルパー関数
 * @param key 削除するキー
 */
export function removeFromLocalStorage(key: string): void {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * LocalStorageの使用可能容量をチェックする関数
 * @returns 使用可能かどうか
 */
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') {
      return false;
    }
    
    const testKey = '__localStorage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * LocalStorageの使用量を取得する関数（概算）
 * @returns 使用量（バイト）
 */
export function getLocalStorageSize(): number {
  if (!isLocalStorageAvailable()) {
    return 0;
  }

  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
}