interface ContentBlock {
    type: 'text' | 'list' | 'code' | 'quote';
    value?: string;
    items?: string[];
    language?: string;
  }

interface ApiResponse {
    content: ContentBlock[];
    model: string;
    tokensUsed?: number;
}

interface Message {
    content: ContentBlock[];
    role: "user" | "assistant";
    timestamp: Date;
  }

type StoredMessage = {
    content: ContentBlock[];
    role: "user" | "assistant";
    timestamp: string;
};

interface ChatMessage {
    role: string
    content: Array<{
        value: string
        type: string
    }> | string
}

interface ChatSession {
    id: string;
    userId: string;
    messages: ChatMessage[];
    createdAt: Date | string;
    updatedAt: Date | string;
  }



export { ContentBlock, ApiResponse, Message, StoredMessage, ChatMessage, ChatSession };
