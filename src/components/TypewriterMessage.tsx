import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterMessageProps {
  text: string;
  isVisible: boolean;
}

const TypewriterMessage: React.FC<TypewriterMessageProps> = ({ text, isVisible }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (isVisible && text) {
      setDisplayedText(''); // Reset displayedText when a new text is passed
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText((prev) => prev + text[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 50); // Adjust typing speed here

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedText('');
    }
  }, [text, isVisible]);

  if (!isVisible || !text) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex items-start mb-4"
    >
      <div className="bg-[#0f172a] rounded-xl px-4 py-3 max-w-[80%] text-gray-300">
        {displayedText}
        <span className="animate-pulse ml-1 text-teal-500">|</span>
      </div>
    </motion.div>
  );
};

export default TypewriterMessage;