# 設計文書

## 概要

モダンな TODO アプリケーションは、Next.js 15 の App Router を使用したサーバーサイドレンダリング対応のシングルページアプリケーションです。React 19 の最新機能を活用し、TypeScript による型安全性と Tailwind CSS v4 による効率的なスタイリングを実現します。

## アーキテクチャ

### 全体アーキテクチャ

```
┌─────────────────────────────────────┐
│           ブラウザ                    │
├─────────────────────────────────────┤
│         React Components            │
│  ┌─────────────────────────────────┐ │
│  │        TodoApp (Main)           │ │
│  │  ┌─────────────────────────────┐│ │
│  │  │      TodoHeader             ││ │
│  │  │  - タイトル                  ││ │
│  │  │  - ダークモード切り替え        ││ │
│  │  └─────────────────────────────┘│ │
│  │  ┌─────────────────────────────┐│ │
│  │  │      TodoInput              ││ │
│  │  │  - 新規タスク入力フィールド    ││ │
│  │  │  - 追加ボタン                ││ │
│  │  └─────────────────────────────┘│ │
│  │  ┌─────────────────────────────┐│ │
│  │  │      TodoFilters            ││ │
│  │  │  - フィルターボタン群         ││ │
│  │  │  - タスク統計表示            ││ │
│  │  └─────────────────────────────┘│ │
│  │  ┌─────────────────────────────┐│ │
│  │  │      TodoList               ││ │
│  │  │  - TodoItem[]               ││ │
│  │  └─────────────────────────────┘│ │
│  └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│         State Management            │
│  ┌─────────────────────────────────┐ │
│  │      React Hooks                │ │
│  │  - useState (todos, filter)     │ │
│  │  - useEffect (persistence)      │ │
│  │  - useLocalStorage (custom)     │ │
│  │  - useTheme (custom)            │ │
│  └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│         Data Persistence            │
│  ┌─────────────────────────────────┐ │
│  │      LocalStorage               │ │
│  │  - todos: Todo[]                │ │
│  │  - theme: 'light' | 'dark'      │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### レイヤー構造

1. **プレゼンテーション層**: React コンポーネント
2. **ビジネスロジック層**: カスタムフック
3. **データ永続化層**: LocalStorage API

## コンポーネントとインターフェース

### 型定義

```typescript
// types/todo.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type FilterType = "all" | "active" | "completed";

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

export type Theme = "light" | "dark";
```

### コンポーネント階層

```
app/
├── page.tsx (TodoApp - メインコンポーネント)
├── components/
│   ├── TodoHeader.tsx
│   ├── TodoInput.tsx
│   ├── TodoFilters.tsx
│   ├── TodoList.tsx
│   ├── TodoItem.tsx
│   └── ThemeToggle.tsx
├── hooks/
│   ├── useTodos.ts
│   ├── useLocalStorage.ts
│   └── useTheme.ts
├── types/
│   └── todo.ts
└── utils/
    ├── todoHelpers.ts
    └── constants.ts
```

### 主要コンポーネント仕様

#### TodoApp (page.tsx)

- **責務**: アプリケーション全体の状態管理とレイアウト
- **Props**: なし
- **State**: todos, filter, theme
- **機能**:
  - 全体レイアウトの提供
  - 状態の管理と子コンポーネントへの配布
  - データ永続化の制御

#### TodoHeader

- **責務**: アプリケーションヘッダーの表示
- **Props**: `{ theme: Theme, onThemeToggle: () => void }`
- **機能**:
  - アプリタイトルの表示
  - ダークモード切り替えボタン

#### TodoInput

- **責務**: 新規タスクの入力と追加
- **Props**: `{ onAddTodo: (text: string) => void }`
- **State**: inputValue
- **機能**:
  - テキスト入力フィールド
  - Enter キー/ボタンクリックでの追加
  - 入力値の検証

#### TodoFilters

- **責務**: フィルター機能と統計表示
- **Props**: `{ filter: FilterType, onFilterChange: (filter: FilterType) => void, stats: TodoStats }`
- **機能**:
  - フィルターボタン群
  - タスク統計の表示
  - アクティブフィルターの視覚的表示

#### TodoList

- **責務**: フィルタリングされたタスクリストの表示
- **Props**: `{ todos: Todo[], onToggleTodo: (id: string) => void, onDeleteTodo: (id: string) => void }`
- **機能**:
  - TodoItem コンポーネントのレンダリング
  - 空状態の表示

#### TodoItem

- **責務**: 個別タスクの表示と操作
- **Props**: `{ todo: Todo, onToggle: () => void, onDelete: () => void }`
- **機能**:
  - チェックボックス
  - タスクテキスト表示
  - 削除ボタン
  - 完了状態の視覚的表示

## データモデル

### Todo エンティティ

```typescript
interface Todo {
  id: string; // UUID v4
  text: string; // 1-500文字
  completed: boolean; // 完了状態
  createdAt: Date; // 作成日時
  updatedAt: Date; // 更新日時
}
```

### LocalStorage スキーマ

```typescript
// キー: 'todos'
{
  todos: Todo[]
}

