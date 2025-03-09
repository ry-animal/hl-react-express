import { describe, it, expect } from 'vitest';
import { 
  formatTime, 
  formatDate, 
  formatISOToReadableDate, 
  getRelativeTimeString 
} from '../../utils/dateUtils';

describe('dateUtils', () => {
  describe('formatTime', () => {
    it('formats date to time string correctly', () => {
      // Create a date with known time (2:30 PM)
      const testDate = new Date(2023, 5, 15, 14, 30, 0);
      
      // Format should be in AM/PM format
      expect(formatTime(testDate)).toMatch(/2:30 PM/i);
    });
  });

  describe('formatDate', () => {
    it('formats date to YYYY-MM-DD format', () => {
      const testDate = new Date(2023, 5, 15); // June 15, 2023
      
      expect(formatDate(testDate)).toBe('2023-06-15');
    });
  });

  describe('formatISOToReadableDate', () => {
    it('formats ISO date string to readable format', () => {
      const isoString = '2023-06-15T14:30:00.000Z';
      const result = formatISOToReadableDate(isoString);
      
      // Should contain the date components in readable format
      expect(result).toContain('2023');
      expect(result).toContain('Jun');
      expect(result).toContain('15');
    });
  });

  describe('getRelativeTimeString', () => {
    it('returns "just now" for very recent dates', () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 30 * 1000); // 30 seconds ago
      
      expect(getRelativeTimeString(recent)).toBe('just now');
    });

    it('returns minutes for dates within the hour', () => {
      const now = new Date();
      const minutesAgo = new Date(now.getTime() - 10 * 60 * 1000); // 10 minutes ago
      
      expect(getRelativeTimeString(minutesAgo)).toBe('10 minutes ago');
    });

    it('handles singular form correctly', () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000); // 1 minute ago
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
      
      expect(getRelativeTimeString(oneMinuteAgo)).toBe('1 minute ago');
      expect(getRelativeTimeString(oneHourAgo)).toBe('1 hour ago');
    });

    it('returns hours for dates within the day', () => {
      const now = new Date();
      const hoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000); // 5 hours ago
      
      expect(getRelativeTimeString(hoursAgo)).toBe('5 hours ago');
    });

    it('returns "yesterday" for one day ago', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
      
      expect(getRelativeTimeString(yesterday)).toBe('yesterday');
    });

    it('returns days for dates within the month', () => {
      const now = new Date();
      const daysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
      
      expect(getRelativeTimeString(daysAgo)).toBe('5 days ago');
    });

    it('returns formatted date for older dates', () => {
      const now = new Date();
      const monthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000); // 60 days ago
      
      expect(getRelativeTimeString(monthsAgo)).toBe(formatDate(monthsAgo));
    });
  });
}); 