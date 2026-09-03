export type NanChatModelId =
  | "qwen3.6"
  | "deepseek-v4-flash"
  | "mimo-v2.5"
  | "gemma4"
  | "glm5.2"
  | (string & {});

export type NanModelModality = "text" | "image" | "audio";

export interface NanModelMetadata {
  contextWindow: number;
  description: string;
  input: NanModelModality[];
  name: string;
  output: NanModelModality[];
  reasoningDefault?: boolean;
}

export const NAN_CHAT_MODELS: Record<string, NanModelMetadata> = {
  "deepseek-v4-flash": {
    contextWindow: 1_000_000,
    description:
      "MoE text model with long context, tool calling, and configurable reasoning_effort.",
    input: ["text"],
    name: "DeepSeek V4 Flash",
    output: ["text"],
    reasoningDefault: true,
  },
  gemma4: {
    contextWindow: 262_144,
    description:
      "Multimodal chat with vision; reasoning opt-in via enable_thinking.",
    input: ["text", "image"],
    name: "Gemma 4",
    output: ["text"],
    reasoningDefault: false,
  },
  "glm5.2": {
    contextWindow: 262_144,
    description: "Premium-tier MoE model for coding and agentic tasks.",
    input: ["text"],
    name: "GLM 5.2",
    output: ["text"],
    reasoningDefault: true,
  },
  "glm5.3-flash": {
    contextWindow: 1_000_000,
    description: "Fast MoE model, strongest agentic/tool-use of its class; 1M context.",
    input: ["text"],
    name: "GLM 5.3 Flash",
    output: ["text"],
    reasoningDefault: true,
  },
  "mimo-v2.5": {
    contextWindow: 1_000_000,
    description:
      "Omnimodal model with text, image, and audio input; reasoning always on.",
    input: ["text", "image", "audio"],
    name: "Xiaomi MiMo V2.5",
    output: ["text"],
    reasoningDefault: true,
  },
  "qwen3.6": {
    contextWindow: 262_144,
    description:
      "General-purpose chat, vision, tool calling, and reasoning; recommended default.",
    input: ["text", "image"],
    name: "Qwen 3.6",
    output: ["text"],
    reasoningDefault: true,
  },
};

export const nanModelMetadata = (
  modelId: NanChatModelId
): NanModelMetadata | undefined => NAN_CHAT_MODELS[modelId];

export const nanContextWindow = (modelId: NanChatModelId): number =>
  nanModelMetadata(modelId)?.contextWindow ?? 262_144;
