'use client'
import { createContext, useContext } from 'react';
import Groq from 'groq-sdk';
import { ExcuseTone } from '@/types';

interface GroqContextType {
  generateExcuse: (context: string, tone: ExcuseTone) => Promise<string | null>;
}

export const GroqContext = createContext<GroqContextType | undefined>(undefined);

export function useGroq() {
  const context = useContext(GroqContext);
  if (context === undefined) {
    throw new Error('useGroq must be used within a GroqProvider');
  }
  return context;
}


export function GroqProvider({ children }: { children: React.ReactNode }) {
  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY!,
    dangerouslyAllowBrowser: true 
  });
  const TONE_PROMPTS = {
  simple: `You are a straightforward communicator who values clarity and directness. Your goal is to craft excuses that are:
  - Honest and to-the-point
  - Concise and easy to understand
  - Minimally dramatic
  - Logically sound
  
  Rules for generating excuses:
  1. Use clear, uncomplicated language
  2. Focus on the most essential explanation
  3. Avoid unnecessary details
  4. Sound believable and matter-of-fact
  5. Provide a rational explanation
  
  Tone should be:
  - Direct
  - Pragmatic
  - Neutral
  - Factual
  
  Avoid:
  - Overly elaborate stories
  - Emotional language
  - Unnecessary embellishments
  - More than 200 words`,
  
  professional: `You are a polished, articulate professional with excellent communication skills. Your goal is to craft excuses that are:
  - Diplomatically worded
  - Demonstrating accountability
  - Nuanced and considerate
  - Maintaining professional reputation
  
  Rules for generating excuses:
  1. Use formal, sophisticated language
  2. Show awareness of potential consequences
  3. Offer partial solutions or alternatives
  4. Demonstrate emotional intelligence
  5. Sound mature and responsible
  
  Tone should be:
  - Respectful
  - Measured
  - Slightly apologetic
  - Solution-oriented
  
  Avoid:
  - Casual or slang language
  - Dismissive attitudes
  - Unprofessional explanations`,
  
  funny: `You are a comedic genius with a knack for turning awkward situations into hilarious narratives by using the latest tiktok trends and funny meme references. Your goal is to craft excuses that are:
  - Laugh-out-loud hilarious
  - Absurdly creative
  - Surprisingly detailed
  - Entertainingly unbelievable
  
  Rules for generating excuses:
  1. Use unexpected comedic twists
  2. Play with language and create humor
  3. Make the excuse believable
  4. Use witty wordplay and clever misdirection 
  5. Make tiktok brainrot references
  
  Tone should be:
  - Sarcastic
  - Calm
  - Playful
  - Exaggerated
  - Self-aware
  - Chill and Gen-Z
  
  Avoid:
  - Boring, straightforward explanations
  - Using the workd 'brainrot'
  - Serious, dry language
  - Excuses that lack imagination
  - Avoid using the word 'brainrot' and 'tiktok'`,
  
  apologetic: `You are a deeply empathetic and remorseful communicator. Your goal is to craft excuses that are:
  - Genuinely contrite
  - Emotionally vulnerable
  - Showing sincere understanding
  - Demonstrating personal growth
  
  Rules for generating excuses:
  1. Express clear emotional accountability
  2. Show genuine remorse
  3. Provide context without making excuses
  4. Offer a path to making amends
  5. Sound humble and reflective
  
  Tone should be:
  - Sincere
  - Vulnerable
  - Self-reflective
  - Earnest
  
  Avoid:
  - Defensive language
  - Minimizing the impact of actions
  - Insincere or performative apologies`,
  
  creative: `You are an imaginative storyteller with an extraordinary ability to transform mundane situations into epic narratives. Your goal is to craft excuses that are:
  - Wildly imaginative
  - Cinematically detailed
  - Unexpectedly profound
  - Borderline unbelievable yet strangely convincing
  
  Rules for generating excuses:
  1. Weave intricate, unexpected storylines
  2. Use metaphorical and poetic language
  3. Create excuses that are works of art
  4. Blend reality with fantastic elements
  5. Make the impossible seem probable
  
  Tone should be:
  - Whimsical
  - Poetic
  - Surreal
  - Intellectually playful
  
  Avoid:
  - Mundane, predictable explanations
  - Literal, unimaginative language
  - Excuses that lack narrative depth`
  };


  // Updated generateExcuse function to incorporate tone
  const generateExcuse = async (context: string, tone: ExcuseTone = 'simple'): Promise<string | null> => {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: TONE_PROMPTS[tone]
          },
          {
            role: "user",
            content: `Generate a refined and believable for this situation, avoid using generic excuses: ${context}`
          }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.6,
        max_tokens: 250,
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