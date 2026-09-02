import type { LanguageModelV4 } from "@ai-sdk/provider";
import { createNan, nanContextWindow } from "@nan-builders/ai-sdk";
import { requireEnv } from "./constants.js";

// One place to change every agent's model assignment.
// Default: Vercel AI Gateway strings (<provider>/<model>).
// Opt-in NaN: set MODEL_PROVIDER=nan and NAN_API_KEY; see packages/nan-ai-sdk/README.md.

export type ModelProvider = "gateway" | "nan";

export type FactoryModel = LanguageModelV4 | string;

const MODEL_PROVIDER = (process.env.MODEL_PROVIDER ??
  "gateway") as ModelProvider;

if (MODEL_PROVIDER !== "gateway" && MODEL_PROVIDER !== "nan") {
  throw new Error(
    `MODEL_PROVIDER must be "gateway" or "nan", got '${process.env.MODEL_PROVIDER}'.`
  );
}

export const modelProvider: ModelProvider = MODEL_PROVIDER;

export const isNanProvider = modelProvider === "nan";

const GATEWAY_MODELS = {
  analyst: "google/gemini-3.6-flash",
  classifier: "google/gemini-3.6-flash",
  implementer: "google/gemini-3.6-flash",
  orchestrator: "google/gemini-3.6-flash",
  researcher: "google/gemini-3.6-flash",
  reviewer: "google/gemini-2.5-flash",
} as const;

const NAN_MODEL_IDS = {
  analyst: "glm5.3-flash",
  classifier: "glm5.3-flash",
  implementer: "glm5.3-flash",
  orchestrator: "glm5.3-flash",
  researcher: "glm5.3-flash",
  reviewer: "glm5.3-flash",
} as const;

const buildNanModels = () => {
  requireEnv("NAN_API_KEY", "sk-your-nan-key");
  const nan = createNan();
  return {
    analyst: nan(NAN_MODEL_IDS.analyst),
    classifier: nan(NAN_MODEL_IDS.classifier),
    implementer: nan(NAN_MODEL_IDS.implementer),
    orchestrator: nan(NAN_MODEL_IDS.orchestrator),
    researcher: nan(NAN_MODEL_IDS.researcher),
    reviewer: nan(NAN_MODEL_IDS.reviewer),
  } as const;
};

export const MODELS: Record<keyof typeof GATEWAY_MODELS, FactoryModel> =
  isNanProvider ? buildNanModels() : GATEWAY_MODELS;

export type FactoryAgent = keyof typeof GATEWAY_MODELS;

export const agentModelConfig = (agent: FactoryAgent) => {
  const model = MODELS[agent];
  if (typeof model === "string") {
    return { model };
  }
  return {
    model,
    modelContextWindowTokens: nanContextWindow(NAN_MODEL_IDS[agent]),
  };
};

export const judgeModel: FactoryModel = isNanProvider
  ? createNan()(NAN_MODEL_IDS.orchestrator)
  : "google/gemini-3.6-flash";
