import { db } from "@/lib/firebase/config";
import { Message } from "@/types/general";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const saveChatHistory = async (
    userId: string,
    sessionId: string,
    messages: Message[]

) => {
    try {
        // Create a reference to the chat session document
        const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
console.log("Saving chat history to:", `users/${userId}/chatSessions/${sessionId}`);
        // Prepare the session data
        const sessionData = {
            id: sessionId,
            userId,
            messages,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        // Save/update the document
        await setDoc(sessionRef, sessionData, { merge: true });

        console.log("Chat session saved successfully");
        return { success: true };
    } catch (error) {
        console.error("Error saving chat session:", error);
        throw error;
    }
};

