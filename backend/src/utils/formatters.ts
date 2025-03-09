/**
 * Type definition for brewery data
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
 * Formats brewery data into a readable string format with clear separations
 * @param breweries List of breweries to format
 * @returns Formatted string with brewery information
 */
export const formatBreweryData = (breweries: Brewery[]): string => {
  // Return a JSON string that the frontend can parse
  return JSON.stringify(breweries);
}; 