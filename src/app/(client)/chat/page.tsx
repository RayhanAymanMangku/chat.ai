"use client"
import { useEffect, useState } from "react"
import ChatArea from "@/components/custom/ChatArea"
import Navbar from "@/components/utils/Navbar"

interface ChatSessionForPage {
  id: string
  createdAt: string
  updatedAt: string
  messages: {
    content: {
      type: string
      value?: string
    }[]
    role: "user" | "assistant"
    timestamp: string
  }[]
}

export default function ChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [refreshFlag, setRefreshFlag] = useState(0)

  const refreshSessions = () => setRefreshFlag(prev => prev + 1)

  useEffect(() => {
    const sessions = localStorage.getItem('chatSessions')
    if (!sessions || Object.keys(JSON.parse(sessions)).length === 0) {
      const newSessionId = Date.now().toString()
      setActiveSessionId(newSessionId)
    } else {
      const sessionsObj: Record<string, ChatSessionForPage> = JSON.parse(sessions)
      const sortedSessions = Object.values(sessionsObj).sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      if (sortedSessions.length > 0) {
        setActiveSessionId(sortedSessions[0].id)
      }
    }
  }, [refreshFlag])

  return (
    <div className="flex flex-col h-screen overflow-y-auto space-y-4">
      <div className="mt-30">
        <Navbar
          setActiveSessionId={setActiveSessionId}
          refreshSessions={refreshSessions}
          activeSessionId={activeSessionId}
         
        />
      </div>
      <div className="overflow-y-hidden">
        <ChatArea
          activeSessionId={activeSessionId}
          setActiveSessionId={setActiveSessionId}
          refreshSessions={refreshSessions}
        />
      </div>
    </div>
  )
}