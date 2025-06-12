# アーキテクチャフロー

このドキュメントでは、AI-Powered Todo Appの処理の流れをMermaidシーケンス図で説明します。

## AI操作のフロー

ユーザーがAIチャットでタスク操作を行う際の完全なフローを示します。

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant UI as React UI
    participant Copilot as CopilotPopup
    participant Context as TasksProvider
    participant API as /api/copilotkit
    participant Adapter as LangChainAdapter
    participant LLM as ChatOpenAI
    participant OpenAI as OpenAI API
    participant LangSmith as LangSmith

    User->>UI: ページを開く
    UI->>Context: TasksProviderでラップ
    Context->>Copilot: useCopilotReadable(tasks)
    Note over Context,Copilot: タスク状態をAIコンテキストに公開

    User->>Copilot: "買い物リストに牛乳を追加して"
    Copilot->>API: POST /api/copilotkit
    Note over Copilot,API: メッセージ + 利用可能なアクション

    API->>Adapter: LangChainAdapter.chainFn()
    Adapter->>LLM: ChatOpenAI.stream()
    Note over Adapter,LLM: メッセージ + tools + threadId

    LLM->>OpenAI: API呼び出し
    Note over LLM,OpenAI: モデル: gpt-4o-mini<br/>tools: addTask, deleteTask, setTaskStatus

    OpenAI-->>LLM: レスポンス（ツール呼び出し含む）
    Note over LLM,LangSmith: LangChainにより自動トレーシング開始

    LLM-->>Adapter: ストリームレスポンス
    Adapter-->>API: 構造化レスポンス
    API-->>Copilot: AI応答

    Note over API,LangSmith: conversation_id メタデータで<br/>スレッド追跡

    Copilot->>Context: addTask("牛乳")
    Note over Copilot,Context: useCopilotAction で定義されたアクション実行

    Context->>Context: setTasks([...tasks, newTask])
    Context->>UI: 状態更新通知
    UI->>User: タスクリストを更新表示

    Copilot->>User: "牛乳をタスクに追加しました"

    Note over LangSmith: 以下がトレーシングされる:<br/>- OpenAI API呼び出し<br/>- ツール使用<br/>- 会話履歴<br/>- レスポンス時間<br/>- トークン使用量
```

## 通常のタスク操作フロー

ユーザーが直接UIでタスクを操作する場合のフローです。

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant UI as React UI
    participant Context as TasksProvider
    participant Hook as useTasks

    User->>UI: タスク入力フィールドに "プレゼン準備" を入力
    User->>UI: "Add" ボタンをクリック

    UI->>Hook: addTask("プレゼン準備")
    Hook->>Context: setTasks([...tasks, newTask])
    Context->>UI: 状態更新通知
    UI->>User: 新しいタスクを表示

    User->>UI: チェックボックスをクリック（タスク完了）
    UI->>Hook: setTaskStatus(taskId, "done")
    Hook->>Context: タスクのstatusを更新
    Context->>UI: 状態更新通知
    UI->>User: タスクの見た目を更新（完了状態）

    Note over UI,Context: アニメーション（Framer Motion）<br/>ソート更新（todo → done順）
```

## 初期化フロー

アプリケーションの起動時の処理フローです。

```mermaid
sequenceDiagram
    participant Browser as ブラウザ
    participant Layout as app/layout.tsx
    participant Page as app/page.tsx
    participant Context as TasksProvider
    participant API as /api/copilotkit
    participant Env as 環境変数

    Browser->>Layout: ページアクセス
    Layout->>Env: OPENAI_API_KEY読み込み
    Layout->>API: CopilotKit runtimeUrl="/api/copilotkit"
    Note over Layout,API: セルフホスティング設定

    Layout->>Page: 子コンポーネント描画
    Page->>Context: TasksProvider初期化
    Context->>Context: defaultTasks読み込み
    Note over Context: デフォルトタスク:<br/>- Complete project proposal (done)<br/>- Review design mockups (done)<br/>- Prepare presentation slides (todo)<br/>- etc.

    Context->>Page: useCopilotReadable設定
    Note over Context,Page: タスク状態をJSON文字列で<br/>AIコンテキストに公開

    Context->>Page: useCopilotAction設定
    Note over Context,Page: addTask, deleteTask,<br/>setTaskStatus アクション定義

    Page->>Browser: CopilotPopup表示
    Note over Page,Browser: AIチャットインターフェース準備完了

    Browser->>Browser: アプリケーション準備完了
```

## LangSmith トレーシングフロー

LangSmithでの観測性とトレーシングの詳細フローです。

```mermaid
sequenceDiagram
    participant API as /api/copilotkit
    participant Adapter as LangChainAdapter
    participant LLM as ChatOpenAI
    participant OpenAI as OpenAI API
    participant LangSmith as LangSmith
    participant Env as 環境変数

    Note over Env: LANGCHAIN_TRACING_V2=true<br/>LANGCHAIN_API_KEY=xxx<br/>LANGCHAIN_PROJECT=copilot-todo-app<br/>LANGCHAIN_CALLBACKS_BACKGROUND=false

    API->>Adapter: リクエスト受信
    Adapter->>LLM: ChatOpenAI初期化
    Note over LLM,Env: 環境変数により自動的に<br/>LangSmithトレーシング有効

    LLM->>LangSmith: トレース開始
    Note over LLM,LangSmith: プロジェクト: copilot-todo-app<br/>conversation_id: threadId

    LLM->>OpenAI: API呼び出し
    Note over LLM,LangSmith: 入力:<br/>- メッセージ履歴<br/>- 利用可能ツール<br/>- メタデータ

    OpenAI-->>LLM: レスポンス
    LLM->>LangSmith: レスポンス記録
    Note over LLM,LangSmith: 出力:<br/>- 生成されたテキスト<br/>- ツール呼び出し<br/>- トークン使用量<br/>- レスポンス時間

    LLM-->>Adapter: 処理完了
    Adapter-->>API: レスポンス返却

    Note over LangSmith: 同期コールバック<br/>(LANGCHAIN_CALLBACKS_BACKGROUND=false)<br/>により確実にトレース送信完了

    Note over LangSmith: ダッシュボードで確認可能:<br/>- 会話スレッド<br/>- ツール使用履歴<br/>- パフォーマンス指標<br/>- エラー追跡
```