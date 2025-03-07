import { DEFAULT_AI_MODEL_ID, ModelIds } from './ai';

export const getAICodeReviewPreset = (modelId: ModelIds, code: string) => {
  return {
    modelId: modelId ?? DEFAULT_AI_MODEL_ID,
    prompt: '',
    options: {
      temperature: 0.5,
      topP: 0.5,
      maxGenerationLength: 5000,
    },
    context: code,
    promptPreset: 'blockfabric-code-review',
  };
};

export const getAISecurityReviewPreset = (modelId: ModelIds, code: string) => {
  return {
    modelId: modelId ?? DEFAULT_AI_MODEL_ID,
    prompt: '',
    options: {
      temperature: 0.5,
      topP: 0.5,
      maxGenerationLength: 5000,
    },
    context: code,
    promptPreset: 'blockfabric-security-analysis',
  };
};
