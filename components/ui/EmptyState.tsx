'use client';

import { EmptyStateProps } from '@/lib/types/todo';

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 mb-4 text-gray-300">
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No todos yet
      </h3>
      <p className="text-gray-600 max-w-sm mx-auto">
        {message}
      </p>
    </div>
  );
}