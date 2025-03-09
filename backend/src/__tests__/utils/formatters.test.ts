import { formatBreweryData, Brewery } from '../../utils/formatters';

describe('formatters', () => {
  describe('formatBreweryData', () => {
    it('should convert brewery array to JSON string', () => {
      const mockBreweries: Brewery[] = [
        {
          id: '1',
          name: 'Test Brewery',
          brewery_type: 'micro',
          street: '123 Test St',
          city: 'Seattle',
          state: 'Washington',
          postal_code: '98101',
          country: 'United States',
          updated_at: '2022-01-01',
          created_at: '2022-01-01'
        },
        {
          id: '2',
          name: 'Another Brewery',
          brewery_type: 'brewpub',
          street: '456 Example Ave',
          city: 'Seattle',
          state: 'Washington',
          postal_code: '98102',
          country: 'United States',
          website_url: 'https://example.com',
          phone: '5551234567',
          updated_at: '2022-01-02',
          created_at: '2022-01-02'
        }
      ];

      const formattedData = formatBreweryData(mockBreweries);
      
      // Verify it's a valid JSON string
      expect(typeof formattedData).toBe('string');
      
      // Verify we can parse it back into the original object
      const parsedData = JSON.parse(formattedData);
      expect(parsedData).toEqual(mockBreweries);
      expect(parsedData.length).toBe(2);
      expect(parsedData[0].name).toBe('Test Brewery');
      expect(parsedData[1].name).toBe('Another Brewery');
    });

    it('should handle empty array', () => {
      const emptyBreweries: Brewery[] = [];
      const result = formatBreweryData(emptyBreweries);
      
      expect(result).toBe('[]');
      expect(JSON.parse(result)).toEqual([]);
    });
  });
}); 