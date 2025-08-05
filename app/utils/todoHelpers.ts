import { Todo, FilterType, TodoStats } from '@/types/todo';
import { VALIDATION } from './constants';

/**
 * UUID v4を生成する
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * 新しいTodoオブジェクトを作成する
 */
export function createTodo(text: string): Todo {
  const now = new Date();
  return {
    id: generateId(),
    text: text.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Todoのテキストを検証する
 */
export function validateTodoText(text: string): { isValid: boolean; error?: string } {
  const trimmedText = text.trim();
  
  if (trimmedText.length === 0) {
    return { isValid: false, error: 'タスクを入力してください' };
  }
  
  if (trimmedText.length < VALIDATION.MIN_TODO_LENGTH) {
    return { isValid: false, error: 'タスクは1文字以上で入力してください' };
  }
  
  if (trimmedText.length > VALIDATION.MAX_TODO_LENGTH) {
    return { isValid: false, error: `タスクは${VALIDATION.MAX_TODO_LENGTH}文字以内で入力してください` };
  }
  
  return { isValid: true };
}

/**
 * フィルタータイプに基づいてTodoリストをフィルタリングする
 */
export function filterTodos(todos: Todo[], filter: FilterType): Todo[] {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    case 'all':
    default:
      return todos;
  }
}

/**
 * Todoリストの統計情報を計算する
 */
export function calculateTodoStats(todos: Todo[]): TodoStats {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const active = total - completed;
  
  return {
    total,
    active,
    completed,
  };
}

/**
 * Todoの完了状態を切り替える
 */
export function toggleTodo(todos: Todo[], id: string): Todo[] {
  return todos.map(todo => {
    if (todo.id === id) {
      return {
        ...todo,
        completed: !todo.completed,
        updatedAt: new Date(),
      };
    }
    return todo;
  });
}

/**
 * Todoを削除する
 */
export function deleteTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter(todo => todo.id !== id);
}

/**
 * Todoを追加する
 */
export function addTodo(todos: Todo[], text: string): { todos: Todo[]; error?: string } {
  const validation = validateTodoText(text);
  
  if (!validation.isValid) {
    return { todos, error: validation.error };
  }
  
  const newTodo = createTodo(text);
  return { todos: [newTodo, ...todos] };
}

/**
 * 日付を読みやすい形式でフォーマットする
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * LocalStorageから安全にデータを取得する
 */
export function safeParseJSON<T>(jsonString: string | null, fallback: T): T {
  if (!jsonString) {
    return fallback;
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    return parsed || fallback;
  } catch (error) {
    console.warn('Failed to parse JSON from localStorage:', error);
    return fallback;
  }
}

/**
 * Todoリストをソートする（作成日時の降順）
 */
export function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}