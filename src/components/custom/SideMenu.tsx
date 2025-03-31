"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import CardHistory from "./CardHistory"
import { ChatMessage, ChatSession } from "@/types/general"

interface SideMenuProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    setActiveSessionId: (id: string | null) => void
    refreshSessions: () => void
    activeSessionId: string | null
}

const SideMenu = ({ isOpen, onOpenChange, setActiveSessionId, refreshSessions, activeSessionId }: SideMenuProps) => {
    const [sessions, setSessions] = useState<ChatSession[]>([])


    useEffect(() => {
        const loadSessions = () => {
            const savedSessions = localStorage.getItem('chatSessions')
            if (savedSessions) {
                try {
                    const sessionsObj = JSON.parse(savedSessions)
                    setSessions(
                        (Object.values(sessionsObj) as ChatSession[]).sort(
                            (a: ChatSession, b: ChatSession) =>
                                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                        )
                    )
                } catch (error) {
                    console.error("Error parsing chat sessions:", error)
                }
            }
        }

        loadSessions()
    }, [isOpen, refreshSessions])

    const createNewChat = () => {
        const newSessionId = Date.now().toString()
        setActiveSessionId(newSessionId)
        onOpenChange(false)
    }

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

    const handleDelete = (sessionId: string) => {
        const savedSessions = localStorage.getItem('chatSessions')
        if (savedSessions) {
            try {
                const sessionsObj = JSON.parse(savedSessions)
                delete sessionsObj[sessionId]
                localStorage.setItem('chatSessions', JSON.stringify(sessionsObj))
                setSessions(
                    (Object.values(sessionsObj) as ChatSession[]).sort(
                        (a: ChatSession, b: ChatSession) =>
                            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                    )
                )
                if (activeSessionId === sessionId) {
                    setActiveSessionId(null)
                }
            } catch (error) {
                console.error("Error deleting chat session:", error)
            }
        }
    }


    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="bg-foreground/40 p-6">
                <SheetHeader className="border-b border-b-foreground py-4 pe-4">
                    <div className="flex justify-between items-center">
                        <SheetTitle className="text-white">Chat History</SheetTitle>
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

                <div className="py-4 space-y-2 max-h-[calc(100vh-150px)] overflow-y-auto">
                    {sessions.length > 0 ? (
                        sessions.map(session => (
                            <CardHistory
                                key={session.id}
                                title={getPreviewText(session)}
                                onClick={() => {
                                    setActiveSessionId(session.id)
                                    onOpenChange(false)
                                }}
                                date={new Date(session.updatedAt).toLocaleString()}
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
            </SheetContent>
        </Sheet>
    )
}

export default SideMenu