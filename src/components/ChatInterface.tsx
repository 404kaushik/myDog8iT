import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Wand2, Menu, X } from 'lucide-react';
import { useGroq } from '@/context/GroqContext';
import MessageBubble from './MessageBubble';
import ImageUpload from './ImageUpload';
import { Message } from '@/types';

const PREDEFINED_PROMPTS = [
  "I'm late for work",
  "I missed a deadline", 
  "I don't want to go to a social event",
  "I need to cancel plans last minute",
  "I want to avoid a family gathering"
];



export default function CoolExcuseGenerator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

    const textToSubmit = promptText || input;
    if (!textToSubmit.trim()) return;

    const userMessage: Message = {
      content: textToSubmit,
      role: 'user',
      
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsSidebarOpen(false);

    try {
      const excuse = await generateExcuse(textToSubmit);
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

  const handleImageProcessed = async (extractedText: string) => {
    const userMessage: Message = {
      content: `Uploaded Image Text: ${extractedText}`,
      role: 'user',
      
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsSidebarOpen(false);
    try {
      const excuse = await generateExcuse(extractedText);
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] font-['Inter'] text-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 bg-[#1e293b] rounded-3xl overflow-hidden shadow-2xl relative"
      >
        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleSidebar} 
          className="md:hidden absolute top-4 left-4 z-50 bg-[#0f172a] p-2 rounded-full"
        >
          {isSidebarOpen ? <X className="text-white" /> : <Menu className="text-white" />}
        </button>

        {/* Sidebar */}
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: isSidebarOpen ? 0 : '-100%' }}
          transition={{ type: 'tween' }}
          className="absolute md:relative z-40 md:z-0 w-full md:w-auto md:col-span-1 
                      bg-[#0f172a] p-6 border-r border-[#334155] 
                      h-full md:h-auto top-0 left-0 
                      transform md:transform-none 
                      transition-transform duration-300 ease-in-out"
        >
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center mb-8 space-x-3"
          >
            <Wand2 className="text-teal-400 w-10 h-10" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-teal-300">
              myDawgAteit
            </h1>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Predefined Prompts</h2>
            {PREDEFINED_PROMPTS.map((prompt, index) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={index}
                onClick={(e) => {
                  handleSubmit(e, prompt);
                  setIsSidebarOpen(false);
                }}
                className="w-full text-left px-4 py-3 bg-[#1e293b] text-gray-300 
                rounded-xl hover:bg-[#334155] transition-all text-sm md:text-base"
              >
                {prompt}
              </motion.button>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Tone Selection</h2>
        
        
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col">
          {/* Messages Section */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#1e293b]">
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
          <div className="p-4 md:p-6 bg-[#0f172a] border-t border-[#334155]">
            <ImageUpload onImageProcessed={handleImageProcessed} />
            <motion.form 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onSubmit={handleSubmit} 
              className="flex flex-col md:flex-row gap-2 mt-4"
            >
              <div className="relative flex-1 mb-2 md:mb-0">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your situation..."
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-[#1e293b] text-white 
                  border border-[#334155] focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  disabled={isLoading}
                />
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-teal-600 text-white font-medium 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
              >
                <Send size={18} /> Send
              </motion.button>
            </motion.form>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-30"
          />
        )}
      </motion.div>
    </div>
  );
}