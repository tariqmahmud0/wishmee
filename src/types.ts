export type Gender = 'girl' | 'boy';

export type RelationType = 
  | 'girlfriend' 
  | 'boyfriend' 
  | 'friend_girl' 
  | 'friend_boy' 
  | 'wife' 
  | 'husband' 
  | 'sister' 
  | 'brother';

export interface MemoryItem {
  id: string;
  type: 'image' | 'emoji';
  content: string;
  caption: string;
  subcaption?: string;
}

export interface BirthdayData {
  name: string;
  senderName?: string;
  gender: Gender;
  relation: RelationType;
  customGreeting?: string;
  customLetterText?: string[];
  customFinalCaption?: string;
  memories: MemoryItem[];
  themeColor: 'rose' | 'pink' | 'purple' | 'blue' | 'emerald';
  musicEnabled: boolean;
}

export interface RelationTemplate {
  relationLabel: string;
  welcomeSubText: string;
  balloonTitle: string;
  balloons: [string, string, string, string];
  candleHint: string;
  candleWishSuccess: string;
  bouquetTitle: string;
  bouquetSubText: string;
  memoriesTitle: string;
  memoriesHint: string;
  envelopeTitle: string;
  envelopeTapText: string;
  greeting: string;
  letter: string[];
  finalTitle: string;
  finalHint: string;
  finalCaption: string;
  finalSubtext: string;
  finalEmoji: string;
}
