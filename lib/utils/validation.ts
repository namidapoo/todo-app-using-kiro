import { TodoValidationResult } from '@/lib/types/todo';

/**
 * Validates todo text input
 * @param text - The todo text to validate
 * @returns Validation result with isValid flag and optional error message
 */
export function validateTodoText(text: string): TodoValidationResult {
  const trimmedText = text.trim();
  
  if (!trimmedText) {
    return {
      isValid: false,
      error: 'Todo text cannot be empty'
    };
  }
  
  if (trimmedText.length > 500) {
    return {
      isValid: false,
      error: 'Todo text cannot exceed 500 characters'
    };
  }
  
  return {
    isValid: true
  };
}

/**
 * Generates a unique ID for todo items
 * @returns A unique string ID
 */
export function generateTodoId(): string {
  return `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitizes todo text by trimming whitespace
 * @param text - The text to sanitize
 * @returns Sanitized text
 */
export function sanitizeTodoText(text: string): string {
  return text.trim();
}