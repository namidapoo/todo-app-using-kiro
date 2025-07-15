'use client';

import { TodoListProps } from '@/lib/types/todo';
import { TodoItem } from './TodoItem';

export function TodoList({ todos, onToggleComplete, onEdit, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return null; // EmptyState will be handled by parent component
  }

  return (
    <div className="space-y-2">
      <ul className="space-y-2" role="list" aria-label="Todo items">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
      
      {/* Todo count summary */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        {todos.length === 1 ? '1 item' : `${todos.length} items`}
        {todos.some(todo => todo.completed) && (
          <span className="ml-2">
            • {todos.filter(todo => todo.completed).length} completed
          </span>
        )}
      </div>
    </div>
  );
}