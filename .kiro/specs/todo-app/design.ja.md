# 設計書

## 概要

TODO アプリケーションは、Next.js 15 と React 19 を使用したシングルページアプリケーションとして構築され、App Router アーキテクチャを活用します。このアプリケーションは、完全な CRUD 機能とレスポンシブデザインを備えた TODO アイテム管理のためのクリーンで直感的なインターフェースを提供します。データの永続化は、セッション間で TODO を維持するためにブラウザの localStorage を通じて処理されます。

## アーキテクチャ

### フロントエンドアーキテクチャ

- **Next.js App Router**: クライアントサイド状態管理を備えたシングルページアプリケーション
- **React コンポーネント**: フックを使用した状態管理によるモジュラーコンポーネントアーキテクチャ
- **TypeScript**: 厳密モードが有効なタイプセーフ開発
- **Tailwind CSS**: レスポンシブデザインのためのユーティリティファーストスタイリング

### データフロー

```
ユーザー操作 → React状態 → localStorage → UI更新
```

### 状態管理

- ローカル状態管理のための React の組み込み`useState`と`useEffect`フック
- localStorage 操作と TODO 管理ロジックのためのカスタムフック
- この範囲では外部状態管理ライブラリは不要

## コンポーネントとインターフェース

### コアコンポーネント

#### 1. TodoApp（メインコンテナ）

```typescript
interface TodoAppProps {}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2. TodoList

```typescript
interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}
```

#### 3. TodoItem

```typescript
interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}
```

#### 4. AddTodoForm

```typescript
interface AddTodoFormProps {
  onAdd: (text: string) => void;
}
```

#### 5. EmptyState

```typescript
interface EmptyStateProps {
  message: string;
}
```

### カスタムフック

#### useTodos フック

```typescript
interface UseTodosReturn {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  editTodo: (id: string, newText: string) => void;
  deleteTodo: (id: string) => void;
  loading: boolean;
  error: string | null;
}
```

#### useLocalStorage フック

```typescript
interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  loading: boolean;
  error: string | null;
}
```

## データモデル

### Todo モデル

```typescript
interface Todo {
  id: string; // 一意識別のためのUUID
  text: string; // TODO説明（1-500文字）
  completed: boolean; // 完了状態
  createdAt: Date; // 作成タイムスタンプ
  updatedAt: Date; // 最終更新タイムスタンプ
}
```

### バリデーションルール

- TODO テキスト: 必須、1-500 文字、トリム済み
- ID: 自動生成 UUID
- タイムスタンプ: システムによる自動管理

### ストレージスキーマ

```typescript
// localStorageキー: 'todos'
interface StoredTodos {
  todos: Todo[];
  version: string; // 将来の移行サポート用
}
```

## ユーザーインターフェース設計

### レイアウト構造

```
┌─────────────────────────────────────┐
│ ヘッダー（アプリタイトル）            │
├─────────────────────────────────────┤
│ TODO追加フォーム                     │
├─────────────────────────────────────┤
│ TODOリスト                          │
│ ┌─────────────────────────────────┐ │
│ │ □ TODOアイテム1          [×]    │ │
│ │ ☑ TODOアイテム2（完了）   [×]    │ │
│ │ □ TODOアイテム3          [×]    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### レスポンシブブレークポイント

- モバイル: < 640px（単一列、大きなタッチターゲット）
- タブレット: 640px - 1024px（最適化されたスペーシング）
- デスクトップ: > 1024px（ホバー状態を含む完全レイアウト）

### 視覚的状態

- **デフォルト TODO**: 通常テキスト、チェックボックス未チェック
- **完了 TODO**: 取り消し線テキスト、薄い色、チェックボックスチェック済み
- **編集中 TODO**: テキストを入力フィールドに置換、保存/キャンセルボタン
- **空状態**: イラスト付きの中央配置メッセージ
- **ローディング状態**: localStorage 操作中のスケルトンプレースホルダー

## エラーハンドリング

### クライアントサイドエラーシナリオ

#### 1. localStorage 利用不可

- **検出**: localStorage 操作周りの try-catch
- **フォールバック**: 警告メッセージ付きのインメモリストレージ
- **ユーザーフィードバック**: 限定的な永続化についてのトースト通知

#### 2. 無効な TODO データ

- **バリデーション**: 状態更新前のクライアントサイドバリデーション
- **エラー表示**: フォームフィールド下のインラインエラーメッセージ
- **復旧**: 無効な入力をクリア、フィールドにフォーカス

#### 3. 破損した localStorage データ

- **検出**: JSON 解析エラーまたはスキーマバリデーション失敗
- **復旧**: 破損データをクリア、新規開始
- **ユーザーフィードバック**: データリセットについての通知

### エラーバウンダリ

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
```

## テスト戦略

### ユニットテスト

- **コンポーネント**: コンポーネント動作のための React Testing Library
- **フック**: renderHook を使用したカスタムフックテスト
- **ユーティリティ**: 純粋関数テストのための Jest
- **カバレッジ目標**: クリティカルパスで 90%以上

### 統合テスト

- **ユーザーフロー**: 完全な TODO CRUD 操作
- **localStorage 統合**: データ永続化シナリオ
- **レスポンシブ動作**: 異なるビューポートサイズ

### テスト構造

```
__tests__/
├── components/
│   ├── TodoApp.test.tsx
│   ├── TodoList.test.tsx
│   ├── TodoItem.test.tsx
│   └── AddTodoForm.test.tsx
├── hooks/
│   ├── useTodos.test.ts
│   └── useLocalStorage.test.ts
└── utils/
    └── validation.test.ts
```

### テストシナリオ

1. **TODO 作成**: 有効/無効な TODO の追加
2. **TODO 読み取り**: TODO の表示、空状態、ローディング状態
3. **TODO 更新**: 完了切り替え、テキスト編集、バリデーション
4. **TODO 削除**: TODO の削除、削除確認
5. **永続化**: localStorage 保存/読み込み操作
6. **レスポンシブ**: モバイル/デスクトップ操作
7. **エラーハンドリング**: localStorage 失敗、無効データ

## パフォーマンス考慮事項

### 最適化戦略

- **React.memo**: TodoItem コンポーネントの不要な再レンダリング防止
- **useCallback**: 子コンポーネントに渡すイベントハンドラーのメモ化
- **useMemo**: フィルタ/ソート済み TODO リストのメモ化
- **デバウンス**: 高速変更に対する localStorage 書き込みのデバウンス

### バンドルサイズ

- Next.js 組み込み最適化によるツリーシェイキング
- React/Next.js コア以外の外部依存関係なし
- 最小 CSS バンドルのための Tailwind CSS パージ

### アクセシビリティ

#### WCAG 2.1 AA 準拠

- **キーボードナビゲーション**: すべての操作の完全なキーボードサポート
- **スクリーンリーダー**: 適切な ARIA ラベルとセマンティック HTML
- **色コントラスト**: 最小 4.5:1 のコントラスト比
- **フォーカス管理**: 視覚的フォーカスインジケーターと論理的タブ順序

#### 実装詳細

- セマンティック HTML 要素（`<main>`、`<section>`、`<ul>`、`<li>`）
- インタラクティブ要素の ARIA ラベル
- キーボードユーザー用のスキップリンク
- ハイコントラストモードサポート
