'use client';

import { useCallback, useMemo } from 'react';
import { Todo, StoredTodos, UseTodosReturn } from '@/lib/types/todo';
import { useLocalStorage } from './useLocalStorage';
import { validateTodoText, generateTodoId, sanitizeTodoText } from '@/lib/utils/validation';

const STORAGE_KEY = 'todos';
const STORAGE_VERSION = '1.0';

/**
 * Custom hook for managing todos with localStorage persistence
 * @returns Object with todos array and CRUD operations
 */
export function useTodos(): UseTodosReturn {
  const initialStoredTodos: StoredTodos = {
    todos: [],
    version: STORAGE_VERSION
  };

  const {
    value: storedTodos,
    setValue: setStoredTodos,
    loading,
    error: storageError
  } = useLocalStorage<StoredTodos>(STORAGE_KEY, initialStoredTodos);

  // Sort todos: incomplete first, then completed, by creation date
  const sortedTodos = useMemo(() => {
    return [...storedTodos.todos].sort((a, b) => {
      // First sort by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [storedTodos.todos]);

  // Add a new todo
  const addTodo = useCallback((text: string) => {
    const validation = validateTodoText(text);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const sanitizedText = sanitizeTodoText(text);
    const now = new Date();
    const newTodo: Todo = {
      id: generateTodoId(),
      text: sanitizedText,
      completed: false,
      createdAt: now,
      updatedAt: now
    };

    setStoredTodos({
      ...storedTodos,
      todos: [...storedTodos.todos, newTodo]
    });
  }, [storedTodos, setStoredTodos]);

  // Toggle todo completion status
  const toggleTodo = useCallback((id: string) => {
    const updatedTodos = storedTodos.todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    );

    setStoredTodos({
      ...storedTodos,
      todos: updatedTodos
    });
  }, [storedTodos, setStoredTodos]);

  // Edit todo text
  const editTodo = useCallback((id: string, newText: string) => {
    const validation = validateTodoText(newText);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const sanitizedText = sanitizeTodoText(newText);
    const updatedTodos = storedTodos.todos.map(todo =>
      todo.id === id
        ? { ...todo, text: sanitizedText, updatedAt: new Date() }
        : todo
    );

    setStoredTodos({
      ...storedTodos,
      todos: updatedTodos
    });
  }, [storedTodos, setStoredTodos]);

  // Delete a todo
  const deleteTodo = useCallback((id: string) => {
    const updatedTodos = storedTodos.todos.filter(todo => todo.id !== id);
    
    setStoredTodos({
      ...storedTodos,
      todos: updatedTodos
    });
  }, [storedTodos, setStoredTodos]);

  return {
    todos: sortedTodos,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    loading,
    error: storageError
  };
}