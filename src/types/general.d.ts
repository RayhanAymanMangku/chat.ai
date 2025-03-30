interface ContentBlock {
    type: 'text' | 'list' | 'code' | 'quote'
    value?: string
    items?: string[]
    language?: string
}

interface ApiResponse {
    content: ContentBlock[];
    model: string;
    tokensUsed?: number;
}

export { ContentBlock, ApiResponse }
