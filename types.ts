
export interface SentimentResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  score: number; // 0 to 100
  confidence: number; // 0 to 100
  explanation: string;
  keywords: string[];
  emojis: string[];
  intensity: 'Low' | 'Medium' | 'High';
}

export interface HistoryItem extends SentimentResult {
  id: string;
  text: string;
  timestamp: number;
}
