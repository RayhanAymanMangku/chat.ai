import { ChatMessage, ContentBlock, Message } from "@/types/general"
import { clsx, type ClassValue } from "clsx"
import { FieldValue } from "firebase/firestore";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 

export function formatChatDate(date: Date | string | FieldValue): string {
  if (date instanceof Date) {
    return date.toLocaleString();
  }
  if (typeof date === 'string') {
    return new Date(date).toLocaleString();
  }
  return new Date().toLocaleString(); // Fallback for FieldValue
}

export const formatMessageTime = (timestamp: Date | FieldValue): string => {
  const date = timestamp instanceof Date ? timestamp : new Date();
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export function convertChatMessageToMessage(chatMessage: ChatMessage): Message {
  // Handle case where content is a string
  let contentBlocks: ContentBlock[] = [];
  
  if (typeof chatMessage.content === 'string') {
    contentBlocks = [{ type: 'text', value: chatMessage.content }];
  } else {
    contentBlocks = chatMessage.content;
  }

  // Convert timestamp to Date if it's a string or FieldValue
  let timestamp: Date;
  if (chatMessage.timestamp instanceof Date) {
    timestamp = chatMessage.timestamp;
  } else if (typeof chatMessage.timestamp === 'string') {
    timestamp = new Date(chatMessage.timestamp);
  } else {
    timestamp = new Date(); // Fallback to current date
  }

  return {
    content: contentBlocks,
    role: chatMessage.role,
    timestamp
  };
}

export function parseContent(text: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = text.split('\n');
  let currentList: string[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({
        type: 'text',
        value: currentParagraph.join('\n').trim()
      });
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: 'list', items: currentList });
      currentList = [];
    }
  };

  for (const line of lines) {
    // Deteksi list item (bullet atau numbered)
    const listItemMatch = line.match(/^(\s*[\-•*]|\d+\.)\s+(.*)/);

    if (listItemMatch) {
      flushParagraph();
      currentList.push(listItemMatch[2].trim());
    }
    // Deteksi code block (3 backticks)
    else if (line.startsWith('```')) {
      flushParagraph();
      flushList();
      const codeContent = lines
        .slice(lines.indexOf(line) + 1)
        .join('\n')
        .split('```')[0];
      blocks.push({ type: 'code', value: codeContent.trim() });
      break;
    }
    // Deteksi quote (>)
    else if (line.startsWith('> ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'quote', value: line.slice(2).trim() });
    }
    else {
      if (currentList.length > 0) {
        flushList();
      }
      currentParagraph.push(line.trim());
    }
  }

  flushParagraph();
  flushList();

  return blocks;
}

