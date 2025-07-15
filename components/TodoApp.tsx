'use client';

import { useTodos } from '@/lib/hooks/useTodos';
import { AddTodoForm } from './ui/AddTodoForm';
import { TodoList } from './ui/TodoList';
import { EmptyState } from './ui/EmptyState';

export function TodoApp() {
  const {
    todos,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    loading,
    error
  } = useTodos();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading your todos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Todo App
          </h1>
          <p className="text-gray-600">
            Stay organized and get things done
          </p>
        </header>

        {/* Storage error warning */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Storage Warning
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  {error} Your todos may not persist between sessions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main>
          {/* Add todo form */}
          <AddTodoForm onAdd={addTodo} />

          {/* Todo list or empty state */}
          {todos.length > 0 ? (
            <TodoList
              todos={todos}
              onToggleComplete={toggleTodo}
              onEdit={editTodo}
              onDelete={deleteTodo}
            />
          ) : (
            <EmptyState message="Add your first todo above to get started!" />
          )}
        </main>
      </div>
    </div>
  );
}