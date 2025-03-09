import { useTheme } from '@mui/material/styles';
import { alpha, darken, lighten } from '@mui/material';

/**
 * Get the background color for user chat bubbles based on theme mode
 * Extracted from ChatInterface
 */
export const getUserBubbleBackground = (isDarkMode: boolean) => {
  return isDarkMode 
    ? '#3a3a3a' // Dark gray in dark mode
    : '#e3f2fd'; // Light blue in light mode
};

/**
 * Get the background color for bot chat bubbles based on theme mode
 * Extracted from ChatInterface
 */
export const getBotBubbleBackground = (isDarkMode: boolean) => {
  return isDarkMode
    ? '#2e4c30' // Dark green in dark mode  
    : '#e8f5e9'; // Light green in light mode
};

/**
 * Get the border color for user chat bubbles based on theme mode
 * Extracted from ChatInterface
 */
export const getUserBubbleBorder = (isDarkMode: boolean) => {
  return isDarkMode
    ? '#4a4a4a' // Slightly lighter than background in dark mode
    : '#bbdefb'; // Slightly darker than background in light mode
};

/**
 * Get the border color for bot chat bubbles based on theme mode
 * Extracted from ChatInterface
 */
export const getBotBubbleBorder = (isDarkMode: boolean) => {
  return isDarkMode
    ? '#3e6e40' // Slightly lighter than background in dark mode
    : '#c8e6c9'; // Slightly darker than background in light mode
};

/**
 * Get text color with appropriate contrast based on theme mode
 * Used in multiple components
 */
export const getContrastText = (isDarkMode: boolean, isSecondary = false) => {
  if (isDarkMode) {
    return isSecondary ? 'rgba(255, 255, 255, 0.7)' : '#ffffff';
  } else {
    return isSecondary ? 'rgba(0, 0, 0, 0.6)' : '#000000';
  }
};

/**
 * Get background color with alpha transparency
 */
export const getAlphaBackground = (color: string, alphaValue: number) => {
  return alpha(color, alphaValue);
};

/**
 * Darken a color by a percentage
 */
export const darkenColor = (color: string, percentage: number) => {
  return darken(color, percentage);
};

/**
 * Lighten a color by a percentage
 */
export const lightenColor = (color: string, percentage: number) => {
  return lighten(color, percentage);
};

/**
 * Custom hook to get theme-aware colors for components
 */
export const useThemeAwareColors = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  return {
    userBubbleBackground: getUserBubbleBackground(isDarkMode),
    botBubbleBackground: getBotBubbleBackground(isDarkMode),
    userBubbleBorder: getUserBubbleBorder(isDarkMode),
    botBubbleBorder: getBotBubbleBorder(isDarkMode),
    primaryText: getContrastText(isDarkMode, false),
    secondaryText: getContrastText(isDarkMode, true),
    isDarkMode
  };
}; 