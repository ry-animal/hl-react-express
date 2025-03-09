import { useState } from 'react';
import useStore from '../store/useStore';
import { Message } from '../store/useStore';

interface ChatHookOptions {
  useStreaming?: boolean;
}

interface ChatHookResult {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  resetChat: () => void;
}

/**
 * Custom hook for chat functionality
 * Extracts chat logic from ChatInterface component
 */
export const useChat = (options: ChatHookOptions = {}): ChatHookResult => {
  const { useStreaming = true } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messages = useStore((state) => state.messages);
  const addMessage = useStore((state) => state.addMessage);
  const setRequestStartTime = useStore((state) => state.setRequestStartTime);
  
  const resetChat = () => {
    // Keep only the welcome message
    useStore.setState({
      messages: [
        {
          id: 1,
          text: "Hello! I'm Reuben's Brews assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]
    });
  };
  
  const sendMessage = async (message: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      setRequestStartTime(Date.now());
      
      // Add user message to the chat
      addMessage({
        text: message,
        sender: 'user',
      });
      
      if (useStreaming) {
        await handleStreamingResponse(message);
      } else {
        await handleRegularResponse(message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      // Add error message to chat
      addMessage({
        text: `Sorry, I encountered an error: ${errorMessage}`,
        sender: 'bot',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegularResponse = async (message: string): Promise<void> => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Add bot response to chat
    addMessage({
      text: data.reply,
      sender: 'bot',
    });
  };
  
  const handleStreamingResponse = async (message: string): Promise<void> => {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get streaming response from server');
    }
    
    // Add empty bot message to be updated during streaming
    addMessage({
      text: '',
      sender: 'bot',
    });
    
    let fullResponse = '';
    
    if (!response.body) {
      throw new Error('Response body is null');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Process the response chunk
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk
          .split('\n')
          .filter((line) => line.trim() !== '' && line.startsWith('data: '));
        
        for (const line of lines) {
          try {
            const jsonStr = line.replace('data: ', '');
            
            // Handle completion marker
            if (jsonStr === '[DONE]') {
              break;
            }
            
            const parsed = JSON.parse(jsonStr);
            
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            
            if (parsed.chunk) {
              fullResponse += parsed.chunk;
              
              // Update the last bot message with the accumulated response
              addMessage(
                {
                  text: fullResponse,
                  sender: 'bot',
                },
                true // isUpdate flag to update the last message instead of adding a new one
              );
            }
          } catch (e) {
            console.error('Error parsing SSE chunk:', e);
          }
        }
      }
    } catch (err) {
      console.error('Error reading stream:', err);
      throw new Error('Error reading response stream');
    }
  };
  
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetChat
  };
}; 