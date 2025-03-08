import { z } from 'zod';

// Define schemas for API responses
const MetricsSummarySchema = z.object({
  avgResponseTime: z.number(),
  eventCounts: z.array(z.object({
    event_type: z.string(),
    count: z.number()
  })),
  messagesPerDay: z.array(z.object({
    date: z.string(),
    count: z.number()
  })),
  tokenUsage: z.object({
    totalTokens: z.number(),
    avgTokensPerRequest: z.number(),
    totalCost: z.number()
  })
});

const MetricsResponseSchema = z.object({
  metrics: z.array(z.object({
    id: z.number(),
    event_type: z.string(),
    message_length: z.number().nullable(),
    response_length: z.number().nullable(),
    response_time: z.number().nullable(),
    timestamp: z.string(),
    model: z.string().nullable(),
    token_count: z.number().nullable(),
    estimated_cost: z.number().nullable(),
    extra_data: z.string().nullable().transform(data => 
      data ? JSON.parse(data) : null
    )
  })),
  total: z.number()
});

const LogsResponseSchema = z.object({
  logs: z.array(z.object({
    id: z.number(),
    request_type: z.string(),
    user_message: z.string().nullable(),
    ai_response: z.string().nullable(),
    error: z.string().nullable(),
    timestamp: z.string()
  })),
  total: z.number()
});

// Fetch metrics summary
export const fetchMetricsSummary = async () => {
  const response = await fetch('/api/metrics/summary');
  if (!response.ok) {
    throw new Error('Failed to fetch metrics summary');
  }
  const data = await response.json();
  
  // Parse with Zod to validate and type the response
  return MetricsSummarySchema.parse(data);
};

// Fetch detailed metrics with pagination
export const fetchMetrics = async (page = 0, pageSize = 50) => {
  const offset = page * pageSize;
  const response = await fetch(`/api/metrics?limit=${pageSize}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }
  const data = await response.json();
  
  // Parse with Zod to validate and type the response
  return MetricsResponseSchema.parse(data);
};

// Fetch logs with pagination
export const fetchLogs = async (page = 0, pageSize = 50) => {
  const offset = page * pageSize;
  const response = await fetch(`/api/metrics/logs?limit=${pageSize}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch logs');
  }
  const data = await response.json();
  
  // Parse with Zod to validate and type the response
  return LogsResponseSchema.parse(data);
};

// Define schemas for chat requests and responses
const ChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty")
});

const ChatResponseSchema = z.object({
  reply: z.string()
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

// Send a chat message (non-streaming)
export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  // Validate input with Zod before sending
  const validatedRequest = ChatRequestSchema.parse({ message });
  
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validatedRequest),
  });
  
  if (!response.ok) {
    throw new Error('Failed to get response from server');
  }
  
  const data = await response.json();
  
  // Validate response with Zod
  return ChatResponseSchema.parse(data);
};

// Stream a chat response
export const streamChatMessage = async (
  message: string, 
  onChunk: (chunk: string) => void,
  onError: (error: Error) => void,
  onComplete: () => void
): Promise<void> => {
  try {
    // Validate input with Zod before sending
    ChatRequestSchema.parse({ message });
    
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
    
    if (!response.body) {
      throw new Error('Response body is null');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const eventData = line.substring(6);
          
          if (eventData === '[DONE]') {
            onComplete();
            break;
          }
          
          try {
            const data = JSON.parse(eventData);
            
            if (data.error) {
              onError(new Error(data.error));
              break;
            }
            
            if (data.chunk) {
              onChunk(data.chunk);
            }
          } catch (err) {
            console.error('Error parsing chunk:', err);
          }
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }
}; 