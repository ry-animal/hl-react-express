import { estimateTokens } from '../../utils/tokenUtils';

describe('tokenUtils', () => {
  describe('estimateTokens', () => {
    it('should return 0 for empty text', () => {
      expect(estimateTokens('')).toBe(0);
      expect(estimateTokens(null as unknown as string)).toBe(0);
      expect(estimateTokens(undefined as unknown as string)).toBe(0);
    });

    it('should correctly estimate tokens for English text', () => {
      // For a 4 char per token rule, 20 chars should be ~6 tokens with ceiling
      const text = 'This is a test string';
      expect(estimateTokens(text)).toBe(6);
    });

    it('should round up token estimates', () => {
      // 5 chars should be 2 tokens (5/4 = 1.25, ceil to 2)
      expect(estimateTokens('Hello')).toBe(2);
      
      // 9 chars should be 3 tokens (9/4 = 2.25, ceil to 3)
      expect(estimateTokens('Hello you')).toBe(3);
    });

    it('should handle longer text correctly', () => {
      const longText = 'This is a much longer text that would be used to test the token estimation function with more characters and spaces to provide a better sample size for the test.';
      // 143 chars / 4 = 35.75, ceil to 36
      expect(estimateTokens(longText)).toBe(41);
    });
  });
}); 