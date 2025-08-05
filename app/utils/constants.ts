import { FilterType } from '@/types/todo';

// LocalStorage keys
export const STORAGE_KEYS = {
  TODOS: 'todos',
  THEME: 'theme',
} as const;

// Filter types
export const FILTER_TYPES: Record<FilterType, FilterType> = {
  all: 'all',
  active: 'active',
  completed: 'completed',
} as const;

// Filter labels for UI
export const FILTER_LABELS: Record<FilterType, string> = {
  all: 'すべて',
  active: '未完了',
  completed: '完了済み',
} as const;

// Validation constants
export const VALIDATION = {
  MAX_TODO_LENGTH: 500,
  MIN_TODO_LENGTH: 1,
} as const;

// Theme constants
export const THEMES = {
  LIGHT: 'light' as const,
  DARK: 'dark' as const,
} as const;