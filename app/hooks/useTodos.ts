import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Todo, FilterType, TodoStats } from '@/types/todo';
import { STORAGE_KEYS, FILTER_TYPES } from '@/utils/constants';
import {
  addTodo as addTodoHelper,
  toggleTodo as toggleTodoHelper,
  deleteTodo as deleteTodoHelper,
  filterTodos,
  calculateTodoStats,
  sortTodos,
} from '@/utils/todoHelpers';

/**
 * Todo管理のカスタムフック
 * @returns Todo管理に必要な状態と関数
 */
export function useTodos() {
  // LocalStorageからTodoリストを取得
  const [todos, setTodos, todosError] = useLocalStorage<Todo[]>(STORAGE_KEYS.TODOS, []);
  
  // フィルター状態
  const [filter, setFilter] = useState<FilterType>(FILTER_TYPES.all);
  
  // エラー状態
  const [error, setError] = useState<string | null>(null);

  // フィルタリングされたTodoリスト
  const filteredTodos = useMemo(() => {
    const sorted = sortTodos(todos);
    return filterTodos(sorted, filter);
  }, [todos, filter]);

  // Todo統計情報
  const stats = useMemo(() => {
    return calculateTodoStats(todos);
  }, [todos]);

  // Todoを追加する関数
  const addTodo = useCallback((text: string) => {
    try {
      setError(null);
      const result = addTodoHelper(todos, text);
      
      if (result.error) {
        setError(result.error);
        return false;
      }
      
      setTodos(result.todos);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Todoの追加に失敗しました';
      setError(errorMessage);
      return false;
    }
  }, [todos, setTodos]);

  // Todoの完了状態を切り替える関数
  const toggleTodo = useCallback((id: string) => {
    try {
      setError(null);
      const updatedTodos = toggleTodoHelper(todos, id);
      setTodos(updatedTodos);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Todoの更新に失敗しました';
      setError(errorMessage);
      return false;
    }
  }, [todos, setTodos]);

  // Todoを削除する関数
  const deleteTodo = useCallback((id: string) => {
    try {
      setError(null);
      const updatedTodos = deleteTodoHelper(todos, id);
      setTodos(updatedTodos);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Todoの削除に失敗しました';
      setError(errorMessage);
      return false;
    }
  }, [todos, setTodos]);

  // フィルターを変更する関数
  const changeFilter = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  // 完了済みTodoを全て削除する関数
  const clearCompleted = useCallback(() => {
    try {
      setError(null);
      const activeTodos = todos.filter(todo => !todo.completed);
      setTodos(activeTodos);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '完了済みTodoの削除に失敗しました';
      setError(errorMessage);
      return false;
    }
  }, [todos, setTodos]);

  // 全てのTodoを削除する関数
  const clearAll = useCallback(() => {
    try {
      setError(null);
      setTodos([]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '全Todoの削除に失敗しました';
      setError(errorMessage);
      return false;
    }
  }, [setTodos]);

  // 全てのTodoの完了状態を切り替える関数
  const toggleAll = useCallback(() => {
    try {
      setError(null);
      const hasActiveTodos = todos.some(todo => !todo.completed);
      const updatedTodos = todos.map(todo => ({
        ...todo,
        completed: hasActiveTodos,
        updatedAt: new Date(),
      }));
      setTodos(updatedTodos);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '全Todoの更新に失敗しました';
      setError(errorMessage);
      return false;
    }
  }, [todos, setTodos]);

  // 特定のTodoを取得する関数
  const getTodoById = useCallback((id: string): Todo | undefined => {
    return todos.find(todo => todo.id === id);
  }, [todos]);

  // Todoが存在するかチェックする関数
  const hasTodos = useMemo(() => {
    return todos.length > 0;
  }, [todos]);

  // アクティブなTodoが存在するかチェックする関数
  const hasActiveTodos = useMemo(() => {
    return todos.some(todo => !todo.completed);
  }, [todos]);

  // 完了済みTodoが存在するかチェックする関数
  const hasCompletedTodos = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  // エラーをクリアする関数
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 複合エラー（LocalStorageエラーも含む）
  const combinedError = error || todosError;

  return {
    // 状態
    todos: filteredTodos,
    allTodos: todos,
    filter,
    stats,
    error: combinedError,
    
    // フラグ
    hasTodos,
    hasActiveTodos,
    hasCompletedTodos,
    
    // Todo操作関数
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    clearAll,
    toggleAll,
    getTodoById,
    
    // フィルター操作関数
    changeFilter,
    
    // エラー操作関数
    clearError,
  };
}

/**
 * Todo操作の結果を表す型
 */
export interface TodoOperationResult {
  success: boolean;
  error?: string;
}

/**
 * useTodosフックの戻り値の型
 */
export type UseTodosReturn = ReturnType<typeof useTodos>;