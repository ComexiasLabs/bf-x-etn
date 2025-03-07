export interface AppConfig {
  environment: string;
  jwtSecret: string;
  firebaseProjectId: string;
  firebasePrivateKey: string;
  firebaseClientEmail: string;
  bscscanApiKey: string;
  githubApiKey: string;
  templatesGithubRepo: string;
  aiApiStreaming: string;
  aiApiGenerate: string;
  aiApiKey: string;
}

export const Config: AppConfig = {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'testnet',
  jwtSecret: process.env.JWT_SECRET || 'jwtsecret',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  bscscanApiKey: process.env.BSCSCAN_API_KEY,
  githubApiKey: process.env.GITHUB_API_KEY,
  templatesGithubRepo: 'https://github.com/ComexiasLabs/blockfabric-templates',
  aiApiStreaming: 'https://voi4u3rc7unzfn562njz6vpyhq0tzphw.lambda-url.us-east-1.on.aws',
  aiApiGenerate: 'https://gaxvwyokzf.execute-api.us-east-1.amazonaws.com/generate-text',
  aiApiKey: 'mOK2p74t45G2gTYm5kLRvv2q9f9Xp',
};
