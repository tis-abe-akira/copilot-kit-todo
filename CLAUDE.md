# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリでコードを操作する際のガイダンスを提供します。

## 開発コマンド

- `npm run dev` - 開発サーバー起動 (localhost:3000)
- `npm run build` - 本番用ビルド
- `npm run start` - 本番サーバー起動
- `npm run lint` - ESLint実行

## アーキテクチャ概要

TypeScript、React、Tailwind CSSで構築されたNext.js 14のTodoアプリケーション。AI機能のためCopilotKitが統合されています。

### コア構造

- **状態管理**: グローバルなタスク状態管理にReact Context (`TasksProvider`) を使用
- **タスクフロー**: `TaskStatus` enumで定義された2つの状態 (`todo`/`done`)
- **コンポーネント**: Radix UIとカスタムタスクコンポーネントを含むモジュラー構造
- **スタイリング**: shadcn/uiコンポーネントとアニメーション用Framer Motionを組み合わせたTailwind CSS

### 重要ファイル

- `lib/hooks/use-tasks.tsx` - メイン状態管理フックとコンテキストプロバイダー
- `lib/tasks.types.ts` - TaskとTaskStatusのTypeScript定義
- `components/TasksList.tsx` - ソートロジック付きメインタスク表示コンポーネント
- `app/page.tsx` - TasksProviderラッパーとCopilotPopupを含むルートページ

### CopilotKit統合

アプリはCopilotKitプロバイダーでラップされています：
- layout.tsxのパブリックAPIキー付き`CopilotKit`ラッパー
- page.tsxのAIチャットインターフェース用`CopilotPopup`コンポーネント
- `useCopilotReadable`フックがタスク状態をAIコンテキストに公開

タスクは`todo`アイテムが最初にソートされ、その後各ステータスグループ内でIDでソートされます。