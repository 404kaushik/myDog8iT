'use client'
import { useState, useRef, useEffect } from 'react';
import { useGroq } from '@/context/GroqContext';
import MessageBubble from './MessageBubble';
import ImageUpload from './ImageUpload';
import { Message } from '@/types';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { generateExcuse } = useGroq();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      content: input,
      role: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const excuse = await generateExcuse(input);
      if (excuse) {
        const aiMessage: Message = {
          content: excuse,
          role: 'assistant',
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error generating excuse:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col px-4">
      <header className="py-6 text-center border-b border-gray-100">
        <h1 className="text-2xl font-light text-gray-900">Excuse Generator</h1>
      </header>

      <div className="flex-1 overflow-y-auto py-4 space-y-6">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
          />
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-pulse h-2 w-2 bg-gray-400 rounded-full mx-1"></div>
            <div className="animate-pulse h-2 w-2 bg-gray-400 rounded-full mx-1 delay-100"></div>
            <div className="animate-pulse h-2 w-2 bg-gray-400 rounded-full mx-1 delay-200"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-100 py-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your situation..."
            className="flex-1 px-4 py-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 rounded-xl bg-black text-white font-medium 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-gray-800 transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}