> [!note]
> 本アプリケーションは、Kiroを使用して開発されたデモアプリケーションです。社内向けKiro紹介記事のために作成されました。

# 📝 Modern Todo App

モダンな Todo アプリケーション - Next.js 15、React 19、TypeScript、Tailwind CSS v4 で構築された効率的なタスク管理ツール

<img width="3428" height="2324" alt="CleanShot 2025-08-05 at 15 17 18@2x" src="https://github.com/user-attachments/assets/f4292819-6104-43f3-bb6a-9fe8fd381ba1" />

## ✨ 特徴

### 🚀 モダンな技術スタック

- **Next.js 15** - App Router 付き React フレームワーク
- **React 19** - 並行機能を持つ最新の React
- **TypeScript 5** - 静的型チェック
- **Tailwind CSS v4** - ユーティリティファースト CSS フレームワーク
- **Bun** - 高速パッケージマネージャー

### 📱 コア機能

- ✅ タスクの追加・編集・削除
- ✅ 完了状態の切り替え
- ✅ フィルタリング（すべて・未完了・完了済み）
- ✅ 統計情報表示（総数・未完了・完了済み）
- ✅ 進捗バー表示
- ✅ LocalStorage でのデータ永続化

### 🎨 UI/UX

- ✅ レスポンシブデザイン（モバイル・タブレット・デスクトップ対応）
- ✅ ダークモード・ライトモード切り替え
- ✅ スムーズなアニメーション・トランジション
- ✅ 直感的なユーザーインターフェース

### ♿ アクセシビリティ

- ✅ ARIA 属性による支援技術対応
- ✅ キーボードナビゲーション
- ✅ セマンティック HTML
- ✅ 適切なカラーコントラスト

### 🛡️ 品質保証

- ✅ TypeScript による型安全性
- ✅ 包括的な単体テスト
- ✅ エラーハンドリング
- ✅ 入力値検証

## 🚀 クイックスタート

### 前提条件

- Node.js 18 以上
- Bun（推奨）または npm/yarn/pnpm

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd todo-app-using-kiro

# 依存関係をインストール
bun install
# または
npm install
```

### 開発サーバーの起動

```bash
# Bunを使用（推奨）
bun dev

# または他のパッケージマネージャー
npm run dev
yarn dev
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認してください。

## 📁 プロジェクト構造

```
├── app/                     # Next.js App Routerディレクトリ
│   ├── components/          # Reactコンポーネント
│   │   ├── TodoApp.tsx      # メインアプリケーションコンポーネント
│   │   ├── TodoHeader.tsx   # ヘッダーコンポーネント
│   │   ├── TodoInput.tsx    # タスク入力コンポーネント
│   │   ├── TodoFilters.tsx  # フィルター・統計コンポーネント
│   │   ├── TodoList.tsx     # タスクリストコンポーネント
│   │   ├── TodoItem.tsx     # 個別タスクコンポーネント
│   │   ├── ThemeToggle.tsx  # テーマ切り替えコンポーネント
│   │   └── __tests__/       # コンポーネントテスト
│   ├── hooks/               # カスタムフック
│   │   ├── useLocalStorage.ts # LocalStorage管理フック
│   │   ├── useTheme.ts      # テーマ管理フック
│   │   ├── useTodos.ts      # Todo管理フック
│   │   └── __tests__/       # フックテスト
│   ├── types/               # TypeScript型定義
│   │   └── todo.ts          # Todo関連の型
│   ├── utils/               # ユーティリティ関数
│   │   ├── constants.ts     # 定数定義
│   │   ├── todoHelpers.ts   # Todo操作ヘルパー
│   │   └── __tests__/       # ユーティリティテスト
│   ├── globals.css          # グローバルスタイル
│   ├── layout.tsx           # ルートレイアウト
│   └── page.tsx             # ホームページ
├── public/                  # 静的アセット
├── .kiro/                   # Kiro AIアシスタント設定
│   ├── specs/               # 機能仕様書
│   └── steering/            # 開発ガイドライン
├── jest.config.js           # Jest設定
├── jest.setup.js            # Jestセットアップ
├── next.config.ts           # Next.js設定
├── tailwind.config.ts       # Tailwind CSS設定
└── tsconfig.json            # TypeScript設定
```

## 🧪 テスト

### テストの実行

```bash
# 全テストを実行
bun test
# または
npm test

# ウォッチモードでテスト実行
bun test:watch
# または
npm run test:watch

# カバレッジ付きでテスト実行
bun test:coverage
# または
npm run test:coverage
```

### テスト構成

- **単体テスト**: Jest + React Testing Library
- **コンポーネントテスト**: 各コンポーネントの動作をテスト
- **フックテスト**: カスタムフックのロジックをテスト
- **ユーティリティテスト**: ヘルパー関数をテスト

## 🏗️ ビルドとデプロイ

### 本番ビルド

```bash
# 本番用ビルド
bun run build
# または
npm run build

# 本番サーバーを起動
bun start
# または
npm start
```

### デプロイ

このアプリケーションは以下のプラットフォームに簡単にデプロイできます：

- **Vercel** (推奨)
- **Netlify**
- **AWS Amplify**
- **その他の Next.js 対応ホスティング**

## 🎯 主要コンポーネント

### TodoApp

メインアプリケーションコンポーネント。全体の状態管理とレイアウトを担当。

### useTodos

Todo 管理の中核となるカスタムフック。CRUD 操作、フィルタリング、統計計算を提供。

### useTheme

ダークモード・ライトモードの切り替えとテーマ状態の永続化を管理。

### useLocalStorage

LocalStorage との同期、エラーハンドリング、タブ間同期を提供。

## 🔧 カスタマイズ

### テーマのカスタマイズ

`app/globals.css`で CSS 変数を変更してテーマをカスタマイズできます：

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #f1f5f9;
  /* その他の変数... */
}
```

### 新機能の追加

1. `.kiro/specs/`に機能仕様を作成
2. 必要な型を`app/types/`に追加
3. コンポーネントを`app/components/`に実装
4. テストを`__tests__/`に作成

## 📚 技術的詳細

### 状態管理

- React Hooks ベースの軽量な状態管理
- LocalStorage によるデータ永続化
- カスタムフックによる関心の分離

### スタイリング

- Tailwind CSS v4 のユーティリティクラス
- CSS 変数によるテーマシステム
- レスポンシブデザインのブレークポイント

### パフォーマンス最適化

- React.memo、useMemo、useCallback による最適化
- Next.js App Router による効率的なルーティング
- Turbopack による高速な開発体験

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🙏 謝辞

- [Next.js](https://nextjs.org/) - React フレームワーク
- [Tailwind CSS](https://tailwindcss.com/) - CSS フレームワーク
- [React](https://reactjs.org/) - UI ライブラリ
- [TypeScript](https://www.typescriptlang.org/) - 型安全性
- [Bun](https://bun.sh/) - 高速ランタイム

---

**Made with ❤️ using Next.js, React, TypeScript, and Tailwind CSS**
