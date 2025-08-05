import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { THEMES } from '@/utils/constants';

// Mock the useTheme hook
jest.mock('@/hooks/useTheme');
const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe('ThemeToggle', () => {
  const mockToggleTheme = jest.fn();
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTheme.mockReturnValue([
      THEMES.LIGHT,
      mockToggleTheme,
      mockSetTheme,
      null,
    ]);
  });

  it('should render correctly in light mode', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-checked', 'false');
    expect(button).toHaveAttribute('aria-label', 'ダークモードに切り替え');
  });

  it('should render correctly in dark mode', () => {
    mockUseTheme.mockReturnValue([
      THEMES.DARK,
      mockToggleTheme,
      mockSetTheme,
      null,
    ]);

    render(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-checked', 'true');
    expect(button).toHaveAttribute('aria-label', 'ライトモードに切り替え');
  });

  it('should call toggleTheme when clicked', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    fireEvent.click(button);
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should call toggleTheme when Enter key is pressed', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    fireEvent.keyDown(button, { key: 'Enter' });
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should call toggleTheme when Space key is pressed', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    fireEvent.keyDown(button, { key: ' ' });
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should not call toggleTheme for other keys', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    fireEvent.keyDown(button, { key: 'Tab' });
    fireEvent.keyDown(button, { key: 'Escape' });
    
    expect(mockToggleTheme).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<ThemeToggle className="custom-class" />);
    
    const button = screen.getByRole('switch');
    expect(button).toHaveClass('custom-class');
  });

  it('should have proper accessibility attributes', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    
    // Check ARIA attributes
    expect(button).toHaveAttribute('role', 'switch');
    expect(button).toHaveAttribute('aria-checked');
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('title');
    
    // Check screen reader text
    expect(screen.getByText('ダークモードに切り替え')).toHaveClass('sr-only');
  });

  it('should show correct visual state for light mode', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    expect(button).toHaveClass('bg-gray-200');
    expect(button).not.toHaveClass('bg-blue-600');
  });

  it('should show correct visual state for dark mode', () => {
    mockUseTheme.mockReturnValue([
      THEMES.DARK,
      mockToggleTheme,
      mockSetTheme,
      null,
    ]);

    render(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    expect(button).toHaveClass('bg-blue-600');
    expect(button).not.toHaveClass('bg-gray-200');
  });

  it('should have focus styles', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    expect(button).toHaveClass('focus:outline-none');
    expect(button).toHaveClass('focus:ring-2');
    expect(button).toHaveClass('focus:ring-blue-500');
    expect(button).toHaveClass('focus:ring-offset-2');
  });

  it('should prevent default behavior on key press', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    
    fireEvent.keyDown(button, event);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should display sun icon in light mode', () => {
    render(<ThemeToggle />);
    
    // Sun icon should be visible (opacity-100)
    const sunIcon = screen.getByRole('switch').querySelector('.opacity-100 svg');
    expect(sunIcon).toBeInTheDocument();
    expect(sunIcon).toHaveClass('text-yellow-500');
  });

  it('should display moon icon in dark mode', () => {
    mockUseTheme.mockReturnValue([
      THEMES.DARK,
      mockToggleTheme,
      mockSetTheme,
      null,
    ]);

    render(<ThemeToggle />);
    
    // Moon icon should be visible (opacity-100)
    const moonIcon = screen.getByRole('switch').querySelector('.opacity-100 svg');
    expect(moonIcon).toBeInTheDocument();
    expect(moonIcon).toHaveClass('text-blue-300');
  });

  it('should have smooth transitions', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    expect(button).toHaveClass('transition-colors');
    expect(button).toHaveClass('duration-200');
    expect(button).toHaveClass('ease-in-out');
    
    // Check toggle circle transitions
    const toggleCircle = button.querySelector('.transform');
    expect(toggleCircle).toHaveClass('transition');
    expect(toggleCircle).toHaveClass('duration-200');
    expect(toggleCircle).toHaveClass('ease-in-out');
  });
});