/**
 * Simple function to detect brewery-related queries
 * @param message The user message to check
 * @returns Boolean indicating if the message appears to be a brewery search query
 */
export const isBrewerySearchQuery = (message: string): boolean => {
  if (!message) return false;
  return message.toLowerCase().includes('breweries');
}; 