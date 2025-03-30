import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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