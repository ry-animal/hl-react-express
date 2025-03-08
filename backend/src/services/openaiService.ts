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
- They offer a wide range of seasonal and limited releases along with their core beers
- They have won numerous awards including at the Great American Beer Festival and World Beer Cup
- They host "Gratituesdays" at The Taproom (5010 14th Ave NW), a monthly charity event where $1 per pint/growler/taster set is donated to local non-profits. This program has raised over $100,000 for local charities.

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
