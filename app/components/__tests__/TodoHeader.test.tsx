import { render, screen } from '@testing-library/react';
import { TodoHeader } from '../TodoHeader';

// Mock ThemeToggle component
jest.mock('../ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Theme Toggle</button>,
}));

describe('TodoHeader', () => {
  it('should render header with title', () => {
    render(<TodoHeader />);
    
    const header = screen.getByRole('banner');
    const title = screen.getByRole('heading', { level: 1 });
    
    expect(header).toBeInTheDocument();
    expect(title).toHaveTextContent('Todo App');
  });

  it('should render subtitle on larger screens', () => {
    render(<TodoHeader />);
    
    const subtitle = screen.getByText('タスクを効率的に管理しましょう');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveClass('hidden', 'sm:block');
  });

  it('should render theme toggle', () => {
    render(<TodoHeader />);
    
    const themeToggle = screen.getByTestId('theme-toggle');
    expect(themeToggle).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<TodoHeader className="custom-class" />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('custom-class');
  });

  it('should have proper layout structure', () => {
    render(<TodoHeader />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('flex', 'items-center', 'justify-between', 'py-6');
  });

  it('should have responsive design classes', () => {
    render(<TodoHeader />);
    
    const subtitle = screen.getByText('タスクを効率的に管理しましょう');
    expect(subtitle).toHaveClass('hidden', 'sm:block');
  });

  it('should have proper text styling', () => {
    render(<TodoHeader />);
    
    const title = screen.getByRole('heading', { level: 1 });
    const subtitle = screen.getByText('タスクを効率的に管理しましょう');
    
    expect(title).toHaveClass('text-3xl', 'font-bold', 'text-gray-900', 'dark:text-gray-100');
    expect(subtitle).toHaveClass('text-sm', 'text-gray-500', 'dark:text-gray-400');
  });
});