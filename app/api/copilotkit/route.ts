import { CopilotRuntime, LangChainAdapter, copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import { ChatOpenAI } from "@langchain/openai";

const runtime = new CopilotRuntime();

// Initialize the service adapter
const serviceAdapter = new LangChainAdapter({
  chainFn: async ({ messages, tools, threadId }) => {
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      openAIApiKey: process.env.OPENAI_API_KEY,
      // LangSmith tracing is automatically enabled via environment variables
    }).bindTools(tools, {
      strict: true,
    });
    
    return model.stream(messages, {
      tools,
      metadata: { conversation_id: threadId },
    });
  },
});

const { POST } = copilotRuntimeNextJSAppRouterEndpoint({
  runtime,
  serviceAdapter,
  endpoint: "/api/copilotkit",
});

export { POST };