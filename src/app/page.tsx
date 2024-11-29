'use client'
import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import type { AppProps } from 'next/app'
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