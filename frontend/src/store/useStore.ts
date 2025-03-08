import { create } from 'zustand';

// Define the Message type
export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  responseTime?: number; // in milliseconds, only for bot messages
}

// Define the metrics type
export interface Metrics {
  totalMessages: number;
  userMessages: number;
  botMessages: number;
  averageResponseTime: number; // in milliseconds
  totalResponseTime: number; // in milliseconds
  tokenEstimate: number; // rough estimate
}

// Define the application state
interface AppState {
  // View management
  activeView: 'metrics' | 'chat';
  setActiveView: (view: 'metrics' | 'chat') => void;
  
  // Message management
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  
  // For tracking response time
  requestStartTime: number | null;
  setRequestStartTime: (time: number | null) => void;
}

// Create the store
const useStore = create<AppState>((set, get) => ({
  // Initialize view
  activeView: 'chat',
  setActiveView: (view) => set({ activeView: view }),
  
  // Initialize messages with a welcome message
  messages: [{
    id: 1,
    text: "Hello! I'm Reuben's Brews assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date()
  }],
  
  // Add message function with logic for metrics tracking
  addMessage: (messageData) => {
    const state = get();
    const newMessage: Message = {
      id: state.messages.length + 1,
      timestamp: new Date(),
      ...messageData,
    };
    
    // For bot messages, calculate response time if request start time exists
    if (messageData.sender === 'bot' && state.requestStartTime) {
      newMessage.responseTime = Date.now() - state.requestStartTime;
      set({ requestStartTime: null }); // Reset request start time
    }
    
    // Update messages
    set(state => ({ 
      messages: [...state.messages, newMessage],
    }));
  },
  
  // Request timing
  requestStartTime: null,
  setRequestStartTime: (time) => set({ requestStartTime: time }),
}));

export default useStore; 