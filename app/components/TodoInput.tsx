'use client';

import { useState, useRef } from 'react';
import { validateTodoText } from '@/utils/todoHelpers';

interface TodoInputProps {
  onAddTodo: (text: string) => boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function TodoInput({
  onAddTodo,
  placeholder = 'タスクを入力してください...',
  className = '',
  disabled = false,
}: TodoInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disabled || isSubmitting) {
      return;
    }

    // バリデーション
    const validation = validateTodoText(inputValue);
    if (!validation.isValid) {
      setError(validation.error || 'エラーが発生しました');
      inputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const success = onAddTodo(inputValue.trim());
      
      if (success) {
        setInputValue('');
        setError(null);
      } else {
        setError('タスクの追加に失敗しました');
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setIsSubmitting(false);
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // リアルタイムバリデーション（エラーがある場合のみ）
    if (error) {
      const validation = validateTodoText(value);
      if (validation.isValid) {
        setError(null);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setInputValue('');
      setError(null);
      inputRef.current?.blur();
    }
  };

  const hasError = Boolean(error);
  const isEmpty = inputValue.trim().length === 0;

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isSubmitting}
              className={`
                w-full px-4 py-3 text-base
                border rounded-lg
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed
                ${hasError
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }
                placeholder:text-gray-500 dark:placeholder:text-gray-400
              `}
              aria-label="新しいタスクを入力"
              aria-describedby={hasError ? 'todo-input-error' : undefined}
              aria-invalid={hasError}
              maxLength={500}
            />
            
            {/* Character count indicator */}
            {inputValue.length > 400 && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <span
                  className={`text-xs ${
                    inputValue.length > 500
                      ? 'text-red-500'
                      : inputValue.length > 450
                      ? 'text-yellow-500'
                      : 'text-gray-500'
                  }`}
                  aria-label={`${inputValue.length}/500文字`}
                >
                  {inputValue.length}/500
                </span>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={disabled || isSubmitting || isEmpty}
            className={`
              px-6 py-3 text-base font-medium rounded-lg
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isEmpty || disabled || isSubmitting
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              }
            `}
            aria-label="タスクを追加"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>追加中...</span>
              </div>
            ) : (
              '追加'
            )}
          </button>
        </div>
        
        {/* Error message */}
        {hasError && (
          <div
            id="todo-input-error"
            className="mt-2 text-sm text-red-600 dark:text-red-400 animate-slide-up"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Help text */}
        {!hasError && !disabled && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enterキーまたは追加ボタンでタスクを追加できます。Escキーでクリアできます。
          </div>
        )}
      </div>
    </form>
  );
}

export default TodoInput;