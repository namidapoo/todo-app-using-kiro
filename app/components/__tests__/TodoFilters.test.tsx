import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFilters } from '../TodoFilters';
import { FilterType, TodoStats } from '@/types/todo';

describe('TodoFilters', () => {
  const mockOnFilterChange = jest.fn();
  
  const mockStats: TodoStats = {
    total: 10,
    active: 6,
    completed: 4,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render statistics correctly', () => {
    render(
      <TodoFilters
        filter="all"
        onFilterChange={mockOnFilterChange}
        stats={mockStats}
      />
    );

    expect(screen.getByText('10')).toBeInTheDocument(); // total
    expect(screen.getByText('6')).toBeInTheDocument(); // active
    expect(screen.getByText('4')).toBeInTheDocument(); // completed
  });

  it('should render all filter buttons', () => {
    render(
      <TodoFilters
        filter="all"
        onFilterChange={mockOnFilterChange}
        stats={mockStats}
      />
    );

    expect(screen.getByText('すべて')).toBeInTheDocument();
    expect(screen.getByText('未完了')).toBeInTheDocument();
    expect(screen.getByText('完了済み')).toBeInTheDocument();
  });

  it('should highlight active filter', () => {
    render(
      <TodoFilters
        filter="active"
        onFilterChange={mockOnFilterChange}
        stats={mockStats}
      />
    );

    const activeButton = screen.getByText('未完了');
    const allButton = screen.getByText('すべて');

    expect(activeButton).toHaveClass('bg-blue-600', 'text-white');
    expect(allButton).not.toHaveClass('bg-blue-600', 'text-white');
  });

  it('should call onFilterChange when filter button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoFilters
        filter="all"
        onFilterChange={mockOnFilterChange}
        stats={mockStats}
      />
    );

    const activeButton = screen.getByText('未完了');
    await user.click(activeButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('active');
  });

  it('should show progress bar when there are todos', () => {
    render(
      <TodoFilters
        filter="all"
        onFilterChange={mockOnFilterChange}
        stats={mockStats}
      />
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '4');
    expect(progressBar).toHaveAttribute('aria-valuemax', '10');
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('should not show progress bar when there are no todos', () => {
    const emptyStats: TodoStats = {
      total: 0,
      active: 0,
      completed: 0,
    };

    render(
      <TodoFilters
        filter="all"
        onFilterChange={mockOnFilterChange}
        stats={emptyStats}
      />
    );

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByText('進捗')).not.toBeInTheDocument();
  });

  it('should calculate progress percentage correctly', () => {
    const stats: TodoStats = {
      total: 3,
      active: 1,
      completed: 2,
    };

    render(
      <TodoFilters
        filter="all"
        onFilterChange={mockOnFilterChange}
        stats={stats}
      />
    );

    expect(screen.getByText('67%')).toBeInTheDocument(); // 2/3 * 100 = 66.67 -> 67
  });

  it('should handle 100% completion', () => {
    const stats: TodoStats = {
      total: 5,
      active: 0,
      completed: 5,
    };

    render(
      <TodoFilters
        filter="all"
        onFilterChange={mockOnFilterChange}
        stats={stats}
      />
    );

    expect(screen.getByText('100%')).toBeInTheDocument();
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 100%');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <TodoFilters
        filter="all"
        onFilterChange={mockOnFilterChange}
        stats={mockStats}
        className="custom-class"
      />
    );

    const filtersContainer = container.firstChild as HTMLElement;
    expect(filtersContainer).toHaveClass('custom-class');
  });

  it('should have proper accessibility attributes', () => {
    render(
      <TodoFilters
        filter="active"
        onFilterChange={mockOnFilterChange}
        stats={mockStats}
      />
    );

    const activeButton = screen.getByText('未完了');
    const allButton = screen.getByText('すべて');

    expect(activeButton).toHaveAttribute('aria-pressed', 'true');
    expect(allButton).toHaveAttribute('aria-pressed', 'false');
    expect(activeButton).toHaveAttribute('aria-label', '未完了のタスクを表示');
  });

  it('should have responsive design classes', () => {
    const { container } = render(
      <TodoFilters
        filter="all"
        onFilterChange={mockOnFilterChange}
        stats={mockStats}
      />
    );

    const filtersContainer = container.firstChild as HTMLElement;
    expect(filtersContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row');
  });

  it('should handle keyboard navigation', () => {
    render(
      <TodoFilters
        filter="all"
        onFilterChange={mockOnFilterChange}
        stats={mockStats}
      />
    );

    const activeButton = screen.getByText('未完了');
    
    // Focus the button
    activeButton.focus();
    expect(activeButton).toHaveFocus();

    // Press Enter
    fireEvent.keyDown(activeButton, { key: 'Enter' });
    fireEvent.click(activeButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('active');
  });

  it('should show correct statistics labels', () => {
    render(
      <TodoFilters
        filter="all"
        onFilterChange={mockOnFilterChange}
        stats={mockStats}
      />
    );

    expect(screen.getByText('総数:')).toBeInTheDocument();
    expect(screen.getByText('未完了:')).toBeInTheDocument();
    expect(screen.getByText('完了済み:')).toBeInTheDocument();
  });

  it('should have proper color coding for statistics', () => {
    render(
      <TodoFilters
        filter="all"
        onFilterChange={mockOnFilterChange}
        stats={mockStats}
      />
    );

    const activeCount = screen.getByText('6');
    const completedCount = screen.getByText('4');

    expect(activeCount).toHaveClass('text-blue-600', 'dark:text-blue-400');
    expect(completedCount).toHaveClass('text-green-600', 'dark:text-green-400');
  });
});