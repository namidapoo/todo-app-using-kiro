'use client';

import { FilterType, TodoStats } from '@/types/todo';
import { FILTER_LABELS } from '@/utils/constants';

interface TodoFiltersProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  stats: TodoStats;
  className?: string;
}

export function TodoFilters({
  filter,
  onFilterChange,
  stats,
  className = '',
}: TodoFiltersProps) {
  const filters: FilterType[] = ['all', 'active', 'completed'];

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}>
      {/* Statistics */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">総数:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {stats.total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">未完了:</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {stats.active}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">完了済み:</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            {stats.completed}
          </span>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex items-center gap-1 bg-white dark:bg-gray-700 rounded-lg p-1 shadow-sm">
        {filters.map((filterType) => (
          <button
            key={filterType}
            onClick={() => onFilterChange(filterType)}
            className={`
              px-3 py-2 text-sm font-medium rounded-md
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${
                filter === filterType
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }
            `}
            aria-label={`${FILTER_LABELS[filterType]}のタスクを表示`}
            aria-pressed={filter === filterType}
          >
            {FILTER_LABELS[filterType]}
          </button>
        ))}
      </div>

      {/* Progress indicator */}
      {stats.total > 0 && (
        <div className="w-full sm:w-32">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>進捗</span>
            <span>{Math.round((stats.completed / stats.total) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: `${(stats.completed / stats.total) * 100}%`,
              }}
              role="progressbar"
              aria-valuenow={stats.completed}
              aria-valuemin={0}
              aria-valuemax={stats.total}
              aria-label={`進捗: ${stats.completed}/${stats.total} 完了`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoFilters;