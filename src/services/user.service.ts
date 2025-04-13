import { db } from "@/lib/firebase/service"; // Pastikan jalur impor benar
import { toSafeDate } from "@/lib/firebase/utils";
import { FirestoreChatMessage } from "@/types/firestore";
import { ChatMessage, ChatSession, Message } from "@/types/general";
import { doc, setDoc, serverTimestamp, getDoc, deleteDoc, Timestamp } from "firebase/firestore";

export const getChatHistory = async (
    userId: string, 
    sessionId: string
  ): Promise<ChatSession | null> => {
    try {
      const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
      const docSnapshot = await getDoc(sessionRef);
  
      if (!docSnapshot.exists()) {
        return null;
      }
  
      const data = docSnapshot.data();
      
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid session data");
      }
  
      const parseMessage = (msg: unknown): ChatMessage => {
        if (typeof msg !== 'object' || msg === null) {
          throw new Error("Invalid message format");
        }
        
        const message = msg as FirestoreChatMessage;
        return {
          content: message.content,
          role: message.role,
          timestamp: message.timestamp instanceof Timestamp 
            ? message.timestamp.toDate() 
            : new Date(message.timestamp)
        };
      };
  
      return {
        id: docSnapshot.id,
        userId: data.userId,
        messages: Array.isArray(data.messages) 
          ? data.messages.map(parseMessage)
          : [],
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp 
          ? data.updatedAt.toDate() 
          : new Date()
      };
    } catch (error) {
      console.error("Error getting chat history:", error);
      throw error;
    }
  };

export const saveChatHistory = async (
    userId: string,
    sessionId: string,
    messages: Message[]
) => {
    try {
        const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
        console.log("Saving chat history to:", `users/${userId}/chatSessions/${sessionId}`);
        
        const chatMessages: ChatMessage[] = messages.map(message => ({
            content: message.content,
            role: message.role,
            timestamp: toSafeDate(message.timestamp) 
        }));

      
        const sessionData: Omit<ChatSession, 'id'> & { id: string } = {
            id: sessionId,
            userId,
            messages: chatMessages,
            createdAt: serverTimestamp(), 
            updatedAt: serverTimestamp(), 
          };

        await setDoc(sessionRef, sessionData, { merge: true });

        console.log("Chat session saved successfully");
        return { success: true };
    } catch (error) {
        console.error("Error saving chat session:", error);
        throw error;
    }
};

export const deleteChatSession = async (userId: string, sessionId: string): Promise<{ success: boolean }> => {
    try {
        const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
        console.log("Deleting chat session from:", `users/${userId}/chatSessions/${sessionId}`);

        await deleteDoc(sessionRef);

        console.log("Chat session deleted successfully");
        return { success: true };
    } catch (error) {
        console.error("Error deleting chat session:", error);
        throw error;
    }
};