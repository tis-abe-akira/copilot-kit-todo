# AI-Powered Todo App

AI機能を搭載したNext.js 14製のTodoアプリケーションです。CopilotKitを使用して、自然言語でタスクを管理できます。

このプロジェクトは[CopilotKit AI Todo App Tutorial](https://docs.copilotkit.ai/tutorials/ai-todo-app/overview)を参考にして作成されています。

## 特徴

- ✨ **AI対話型操作**: 自然言語でタスクの追加・削除・更新が可能
- 📋 **直感的UI**: シンプルで使いやすいタスク管理インターフェース
- 🎨 **モダンデザイン**: Tailwind CSS + shadcn/ui + Framer Motionによる美しいアニメーション
- ⚡ **リアルタイム更新**: タスクの状態変更が即座に反映
- 🔒 **セルフホスティング**: OpenAI APIを直接使用、ロックインなし
- 📊 **観測性**: LangSmithでAI操作のトレースとデバッグが可能

## 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **AI**: CopilotKit + OpenAI API + LangSmith (観測性)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Animations**: Framer Motion
- **State Management**: React Context

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 環境変数の設定:
`.env.local`ファイルを作成し、必要なAPIキーを設定:
```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# LangSmith Configuration (オプション - トレース・観測性のため)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langsmith_api_key_here
LANGCHAIN_PROJECT=copilot-todo-app
LANGCHAIN_CALLBACKS_BACKGROUND=false
```

**注意**: 
- OpenAI APIキーは[OpenAI Platform](https://platform.openai.com/api-keys)から取得
- LangSmith APIキーは[LangSmith](https://smith.langchain.com/)から取得（オプション）

3. 開発サーバーの起動:
```bash
npm run dev
```

4. ブラウザで[http://localhost:3000](http://localhost:3000)を開く

## 使用方法

### 通常の操作
- **タスク追加**: 入力フィールドに新しいタスクを入力してAddボタンをクリック
- **タスク完了**: チェックボックスをクリックしてタスクを完了状態に変更
- **タスク削除**: 削除ボタンをクリックしてタスクを削除

### AI操作
画面右下のAIアシスタントボタンをクリックして、以下のような自然言語で操作:
- "買い物リストに牛乳を追加して"
- "プレゼンテーション準備のタスクを完了にして"
- "完了したタスクをすべて削除して"

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLint実行
```

## プロジェクト構造

```
├── app/
│   ├── api/
│   │   └── copilotkit/
│   │       └── route.ts      # OpenAI API統合エンドポイント
│   ├── layout.tsx            # ルートレイアウト（CopilotKit設定）
│   └── page.tsx              # メインページ
├── components/
│   ├── AddTodo.tsx    # タスク追加コンポーネント
│   ├── Task.tsx       # 個別タスクコンポーネント
│   ├── TasksList.tsx  # タスクリスト表示コンポーネント
│   └── ui/           # shadcn/uiコンポーネント
├── lib/
│   ├── hooks/
│   │   └── use-tasks.tsx    # タスク状態管理フック
│   ├── default-tasks.ts     # デフォルトタスクデータ
│   └── tasks.types.ts       # TypeScript型定義
└── .env.local              # 環境変数（要作成）
```

## ライセンス

MIT License
