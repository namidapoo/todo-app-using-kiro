# プロジェクト構造

## ルートレベル

```
├── app/                 # Next.js App Routerディレクトリ
├── public/             # 静的アセット
├── .kiro/              # Kiro AIアシスタント設定
├── node_modules/       # 依存関係
└── config files        # TypeScript、Next.js、PostCSS設定
```

## App ディレクトリ (`/app`)

Next.js App Router 規約に従う（Next.js 15 使用）：

- `layout.tsx` - フォント読み込みとメタデータを含むルートレイアウトコンポーネント
- `page.tsx` - ホームページコンポーネント
- `globals.css` - Tailwind インポートと CSS 変数を含むグローバルスタイル
- `favicon.ico` - サイトファビコン

## パブリックアセット (`/public`)

ルートから提供される静的ファイル：

- SVG アイコン（next.svg、vercel.svg など）
- Next.js Image コンポーネント使用に最適化

## 設定ファイル

- `package.json` - 依存関係とスクリプト
- `tsconfig.json` - 厳密モード付き TypeScript 設定
- `next.config.ts` - Next.js 設定（最小セットアップ）
- `postcss.config.mjs` - Tailwind プラグイン付き PostCSS
- `next-env.d.ts` - Next.js TypeScript 宣言

## 命名規約

- **コンポーネント**: React コンポーネントは PascalCase
- **ファイル**: ユーティリティファイルは kebab-case、コンポーネントは PascalCase
- **CSS クラス**: Tailwind ユーティリティクラス、テーマ用 CSS カスタムプロパティ
- **インポート**: ルートレベルインポート用`@/`エイリアスを使用した絶対インポート

## アーキテクチャパターン

- **App Router**: `/app`ディレクトリでのファイルベースルーティング
- **サーバーコンポーネント**: デフォルトでサーバーコンポーネント、必要時に'use client'を使用
- **CSS-in-JS**: Tailwind ユーティリティクラスを優先して回避
- **型安全性**: 適切なコンポーネントプロップ型付けによる厳密な TypeScript

## アセット組織

- Next.js Image 最適化のため`/public`にアイコンと画像
- `app/globals.css`に集約されたグローバルスタイル
- next/font でルートレイアウトでのフォント読み込み処理
