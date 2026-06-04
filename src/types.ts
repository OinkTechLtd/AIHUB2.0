export interface AITool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'AI-кодинг' | 'Генерация текста' | 'Нейросети' | 'Стартапы' | 'Праздники';
  targetAudience: 'programmers' | 'everyone';
  working: boolean;
  statusUrlCheck?: 'working' | 'unstable' | 'offline' | 'checking';
  isNew?: boolean;
  isHoliday?: boolean;
  source: 'github' | 'tatnet' | 'producthunt' | 'ycombinator' | 'other';
  addedDate: string;
  stars?: number;
}

export interface StartupNews {
  id: string;
  title: string;
  description: string;
  url: string;
  source: 'GitHub' | 'TatNet' | 'Product Hunt' | 'YCombinator';
  addedDate: string;
}
