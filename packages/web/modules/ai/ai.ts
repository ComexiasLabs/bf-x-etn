export const AIModelLogos = {
  ai21: '/assets/ai/ai21_24x24.svg',
  amazon: '/assets/ai/amazon_24x24.svg',
  anthropic: '/assets/ai/anthropic_24x24.svg',
  cohere: '/assets/ai/cohere_24x24.svg',
  meta: '/assets/ai/meta_24x24.svg',
  mistral: '/assets/ai/mistral_24x24.svg',
  google: '/assets/ai/google_24x24.svg',
};

export const DEFAULT_AI_MODEL_ID: ModelIds = 'anthropic.claude-3-sonnet-20240229-v1:0';

export type ModelIds =
  | 'ai21.j2-mid-v1'
  | 'ai21.j2-ultra-v1'
  | 'amazon.titan-text-lite-v1'
  | 'amazon.titan-text-express-v1'
  | 'anthropic.claude-3-sonnet-20240229-v1:0'
  | 'anthropic.claude-3-5-sonnet-20240620-v1:0'
  | 'anthropic.claude-3-haiku-20240307-v1:0'
  | 'anthropic.claude-instant-v1'
  | 'cohere.command-text-v14'
  | 'cohere.command-light-text-v14'
  | 'meta.llama2-13b-chat-v1'
  | 'meta.llama2-70b-chat-v1'
  | 'mistral.mistral-7b-instruct-v0:2'
  | 'mistral.mixtral-8x7b-instruct-v0:1';
