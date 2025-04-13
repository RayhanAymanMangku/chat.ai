// types/firestore.d.ts
import { Timestamp } from "firebase/firestore";

interface FirestoreChatMessage {
  content: ContentBlock[] | string;
  role: "user" | "assistant";
  timestamp: Timestamp | string;
}

interface FirestoreChatSession {
  id: string;
  userId: string;
  messages: FirestoreChatMessage[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

