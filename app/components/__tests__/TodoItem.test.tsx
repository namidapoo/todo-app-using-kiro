import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../TodoItem';
import { Todo } from '@/types/todo';

// Mock formatDate function
jest.mock('@/utils/todoHelpers', () => ({
  formatDate: jest.fn((date: Date) => date.toLocaleDateString('ja-JP')),
}));

describe('TodoItem', () => {
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  const mockTodo: Todo = {
    id: '1',
    text: 'Test todo item',
    completed: false,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  };

  const completedTodo: Todo = {
    ...mockTodo,
    completed: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo item correctly', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('Test todo item')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByText(/作成日時:/)).toBeInTheDocument();
  });

  it('should render completed todo with correct styling', () => {
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    const checkbox = screen.getByRole('checkbox');
    const todoText = screen.getByText('Test todo item');
    
    expect(checkbox).toBeChecked();
    expect(todoText).toHaveClass('line-through');
    expect(screen.getByTitle('完了済み')).toBeInTheDocument();
  });

  it('should call onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onToggle when Enter key is pressed on checkbox', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.keyDown(checkbox, { key: 'Enter' });
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onToggle when Space key is pressed on checkbox', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.keyDown(checkbox, { key: ' ' });
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('should show delete confirmation on first delete button click', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    // Hover to show delete button
    const todoItem = screen.getByRole('listitem');
    await user.hover(todoItem);
    
    const deleteButton = screen.getByLabelText(/削除$/);
    await user.click(deleteButton);
    
    expect(screen.getByText('再度クリックで削除')).toBeInTheDocument();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('should call onDelete on second delete button click', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    // Hover to show delete button
    const todoItem = screen.getByRole('listitem');
    await user.hover(todoItem);
    
    const deleteButton = screen.getByLabelText(/削除$/);
    
    // First click - show confirmation
    await user.click(deleteButton);
    expect(screen.getByText('再度クリックで削除')).toBeInTheDocument();
    
    // Second click - delete
    await user.click(deleteButton);
    
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });
  });

  it('should trigger delete confirmation with Delete key', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.keyDown(checkbox, { key: 'Delete' });
    
    expect(screen.getByText('再度クリックで削除')).toBeInTheDocument();
  });

  it('should trigger delete confirmation with Backspace key', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.keyDown(checkbox, { key: 'Backspace' });
    
    expect(screen.getByText('再度クリックで削除')).toBeInTheDocument();
  });

  it('should hide delete confirmation with Escape key', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    // Show confirmation first
    const todoItem = screen.getByRole('listitem');
    await user.hover(todoItem);
    
    const deleteButton = screen.getByLabelText(/削除$/);
    await user.click(deleteButton);
    
    expect(screen.getByText('再度クリックで削除')).toBeInTheDocument();
    
    // Press Escape
    const checkbox = screen.getByRole('checkbox');
    fireEvent.keyDown(checkbox, { key: 'Escape' });
    
    expect(screen.queryByText('再度クリックで削除')).not.toBeInTheDocument();
  });

  it('should show loading state during deletion', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    // Show delete confirmation and click
    const todoItem = screen.getByRole('listitem');
    await user.hover(todoItem);
    
    const deleteButton = screen.getByLabelText(/削除$/);
    await user.click(deleteButton); // First click
    await user.click(deleteButton); // Second click
    
    // Should show loading spinner briefly
    expect(screen.getByRole('listitem')).toHaveClass('opacity-50', 'scale-95');
  });

  it('should display updated date when different from created date', () => {
    const updatedTodo: Todo = {
      ...mockTodo,
      updatedAt: new Date('2023-01-02T10:00:00Z'),
    };
    
    render(<TodoItem todo={updatedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    expect(screen.getByText(/更新:/)).toBeInTheDocument();
  });

  it('should not display updated date when same as created date', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    expect(screen.queryByText(/更新:/)).not.toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    const listItem = screen.getByRole('listitem');
    const checkbox = screen.getByRole('checkbox');
    
    expect(listItem).toHaveAttribute('aria-label', 'タスク: Test todo item');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).toHaveAttribute('aria-label', 'Test todo itemを完了にする');
  });

  it('should update accessibility labels for completed todo', () => {
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(checkbox).toHaveAttribute('aria-label', 'Test todo itemを未完了にする');
  });

  it('should apply custom className', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        className="custom-class"
      />
    );
    
    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveClass('custom-class');
  });

  it('should not allow toggle during deletion', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    // Start deletion process
    const todoItem = screen.getByRole('listitem');
    await user.hover(todoItem);
    
    const deleteButton = screen.getByLabelText(/削除$/);
    await user.click(deleteButton); // Show confirmation
    await user.click(deleteButton); // Start deletion
    
    // Try to toggle during deletion
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    // Should not call onToggle during deletion
    expect(mockOnToggle).not.toHaveBeenCalled();
  });

  it('should auto-hide delete confirmation after timeout', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    // Show confirmation
    const todoItem = screen.getByRole('listitem');
    await user.hover(todoItem);
    
    const deleteButton = screen.getByLabelText(/削除$/);
    await user.click(deleteButton);
    
    expect(screen.getByText('再度クリックで削除')).toBeInTheDocument();
    
    // Fast-forward time
    jest.advanceTimersByTime(3000);
    
    await waitFor(() => {
      expect(screen.queryByText('再度クリックで削除')).not.toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  it('should show checkmark icon when completed', () => {
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    const checkbox = screen.getByRole('checkbox');
    const checkmark = checkbox.querySelector('svg');
    
    expect(checkmark).toBeInTheDocument();
  });

  it('should not show checkmark icon when not completed', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    const checkbox = screen.getByRole('checkbox');
    const checkmark = checkbox.querySelector('svg');
    
    expect(checkmark).not.toBeInTheDocument();
  });
});