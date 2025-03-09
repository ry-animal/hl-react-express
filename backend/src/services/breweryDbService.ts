import axios from 'axios';
import { Brewery, BreweryQueryParams } from '../utils/types';
import { BREWERY_API_BASE_URL } from '../utils/constants';
import { formatBreweryData } from '../utils/formatters';

/**
 * Fetches brewery data from the Open Brewery DB API
 * @param params Query parameters to filter breweries
 * @returns List of breweries matching the criteria
 */
export const getBreweries = async (params?: BreweryQueryParams): Promise<Brewery[]> => {
  try {
    // Add logging to see exactly what parameters are being sent
    console.log('Fetching breweries with params:', params);
    
    // Make sure to handle URL encoding for all string parameters
    const encodedParams = { ...params };
    
    // Set a timeout to prevent hanging requests
    const response = await axios.get<Brewery[]>(BREWERY_API_BASE_URL, { 
      params: encodedParams,
      timeout: 5000 // 5 second timeout
    });
    
    // Log the response status
    console.log('Brewery API response status:', response.status);
    
    // Check if the response has data
    if (!response.data || !Array.isArray(response.data)) {
      console.error('Invalid response from brewery API:', response.data);
      return [];
    }
    
    // Log how many breweries were returned
    console.log(`Found ${response.data.length} breweries`);
    
    return response.data;
  } catch (error) {
    // More detailed error logging
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching brewery data:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error('Error fetching brewery data:', error);
    }
    
    // Return empty array rather than throwing to prevent cascade failures
    return [];
  }
};

/**
 * Search for breweries by search term
 * @param query Search term
 * @returns List of breweries matching the search
 */
export const searchBreweries = async (query: string): Promise<Brewery[]> => {
  try {
    const response = await axios.get<Brewery[]>(`${BREWERY_API_BASE_URL}/search`, { 
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching breweries:', error);
    return [];
  }
}; 