function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env variable: ${key}`);
  return value;
}

export const env = {
  featherlessApiKey: required('FEATHERLESS_API_KEY'),
  featherlessBaseUrl: process.env.FEATHERLESS_BASE_URL ?? 'https://api.featherless.ai/v1',
  featherlessModel: process.env.FEATHERLESS_MODEL ?? 'meta-llama/Meta-Llama-3.1-8B-Instruct',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL ?? 'llama3',
  databaseUrl: required('DATABASE_URL'),
  nodeEnv: process.env.NODE_ENV ?? 'development',
} as const;
