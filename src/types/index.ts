export type ExcuseTone = 'simple' | 'professional' | 'funny' | 'apologetic' | 'creative';


export interface Message {
    content: string;
    role: 'user' | 'assistant';
    tone?: ExcuseTone;
}

