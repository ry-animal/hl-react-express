import { isBrewerySearchQuery } from '../../utils/queryUtils';

describe('queryUtils', () => {
  describe('isBrewerySearchQuery', () => {
    it('should return true for messages containing "breweries"', () => {
      expect(isBrewerySearchQuery('Show me breweries')).toBe(true);
      expect(isBrewerySearchQuery('Are there any breweries in Seattle?')).toBe(true);
      expect(isBrewerySearchQuery('Tell me about local breweries')).toBe(true);
      expect(isBrewerySearchQuery('BREWERIES in my area')).toBe(true);
    });

    it('should return false for messages not containing "breweries"', () => {
      expect(isBrewerySearchQuery('Tell me about beer')).toBe(false);
      expect(isBrewerySearchQuery('Where can I find craft beer?')).toBe(false);
      expect(isBrewerySearchQuery('')).toBe(false);
      expect(isBrewerySearchQuery(null as unknown as string)).toBe(false);
    });

    it('should handle case insensitivity correctly', () => {
      expect(isBrewerySearchQuery('BREWERIES')).toBe(true);
      expect(isBrewerySearchQuery('Breweries')).toBe(true);
      expect(isBrewerySearchQuery('breWeriEs')).toBe(true);
    });

    it('should work with partial word matches', () => {
      expect(isBrewerySearchQuery('brewery')).toBe(false);
      expect(isBrewerySearchQuery('microbreweries')).toBe(true);
    });
  });
}); 