/**
 * Interface for brewery data
 */
export interface Brewery {
  id?: string;
  name: string;
  brewery_type: string;
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  website_url?: string;
  longitude?: string;
  latitude?: string;
  updated_at?: string;
  created_at?: string;
}

/**
 * Detects if a message contains brewery data
 * 
 * @param message The message to check for brewery data
 * @returns The parsed brewery data or null if not brewery data
 */
export const extractBreweryData = (message: unknown): Brewery[] | null => {
  // Check for explicit prefix
  if (typeof message === 'string' && message.startsWith('BREWERY_DATA:')) {
    try {
      const breweriesJson = message.replace('BREWERY_DATA:', '');
      const breweries = JSON.parse(breweriesJson);
      
      if (isBreweryArray(breweries)) {
        return breweries;
      }
    } catch (error) {
      console.error('Error parsing brewery data:', error);
    }
  }

  // Try to parse string as JSON
  if (typeof message === 'string') {
    try {
      const data = JSON.parse(message);
      if (isBreweryArray(data)) {
        return data;
      }
    } catch {
      // Not JSON, continue to other checks
    }
  }

  // Check if message is already an array of breweries
  if (typeof message === 'object' && message !== null && Array.isArray(message)) {
    if (message.length > 0 && isBrewery(message[0])) {
      return message as Brewery[];
    }
  }

  return null;
};

/**
 * Type guard to check if an object is a brewery
 */
export const isBrewery = (obj: unknown): obj is Brewery => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  
  const brewery = obj as Record<string, unknown>;
  
  return (
    typeof brewery.name === 'string' &&
    typeof brewery.brewery_type === 'string'
  );
};

/**
 * Type guard to check if an array contains breweries
 */
export const isBreweryArray = (arr: unknown): arr is Brewery[] => {
  return Array.isArray(arr) && arr.length > 0 && isBrewery(arr[0]);
};

/**
 * Format a brewery address
 */
export const formatBreweryAddress = (brewery: Brewery): string => {
  const parts = [];
  
  if (brewery.street) {
    parts.push(brewery.street);
  }
  
  if (brewery.city && brewery.state) {
    parts.push(`${brewery.city}, ${brewery.state} ${brewery.postal_code || ''}`);
  } else if (brewery.city) {
    parts.push(brewery.city);
  } else if (brewery.state) {
    parts.push(brewery.state);
  }
  
  return parts.join('\n');
}; 