import { TodoApp } from '@/components/TodoApp';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Todo App - Stay Organized',
  description: 'A simple and intuitive todo application to help you manage your daily tasks and stay organized.',
  keywords: ['todo', 'task management', 'productivity', 'organization'],
};

export default function Home() {
  return <TodoApp />;
}