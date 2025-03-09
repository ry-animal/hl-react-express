/**
 * Estimate the number of tokens in a text string
 * This is a rough estimate based on the OpenAI tokenization rules:
 * - ~4 characters per token for English text
 * - Varies by language and content
 * 
 * @param text The text to estimate tokens for
 * @returns Estimated token count
 */
export const estimateTokens = (text: string): number => {
  if (!text) return 0;
  
  // Basic estimation - 4 chars per token is a common rule of thumb for English
  // This is not exact but gives a reasonable approximation
  const estimatedTokens = Math.ceil(text.length / 4);
  
  return estimatedTokens;
}; 