'use client';

import { useState } from 'react';
import { Todo } from '@/types/todo';
import { formatDate } from '@/utils/todoHelpers';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  className?: string;
}

export function TodoItem({ todo, onToggle, onDelete, className = '' }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggle = () => {
    if (isDeleting) return;
    onToggle();
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    
    // Add a small delay for animation
    setTimeout(() => {
      onDelete();
      setIsDeleting(false);
    }, 200);
  };

  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      handleDelete();
    } else {
      setShowDeleteConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      handleDeleteClick();
    } else if (event.key === 'Escape') {
      setShowDeleteConfirm(false);
    }
  };

  const formattedDate = formatDate(todo.createdAt);
  const isCompleted = todo.completed;

  return (
    <div
      className={`
        group relative flex items-center gap-3 p-4
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-lg shadow-sm
        transition-all duration-200 ease-in-out
        hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600
        animate-slide-up
        ${isDeleting ? 'opacity-50 scale-95 animate-scale-in' : ''}
        ${isCompleted ? 'opacity-75' : ''}
        ${className}
      `}
      role="listitem"
      aria-label={`タスク: ${todo.text}`}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={isDeleting}
          className={`
            relative w-5 h-5 rounded border-2
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:cursor-not-allowed
            ${isCompleted
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
            }
          `}
          role="checkbox"
          aria-checked={isCompleted}
          aria-label={`${todo.text}を${isCompleted ? '未完了' : '完了'}にする`}
          tabIndex={0}
        >
          {isCompleted && (
            <svg
              className="w-3 h-3 absolute top-0.5 left-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Todo content */}
      <div className="flex-1 min-w-0">
        <div
          className={`
            text-base font-medium
            transition-all duration-200 ease-in-out
            ${isCompleted
              ? 'line-through text-gray-500 dark:text-gray-400'
              : 'text-gray-900 dark:text-gray-100'
            }
          `}
        >
          {todo.text}
        </div>
        
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          作成日時: {formattedDate}
          {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
            <span className="ml-2">
              (更新: {formatDate(todo.updatedAt)})
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className={`
            relative w-8 h-8 rounded-full
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            disabled:cursor-not-allowed
            ${showDeleteConfirm
              ? 'bg-red-600 text-white'
              : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
            }
            opacity-0 group-hover:opacity-100 focus:opacity-100
          `}
          aria-label={showDeleteConfirm ? `${todo.text}を削除（確認）` : `${todo.text}を削除`}
          title={showDeleteConfirm ? '再度クリックで削除' : '削除'}
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
          ) : showDeleteConfirm ? (
            <svg
              className="w-4 h-4 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L7.586 12l-1.293 1.293a1 1 0 101.414 1.414L9 13.414l2.293 2.293a1 1 0 001.414-1.414L11.414 12l1.293-1.293z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Delete confirmation tooltip */}
      {showDeleteConfirm && (
        <div
          className="absolute -top-10 right-0 z-10 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg"
          role="tooltip"
        >
          再度クリックで削除
          <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}

      {/* Completion indicator */}
      {isCompleted && (
        <div
          className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"
          aria-hidden="true"
          title="完了済み"
        />
      )}
    </div>
  );
}

export default TodoItem;