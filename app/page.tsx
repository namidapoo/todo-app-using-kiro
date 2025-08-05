import { TodoApp } from '@/components/TodoApp';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Todo App - タスク管理アプリ',
  description: 'モダンなTodoアプリケーション。Next.js、React、TypeScript、Tailwind CSSで構築されたタスク管理ツール。',
  keywords: ['todo', 'task', 'management', 'productivity', 'next.js', 'react', 'typescript'],
  authors: [{ name: 'Todo App Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  openGraph: {
    title: 'Todo App - タスク管理アプリ',
    description: 'モダンなTodoアプリケーション。効率的にタスクを管理しましょう。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    title: 'Todo App - タスク管理アプリ',
    description: 'モダンなTodoアプリケーション。効率的にタスクを管理しましょう。',
  },
};

export default function Home() {
  return <TodoApp />;
}
