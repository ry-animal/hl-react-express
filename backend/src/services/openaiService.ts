import dotenv from 'dotenv';
import OpenAI from 'openai';
import { getBreweries } from './breweryDbService';
import { formatBreweryData } from '../utils/formatters';
import { estimateTokens } from '../utils/tokenUtils';
import { isBrewerySearchQuery } from '../utils/queryUtils';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const businessContext = `
You are a helpful assistant for Reuben's Brews, a craft brewery based in Seattle, Washington.
Facts about Reuben's Brews:
- Founded in 2012 by Adam and Grace Robbings, named after their son Reuben
- Known for award-winning beers including Robust Porter, Crikey IPA, Hazealicious IPA, and Pilsner
- The brewery has two taprooms:
  * Ballard: Mon-Thu 12pm-9pm, Fri-Sun 11am-10pm
  * Fremont: Mon-Thu 3pm-9pm, Fri-Sun 11am-10pm
- They have a "Beer Unbound" philosophy focused on brewing without constraints

- Beer Selection (Current Offerings):
  * Core Beers: Crikey IPA (6.8% ABV), Hazealicious IPA (6% ABV), Pilsner (5.4% ABV), Robust Porter (5.9% ABV), Hop Tropic (6.2% ABV), Crushable (5.2% ABV), Fruitfizz Grapefruit/Lemon & Lime/Orange Zest (5% ABV)
  * IPA Series: Brighten Up (6% ABV), Christmas Crikey (6.8% ABV), Fluff Coast (7% ABV), Making Waves (5.6% ABV), South-Up (6.7% ABV)
  * Hazy IPAs: Juice Party (6.7% ABV), Puffy IPA (6.5% ABV), Puffs of Fluff (7.5% ABV)
  * Lagers: Crispytown (4.8% ABV), Dark Munich Lager (5.3% ABV), Dortmunder (5.5% ABV), Hopshine (5.8% ABV), Northsun (5.3% ABV), Southsun (4.8% ABV)
  * Barrel-Aged: BBIS (14% ABV), Three Ryes Men (13.7% ABV), All Hands (12.7% ABV), various taproom-only variants
  * Specialty Series: Brettania wild ales, Farm & Oak fruit-aged beers
  * Non-Alcoholic: Reuben's Refresh IPA, Reuben's Refresh Sour, Yakima Pure

- They offer a wide range of seasonal and limited releases along with their core beers
- They have won numerous awards including at the Great American Beer Festival and World Beer Cup
- They host "Gratituesdays" at The Taproom (5010 14th Ave NW), a monthly charity event where $1 per pint/growler/taster set is donated to local non-profits. This program has raised over $100,000 for local charities.

IMPORTANT FORMATTING GUIDELINES:
Always use ample line breaks between sections to improve readability. Never present information as a wall of text.

For example, when answering about beer selections, format like this:

Hello! We have a diverse selection of beers at Reuben's Brews.

Our lineup includes:

• Core Beers: 
  - Crikey IPA (6.8% ABV)
  - Hazealicious IPA (6% ABV)
  - Pilsner (5.4% ABV)
  - Robust Porter (5.9% ABV)

• IPA Series:
  - Brighten Up (6% ABV)
  - Christmas Crikey (6.8% ABV)
  - Fluff Coast (7% ABV)

• Barrel-Aged Options:
  - BBIS (14% ABV)
  - Three Ryes Men (13.7% ABV)

Would you like to know more about any specific beer?

When sharing hours information, use extra line breaks between each line like this:

Our taproom hours are:

Ballard Taproom:

• Monday-Thursday: 12pm-9pm

• Friday-Sunday: 11am-10pm

Fremont Taproom:

• Monday-Thursday: 3pm-9pm

• Friday-Sunday: 11am-10pm

We hope to see you soon! 🍻

Always ensure each bullet point or line of information appears on its own separate line with space before and after.

Please help customers with questions about our beers, brewery, locations, hours, and any other brewery-related topics.
Be friendly, enthusiastic about craft beer, and knowledgeable while maintaining a conversational tone.
`;

