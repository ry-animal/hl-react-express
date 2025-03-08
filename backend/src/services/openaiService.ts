import dotenv from 'dotenv';
import OpenAI from 'openai';

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

/**
 * Estimate the number of tokens in a text string
 * This is a rough estimate based on the OpenAI tokenization rules:
 * - ~4 characters per token for English text
 * - Varies by language and content
 * 
 * @param text The text to estimate tokens for
 * @returns Estimated token count
 */
export const estimateTokens = (text: string): number => {
  if (!text) return 0;
  
  // Basic estimation - 4 chars per token is a common rule of thumb for English
  // This is not exact but gives a reasonable approximation
  const estimatedTokens = Math.ceil(text.length / 4);
  
  return estimatedTokens;
};

/**
 * Send a message to OpenAI API and get a response
 * @param userMessage The message from the user
 * @returns The response from OpenAI
 */
export const getChatCompletion = async (
  userMessage: string
): Promise<string> => {
  try {
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
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get response from AI service');
  }
};

/**
 * Stream a response from OpenAI API
 * @param userMessage The message from the user
 * @param onChunk Callback function for each chunk of the response
 */
export const streamChatCompletion = async (
  userMessage: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  try {
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
    console.error('Error streaming from OpenAI API:', error);
    throw new Error('Failed to stream response from AI service');
  }
};
