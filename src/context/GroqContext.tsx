'use client'
import { createContext, useContext } from 'react';
import Groq from 'groq-sdk';

interface GroqContextType {
  generateExcuse: (context: string) => Promise<string | null>;
}

const GroqContext = createContext<GroqContextType | undefined>(undefined);

export function GroqProvider({ children }: { children: React.ReactNode }) {
  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY!,
    dangerouslyAllowBrowser: true 
  });

  const generateExcuse = async (context: string): Promise<string | null> => {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a sophisticated excuse generator that creates elegant, thoughtful, and believable excuses."
          },
          {
            role: "user",
            content: `Generate a refined excuse for this situation: ${context}`
          }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 150,
      });

      return completion.choices[0]?.message?.content ?? null;
    } catch (error) {
      console.error('Error generating excuse:', error);
      return null;
    }
  };

  return (
    <GroqContext.Provider value={{ generateExcuse }}>
      {children}
    </GroqContext.Provider>
  );
}

export const useGroq = () => {
  const context = useContext(GroqContext);
  if (context === undefined) {
    throw new Error('useGroq must be used within a GroqProvider');
  }
  return context;
};