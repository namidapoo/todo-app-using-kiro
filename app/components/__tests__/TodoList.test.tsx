import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from '../TodoList';
import { Todo } from '@/types/todo';

// Mock TodoItem component
jest.mock('../TodoItem', () => ({
  TodoItem: ({ todo, onToggle, onDelete }: any) => (
    <div data-testid={`todo-item-${todo.id}`}>
      <span>{todo.text}</span>
      <button onClick={onToggle} data-testid={`toggle-${todo.id}`}>
        Toggle
      </button>
      <button onClick={onDelete} data-testid={`delete-${todo.id}`}>
        Delete
      </button>
    </div>
  ),
}));

describe('TodoList', () => {
  const mockOnToggleTodo = jest.fn();
  const mockOnDeleteTodo = jest.fn();

  const mockTodos: Todo[] = [
    {
      id: '1',
      text: 'First todo',
      completed: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      id: '2',
      text: 'Second todo',
      completed: true,
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when no todos', () => {
    render(
      <TodoList
        todos={[]}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    expect(screen.getByText('タスクがありません')).toBeInTheDocument();
    expect(screen.getByText('新しいタスクを追加して、効率的にタスクを管理しましょう。')).toBeInTheDocument();
  });

  it('should render todos when provided', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument();
    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.getByText('Second todo')).toBeInTheDocument();
  });

  it('should call onToggleTodo when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const toggleButton = screen.getByTestId('toggle-1');
    await user.click(toggleButton);

    expect(mockOnToggleTodo).toHaveBeenCalledWith('1');
  });

  it('should call onDeleteTodo when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const deleteButton = screen.getByTestId('delete-2');
    await user.click(deleteButton);

    expect(mockOnDeleteTodo).toHaveBeenCalledWith('2');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
        className="custom-class"
      />
    );

    const listContainer = container.firstChild as HTMLElement;
    expect(listContainer).toHaveClass('custom-class');
  });

  it('should apply custom className to empty state', () => {
    const { container } = render(
      <TodoList
        todos={[]}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
        className="custom-class"
      />
    );

    const emptyContainer = container.firstChild as HTMLElement;
    expect(emptyContainer).toHaveClass('custom-class');
  });

  it('should have proper list role', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
  });

  it('should render todos in correct order', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const todoItems = screen.getAllByTestId(/^todo-item-/);
    expect(todoItems).toHaveLength(2);
    expect(todoItems[0]).toHaveAttribute('data-testid', 'todo-item-1');
    expect(todoItems[1]).toHaveAttribute('data-testid', 'todo-item-2');
  });

  it('should handle single todo', () => {
    const singleTodo = [mockTodos[0]];
    
    render(
      <TodoList
        todos={singleTodo}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.queryByTestId('todo-item-2')).not.toBeInTheDocument();
  });

  it('should have proper spacing between items', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const list = screen.getByRole('list');
    expect(list).toHaveClass('space-y-3');
  });

  it('should show empty state icon', () => {
    render(
      <TodoList
        todos={[]}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  it('should have proper empty state styling', () => {
    render(
      <TodoList
        todos={[]}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const emptyContainer = screen.getByText('タスクがありません').closest('div');
    expect(emptyContainer).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'py-12',
      'text-center'
    );
  });

  it('should pass correct props to TodoItem components', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    // Verify that each TodoItem receives the correct todo
    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.getByText('Second todo')).toBeInTheDocument();
    
    // Verify that toggle and delete buttons are present for each todo
    expect(screen.getByTestId('toggle-1')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-2')).toBeInTheDocument();
    expect(screen.getByTestId('delete-1')).toBeInTheDocument();
    expect(screen.getByTestId('delete-2')).toBeInTheDocument();
  });
});