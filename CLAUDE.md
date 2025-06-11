# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリでコードを操作する際のガイダンスを提供します。

## 開発コマンド

- `npm run dev` - 開発サーバー起動 (localhost:3000)
- `npm run build` - 本番用ビルド
- `npm run start` - 本番サーバー起動
- `npm run lint` - ESLint実行

## アーキテクチャ概要

TypeScript、React、Tailwind CSSで構築されたNext.js 14のTodoアプリケーション。OpenAI API + LangSmith観測性を含むCopilotKitが統合されています。

### コア構造

- **状態管理**: グローバルなタスク状態管理にReact Context (`TasksProvider`) を使用
- **タスクフロー**: `TaskStatus` enumで定義された2つの状態 (`todo`/`done`)
- **コンポーネント**: Radix UIとカスタムタスクコンポーネントを含むモジュラー構造
- **スタイリング**: shadcn/uiコンポーネントとアニメーション用Framer Motionを組み合わせたTailwind CSS

### 重要ファイル

- `lib/hooks/use-tasks.tsx` - メイン状態管理フックとコンテキストプロバイダー、CopilotKit Actions定義
- `lib/tasks.types.ts` - TaskとTaskStatusのTypeScript定義
- `components/TasksList.tsx` - ソートロジック付きメインタスク表示コンポーネント
- `app/page.tsx` - TasksProviderラッパーとCopilotPopupを含むルートページ
- `app/api/copilotkit/route.ts` - OpenAI API + LangSmith統合エンドポイント（LangChainAdapter使用）

### CopilotKit統合

#### セルフホスティング構成
- **layout.tsx**: `CopilotKit`ラッパーで`runtimeUrl="/api/copilotkit"`を設定
- **page.tsx**: AIチャットインターフェース用`CopilotPopup`コンポーネント
- **API Route**: `app/api/copilotkit/route.ts`でLangChainAdapterを使用したOpenAI API統合

#### AI機能
- **useCopilotReadable**: タスク状態をAIコンテキストに公開
- **useCopilotAction**: addTask、deleteTask、setTaskStatusアクションを定義
- **自然言語操作**: ユーザーがチャットでタスクを管理可能

#### 観測性（LangSmith）
- LangChainAdapterにより自動的にLangSmithトレーシングが有効
- 環境変数（LANGCHAIN_TRACING_V2, LANGCHAIN_API_KEY, LANGCHAIN_PROJECT）で設定
- OpenAI API呼び出し、ツール使用、会話履歴を完全に追跡

## 環境変数

```bash
# 必須
OPENAI_API_KEY=your_openai_api_key

# オプション（観測性）
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langsmith_api_key
LANGCHAIN_PROJECT=copilot-todo-app
LANGCHAIN_CALLBACKS_BACKGROUND=false
```

タスクは`todo`アイテムが最初にソートされ、その後各ステータスグループ内でIDでソートされます。