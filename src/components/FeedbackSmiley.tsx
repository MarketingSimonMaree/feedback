import React from 'react';
import { motion } from 'framer-motion';

interface FeedbackSmileyProps {
  isHappy: boolean;
  onClick: () => void;
}

const FeedbackSmiley: React.FC<FeedbackSmileyProps> = ({ isHappy, onClick }) => {
  const color = isHappy ? 'text-green-500' : 'text-red-600';
  const bgColor = isHappy ? 'bg-green-100' : 'bg-red-100';
  const hoverBgColor = isHappy ? 'hover:bg-green-200' : 'hover:bg-red-200';
  
  return (
    <motion.button
      className={`p-8 ${bgColor} ${hoverBgColor} rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {isHappy ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="80" 
          height="80" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={color}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="80" 
          height="80" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={color}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="15" x2="16" y2="15" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      )}
    </motion.button>
  );
};

export default FeedbackSmiley;