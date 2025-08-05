import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from '../TodoInput';

describe('TodoInput', () => {
  const mockOnAddTodo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'タスクを追加' });
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'タスクを入力してください...');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled(); // Should be disabled when input is empty
  });

  it('should render with custom placeholder', () => {
    render(<TodoInput onAddTodo={mockOnAddTodo} placeholder="カスタムプレースホルダー" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'カスタムプレースホルダー');
  });

  it('should enable submit button when input has text', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'タスクを追加' });
    
    expect(button).toBeDisabled();
    
    await user.type(input, 'Test todo');
    
    expect(button).not.toBeDisabled();
  });

  it('should call onAddTodo when form is submitted', async () => {
    const user = userEvent.setup();
    mockOnAddTodo.mockReturnValue(true);
    
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'タスクを追加' });
    
    await user.type(input, 'Test todo');
    await user.click(button);
    
    expect(mockOnAddTodo).toHaveBeenCalledWith('Test todo');
  });

  it('should call onAddTodo when Enter key is pressed', async () => {
    const user = userEvent.setup();
    mockOnAddTodo.mockReturnValue(true);
    
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'Test todo');
    await user.keyboard('{Enter}');
    
    expect(mockOnAddTodo).toHaveBeenCalledWith('Test todo');
  });

  it('should clear input after successful submission', async () => {
    const user = userEvent.setup();
    mockOnAddTodo.mockReturnValue(true);
    
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'Test todo');
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('should not clear input after failed submission', async () => {
    const user = userEvent.setup();
    mockOnAddTodo.mockReturnValue(false);
    
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'Test todo');
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(input).toHaveValue('Test todo');
    });
  });

  it('should show error for empty input submission', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    
    // Try to submit empty input by typing space and then deleting
    await user.type(input, ' ');
    await user.clear(input);
    
    // Force form submission
    fireEvent.submit(input.closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('タスクを入力してください');
    });
  });

  it('should show error for input that is too long', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    const longText = 'a'.repeat(501);
    
    await user.type(input, longText);
    fireEvent.submit(input.closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('500文字以内');
    });
  });

  it('should clear error when valid input is entered', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    
    // First, trigger an error
    fireEvent.submit(input.closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    
    // Then type valid input
    await user.type(input, 'Valid todo');
    
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('should clear input and error when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    
    // Type some text and trigger error
    await user.type(input, 'Test');
    fireEvent.submit(input.closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    
    // Press Escape
    await user.keyboard('{Escape}');
    
    expect(input).toHaveValue('');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should show character count when approaching limit', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    const longText = 'a'.repeat(450);
    
    await user.type(input, longText);
    
    expect(screen.getByText('450/500')).toBeInTheDocument();
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    // Mock a slow onAddTodo function
    mockOnAddTodo.mockImplementation(() => {
      return new Promise(resolve => setTimeout(() => resolve(true), 100));
    });
    
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'Test todo');
    await user.keyboard('{Enter}');
    
    // Should show loading state
    expect(screen.getByText('追加中...')).toBeInTheDocument();
    expect(input).toBeDisabled();
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.queryByText('追加中...')).not.toBeInTheDocument();
    });
  });

  it('should be disabled when disabled prop is true', () => {
    render(<TodoInput onAddTodo={mockOnAddTodo} disabled />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'タスクを追加' });
    
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('should apply custom className', () => {
    render(<TodoInput onAddTodo={mockOnAddTodo} className="custom-class" />);
    
    const form = screen.getByRole('textbox').closest('form');
    expect(form).toHaveClass('custom-class');
  });

  it('should have proper accessibility attributes', () => {
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveAttribute('aria-label', '新しいタスクを入力');
    expect(input).toHaveAttribute('maxLength', '500');
  });

  it('should associate error message with input', async () => {
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    
    // Trigger error
    fireEvent.submit(input.closest('form')!);
    
    await waitFor(() => {
      const errorElement = screen.getByRole('alert');
      expect(input).toHaveAttribute('aria-describedby', errorElement.id);
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('should show help text when no error', () => {
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    expect(screen.getByText(/Enterキーまたは追加ボタンでタスクを追加できます/)).toBeInTheDocument();
  });

  it('should not show help text when disabled', () => {
    render(<TodoInput onAddTodo={mockOnAddTodo} disabled />);
    
    expect(screen.queryByText(/Enterキーまたは追加ボタンでタスクを追加できます/)).not.toBeInTheDocument();
  });

  it('should handle onAddTodo throwing an error', async () => {
    const user = userEvent.setup();
    mockOnAddTodo.mockImplementation(() => {
      throw new Error('Network error');
    });
    
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'Test todo');
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('予期しないエラーが発生しました');
    });
  });

  it('should trim whitespace from input', async () => {
    const user = userEvent.setup();
    mockOnAddTodo.mockReturnValue(true);
    
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByRole('textbox');
    
    await user.type(input, '  Test todo  ');
    await user.keyboard('{Enter}');
    
    expect(mockOnAddTodo).toHaveBeenCalledWith('Test todo');
  });
});