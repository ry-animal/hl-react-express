/**
 * Interface for brewery data
 */
export interface Brewery {
  id: string;
  name: string;
  brewery_type: string;
  street: string;
  address_2?: string;
  address_3?: string;
  city: string;
  state: string;
  county_province?: string;
  postal_code: string;
  country: string;
  longitude?: string;
  latitude?: string;
  phone?: string;
  website_url?: string;
  updated_at: string;
  created_at: string;
}

/**
 * Interface for brewery query parameters
 */
export interface BreweryQueryParams {
  by_city?: string;
  by_name?: string;
  by_state?: string;
  by_postal?: string;
  by_country?: string;
  by_type?: string;
  page?: number;
  per_page?: number;
}

/**
 * Interface for metric data
 */
export interface MetricData {
  eventType: string;
  messageLength?: number;
  responseLength?: number;
  responseTime?: number;
  timestamp: string;
  model?: string;
  tokenCount?: number;
  estimatedCost?: number;
  extraData?: any;
}

/**
 * Interface for log data
 */
export interface LogData {
  requestType: string;
  userMessage?: string;
  aiResponse?: string;
  error?: string;
  timestamp: string;
} 