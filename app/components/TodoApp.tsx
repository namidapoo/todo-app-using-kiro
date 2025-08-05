'use client';

import { useTodos } from '@/hooks/useTodos';
import { useTheme } from '@/hooks/useTheme';
import { TodoHeader } from './TodoHeader';
import { TodoInput } from './TodoInput';
import { TodoFilters } from './TodoFilters';
import { TodoList } from './TodoList';

interface TodoAppProps {
  className?: string;
}

export function TodoApp({ className = '' }: TodoAppProps) {
  const {
    todos,
    filter,
    stats,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    changeFilter,
    clearError,
  } = useTodos();

  const [theme] = useTheme();

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <TodoHeader />

        {/* Main Content */}
        <main className="pb-8">
          {/* Input Section */}
          <div className="mb-6">
            <TodoInput onAddTodo={addTodo} />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                  aria-label="エラーを閉じる"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Filters Section */}
          <div className="mb-6">
            <TodoFilters
              filter={filter}
              onFilterChange={changeFilter}
              stats={stats}
            />
          </div>

          {/* Todo List */}
          <TodoList
            todos={todos}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
          />
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          <p>
            Built with{' '}
            <span className="text-red-500" aria-label="love">
              ♥
            </span>{' '}
            using Next.js, React, TypeScript, and Tailwind CSS
          </p>
          <p className="mt-2">
            Current theme: {theme === 'dark' ? 'ダーク' : 'ライト'}モード
          </p>
        </footer>
      </div>
    </div>
  );
}

export default TodoApp;