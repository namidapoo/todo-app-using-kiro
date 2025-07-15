/**
 * Todo item interface
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Storage schema for localStorage
 */
export interface StoredTodos {
  todos: Todo[];
  version: string;
}

/**
 * Todo validation result
 */
export interface TodoValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Props for TodoApp component
 */
export interface TodoAppProps {}

/**
 * Props for TodoList component
 */
export interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Props for TodoItem component
 */
export interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Props for AddTodoForm component
 */
export interface AddTodoFormProps {
  onAdd: (text: string) => void;
}

/**
 * Props for EmptyState component
 */
export interface EmptyStateProps {
  message: string;
}

/**
 * Return type for useTodos hook
 */
export interface UseTodosReturn {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  editTodo: (id: string, newText: string) => void;
  deleteTodo: (id: string) => void;
  loading: boolean;
  error: string | null;
}

/**
 * Return type for useLocalStorage hook
 */
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  loading: boolean;
  error: string | null;
}

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}