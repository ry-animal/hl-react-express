import { MODEL_PRICING, BREWERY_API_BASE_URL } from '../../utils/constants';

describe('constants', () => {
  describe('MODEL_PRICING', () => {
    it('should have correct pricing for gpt-3.5-turbo', () => {
      expect(MODEL_PRICING['gpt-3.5-turbo']).toBeDefined();
      expect(MODEL_PRICING['gpt-3.5-turbo'].input).toBe(0.0015);
      expect(MODEL_PRICING['gpt-3.5-turbo'].output).toBe(0.002);
    });

    it('should have correct pricing for gpt-4', () => {
      expect(MODEL_PRICING['gpt-4']).toBeDefined();
      expect(MODEL_PRICING['gpt-4'].input).toBe(0.03);
      expect(MODEL_PRICING['gpt-4'].output).toBe(0.06);
    });
  });

  describe('BREWERY_API_BASE_URL', () => {
    it('should have the correct default URL', () => {
      // Since process.env.PUBLIC_API_URL might not be set in tests,
      // we expect the default value to be used
      expect(BREWERY_API_BASE_URL).toBe('https://api.openbrewerydb.org/v1/breweries');
    });
  });
}); 