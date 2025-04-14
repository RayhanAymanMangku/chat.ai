import { FieldValue } from "firebase/firestore";

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
    timestamp: Date | FieldValue;
  }

type StoredMessage = {
    content: ContentBlock[];
    role: "user" | "assistant";
    timestamp: string;
};

interface ChatMessage {
  content: ContentBlock[] | string;
  role: "user" | "assistant";
  timestamp: Date | FieldValue;
}

interface ChatSession {
    id: string;
    userId: string;
    messages: ChatMessage[];
    createdAt: Date | FieldValue;  // Allow both Date and FieldValue
    updatedAt: Date | FieldValue;
  }



export { ContentBlock, ApiResponse, Message, StoredMessage, ChatMessage, ChatSession };
