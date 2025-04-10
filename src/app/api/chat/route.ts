import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY, GEMINI_MODEL } from '@/lib/env';
import { parseContent } from '@/lib/utils';
import { ApiResponse } from '@/types/general';
import { SYSTEM_PROMPT } from '@/lib/gemini-prompt';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
const aiModel = GEMINI_MODEL


export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();
        const model = genAI.getGenerativeModel({
            model: aiModel,
            systemInstruction: {
                role: "model",
                parts: [{ text: SYSTEM_PROMPT }]
            }
        });

        const lastMessage = messages[messages.length - 1].content;

        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [{ text: lastMessage }]
            }],
            generationConfig: {
                temperature: 0.9,
                topP: 1,
                topK: 40,
                maxOutputTokens: 2048
            }

        });

        const response = result.response;
        const text = response.text();
        const usage = await model.countTokens(text);

        const parsedContent = parseContent(text);

        return NextResponse.json({
            content: parsedContent,
            model: aiModel,
            tokensUsed: usage.totalTokens
        } as ApiResponse);

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : String(error)
            },
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