// キー: 'theme'
{
  theme: 'light' | 'dark'
}
```

## エラーハンドリング

### エラー分類

1. **入力検証エラー**

   - 空文字列の入力
   - 文字数制限超過
   - 不正な文字の入力

2. **データ永続化エラー**

   - LocalStorage 容量不足
   - LocalStorage アクセス拒否
   - データ破損

3. **システムエラー**
   - 予期しない JavaScript エラー
   - レンダリングエラー

### エラー処理戦略

```typescript
// エラー境界コンポーネント
class TodoErrorBoundary extends React.Component {
  // エラーキャッチとフォールバックUI表示
}

// カスタムフックでのエラーハンドリング
const useTodos = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: Error) => {
    console.error("Todo operation failed:", error);
    setError(error.message);
  };
};
```

## テスト戦略

### テストピラミッド

1. **単体テスト (70%)**

   - ユーティリティ関数
   - カスタムフック
   - 個別コンポーネント

2. **統合テスト (20%)**

   - コンポーネント間の連携
   - データフロー
   - LocalStorage 連携

3. **E2E テスト (10%)**
   - ユーザーシナリオ
   - ブラウザ互換性

### テストツール

- **Jest**: 単体テスト・統合テスト
- **React Testing Library**: コンポーネントテスト
- **MSW**: API モック（将来の拡張用）

### テストケース例

```typescript
// TodoItem.test.tsx
describe("TodoItem", () => {
  it("should toggle completion when checkbox is clicked", () => {
    // テストケース実装
  });

  it("should call onDelete when delete button is clicked", () => {
    // テストケース実装
  });
});

// useTodos.test.ts
describe("useTodos hook", () => {
  it("should add new todo", () => {
    // テストケース実装
  });

  it("should persist todos to localStorage", () => {
    // テストケース実装
  });
});
```

## パフォーマンス最適化

### React 最適化

1. **メモ化**

   - `React.memo` でコンポーネントの再レンダリング防止
   - `useMemo` で計算結果のキャッシュ
   - `useCallback` でイベントハンドラーの安定化

2. **仮想化**

   - 大量のタスクに対する仮想スクロール（将来の拡張）

3. **遅延読み込み**
   - `React.lazy` でコンポーネントの動的インポート

### Next.js 最適化

1. **静的生成**

   - 初期ページの静的生成
   - 画像最適化

2. **バンドル最適化**
   - Tree shaking
   - コード分割

## セキュリティ考慮事項

### XSS 対策

- React のデフォルトエスケープ機能を活用
- `dangerouslySetInnerHTML` の使用禁止
- ユーザー入力の適切なサニタイズ

### データ保護

- LocalStorage データの暗号化（将来の拡張）
- 機密情報の非保存

## アクセシビリティ

### WCAG 2.1 AA 準拠

1. **キーボードナビゲーション**

   - Tab 順序の適切な設定
   - Enter キーでの操作対応

2. **スクリーンリーダー対応**

   - 適切な ARIA ラベル
   - セマンティック HTML

3. **視覚的配慮**
   - 十分なカラーコントラスト
   - フォーカス表示の明確化

### 実装例

```typescript
// アクセシブルなTodoItem
<div role="listitem" aria-label={`タスク: ${todo.text}`}>
  <input
    type="checkbox"
    checked={todo.completed}
    onChange={onToggle}
    aria-label={`${todo.text}を${todo.completed ? "未完了" : "完了"}にする`}
  />
  <span aria-live="polite">{todo.text}</span>
  <button onClick={onDelete} aria-label={`${todo.text}を削除`}>
    削除
  </button>
</div>
```

## 技術的制約と前提

### ブラウザサポート

- モダンブラウザ（ES2017+対応）
- LocalStorage 対応必須

### パフォーマンス要件

- 初期読み込み時間: 2 秒以内
- タスク操作レスポンス: 100ms 以内
- 1000 件のタスクまで快適に動作

### 開発環境

- Node.js 18+
- TypeScript 5+
- Next.js 15.4.5
- React 19.1.0
- Tailwind CSS v4
