# プロジェクト構造

## ルートレベル

- `package.json` - 依存関係とスクリプト
- `next.config.ts` - Next.js 設定
- `tsconfig.json` - 厳密モード付き TypeScript 設定
- `postcss.config.mjs` - Tailwind 用 PostCSS 設定
- `README.md` - プロジェクトドキュメント

## App ディレクトリ（`app/`）

Next.js App Router 構造を使用：

- `layout.tsx` - フォント設定とグローバルスタイルを含むルートレイアウト
- `page.tsx` - ホームページコンポーネント
- `globals.css` - グローバル CSS インポートと Tailwind ディレクティブ
- `favicon.ico` - サイトファビコン

## パブリックアセット（`public/`）

ルートで提供される静的ファイル：

- SVG アイコンとロゴ
- `/filename.ext`でアクセス可能な画像

## 主要な規約

### ファイル命名

- React コンポーネント: PascalCase（例：`HomePage.tsx`）
- ルートファイル: 小文字（例：`page.tsx`、`layout.tsx`）
- 設定ファイル: ツールの規約に従って kebab-case または camelCase

### インポートパターン

- プロジェクトルートからのインポートには`@/`エイリアスを使用
- Next.js コンポーネントは`next/`からインポート
- フォントインポートは`next/font/google`から

### コンポーネント構造

- ページ/レイアウトコンポーネントはデフォルトエクスポート
- props には TypeScript インターフェースを使用
- ページコンポーネントで SEO 用のメタデータエクスポート

### スタイリングアプローチ

- スタイリングには Tailwind ユーティリティクラス
- テーマ値には CSS カスタムプロパティ
- Tailwind ブレークポイント（`sm:`、`md:`など）でレスポンシブデザイン
- Tailwind の`dark:`プレフィックスでダークモードサポート
