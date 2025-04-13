import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY, GEMINI_MODEL } from '@/lib/env';
import { parseContent } from '@/lib/utils';
import { SYSTEM_PROMPT } from '@/lib/gemini-prompt';
import { adminDb } from '@/lib/firebase/firebase-admin';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
const aiModel = GEMINI_MODEL

interface Content {
  value: string;
}
interface Message {
  role: 'user' | 'assistant';
  content: Content[];
}

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await request.json();

    // Log data yang diterima
    console.log("Received messages:", messages);

    if (!messages?.length) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Konfigurasi model
    console.log("Initializing AI model...");
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT,
    });

    // Proses pesan terakhir
    const lastMessageContent = messages[messages.length - 1]?.content
      .map((c) => c.value)
      .join(' ');

    if (!lastMessageContent) {
      console.error("Empty message content");
      throw new Error("Empty message content");
    }

    console.log("Sending message to AI:", lastMessageContent);

    // Kirim pesan ke AI
    const result = await model.startChat({
      history: messages.map((msg, index) => ({
        role: index === 0 ? 'user' : msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content.map((c) => c.value).join(' ') }],
      })),
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      },
    }).sendMessage(lastMessageContent);

    const text = result.response.text();
    if (!text) {
      console.error("Empty response from AI");
      throw new Error("Empty response from AI");
    }

    console.log("AI response received:", text);

    return NextResponse.json({
      content: parseContent(text),
      model: GEMINI_MODEL,
      tokensUsed: (await model.countTokens(text)).totalTokens,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error },
      { status: 500 }
    );
  }
}



export async function GET() {
  return NextResponse.json({
    model: aiModel,
    status: "active",
    capabilities: ["text-generation", "code-completion"],
    limits: {
      max_tokens: 8192,
      max_requests_per_minute: 60
    },
    safety_settings: {
      harmful_content_blocking: "enabled",
      medical_advice: "blocked"
    }
  });
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: "Session ID and User ID are required" },
        { status: 400 }
      );
    }

    await adminDb.collection('users').doc(userId).collection('chatSessions').doc(sessionId).delete();

    return NextResponse.json({
      message: `Session ${sessionId} deleted successfully`
    });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}