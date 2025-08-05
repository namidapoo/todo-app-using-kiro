import { TodoApp } from '@/components/TodoApp';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Todo App - タスク管理アプリ',
  description: 'モダンなTodoアプリケーション。Next.js、React、TypeScript、Tailwind CSSで構築されたタスク管理ツール。',
  keywords: ['todo', 'task', 'management', 'productivity', 'next.js', 'react', 'typescript'],
  authors: [{ name: 'Todo App Team' }],
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function Home() {
  return <TodoApp />;
}
