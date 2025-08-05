import { renderHook, act } from '@testing-library/react';
import { useLocalStorage, removeFromLocalStorage, isLocalStorageAvailable, getLocalStorageSize } from '../useLocalStorage';

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
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
    hasOwnProperty: jest.fn((key: string) => key in store),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Storage event mock
const mockStorageEvent = (key: string, newValue: string | null) => {
  const event = new StorageEvent('storage', {
    key,
    newValue,
    oldValue: null,
    storageArea: window.localStorage,
  });
  window.dispatchEvent(event);
};

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
    expect(result.current[2]).toBeNull(); // no error
  });

  it('should return stored value from localStorage', () => {
    localStorageMock.setItem('test-key', JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value is set', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
  });

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));
    
    act(() => {
      result.current[1](prev => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(1));
  });

  it('should handle complex objects', () => {
    const initialObject = { count: 0, items: [] };
    const { result } = renderHook(() => useLocalStorage('test-object', initialObject));
    
    const newObject = { count: 1, items: ['item1'] };
    
    act(() => {
      result.current[1](newObject);
    });
    
    expect(result.current[0]).toEqual(newObject);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-object', JSON.stringify(newObject));
  });

  it('should handle localStorage errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[2]).toContain('データの保存に失敗しました');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('should handle invalid JSON in localStorage', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    localStorageMock.getItem.mockReturnValue('invalid json');
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
    
    expect(result.current[0]).toBe('fallback');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('should sync with storage events from other tabs', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      mockStorageEvent('test-key', JSON.stringify('updated-from-other-tab'));
    });
    
    expect(result.current[0]).toBe('updated-from-other-tab');
  });

  it('should ignore storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      mockStorageEvent('other-key', JSON.stringify('other-value'));
    });
    
    expect(result.current[0]).toBe('initial');
  });

  it('should handle SSR (server-side rendering)', () => {
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'ssr-initial'));
    
    expect(result.current[0]).toBe('ssr-initial');
    
    global.window = originalWindow;
  });
});

describe('removeFromLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should remove item from localStorage', () => {
    localStorageMock.setItem('test-key', 'test-value');
    
    removeFromLocalStorage('test-key');
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
  });

  it('should handle errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    localStorageMock.removeItem.mockImplementation(() => {
      throw new Error('Remove failed');
    });
    
    removeFromLocalStorage('test-key');
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('isLocalStorageAvailable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when localStorage is available', () => {
    expect(isLocalStorageAvailable()).toBe(true);
  });

  it('should return false when localStorage throws error', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage not available');
    });
    
    expect(isLocalStorageAvailable()).toBe(false);
  });

  it('should return false in SSR environment', () => {
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;
    
    expect(isLocalStorageAvailable()).toBe(false);
    
    global.window = originalWindow;
  });
});

describe('getLocalStorageSize', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should calculate localStorage size', () => {
    localStorageMock.setItem('key1', 'value1');
    localStorageMock.setItem('key2', 'value2');
    
    // Mock hasOwnProperty to return true for our test keys
    Object.defineProperty(localStorageMock, 'key1', { value: 'value1', enumerable: true });
    Object.defineProperty(localStorageMock, 'key2', { value: 'value2', enumerable: true });
    
    const size = getLocalStorageSize();
    expect(size).toBeGreaterThan(0);
  });

  it('should return 0 when localStorage is not available', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage not available');
    });
    
    const size = getLocalStorageSize();
    expect(size).toBe(0);
  });
});