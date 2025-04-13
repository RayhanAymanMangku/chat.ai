import { db } from "@/lib/firebase/service"; // Pastikan jalur impor benar
import { ChatSession, Message } from "@/types/general";
import { doc, setDoc, serverTimestamp, getDoc, deleteDoc } from "firebase/firestore";

export const getChatHistory = async (userId: string, sessionId: string): Promise<ChatSession | null> => {
    try {
        const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
        const sessionDoc = await getDoc(sessionRef);
        return sessionDoc.exists() ? sessionDoc.data() as ChatSession : null;
    } catch (error) {
        console.error("Error fetching chat session:", error);
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
        const sessionData = {
            id: sessionId,
            userId,
            messages,
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