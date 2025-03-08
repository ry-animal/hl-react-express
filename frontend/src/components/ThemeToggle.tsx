import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../theme/ThemeContext';

const ThemeToggle = () => {
    const { mode, toggleColorMode } = useThemeContext();

    return (
        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton
                onClick={toggleColorMode}
                color="inherit"
                aria-label="toggle light/dark theme"
                sx={{
                    transition: 'all 0.3s',
                    '&:hover': {
                        transform: 'scale(1.1)',
                    },
                }}
            >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle; 