// Update getChatCompletion for breweries
export const getChatCompletion = async (
  userMessage: string
): Promise<string> => {
  try {
    // Check if this is a brewery search query
    if (isBrewerySearchQuery(userMessage)) {
      try {
        const params = { by_city: 'seattle', per_page: 10 };
        
        console.log('Fetching breweries in Seattle');
        const breweries = await getBreweries(params);
        
        if (!breweries || breweries.length === 0) {
          return `I'm sorry, I couldn't find any breweries in Seattle at the moment.`;
        }
        
        // Return a special formatted response that the frontend can detect
        return `BREWERY_DATA:${JSON.stringify(breweries)}`;
      } catch (error) {
        console.error('Error in brewery search:', error);
        return `I'm sorry, I encountered an issue while fetching brewery information.`;
      }
    }
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: businessContext },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
    });

    return (
      completion.choices[0].message.content ||
      "Sorry, I couldn't generate a response."
    );
  } catch (error) {
    console.error('Error in chat completion:', error);
    return "I'm sorry, I couldn't process your request right now. Please try again later.";
  }
};

// For streaming API calls
export const streamChatCompletion = async (
  userMessage: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  try {
    // Check if this is a brewery search query
    if (isBrewerySearchQuery(userMessage)) {
      try {
        // Get breweries in Seattle
        const params = { by_city: 'seattle', per_page: 10 };
        
        console.log('Streaming: Fetching breweries in Seattle');
        const breweries = await getBreweries(params);
        
        if (!breweries || breweries.length === 0) {
          const errorMsg = `I'm sorry, I couldn't find any breweries in Seattle at the moment. The brewery information service might be temporarily unavailable. Would you like me to tell you about our own beers instead?`;
          onChunk(errorMsg);
          return;
        }
        
        // Send the introduction
        onChunk(`Here are some breweries in Seattle:\n\n`);
        
        // Wait a moment for the intro to be displayed
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Send each brewery with explicit separators
        for (let i = 0; i < breweries.length; i++) {
          const brewery = breweries[i];
          
          // Send clear separator
          onChunk(`\n===========================\n`);
          onChunk(`BREWERY #${i + 1}\n`);
          onChunk(`===========================\n\n`);
          
          // Wait to ensure separator is displayed
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Send name
          onChunk(`NAME: ${brewery.name}\n\n`);
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Send type
          onChunk(`TYPE: ${brewery.brewery_type}\n\n`);
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Send address
          if (brewery.street) {
            onChunk(`ADDRESS:\n`);
            onChunk(`${brewery.street}\n`);
            onChunk(`${brewery.city}, ${brewery.state} ${brewery.postal_code}\n\n`);
          } else {
            onChunk(`LOCATION:\n`);
            onChunk(`${brewery.city}, ${brewery.state}\n\n`);
          }
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Send phone
          if (brewery.phone) {
            const formattedPhone = brewery.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            onChunk(`PHONE: ${formattedPhone}\n\n`);
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          // Send website
          if (brewery.website_url) {
            onChunk(`WEBSITE: ${brewery.website_url}\n\n`);
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          // Wait between breweries
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Send closing message
        onChunk(`\nEnjoy exploring the local craft beer scene!`);
        return;
      } catch (breweryError) {
        console.error('Error in brewery streaming search:', breweryError);
        onChunk(`I'm sorry, I encountered an issue while fetching brewery information. Would you like to know about our own beers at Reuben's Brews instead?`);
        return;
      }
    }
    
    // Handle non-brewery queries with regular streaming
    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: businessContext },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Error in stream chat completion:', error);
    onChunk("I'm sorry, I couldn't process your request right now. Please try again later.");
  }
};

// Improved helper for sending messages in very small chunks
const sendMessageInSmallChunks = async (text: string, onChunk: (chunk: string) => void) => {
  // Use a much smaller chunk size to ensure proper delivery
  const chunkSize = 25; // Very small chunks
  
  for (let i = 0; i < text.length; i += chunkSize) {
    const chunk = text.substring(i, i + chunkSize);
    onChunk(chunk);
    // Longer delay between chunks for reliability
    await new Promise(resolve => setTimeout(resolve, 25));
  }
};
