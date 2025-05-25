import type { GenerateTextbookAnswerOutput } from '@/ai/flows/generate-textbook-answer';

export type Citation = GenerateTextbookAnswerOutput['citations'][number];

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citations?: Citation[];
  timestamp: Date;
  isLoading?: boolean; // For AI message while streaming/loading
}
