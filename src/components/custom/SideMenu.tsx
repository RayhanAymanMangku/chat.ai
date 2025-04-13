"use client"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import CardHistory from "./CardHistory"
import { ChatMessage, ChatSession } from "@/types/general"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { CiLogout } from 'react-icons/ci';
import { useRouter } from "next/navigation"
import Loading from "@/app/loading"
import { auth, db } from "@/lib/firebase/service"
// import { getChatHistory } from "@/services/user.service"
import { collection, deleteDoc, doc, FieldValue, getDocs } from "firebase/firestore"
import { toSafeDate } from "@/lib/firebase/utils"

interface SideMenuProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    setActiveSessionId: (id: string | null) => void
    refreshSessions: () => void
    activeSessionId: string | null
}

const SideMenu = ({ isOpen, onOpenChange, setActiveSessionId, refreshSessions, activeSessionId }: SideMenuProps) => {
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [photoURL, setPhotoURL] = useState("/assets/gemini-logo.png");
    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            if (user.photoURL) {
                setPhotoURL(user.photoURL);
            }

            if (user.displayName) {
                setUserName(user.displayName);
            } else {
                console.log("User display name is not available.");
            }

            // Load chat sessions from Firestore
            const loadSessions = async () => {
                try {
                  setIsLoading(true);
                  const userId = user.uid;
                  const fetchedSessions: ChatSession[] = [];
              
                  const querySnapshot = await getDocs(collection(db, "users", userId, "chatSessions"));
                  
                  querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedSessions.push({
                      id: doc.id,
                      userId: data.userId,
                      messages: data.messages || [],
                      createdAt: data.createdAt, // Pertahankan aslinya (Date | FieldValue)
                      updatedAt: data.updatedAt, // Pertahankan aslinya (Date | FieldValue)
                    });
                  });
              
                  // Urutkan dengan konversi aman
                  setSessions(fetchedSessions.sort((a, b) => {
                    const dateA = toSafeDate(a.updatedAt).getTime();
                    const dateB = toSafeDate(b.updatedAt).getTime();
                    return dateB - dateA;
                  }));
                } catch (error) {
                  console.error("Error loading sessions:", error);
                } finally {
                  setIsLoading(false);
                }
              };
            loadSessions();
        }
    }, [isOpen, refreshSessions, user]);

    const createNewChat = () => {
        const newSessionId = Date.now().toString()
        setActiveSessionId(newSessionId)
        onOpenChange(false)
    }

    const parseFirestoreDate = (date: Date | string | FieldValue): Date => {
        if (date instanceof Date) return date;
        if (typeof date === 'string') return new Date(date);
        return new Date(); // Fallback untuk FieldValue
      };

    const getPreviewText = (session: ChatSession) => {
        if (!session.messages) return "New chat"

        const lastUserMessage = session.messages
            .slice()
            .reverse()
            .find((msg: ChatMessage) => msg.role === 'user')

        if (!lastUserMessage) return "New chat"

        if (typeof lastUserMessage.content === 'string') {
            return lastUserMessage.content.substring(0, 30) || "New chat"
        }

        return lastUserMessage.content[0]?.value?.substring(0, 30) || "New chat"
    }

    const handleDelete = async (sessionId: string) => {
        try {
          setIsLoading(true);
          const userId = user?.uid;
          if (!userId) return;
      
          // Hapus dari Firestore
          await deleteDoc(doc(db, "users", userId, "chatSessions", sessionId));
          
          // Update state lokal
          setSessions(prev => prev.filter(s => s.id !== sessionId));
          
          if (activeSessionId === sessionId) {
            setActiveSessionId(null);
          }
        } catch (error) {
          console.error("Error deleting session:", error);
        } finally {
          setIsLoading(false);
        }
      };

    const handleLogout = async () => {
        try {
            setIsLoading(true)
            await auth.signOut()
            
            router.push("/")
        } catch (error) {
            console.error("Error signing out:", error)
            setIsLoading(false)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="bg-foreground/40 p-6">
                <SheetHeader className="border-b border-b-foreground py-4 pe-4">
                    <div className="flex justify-between items-center">
                        <div className="flex justify-between gap-2">
                            <Image
                                src={photoURL}
                                alt="profile"
                                width={40}
                                height={40}
                                className="rounded-full w-10 h-10"
                                onError={() => setPhotoURL("/gemini-logo.png")}
                            />


                            <SheetTitle className="text-sm text-white">{user ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase() : ""}</SheetTitle>

                        </div>
                        <Button
                            onClick={createNewChat}
                            size="sm"
                            className="gap-1 hover:bg-foreground transition-all duration-300 cursor-pointer"
                        >
                            <Plus size={16} />
                            New Chat
                        </Button>
                    </div>
                </SheetHeader>

                <div className="space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto rounded-2xl bg-foreground p-4">
                    <SheetTitle className="text-white">Chat History</SheetTitle>

                    {isLoading ? (
                        <div className="text-center text-white/70 py-4">
                            Loading chat history...
                        </div>
                    ) : sessions.length > 0 ? (
                        sessions.map(session => (
                            <CardHistory
                                key={session.id}
                                title={getPreviewText(session)}
                                onClick={() => {
                                    setActiveSessionId(session.id)
                                    onOpenChange(false)
                                }}
                                date={parseFirestoreDate(session.updatedAt).toLocaleString()}
                                isActive={session.id === activeSessionId}
                                onDelete={() => handleDelete(session.id)}
                            />
                        ))
                    ) : (
                        <div className="text-center text-white/70 py-4">
                            No chat history found
                        </div>
                    )}
                </div>
                <SheetFooter>
                    {isLoading && (
                        <Loading/>
                    )}
                    <Button variant="destructive" onClick={handleLogout}>
                        <CiLogout />
                        Logout
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default SideMenu