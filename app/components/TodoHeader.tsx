'use client';

import { ThemeToggle } from './ThemeToggle';

interface TodoHeaderProps {
  className?: string;
}

export function TodoHeader({ className = '' }: TodoHeaderProps) {
  return (
    <header className={`flex items-center justify-between py-6 ${className}`}>
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Todo App
        </h1>
        <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
          タスクを効率的に管理しましょう
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}

export default TodoHeader;