import { Box, Container, Typography, Link, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Determine appropriate text color for best contrast
  const getTextColor = () => {
    if (theme.palette.mode === 'dark') {
      return theme.palette.text.secondary;
    } else {
      // If using primary color as background in light mode, ensure text has enough contrast
      return theme.palette.primary.contrastText;
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 0.25, sm: 0.5 },
        mt: 'auto',
        backgroundColor:
          theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : theme.palette.primary.main,
        color: getTextColor(),
        width: '100%',
        maxWidth: '100vw',
        left: 0,
        right: 0,
      }}
      role="contentinfo"
      aria-label="Footer"
    >
      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
          minHeight: { xs: '40px', sm: '48px' },
        }}
      >
        <Box
          sx={{
            mb: isMobile ? { xs: 0.5, sm: 0.75 } : 0,
            mt: isMobile ? 0.5 : 0,
            textAlign: 'center',
          }}
        >
          <img
            src="/assets/fremont.svg"
            alt="Fremont logo"
            height={isMobile ? '30' : '40'}
            style={{
              maxWidth: '100%',
              filter: 'brightness(0) invert(1)',
            }}
          />
        </Box>

        <Typography
          variant="body2"
          align={isMobile ? 'center' : 'right'}
          sx={{
            fontSize: { xs: '0.7rem', sm: '0.8rem' },
            color: 'inherit',
            fontWeight: theme.palette.mode === 'dark' ? 'normal' : 'medium',
            lineHeight: 1.4,
            mb: isMobile ? 0.5 : 0,
          }}
        >
          {'© '}
          <Link
            color="inherit"
            href="#"
            sx={{
              textDecoration: 'none',
              fontWeight: 'medium',
              '&:hover': {
                textDecoration: 'underline',
              },
              '&:focus-visible': {
                outline: `2px solid ${getTextColor()}`,
                outlineOffset: 2,
              },
            }}
            aria-label="Reuben's Brews website"
          >
            Reuben&apos;s Brews
          </Link>{' '}
          {new Date().getFullYear()}
          {'. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
