import { renderHook, act } from '@testing-library/react';
import { useTheme, getSystemTheme, isDarkModeSupported, applyThemeVariables } from '../useTheme';
import { THEMES } from '@/utils/constants';

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

// matchMedia mock
const mockMatchMedia = (matches: boolean) => ({
  matches,
  media: '(prefers-color-scheme: dark)',
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

describe('useTheme', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    
    // Reset document classes
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
  });

  it('should return light theme as default', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => mockMatchMedia(false)),
    });

    const { result } = renderHook(() => useTheme());
    
    expect(result.current[0]).toBe(THEMES.LIGHT);
  });

  it('should return dark theme when system prefers dark', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => mockMatchMedia(true)),
    });

    const { result } = renderHook(() => useTheme());
    
    expect(result.current[0]).toBe(THEMES.DARK);
  });

  it('should use stored theme from localStorage', () => {
    localStorageMock.setItem('theme', JSON.stringify(THEMES.DARK));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => mockMatchMedia(false)),
    });

    const { result } = renderHook(() => useTheme());
    
    expect(result.current[0]).toBe(THEMES.DARK);
  });

  it('should toggle theme correctly', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => mockMatchMedia(false)),
    });

    const { result } = renderHook(() => useTheme());
    
    expect(result.current[0]).toBe(THEMES.LIGHT);
    
    act(() => {
      result.current[1](); // toggleTheme
    });
    
    expect(result.current[0]).toBe(THEMES.DARK);
    
    act(() => {
      result.current[1](); // toggleTheme again
    });
    
    expect(result.current[0]).toBe(THEMES.LIGHT);
  });

  it('should set theme directly', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => mockMatchMedia(false)),
    });

    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current[2](THEMES.DARK); // setTheme
    });
    
    expect(result.current[0]).toBe(THEMES.DARK);
  });

  it('should apply theme classes to document', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => mockMatchMedia(false)),
    });

    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current[2](THEMES.DARK);
    });
    
    expect(document.documentElement.classList.contains(THEMES.DARK)).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe(THEMES.DARK);
  });

  it('should remove old theme classes when changing theme', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => mockMatchMedia(false)),
    });

    const { result } = renderHook(() => useTheme());
    
    // Set to dark first
    act(() => {
      result.current[2](THEMES.DARK);
    });
    
    expect(document.documentElement.classList.contains(THEMES.DARK)).toBe(true);
    
    // Change to light
    act(() => {
      result.current[2](THEMES.LIGHT);
    });
    
    expect(document.documentElement.classList.contains(THEMES.DARK)).toBe(false);
    expect(document.documentElement.classList.contains(THEMES.LIGHT)).toBe(true);
  });

  it('should handle system theme changes when no stored theme', () => {
    const mockMediaQuery = {
      ...mockMatchMedia(false),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => mockMediaQuery),
    });

    renderHook(() => useTheme());
    
    expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should handle legacy browsers with addListener', () => {
    const mockMediaQuery = {
      ...mockMatchMedia(false),
      addEventListener: undefined,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => mockMediaQuery),
    });

    renderHook(() => useTheme());
    
    expect(mockMediaQuery.addListener).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should handle SSR environment', () => {
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current[0]).toBe(THEMES.LIGHT);
    
    global.window = originalWindow;
  });
});

describe('getSystemTheme', () => {
  it('should return dark when system prefers dark', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => mockMatchMedia(true)),
    });

    expect(getSystemTheme()).toBe(THEMES.DARK);
  });

  it('should return light when system prefers light', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => mockMatchMedia(false)),
    });

    expect(getSystemTheme()).toBe(THEMES.LIGHT);
  });

  it('should return light in SSR environment', () => {
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;
    
    expect(getSystemTheme()).toBe(THEMES.LIGHT);
    
    global.window = originalWindow;
  });
});

describe('isDarkModeSupported', () => {
  it('should return true when dark mode is supported', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        ...mockMatchMedia(false),
        media: '(prefers-color-scheme: dark)',
      })),
    });

    expect(isDarkModeSupported()).toBe(true);
  });

  it('should return false when dark mode is not supported', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        ...mockMatchMedia(false),
        media: 'not all',
      })),
    });

    expect(isDarkModeSupported()).toBe(false);
  });

  it('should return false in SSR environment', () => {
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;
    
    expect(isDarkModeSupported()).toBe(false);
    
    global.window = originalWindow;
  });
});

describe('applyThemeVariables', () => {
  beforeEach(() => {
    // Reset CSS custom properties
    document.documentElement.style.cssText = '';
  });

  it('should apply dark theme variables', () => {
    applyThemeVariables(THEMES.DARK);
    
    const style = document.documentElement.style;
    expect(style.getPropertyValue('--color-background')).toBe('#0f172a');
    expect(style.getPropertyValue('--color-foreground')).toBe('#f8fafc');
  });

  it('should apply light theme variables', () => {
    applyThemeVariables(THEMES.LIGHT);
    
    const style = document.documentElement.style;
    expect(style.getPropertyValue('--color-background')).toBe('#ffffff');
    expect(style.getPropertyValue('--color-foreground')).toBe('#0f172a');
  });

  it('should handle SSR environment', () => {
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;
    
    expect(() => applyThemeVariables(THEMES.DARK)).not.toThrow();
    
    global.window = originalWindow;
  });
});