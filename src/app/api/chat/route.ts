import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from '@/lib/env';
import { parseContent } from '@/lib/utils';


const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
const aiModel = "gemini-2.5-pro-exp-03-25";

export async function GET() {
    return NextResponse.json({
        model: aiModel,
        status: "active",
        max_tokens: 65536,
        temperature: 1,
        top_p: 1,
        top_k: 40,
    });
}

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();
        const model = genAI.getGenerativeModel({ model: aiModel });
        const lastMessage = messages[messages.length - 1].content;

        const result = await model.generateContent(lastMessage);
        const response = result.response;
        const text = response.text();
        const usage = await model.countTokens(lastMessage);

        // Parsing konten
        const parsedContent = parseContent(text);
        console.log("Token used:", usage.totalTokens);

        return NextResponse.json({
            content: parsedContent,
            model: aiModel,
            tokensUsed: usage.totalTokens
        } as ApiResponse);


    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

