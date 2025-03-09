import React from 'react';
import { Box, Typography, Link } from '@mui/material';

interface Brewery {
  id?: string;
  name: string;
  brewery_type: string;
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  phone?: string;
  website_url?: string;
}

interface BreweryCardProps {
  brewery: Brewery;
  index: number;
}

const BreweryCard: React.FC<BreweryCardProps> = ({ brewery, index }) => {
  return (
    <Box sx={{
      border: '1px solid #ddd',
      borderRadius: 2,
      p: 2,
      mb: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Typography variant="h6" gutterBottom>
        {index + 1}. {brewery.name}
      </Typography>

      <Typography variant="body1" gutterBottom>
        <strong>Type:</strong> {brewery.brewery_type}
      </Typography>

      {brewery.street && (
        <Typography variant="body1" gutterBottom>
          <strong>Address:</strong><br />
          {brewery.street}<br />
          {brewery.city}, {brewery.state} {brewery.postal_code}
        </Typography>
      )}

      {brewery.phone && (
        <Typography variant="body1" gutterBottom>
          <strong>Phone:</strong> {brewery.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
        </Typography>
      )}

      {brewery.website_url && (
        <Typography variant="body1" gutterBottom>
          <strong>Website:</strong> <Link href={brewery.website_url} target="_blank" rel="noopener">
            {brewery.website_url}
          </Link>
        </Typography>
      )}
    </Box>
  );
};

interface BreweriesResponseProps {
  breweries: Brewery[];
}

const BreweriesResponse: React.FC<BreweriesResponseProps> = ({ breweries }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Here are some breweries in Seattle:
      </Typography>

      {breweries.map((brewery, index) => (
        <BreweryCard key={brewery.id || index} brewery={brewery} index={index} />
      ))}
    </Box>
  );
};
interface ChatMessageProps {
  message: string | Brewery[] | unknown;
  role: 'user' | 'assistant' | 'system';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, role }) => {
  console.log('message type:', typeof message);
  console.log('message content:', message);

  // Check if this is a brewery data message
  if (role === 'assistant') {
    // Check for explicit prefix
    if (typeof message === 'string' && message.startsWith('BREWERY_DATA:')) {
      try {
        const breweriesJson = message.replace('BREWERY_DATA:', '');
        const breweries = JSON.parse(breweriesJson);
        return <BreweriesResponse breweries={breweries} />;
      } catch (error) {
        console.error('Error parsing brewery data:', error);
      }
    }

    if (typeof message === 'string') {
      try {
        const data = JSON.parse(message);
        if (Array.isArray(data) && data.length > 0 &&
          'brewery_type' in data[0] && 'name' in data[0]) {
          return <BreweriesResponse breweries={data} />;
        }
      } catch {
        // Not JSON, continue to normal rendering
      }
    }

    if (typeof message === 'object' && message !== null && Array.isArray(message) &&
      message.length > 0 && 'brewery_type' in message[0]) {
      return <BreweriesResponse breweries={message} />;
    }
  }

  return (
    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
      {typeof message === 'object' ? JSON.stringify(message) : String(message)}
    </Typography>
  );
};

export default ChatMessage; 