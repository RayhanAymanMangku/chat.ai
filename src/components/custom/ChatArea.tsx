"use client"
import { Send, UserIcon, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useState, useRef, useEffect } from "react"
import { formatTime } from "@/lib/utils"
import hljs from "highlight.js"
import 'highlight.js/styles/github-dark.css'
import javascript from "highlight.js/lib/languages/javascript"
import python from "highlight.js/lib/languages/python"
import html from "highlight.js/lib/languages/xml"
import typescript from "highlight.js/lib/languages/typescript"
import Image from "next/image"
import Link from "next/link"
import { ContentBlock, Message, StoredMessage } from "@/types/general"

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('html', html);
hljs.registerLanguage('typescript', typescript);


const ChatArea = ({
    activeSessionId,
    setActiveSessionId,
    refreshSessions
}: {
    activeSessionId: string | null;
    setActiveSessionId: (id: string | null) => void;
    refreshSessions: () => void;
}) => {
    const [sessionMessages, setSessionMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (activeSessionId) {
            const sessions = JSON.parse(localStorage.getItem('chatSessions') || '{}');
            const sessionData = sessions[activeSessionId]?.messages || [];
            setSessionMessages(sessionData.map((msg: StoredMessage) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            })));
        } else {
            setSessionMessages([]);
        }
    }, [activeSessionId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleCopyCode = (code: string, index: number) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const highlightCode = (code: string, language?: string) => {
        try {
            if (language && hljs.getLanguage(language)) {
                return hljs.highlight(code, { language }).value;
            }
            return hljs.highlightAuto(code).value;
        } catch (error) {
            console.error("Error highlighting code:", error);
            return code;
        }
    };

    const renderContentBlock = (block: ContentBlock, index: number) => {
        switch (block.type) {
            case 'text':
                return <p key={index} className="w-full text-justify text-wrap">{block.value}</p>;
            case 'list':
                return (
                    <ul key={index} className="list-disc pl-5 space-y-1">
                        {block.items?.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                );
            case 'code':
                return (
                    <div key={index} className="relative ">
                        <pre className="!m-0 !rounded-lg !bg-[#0d1117]">
                            <code
                                className={`hljs language-${block.language || 'javascript'} !font-mono text-sm`}
                                dangerouslySetInnerHTML={{
                                    __html: highlightCode(block.value || '', block.language)
                                }}
                            />
                        </pre>
                        <button
                            onClick={() => handleCopyCode(block.value || '', index)}
                            className="absolute top-2 right-2 p-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
                            aria-label="Copy code"
                        >
                            {copiedIndex === index ? (
                                <Check className="h-4 w-4 text-green-400" />
                            ) : (
                                <Copy className="h-4 w-4 text-gray-300" />
                            )}
                        </button>
                    </div>
                );
            case 'quote':
                return (
                    <blockquote key={index} className="border-l-2 pl-2 italic text-gray-300">
                        {block.value}
                    </blockquote>
                );
            default:
                return <p key={index}>{JSON.stringify(block)}</p>;
        }
    };

    const saveSession = (messages: Message[]) => {
        if (!activeSessionId) return;

        const sessions = JSON.parse(localStorage.getItem('chatSessions') || '{}');

        sessions[activeSessionId] = {
            id: activeSessionId,
            createdAt: sessions[activeSessionId]?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: messages.map(msg => ({
                ...msg,
                timestamp: msg.timestamp.toISOString()
            }))
        };

        localStorage.setItem('chatSessions', JSON.stringify(sessions));
        refreshSessions();
    };

    const ensureActiveSession = () => {
        if (!activeSessionId) {
            const newSessionId = Date.now().toString();
            setActiveSessionId(newSessionId);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || isLoading) return;

        try {
            setIsLoading(true);
            ensureActiveSession();

            const userMessage: Message = {
                content: [{ type: 'text', value: newMessage }],
                role: "user",
                timestamp: new Date()
            };

            // Update local state immediately
            const updatedMessages = [...sessionMessages, userMessage];
            setSessionMessages(updatedMessages);
            setNewMessage("");
            saveSession(updatedMessages);

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [{ content: newMessage, role: "user" }]
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch response");

            const data = await response.json();
            const aiMessage: Message = {
                content: data.content,
                role: "assistant",
                timestamp: new Date()
            };

            const completeMessages = [...updatedMessages, aiMessage];
            setSessionMessages(completeMessages);
            saveSession(completeMessages);

        } catch (error) {
            console.error("Error:", error);
            const errorMessage: Message = {
                content: [{ type: 'text', value: "Sorry, something went wrong. Please try again." }],
                role: "assistant",
                timestamp: new Date()
            };
            const completeMessages = [...sessionMessages, errorMessage];
            setSessionMessages(completeMessages);
            saveSession(completeMessages);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    useEffect(() => {
        scrollToBottom();
        hljs.highlightAll();
    }, [sessionMessages]);

    return (
        <div className="flex items-center h-full screen justify-center overflow-y-auto px-4 lg:px-0">
            <div className="md:w-[60%] w-full h-full border border-foreground rounded-xl bg-background text-foreground flex flex-col">
                {/** Header */}
                <div className="p-4 border-b border-foreground flex items-center">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                                <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center">
                                    AI
                                </div>
                            </Avatar>
                            <div>
                                <h3 className="font-medium text-white">Chat AI</h3>
                                <p className={`text-xs ${isLoading ? "text-yellow-500" : "text-green-500"}`}>
                                    {isLoading ? "Typing..." : "Online"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground font-light">Powered by</span>
                            <div className="flex items-center">
                                <Image
                                    src="/assets/gemini-logo.png"
                                    alt="Gemini Logo"
                                    width={24}
                                    height={24}
                                    className="h-5 w-5 object-contain"
                                />
                                <Link href={"https://gemini.com/"} className="cursor-pointer">
                                    <span className="ml-1 text-sm font-medium text-blue-400">Gemini</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/** Messages & Response Area */}
                <div className="overflow-y-auto p-4 space-y-4">
                    {sessionMessages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex items-start space-x-2 ${message.role === "user" ? "justify-end" : ""}`}
                        >
                            {message.role === "assistant" && (
                                <Avatar className="h-8 w-8">
                                    <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center">
                                        AI
                                    </div>
                                </Avatar>
                            )}

                            <div className={`${message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary/10 border border-foreground text-white"
                                } p-2 rounded-lg w-fit lg:max-w-[88%]`}>

                                {/* Render content blocks */}
                                <div className="space-y-2">
                                    {message.content.map((block, blockIndex) => (
                                        renderContentBlock(block, blockIndex)
                                    ))}
                                </div>

                                <span className="text-xs text-muted-foreground">
                                    {formatTime(message.timestamp)}
                                </span>
                            </div>

                            {message.role === "user" && (
                                <Avatar className="h-8 w-8">
                                    <div className="bg-accent text-accent-foreground rounded-full h-full w-full flex items-center justify-center">
                                        <UserIcon />
                                    </div>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-foreground">
                    <div className="flex items-center space-x-2">
                        <Input
                            ref={inputRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 text-white bg-background/30 border-foreground focus:border-primary focus:ring-0 focus:outline-none"
                            disabled={isLoading}
                        />

                        <Button
                            onClick={handleSendMessage}
                            size="icon"
                            className="bg-primary text-primary-foreground hover:bg-primary/20 transition-all duration-300"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                                <Send size={18} />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatArea;