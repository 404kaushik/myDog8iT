'use client'
import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/context/AuthContext';
import { GroqProvider } from '@/context/GroqContext';

export default function Home() {
  return (
    <AuthProvider>
      <GroqProvider>
        <main className="min-h-screen bg-white">
          <ChatInterface />
        </main>
      </GroqProvider>
    </AuthProvider>
  );
}