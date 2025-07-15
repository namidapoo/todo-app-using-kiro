# 技術スタック

## コアフレームワーク

- **Next.js 15.4.1** - App Router 付き React フレームワーク
- **React 19.1.0** - 並行機能を備えた最新 React
- **TypeScript 5** - タイプセーフな JavaScript 開発

## スタイリング & UI

- **Tailwind CSS 4** - ユーティリティファースト CSS フレームワーク
- **PostCSS** - Tailwind プラグイン付き CSS 処理
- **Geist Font** - Vercel の最適化フォントファミリー（sans と mono）

## ビルドシステム

- **Turbopack** - 開発用高速バンドラー（`--turbopack`フラグ経由）
- **Next.js 組み込みバンドラー** - プロダクションビルド用

## 開発ツール

- **TypeScript** - 厳密モード有効
- **ESLint** - Next.js 設定経由のコードリンティング
- **パスエイリアス** - `@/*`がプロジェクトルートにマップ

## 共通コマンド

### 開発

```bash
npm run dev          # Turbopack付き開発サーバー起動
```

### ビルド & デプロイ

```bash
npm run build        # プロダクションビルド作成
npm run start        # プロダクションサーバー起動
```

### コード品質

```bash
npm run lint         # ESLintチェック実行
```

## 設定ノート

- App Router を使用（Pages Router ではない）
- 厳密な TypeScript 設定
- Tailwind ユーティリティによる CSS-in-JS
- `next/font`によるフォント最適化
