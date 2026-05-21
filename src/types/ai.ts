export type MessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface WellnessInsight {
  id: string;
  type: 'trend' | 'recommendation' | 'alert' | 'summary';
  title: string;
  description: string;
  metric?: string;
  value?: string | number;
  change?: number; // percentage
  priority: 'low' | 'medium' | 'high';
}

export interface AICopilotState {
  messages: ChatMessage[];
  isTyping: boolean;
  insights: WellnessInsight[];
}
