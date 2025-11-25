
export enum LoadingState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface EmailOptions {
  topic: string;
  audience: string;
  tone: string;
  type: EmailType;
  additionalContext: string;
}

export interface SavedTemplate {
  id: string;
  name: string;
  content: string;
  createdAt: number;
}

export enum EmailType {
  NEWSLETTER = 'Newsletter',
  PROMOTIONAL = 'Promotional',
  TRANSACTIONAL = 'Transactional',
  WELCOME = 'Welcome Series',
  COLD_OUTREACH = 'Cold Outreach'
}

export const EMAIL_TONES = [
  'Professional',
  'Friendly',
  'Urgent',
  'Witty',
  'Empathetic',
  'Minimalist'
];
