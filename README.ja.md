# Todo アプリ

日本語 | [English README](./README.md)

> **Kiro IDE Spec Mode で開発** 🚀  
> このプロジェクトは[Kiro IDE](https://kiro.ai/)の仕様駆動開発ワークフローを使用して開発されました。要件収集から設計ドキュメント作成、実装計画、実行まで、体系的な機能開発のための構造化された spec-based アプローチに従ってアプリケーション全体が構築されています。

Next.js 15、React 19、TypeScript で構築されたシンプルで直感的な TODO アプリケーションです。クリーンでレスポンシブなインターフェースで整理整頓し、タスクを完了させましょう。

<img width="3428" height="2324" alt="CleanShot 2025-07-16 at 04 00 22@2x" src="https://github.com/user-attachments/assets/d85db2d3-961e-496b-bc23-9a5333ec95b1" />

## ✨ 機能

- ✅ **TODO の作成・編集・削除** - タスク管理のための完全な CRUD 操作
- ✅ **完了マーク** - 視覚的フィードバック付きで完了状態を切り替え
- ✅ **永続ストレージ** - TODO は localStorage に保存され、セッション間で保持
- ✅ **レスポンシブデザイン** - デスクトップとモバイルデバイスの両方に最適化
- ✅ **リアルタイムバリデーション** - 役立つエラーメッセージ付きの入力検証
- ✅ **空状態** - TODO がない時のフレンドリーなメッセージ
- ✅ **エラーハンドリング** - 復旧オプション付きの優雅なエラー処理
- ✅ **アクセシビリティ** - セマンティック HTML と ARIA ラベルで構築
- ✅ **TypeScript** - アプリケーション全体での完全な型安全性

## 🚀 技術スタック

- **フレームワーク**: [Next.js 15](https://nextjs.org/) with App Router
- **フロントエンド**: [React 19](https://react.dev/) with hooks
- **言語**: [TypeScript 5](https://www.typescriptlang.org/)
- **スタイリング**: [Tailwind CSS 4](https://tailwindcss.com/)
- **フォント**: [Geist](https://vercel.com/font) (Sans & Mono)
- **ストレージ**: ブラウザ localStorage
- **開発**: 高速開発ビルドのための Turbopack

## 🏗️ プロジェクト構造

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # フォントとエラーバウンダリを含むルートレイアウト
│   ├── page.tsx           # TodoAppコンポーネントを含むホームページ
│   └── globals.css        # グローバルスタイルとTailwindディレクティブ
├── components/            # Reactコンポーネント
│   ├── TodoApp.tsx        # メインアプリケーションコンポーネント
│   ├── ErrorBoundary.tsx  # エラーハンドリング用エラーバウンダリ
│   └── ui/                # UIコンポーネント
│       ├── AddTodoForm.tsx    # 新しいTODO追加フォーム
│       ├── TodoList.tsx       # TODOリストコンテナ
│       ├── TodoItem.tsx       # 個別TODOアイテム
│       └── EmptyState.tsx     # 空状態表示
├── lib/                   # ユーティリティとフック
│   ├── hooks/             # カスタムReactフック
│   │   ├── useTodos.ts        # TODO管理フック
│   │   └── useLocalStorage.ts # localStorageフック
│   ├── types/             # TypeScript型定義
│   │   └── todo.ts            # TODO関連インターフェース
│   └── utils/             # ユーティリティ関数
│       └── validation.ts      # 入力検証関数
└── .kiro/                 # Kiro IDE仕様
    ├── specs/todo-app/    # 機能仕様
    └── steering/          # プロジェクトガイドライン
```

## 🛠️ はじめ方

### 前提条件

- Node.js 18+
- npm、yarn、pnpm、または bun

### インストール

1. **リポジトリをクローン**

   ```bash
   git clone <repository-url>
   cd todo-app-using-kiro
   ```

2. **依存関係をインストール**

   ```bash
   npm install
   # または
   yarn install
   # または
   pnpm install
   # または
   bun install
   ```

3. **開発サーバーを起動**

   ```bash
   npm run dev
   # または
   yarn dev
   # または
   pnpm dev
   # または
   bun dev
   ```

4. **ブラウザを開く**

   [http://localhost:3000](http://localhost:3000) にアクセスしてアプリケーションを確認してください。

## 📱 使い方

### TODO の追加

- 入力フィールドにタスクを入力
- 「Add Todo」をクリックするか Enter キーを押して作成
- 空の TODO は許可されず、エラーが表示されます

### TODO の管理

- **完了**: チェックボックスをクリックして完了マークを付ける
- **編集**: TODO テキストをダブルクリックしてインライン編集
- **削除**: × ボタンをクリックして TODO を削除
- **表示**: TODO は未完了アイテムが最初にソートされます

### データの永続化

- すべての TODO は自動的にブラウザの localStorage に保存されます
- ページを更新したり、ブラウザを閉じて再度開いても TODO は保持されます
- localStorage が利用できない場合は警告が表示されますが、アプリは動作します

## 🧪 開発

### 利用可能なスクリプト

```bash
# 開発
npm run dev          # Turbopack付き開発サーバー起動
npm run build        # プロダクションビルド作成
npm run start        # プロダクションサーバー起動

# コード品質
npm run lint         # ESLintチェック実行
npx tsc --noEmit     # TypeScript型チェック実行
```

### 開発機能

- **ホットリロード**: 開発中に変更が即座に反映
- **TypeScript**: 完全な型チェックと IntelliSense サポート
- **ESLint**: Next.js 推奨ルールでのコードリンティング
- **Tailwind CSS**: レスポンシブデザイン付きユーティリティファーストスタイリング
- **エラーバウンダリ**: 開発・本番環境での優雅なエラーハンドリング

## 🎨 カスタマイズ

### スタイリング

アプリは Tailwind CSS を使用してスタイリングされています。カスタマイズ可能：

- `tailwind.config.js`での色設定
- `app/globals.css`でのグローバルスタイル
- 個別コンポーネントファイルでのコンポーネント固有スタイル

### ストレージ

現在は localStorage を使用。以下に拡張可能：

- より大きなデータセット用の IndexedDB
- クラウド同期用の外部 API
- マルチユーザーサポート用のデータベース統合

## 📋 満たされた要件

このアプリケーションは指定されたすべての要件を満たしています：

1. ✅ **新しい TODO アイテムの作成** バリデーション付き
2. ✅ **すべての TODO の表示** ソート済みリスト
3. ✅ **TODO の完了/未完了マーク** 視覚的フィードバック付き
4. ✅ **既存 TODO の編集** インライン編集
5. ✅ **TODO の削除** 即座の削除
6. ✅ **レスポンシブデザイン** モバイルとデスクトップ対応
7. ✅ **データの永続化** localStorage を使用

## 🚀 デプロイ

### Vercel（推奨）

[Vercel](https://vercel.com/new)を使用したデプロイが最も簡単です：

1. コードを GitHub にプッシュ
2. Vercel でリポジトリをインポート
3. 設定なしでデプロイ

### その他のプラットフォーム

この Next.js アプリは以下でもデプロイ可能：

- [Netlify](https://netlify.com)
- [Railway](https://railway.app)
- [Render](https://render.com)
- Node.js をサポートする任意のプラットフォーム

## 🤝 コントリビューション

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを開く

## 📄 ライセンス

このプロジェクトはオープンソースで、[MIT License](LICENSE)の下で利用可能です。

## 🙏 謝辞

- [Next.js](https://nextjs.org/)と[React](https://react.dev/)で構築
- [Tailwind CSS](https://tailwindcss.com/)でスタイリング
- [Kiro IDE](https://kiro.ai/)仕様を使用して開発
- [Heroicons](https://heroicons.com/)のアイコンを使用

---

**整理整頓を楽しんでください！ 📝✨**
