import { Request, Response } from 'express';
import { saveMetric, saveLog } from '../services/metricsService';
import { getChatCompletion, streamChatCompletion } from '../services/openaiService';
import { MODEL_PRICING } from '../utils/constants';
import { estimateTokens } from '../utils/tokenUtils';

/**
 * Handle chat request with non-streaming response
 */
export const handleChatRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const startTime = Date.now();
  const { message } = req.body;
  const model = 'gpt-3.5-turbo';

  try {
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const inputTokenCount = estimateTokens(message);
    
    const response = await getChatCompletion(message);
    const endTime = Date.now();
    
    const outputTokenCount = estimateTokens(response);
    const totalTokenCount = inputTokenCount + outputTokenCount;
    
    const pricing = MODEL_PRICING[model as keyof typeof MODEL_PRICING] || MODEL_PRICING['gpt-3.5-turbo'];
    const estimatedCost = 
      (inputTokenCount / 1000) * pricing.input + 
      (outputTokenCount / 1000) * pricing.output;

    saveMetric({
      eventType: 'chat_completion',
      messageLength: message.length,
      responseTime: endTime - startTime,
      timestamp: new Date().toISOString(),
      responseLength: response.length,
      model,
      tokenCount: totalTokenCount,
      estimatedCost
    });
    
    saveLog({
      requestType: 'chat',
      userMessage: message,
      aiResponse: response,
      timestamp: new Date().toISOString()
    });

    res.json({ reply: response });
  } catch (error) {
    const endTime = Date.now();
    
    saveMetric({
      eventType: 'error',
      messageLength: message?.length,
      responseTime: endTime - startTime,
      timestamp: new Date().toISOString(),
      extraData: { error: (error as Error).message || 'Unknown error' }
    });
    
    saveLog({
      requestType: 'chat',
      userMessage: message,
      error: (error as Error).message || 'Unknown error',
      timestamp: new Date().toISOString()
    });
    
    console.error('Error in chat controller:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while processing your request' });
  }
};

/**
 * Handle chat request with streaming response
 */
export const handleStreamingChatRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const startTime = Date.now();
  const { message } = req.body;
  const model = 'gpt-3.5-turbo';
  let fullResponse = '';

  try {
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }
    
    const inputTokenCount = estimateTokens(message);

    // Set headers for SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    let streamError = false;

    const sendChunk = (chunk: string) => {
      try {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      } catch (err) {
        console.error('Error writing chunk to response:', err);
        streamError = true;
      }
    };

    try {
      await streamChatCompletion(message, sendChunk);

      if (!streamError) {
        res.write('data: [DONE]\n\n');
      }
      
      const endTime = Date.now();
      
      const outputTokenCount = estimateTokens(fullResponse);
      const totalTokenCount = inputTokenCount + outputTokenCount;
      
      const pricing = MODEL_PRICING[model as keyof typeof MODEL_PRICING] || MODEL_PRICING['gpt-3.5-turbo'];
      const estimatedCost = 
        (inputTokenCount / 1000) * pricing.input + 
        (outputTokenCount / 1000) * pricing.output;
      
      saveMetric({
        eventType: 'stream_completion',
        messageLength: message.length,
        responseLength: fullResponse.length,
        responseTime: endTime - startTime,
        timestamp: new Date().toISOString(),
        model,
        tokenCount: totalTokenCount,
        estimatedCost
      });
      
      saveLog({
        requestType: 'stream',
        userMessage: message,
        aiResponse: fullResponse,
        timestamp: new Date().toISOString()
      });
      
    } catch (streamingError) {
      console.error('Error during streaming:', streamingError);
      
      saveLog({
        requestType: 'stream',
        userMessage: message,
        error: (streamingError as Error).message || 'Unknown error during streaming',
        timestamp: new Date().toISOString()
      });
      
      res.write(
        `data: ${JSON.stringify({ error: 'An error occurred during streaming' })}\n\n`
      );
    } finally {
      res.end();
    }
  } catch (error) {
    console.error('Error in streaming chat controller:', error);
    
    saveMetric({
      eventType: 'error',
      messageLength: message?.length,
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      extraData: { error: (error as Error).message || 'Unknown error' }
    });
    
    saveLog({
      requestType: 'stream',
      userMessage: message,
      error: (error as Error).message || 'Unknown error',
      timestamp: new Date().toISOString()
    });
    
    // If headers haven't been sent yet, send a regular JSON error
    if (!res.headersSent) {
      res.status(500).json({ error: 'An error occurred during streaming' });
    } else {
      // Otherwise try to send an error in the stream format and end the response
      try {
        res.write(
          `data: ${JSON.stringify({ error: 'An error occurred during streaming' })}\n\n`
        );
        res.end();
      } catch (endError) {
        console.error('Error ending response stream:', endError);
      }
    }
  }
};
