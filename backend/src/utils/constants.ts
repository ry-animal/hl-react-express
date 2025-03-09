/**
 * OpenAI model pricing constants (USD per 1K tokens)
 */
export const MODEL_PRICING = {
  'gpt-3.5-turbo': {
    input: 0.0015,
    output: 0.002
  },
  'gpt-4': {
    input: 0.03,
    output: 0.06
  }
};

/**
 * API endpoints
 */
export const BREWERY_API_BASE_URL = process.env.PUBLIC_API_URL || 'https://api.openbrewerydb.org/v1/breweries'; 