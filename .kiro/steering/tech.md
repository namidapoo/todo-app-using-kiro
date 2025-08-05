# 技術スタック

## コアフレームワーク

- **Next.js 15.4.5** - App Router 付き React フレームワーク
- **React 19.1.0** - 並行機能を持つ最新の React
- **TypeScript 5** - 静的型チェック

## スタイリング & UI

- **Tailwind CSS v4** - ユーティリティファースト CSS フレームワーク
- **PostCSS** - Tailwind プラグイン付き CSS 処理
- **Geist フォント** - next/font による最適化されたフォント読み込み

## ビルドシステム

- **Turbopack** - 開発用高速バンドラー
- **Bun** - パッケージマネージャー（bun.lock の存在に基づく）

## 開発ツール

- **ESLint** - Next.js 組み込み設定によるコードリンティング
- **TypeScript strict mode** - 強化された型チェック

## 共通コマンド

### 開発

```bash
# Turbopack付き開発サーバーを開始
bun dev

# 代替パッケージマネージャー
npm run dev
yarn dev
pnpm dev
```

### ビルド & デプロイ

```bash
# 本番用ビルド
bun run build

# 本番サーバーを開始
bun run start

# リンティング実行
bun run lint
```

### パッケージ管理

```bash
# 依存関係をインストール
bun install

# 新しい依存関係を追加
bun add [package-name]

# 開発依存関係を追加
bun add -d [package-name]
```

## 設定メモ

- 幅広い互換性のため ES2017 ターゲットを使用
- ルートを指す`@/*`でパスエイリアスを設定
- 厳密な TypeScript 設定を有効化
- テーマ用 CSS カスタムプロパティ
