import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Theme } from '@/types/todo';
import { STORAGE_KEYS, THEMES } from '@/utils/constants';

/**
 * テーマ管理のカスタムフック
 * @returns [theme, toggleTheme, setTheme, error] のタプル
 */
export function useTheme(): [
  Theme,
  () => void,
  (theme: Theme) => void,
  string | null
] {
  // システムのダークモード設定を取得
  const getSystemTheme = useCallback((): Theme => {
    if (typeof window === 'undefined') {
      return THEMES.LIGHT;
    }
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEMES.DARK
      : THEMES.LIGHT;
  }, []);

  // LocalStorageからテーマを取得（初期値はシステム設定）
  const [theme, setStoredTheme, error] = useLocalStorage<Theme>(
    STORAGE_KEYS.THEME,
    getSystemTheme()
  );

  // テーマを切り替える関数
  const toggleTheme = useCallback(() => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setStoredTheme(newTheme);
  }, [theme, setStoredTheme]);

  // テーマを直接設定する関数
  const setTheme = useCallback((newTheme: Theme) => {
    setStoredTheme(newTheme);
  }, [setStoredTheme]);

  // DOMにテーマクラスを適用
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const root = window.document.documentElement;
    
    // 既存のテーマクラスを削除
    root.classList.remove(THEMES.LIGHT, THEMES.DARK);
    
    // 新しいテーマクラスを追加
    root.classList.add(theme);
    
    // data属性も設定（CSS変数用）
    root.setAttribute('data-theme', theme);
  }, [theme]);

  // システムのダークモード設定変更を監視
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // ユーザーが明示的にテーマを設定していない場合のみシステム設定に従う
      const storedTheme = window.localStorage.getItem(STORAGE_KEYS.THEME);
      if (!storedTheme) {
        const systemTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
        setStoredTheme(systemTheme);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
      return () => mediaQuery.removeListener(handleSystemThemeChange);
    }
  }, [setStoredTheme]);

  return [theme, toggleTheme, setTheme, error];
}

/**
 * 現在のシステムテーマを取得する関数
 * @returns システムのテーマ設定
 */
export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return THEMES.LIGHT;
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEMES.DARK
    : THEMES.LIGHT;
}

/**
 * ダークモードがサポートされているかチェックする関数
 * @returns ダークモードサポートの有無
 */
export function isDarkModeSupported(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all';
}

/**
 * テーマに基づいてCSSカスタムプロパティを設定する関数
 * @param theme 設定するテーマ
 */
export function applyThemeVariables(theme: Theme): void {
  if (typeof window === 'undefined') {
    return;
  }

  const root = window.document.documentElement;
  
  if (theme === THEMES.DARK) {
    root.style.setProperty('--color-background', '#0f172a');
    root.style.setProperty('--color-foreground', '#f8fafc');
    root.style.setProperty('--color-muted', '#334155');
    root.style.setProperty('--color-muted-foreground', '#94a3b8');
    root.style.setProperty('--color-border', '#334155');
    root.style.setProperty('--color-input', '#1e293b');
    root.style.setProperty('--color-primary', '#3b82f6');
    root.style.setProperty('--color-primary-foreground', '#f8fafc');
    root.style.setProperty('--color-secondary', '#1e293b');
    root.style.setProperty('--color-secondary-foreground', '#f8fafc');
    root.style.setProperty('--color-accent', '#1e293b');
    root.style.setProperty('--color-accent-foreground', '#f8fafc');
    root.style.setProperty('--color-destructive', '#ef4444');
    root.style.setProperty('--color-destructive-foreground', '#f8fafc');
  } else {
    root.style.setProperty('--color-background', '#ffffff');
    root.style.setProperty('--color-foreground', '#0f172a');
    root.style.setProperty('--color-muted', '#f1f5f9');
    root.style.setProperty('--color-muted-foreground', '#64748b');
    root.style.setProperty('--color-border', '#e2e8f0');
    root.style.setProperty('--color-input', '#ffffff');
    root.style.setProperty('--color-primary', '#3b82f6');
    root.style.setProperty('--color-primary-foreground', '#f8fafc');
    root.style.setProperty('--color-secondary', '#f1f5f9');
    root.style.setProperty('--color-secondary-foreground', '#0f172a');
    root.style.setProperty('--color-accent', '#f1f5f9');
    root.style.setProperty('--color-accent-foreground', '#0f172a');
    root.style.setProperty('--color-destructive', '#ef4444');
    root.style.setProperty('--color-destructive-foreground', '#f8fafc');
  }
}