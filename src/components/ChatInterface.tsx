import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Wand2, Menu, X } from 'lucide-react';
import { useGroq } from '@/context/GroqContext';
import MessageBubble from './MessageBubble';
import ImageUpload from './ImageUpload';
import TypewriterMessage from './TypewriterMessage';
import { Message, ExcuseTone } from '@/types';

const PREDEFINED_PROMPTS = [
  "I'm late for work",
  "I missed a deadline", 
  "I don't want to go to a social event",
  "I need to cancel plans last minute",
  "I want to avoid a family gathering"
];

const TONE_OPTIONS: ExcuseTone[] = ['simple', 'professional', 'funny', 'apologetic', 'creative'];

export default function CoolExcuseGenerator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ExcuseTone>('simple');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { generateExcuse } = useGroq();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent, promptText?: string) => {
    if ('preventDefault' in e) {
      e.preventDefault();
    }

    // Hide the initial message when the first message is sent
    setShowInitialMessage(false);

    const textToSubmit = promptText || input;
    if (!textToSubmit.trim()) return;

    const userMessage: Message = {
      content: textToSubmit,
      role: 'user',
      tone: selectedTone
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsMobileMenuOpen(false);

    try {
      const excuse = await generateExcuse(textToSubmit, selectedTone);
      if (excuse) {
        const aiMessage: Message = {
          content: excuse,
          role: 'assistant',
          tone: selectedTone
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error generating excuse:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageProcessed = async (extractedText: string) => {
    const userMessage: Message = {
      content: `Uploaded Image Text: ${extractedText}`,
      role: 'user',
      tone: selectedTone
    };
    setMessages((prev) => [...prev, userMessage]);
    
    setShowInitialMessage(false);
    setIsLoading(true);
    try {
      const excuse = await generateExcuse(extractedText, selectedTone);
      if (excuse) {
        const aiMessage: Message = {
          content: excuse,
          role: 'assistant',
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error generating excuse:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const MobileSidebar = () => (
    <motion.div 
      initial={{ x: '-100%' }}
      animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
      transition={{ type: 'tween' }}
      className="fixed inset-0 z-50 md:hidden bg-[#0f172a] w-full h-full overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Wand2 className="text-teal-400 w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight text-teal-300">
              mydogateit
            </h1>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="text-white w-8 h-8" />
          </motion.button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Predefined Prompts</h2>
            <div className="space-y-2">
              {PREDEFINED_PROMPTS.map((prompt, index) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={index}
                  onClick={(e) => handleSubmit(e, prompt)}
                  className="w-full text-left px-4 py-3 bg-[#1e293b] text-gray-300 
                  rounded-xl hover:bg-[#334155] transition-all"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Tone Selection</h2>
            <div className="space-y-2">
              {TONE_OPTIONS.map((tone) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={tone}
                  onClick={() => {
                    setSelectedTone(tone);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left rounded-xl transition-all
                    ${selectedTone === tone 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-[#1e293b] text-gray-400 hover:bg-[#334155]'}`}
                >
                  {tone}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] font-['Inter'] text-white flex items-center justify-center p-2">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl md:max-w-7xl h-[98vh] md:h-[90vh] grid grid-cols-1 md:grid-cols-3 bg-[#1e293b] rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/50"
      >
        {/* Desktop Sidebar */}
        <div className="hidden md:block md:col-span-1 bg-[#0f172a] p-6 border-r border-[#334155] overflow-y-auto">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center mb-8 space-x-3"
          >
            <Wand2 className="text-teal-400 w-10 h-10" />
            <h1 className="text-3xl font-bold tracking-tight text-teal-300">
              mydogateit
            </h1>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Predefined Prompts</h2>
            {PREDEFINED_PROMPTS.map((prompt, index) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={index}
                onClick={(e) => handleSubmit(e, prompt)}
                className="w-full text-left px-4 py-3 bg-[#1e293b] text-gray-300 
                rounded-xl hover:bg-[#334155] transition-all"
              >
                {prompt}
              </motion.button>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Tone Selection</h2>
            <div className="space-y-2">
              {TONE_OPTIONS.map((tone) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={tone}
                  onClick={() => setSelectedTone(tone)}
                  className={`w-full px-4 py-3 text-left rounded-xl transition-all
                    ${selectedTone === tone 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-[#1e293b] text-gray-400 hover:bg-[#334155]'}`}
                >
                  {tone}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden bg-[#0f172a] p-4 border-b border-[#334155]">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="text-white w-8 h-8" />
              </motion.button>
              <Wand2 className="text-teal-400 w-8 h-8" />
              <h1 className="text-2xl font-bold tracking-tight text-teal-300">
                mydogateit
              </h1>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Chat Area */}
        <div className="col-span-1 md:col-span-2 flex flex-col h-[88vh] md:h-full overflow-y-auto">
          {/* Messages Section */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#1e293b]">
            {/* Typewriter Initial Message */}
            <TypewriterMessage 
            text="Which situation are you planning on escaping from today?"
            isVisible={showInitialMessage && messages.length === 0}
            />
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageBubble message={message} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center py-2"
              >
                <div className="h-2 w-2 bg-teal-500 rounded-full mx-1 animate-bounce"></div>
                <div className="h-2 w-2 bg-teal-500 rounded-full mx-1 animate-bounce delay-100"></div>
                <div className="h-2 w-2 bg-teal-500 rounded-full mx-1 animate-bounce delay-200"></div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="p-2 md:p-6 bg-[#0f172a] border-t border-[#334155] overscroll-contain">
            <ImageUpload onImageProcessed={handleImageProcessed} />
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2 mt-4"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your situation..."
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-[#1e293b] text-white
                  border border-[#334155] focus:outline-none focus:ring-2 focus:ring-teal-500
                  transition-all text-sm sm:text-base"
                  disabled={isLoading}
                />
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-teal-600 text-white font-medium
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700 transition-all
                flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Send size={18} /> Send
              </motion.button>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}