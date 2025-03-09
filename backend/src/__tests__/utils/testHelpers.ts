import { Brewery } from '../../utils/formatters';
import { MetricData, LogData } from '../../utils/types';

/**
 * Creates mock breweries for testing
 * @returns Array of mock brewery objects
 */
export const createMockBreweries = (): Brewery[] => {
  return [
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
};

/**
 * Create a mock metric data object for testing
 * @returns Sample MetricData object
 */
export const createMockMetricData = (): MetricData => {
  return {
    eventType: 'test_event',
    messageLength: 100,
    responseLength: 200,
    responseTime: 500,
    timestamp: '2023-01-01T12:00:00Z',
    model: 'gpt-3.5-turbo',
    tokenCount: 50,
    estimatedCost: 0.0001
  };
};

/**
 * Create a mock log data object for testing
 * @returns Sample LogData object
 */
export const createMockLogData = (): LogData => {
  return {
    requestType: 'test_request',
    userMessage: 'This is a test message',
    aiResponse: 'This is a test response',
    timestamp: '2023-01-01T12:00:00Z'
  };
};

/**
 * Mock successful API response for brewery data
 */
export const mockBreweryApiResponse = {
  status: 200,
  data: createMockBreweries()
}; 