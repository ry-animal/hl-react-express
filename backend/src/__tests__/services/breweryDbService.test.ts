import axios from 'axios';
import { getBreweries, searchBreweries } from '../../services/breweryDbService';
import { createMockBreweries, mockBreweryApiResponse } from '../utils/testHelpers';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('breweryDbService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBreweries', () => {
    it('should fetch breweries with correct parameters', async () => {
      // Setup
      mockedAxios.get.mockResolvedValueOnce(mockBreweryApiResponse);
      
      const params = { by_city: 'seattle', per_page: 10 };
      
      // Execute
      const result = await getBreweries(params);
      
      // Verify
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String), 
        expect.objectContaining({ 
          params: params,
          timeout: 5000
        })
      );
      expect(result).toEqual(createMockBreweries());
    });

    it('should return empty array when API response is invalid', async () => {
      // Setup - invalid response
      mockedAxios.get.mockResolvedValueOnce({ status: 200, data: null });
      
      // Execute
      const result = await getBreweries();
      
      // Verify
      expect(result).toEqual([]);
    });

    it('should return empty array when API request fails', async () => {
      // Setup - simulate error
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
      
      // Execute
      const result = await getBreweries();
      
      // Verify
      expect(result).toEqual([]);
    });
  });

  describe('searchBreweries', () => {
    it('should search breweries with query parameter', async () => {
      // Setup
      mockedAxios.get.mockResolvedValueOnce(mockBreweryApiResponse);
      
      // Execute
      const result = await searchBreweries('test');
      
      // Verify
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/search'), 
        expect.objectContaining({ 
          params: { query: 'test' }
        })
      );
      expect(result).toEqual(createMockBreweries());
    });

    it('should return empty array when search fails', async () => {
      // Setup
      mockedAxios.get.mockRejectedValueOnce(new Error('Search failed'));
      
      // Execute
      const result = await searchBreweries('test');
      
      // Verify
      expect(result).toEqual([]);
    });
  });
}); 