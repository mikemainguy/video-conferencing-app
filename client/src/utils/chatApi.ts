const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: number;
  color: string;
}

export interface ChatApiResponse {
  messages: ChatMessage[];
}

export interface StoreMessageResponse {
  success: boolean;
  message: ChatMessage;
}

export class ChatApi {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get chat history for a room
   */
  async getMessages(roomName: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/messages/${encodeURIComponent(roomName)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ChatApiResponse = await response.json();
      return data.messages;
    } catch (error) {
      console.error('Failed to fetch chat messages:', error);
      return [];
    }
  }

  /**
   * Store a new chat message
   */
  async storeMessage(roomName: string, message: Omit<ChatMessage, 'timestamp'>): Promise<ChatMessage | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/messages/${encodeURIComponent(roomName)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...message,
          timestamp: Date.now(),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StoreMessageResponse = await response.json();
      return data.message;
    } catch (error) {
      console.error('Failed to store chat message:', error);
      return null;
    }
  }

  /**
   * Clear chat history for a room
   */
  async clearMessages(roomName: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/messages/${encodeURIComponent(roomName)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to clear chat messages:', error);
      return false;
    }
  }
}

// Export a default instance
export const chatApi = new ChatApi(); 