import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../useTodos';
import { Todo, FilterType } from '@/types/todo';
import { FILTER_TYPES } from '@/utils/constants';

// LocalStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'test-uuid-123'),
  },
});

describe('useTodos', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    (crypto.randomUUID as jest.Mock).mockReturnValue('test-uuid-123');
  });

  it('should initialize with empty todos', () => {
    const { result } = renderHook(() => useTodos());
    
    expect(result.current.todos).toEqual([]);
    expect(result.current.allTodos).toEqual([]);
    expect(result.current.filter).toBe(FILTER_TYPES.all);
    expect(result.current.stats).toEqual({ total: 0, active: 0, completed: 0 });
    expect(result.current.hasTodos).toBe(false);
    expect(result.current.hasActiveTodos).toBe(false);
    expect(result.current.hasCompletedTodos).toBe(false);
  });

  it('should load todos from localStorage', () => {
    const mockTodos: Todo[] = [
      {
        id: '1',
        text: 'Test todo',
        completed: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
    ];
    
    localStorageMock.setItem('todos', JSON.stringify(mockTodos));
    
    const { result } = renderHook(() => useTodos());
    
    expect(result.current.allTodos).toEqual(mockTodos);
    expect(result.current.hasTodos).toBe(true);
    expect(result.current.hasActiveTodos).toBe(true);
  });

  describe('addTodo', () => {
    it('should add a new todo', () => {
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        const success = result.current.addTodo('New todo');
        expect(success).toBe(true);
      });
      
      expect(result.current.allTodos).toHaveLength(1);
      expect(result.current.allTodos[0].text).toBe('New todo');
      expect(result.current.allTodos[0].completed).toBe(false);
      expect(result.current.stats.total).toBe(1);
      expect(result.current.stats.active).toBe(1);
    });

    it('should reject empty todo', () => {
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        const success = result.current.addTodo('');
        expect(success).toBe(false);
      });
      
      expect(result.current.allTodos).toHaveLength(0);
      expect(result.current.error).toContain('タスクを入力してください');
    });

    it('should reject todo that is too long', () => {
      const { result } = renderHook(() => useTodos());
      const longText = 'a'.repeat(501);
      
      act(() => {
        const success = result.current.addTodo(longText);
        expect(success).toBe(false);
      });
      
      expect(result.current.allTodos).toHaveLength(0);
      expect(result.current.error).toContain('500文字以内');
    });
  });

  describe('toggleTodo', () => {
    it('should toggle todo completion', () => {
      const { result } = renderHook(() => useTodos());
      
      // Add a todo first
      act(() => {
        result.current.addTodo('Test todo');
      });
      
      const todoId = result.current.allTodos[0].id;
      
      act(() => {
        const success = result.current.toggleTodo(todoId);
        expect(success).toBe(true);
      });
      
      expect(result.current.allTodos[0].completed).toBe(true);
      expect(result.current.stats.completed).toBe(1);
      expect(result.current.stats.active).toBe(0);
    });

    it('should handle non-existent todo', () => {
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        const success = result.current.toggleTodo('non-existent-id');
        expect(success).toBe(true); // toggleTodoHelper doesn't fail for non-existent IDs
      });
      
      expect(result.current.allTodos).toHaveLength(0);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', () => {
      const { result } = renderHook(() => useTodos());
      
      // Add a todo first
      act(() => {
        result.current.addTodo('Test todo');
      });
      
      const todoId = result.current.allTodos[0].id;
      
      act(() => {
        const success = result.current.deleteTodo(todoId);
        expect(success).toBe(true);
      });
      
      expect(result.current.allTodos).toHaveLength(0);
      expect(result.current.stats.total).toBe(0);
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useTodos());
      
      // Add some todos
      act(() => {
        result.current.addTodo('Active todo 1');
        result.current.addTodo('Active todo 2');
        result.current.addTodo('Completed todo');
      });
      
      // Complete one todo
      act(() => {
        const completedTodoId = result.current.allTodos.find(t => t.text === 'Completed todo')?.id;
        if (completedTodoId) {
          result.current.toggleTodo(completedTodoId);
        }
      });
    });

    it('should filter active todos', () => {
      const { result } = renderHook(() => useTodos());
      
      // Setup todos (same as beforeEach but in the test)
      act(() => {
        result.current.addTodo('Active todo 1');
        result.current.addTodo('Active todo 2');
        result.current.addTodo('Completed todo');
      });
      
      act(() => {
        const completedTodoId = result.current.allTodos.find(t => t.text === 'Completed todo')?.id;
        if (completedTodoId) {
          result.current.toggleTodo(completedTodoId);
        }
      });
      
      act(() => {
        result.current.changeFilter(FILTER_TYPES.active);
      });
      
      expect(result.current.filter).toBe(FILTER_TYPES.active);
      expect(result.current.todos).toHaveLength(2);
      expect(result.current.todos.every(todo => !todo.completed)).toBe(true);
    });

    it('should filter completed todos', () => {
      const { result } = renderHook(() => useTodos());
      
      // Setup todos
      act(() => {
        result.current.addTodo('Active todo');
        result.current.addTodo('Completed todo');
      });
      
      act(() => {
        const completedTodoId = result.current.allTodos.find(t => t.text === 'Completed todo')?.id;
        if (completedTodoId) {
          result.current.toggleTodo(completedTodoId);
        }
      });
      
      act(() => {
        result.current.changeFilter(FILTER_TYPES.completed);
      });
      
      expect(result.current.filter).toBe(FILTER_TYPES.completed);
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].completed).toBe(true);
    });

    it('should show all todos', () => {
      const { result } = renderHook(() => useTodos());
      
      // Setup todos
      act(() => {
        result.current.addTodo('Active todo');
        result.current.addTodo('Completed todo');
      });
      
      act(() => {
        const completedTodoId = result.current.allTodos.find(t => t.text === 'Completed todo')?.id;
        if (completedTodoId) {
          result.current.toggleTodo(completedTodoId);
        }
      });
      
      act(() => {
        result.current.changeFilter(FILTER_TYPES.all);
      });
      
      expect(result.current.filter).toBe(FILTER_TYPES.all);
      expect(result.current.todos).toHaveLength(2);
    });
  });

  describe('bulk operations', () => {
    it('should clear completed todos', () => {
      const { result } = renderHook(() => useTodos());
      
      // Add and complete some todos
      act(() => {
        result.current.addTodo('Active todo');
        result.current.addTodo('Completed todo 1');
        result.current.addTodo('Completed todo 2');
      });
      
      act(() => {
        const completedTodos = result.current.allTodos.filter(t => t.text.includes('Completed'));
        completedTodos.forEach(todo => {
          result.current.toggleTodo(todo.id);
        });
      });
      
      act(() => {
        const success = result.current.clearCompleted();
        expect(success).toBe(true);
      });
      
      expect(result.current.allTodos).toHaveLength(1);
      expect(result.current.allTodos[0].text).toBe('Active todo');
    });

    it('should clear all todos', () => {
      const { result } = renderHook(() => useTodos());
      
      // Add some todos
      act(() => {
        result.current.addTodo('Todo 1');
        result.current.addTodo('Todo 2');
      });
      
      act(() => {
        const success = result.current.clearAll();
        expect(success).toBe(true);
      });
      
      expect(result.current.allTodos).toHaveLength(0);
      expect(result.current.stats.total).toBe(0);
    });

    it('should toggle all todos to completed when some are active', () => {
      const { result } = renderHook(() => useTodos());
      
      // Add some todos
      act(() => {
        result.current.addTodo('Todo 1');
        result.current.addTodo('Todo 2');
      });
      
      act(() => {
        const success = result.current.toggleAll();
        expect(success).toBe(true);
      });
      
      expect(result.current.allTodos.every(todo => todo.completed)).toBe(true);
      expect(result.current.stats.completed).toBe(2);
      expect(result.current.stats.active).toBe(0);
    });

    it('should toggle all todos to active when all are completed', () => {
      const { result } = renderHook(() => useTodos());
      
      // Add and complete all todos
      act(() => {
        result.current.addTodo('Todo 1');
        result.current.addTodo('Todo 2');
      });
      
      act(() => {
        result.current.allTodos.forEach(todo => {
          result.current.toggleTodo(todo.id);
        });
      });
      
      act(() => {
        const success = result.current.toggleAll();
        expect(success).toBe(true);
      });
      
      expect(result.current.allTodos.every(todo => !todo.completed)).toBe(true);
      expect(result.current.stats.active).toBe(2);
      expect(result.current.stats.completed).toBe(0);
    });
  });

  describe('utility functions', () => {
    it('should get todo by id', () => {
      const { result } = renderHook(() => useTodos());
      
      act(() => {
        result.current.addTodo('Test todo');
      });
      
      const todoId = result.current.allTodos[0].id;
      const foundTodo = result.current.getTodoById(todoId);
      
      expect(foundTodo).toBeDefined();
      expect(foundTodo?.text).toBe('Test todo');
    });

    it('should return undefined for non-existent todo', () => {
      const { result } = renderHook(() => useTodos());
      
      const foundTodo = result.current.getTodoById('non-existent-id');
      
      expect(foundTodo).toBeUndefined();
    });

    it('should clear error', () => {
      const { result } = renderHook(() => useTodos());
      
      // Trigger an error
      act(() => {
        result.current.addTodo('');
      });
      
      expect(result.current.error).toBeTruthy();
      
      act(() => {
        result.current.clearError();
      });
      
      expect(result.current.error).toBeNull();
    });
  });

  describe('statistics', () => {
    it('should calculate correct statistics', () => {
      const { result } = renderHook(() => useTodos());
      
      // Add mixed todos
      act(() => {
        result.current.addTodo('Active todo 1');
        result.current.addTodo('Active todo 2');
        result.current.addTodo('Completed todo');
      });
      
      // Complete one todo
      act(() => {
        const completedTodoId = result.current.allTodos.find(t => t.text === 'Completed todo')?.id;
        if (completedTodoId) {
          result.current.toggleTodo(completedTodoId);
        }
      });
      
      expect(result.current.stats).toEqual({
        total: 3,
        active: 2,
        completed: 1,
      });
      
      expect(result.current.hasTodos).toBe(true);
      expect(result.current.hasActiveTodos).toBe(true);
      expect(result.current.hasCompletedTodos).toBe(true);
    });
  });
});