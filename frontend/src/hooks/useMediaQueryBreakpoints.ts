import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Custom hook to manage responsive breakpoints
 * 
 * This combines Material UI's useMediaQuery and theme breakpoints for easier usage
 * Extracted from common usage across components
 * 
 * @returns Object with boolean flags for different breakpoints
 */
export const useMediaQueryBreakpoints = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');
  
  // Exact breakpoint ranges
  const isXsOnly = useMediaQuery(theme.breakpoints.only('xs'));
  const isSmOnly = useMediaQuery(theme.breakpoints.only('sm'));
  const isMdOnly = useMediaQuery(theme.breakpoints.only('md'));
  const isLgOnly = useMediaQuery(theme.breakpoints.only('lg'));
  const isXlOnly = useMediaQuery(theme.breakpoints.only('xl'));
  
  // Convenience functions for styling
  const getResponsiveValue = <T>(
    mobileValue: T,
    tabletValue: T = mobileValue,
    desktopValue: T = tabletValue
  ): T => {
    if (isMobile) return mobileValue;
    if (isTablet) return tabletValue;
    return desktopValue;
  };
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isPortrait,
    isLandscape,
    isXsOnly,
    isSmOnly,
    isMdOnly,
    isLgOnly,
    isXlOnly,
    getResponsiveValue
  };
}; 