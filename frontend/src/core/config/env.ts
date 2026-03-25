function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env variable: ${key}`);
  return value;
}

// Lazy getters — values are resolved on first access, not at import time.
// This prevents crashes during build or if a client component transitively
// imports a module that touches this file.
export const env = {
  get featherlessApiKey() { return required('FEATHERLESS_API_KEY'); },
  get featherlessBaseUrl() { return process.env.FEATHERLESS_BASE_URL ?? 'https://api.featherless.ai/v1'; },
  get featherlessModel() { return process.env.FEATHERLESS_MODEL ?? 'meta-llama/Meta-Llama-3.1-8B-Instruct'; },
  get ollamaBaseUrl() { return process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'; },
  get ollamaModel() { return process.env.OLLAMA_MODEL ?? 'llama3'; },
  get databaseUrl() { return required('DATABASE_URL'); },
  get nodeEnv() { return process.env.NODE_ENV ?? 'development'; },
};
