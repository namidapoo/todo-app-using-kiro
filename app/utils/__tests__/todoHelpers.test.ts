import {
  generateId,
  createTodo,
  validateTodoText,
  filterTodos,
  calculateTodoStats,
  toggleTodo,
  deleteTodo,
  addTodo,
  formatDate,
  safeParseJSON,
  sortTodos,
} from '../todoHelpers';
import { Todo, FilterType } from '@/types/todo';

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'test-uuid-123'),
  },
});

describe('todoHelpers', () => {
  describe('generateId', () => {
    it('should generate a UUID', () => {
      const id = generateId();
      expect(id).toBe('test-uuid-123');
      expect(crypto.randomUUID).toHaveBeenCalled();
    });
  });

  describe('createTodo', () => {
    it('should create a new todo with correct properties', () => {
      const text = '  Test Todo  ';
      const todo = createTodo(text);
      
      expect(todo).toEqual({
        id: 'test-uuid-123',
        text: 'Test Todo',
        completed: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('validateTodoText', () => {
    it('should return valid for proper text', () => {
      const result = validateTodoText('Valid todo text');
      expect(result).toEqual({ isValid: true });
    });

    it('should return invalid for empty text', () => {
      const result = validateTodoText('');
      expect(result).toEqual({
        isValid: false,
        error: 'タスクを入力してください',
      });
    });

    it('should return invalid for whitespace only', () => {
      const result = validateTodoText('   ');
      expect(result).toEqual({
        isValid: false,
        error: 'タスクを入力してください',
      });
    });

    it('should return invalid for text too long', () => {
      const longText = 'a'.repeat(501);
      const result = validateTodoText(longText);
      expect(result).toEqual({
        isValid: false,
        error: 'タスクは500文字以内で入力してください',
      });
    });
  });

  describe('filterTodos', () => {
    const mockTodos: Todo[] = [
      {
        id: '1',
        text: 'Active todo',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        text: 'Completed todo',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return all todos for "all" filter', () => {
      const result = filterTodos(mockTodos, 'all');
      expect(result).toHaveLength(2);
    });

    it('should return only active todos for "active" filter', () => {
      const result = filterTodos(mockTodos, 'active');
      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(false);
    });

    it('should return only completed todos for "completed" filter', () => {
      const result = filterTodos(mockTodos, 'completed');
      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(true);
    });
  });

  describe('calculateTodoStats', () => {
    it('should calculate correct stats', () => {
      const mockTodos: Todo[] = [
        { id: '1', text: 'Todo 1', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', text: 'Todo 2', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '3', text: 'Todo 3', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];

      const stats = calculateTodoStats(mockTodos);
      expect(stats).toEqual({
        total: 3,
        active: 2,
        completed: 1,
      });
    });

    it('should handle empty array', () => {
      const stats = calculateTodoStats([]);
      expect(stats).toEqual({
        total: 0,
        active: 0,
        completed: 0,
      });
    });
  });

  describe('toggleTodo', () => {
    it('should toggle todo completion status', () => {
      const mockTodos: Todo[] = [
        { id: '1', text: 'Todo 1', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];

      const result = toggleTodo(mockTodos, '1');
      expect(result[0].completed).toBe(true);
      expect(result[0].updatedAt).toBeInstanceOf(Date);
    });

    it('should not modify other todos', () => {
      const mockTodos: Todo[] = [
        { id: '1', text: 'Todo 1', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', text: 'Todo 2', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];

      const result = toggleTodo(mockTodos, '1');
      expect(result[0].completed).toBe(true);
      expect(result[1].completed).toBe(false);
    });
  });

  describe('deleteTodo', () => {
    it('should remove todo with specified id', () => {
      const mockTodos: Todo[] = [
        { id: '1', text: 'Todo 1', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', text: 'Todo 2', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];

      const result = deleteTodo(mockTodos, '1');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });
  });

  describe('addTodo', () => {
    it('should add valid todo to the beginning of array', () => {
      const mockTodos: Todo[] = [
        { id: '1', text: 'Existing todo', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];

      const result = addTodo(mockTodos, 'New todo');
      expect(result.todos).toHaveLength(2);
      expect(result.todos[0].text).toBe('New todo');
      expect(result.error).toBeUndefined();
    });

    it('should return error for invalid todo', () => {
      const mockTodos: Todo[] = [];
      const result = addTodo(mockTodos, '');
      expect(result.todos).toHaveLength(0);
      expect(result.error).toBe('タスクを入力してください');
    });
  });

  describe('safeParseJSON', () => {
    it('should parse valid JSON', () => {
      const result = safeParseJSON('{"test": "value"}', {});
      expect(result).toEqual({ test: 'value' });
    });

    it('should return fallback for invalid JSON', () => {
      const fallback = { default: true };
      const result = safeParseJSON('invalid json', fallback);
      expect(result).toEqual(fallback);
    });

    it('should return fallback for null input', () => {
      const fallback = { default: true };
      const result = safeParseJSON(null, fallback);
      expect(result).toEqual(fallback);
    });
  });

  describe('sortTodos', () => {
    it('should sort todos by creation date (newest first)', () => {
      const oldDate = new Date('2023-01-01');
      const newDate = new Date('2023-01-02');
      
      const mockTodos: Todo[] = [
        { id: '1', text: 'Old todo', completed: false, createdAt: oldDate, updatedAt: oldDate },
        { id: '2', text: 'New todo', completed: false, createdAt: newDate, updatedAt: newDate },
      ];

      const result = sortTodos(mockTodos);
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('1');
    });
  });
});