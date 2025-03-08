import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GlobalStyles } from '@mui/material'
import App from './App.tsx'
import { ThemeProvider } from './theme/ThemeContext'
import './index.css'

// Create a client
const queryClient = new QueryClient()

// Global styles to ensure full width and height
const globalStyles = {
  'html, body, #root': {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    overflowX: 'hidden'
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GlobalStyles styles={globalStyles} />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
