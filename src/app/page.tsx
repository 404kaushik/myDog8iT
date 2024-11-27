'use client'
import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { GroqProvider } from '@/context/GroqContext';

export default function Home() {
  return (
    <GroqProvider>
      <main className="min-h-screen bg-white">
        <ChatInterface />
      </main>
    </GroqProvider>
  );
}