'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link'; // Import Next.js Link

// Define the interface for the props
interface AIButtonProps {
  url: string;
  newTab: boolean;
  type: 'primary' | 'secondary';
  name: string;
}

const AIButton: React.FC<AIButtonProps> = ({ url, newTab, type, name }) => {
  // Determine button styles based on the type prop
  const buttonStyles =
    type === 'primary'
      ? 'bg-primary-500 text-white'
      : 'bg-gray-500 text-black'; // Assuming secondary style is gray with black text

  return (
    <Link href={url} passHref>
      <button
        type="button"
        className={`font-medium px-3 py-2 rounded-md overflow-hidden relative transition-transform hover:scale-105 active:scale-95 ${buttonStyles}`}
        // Handle newTab behavior by applying a custom onClick handler
        onClick={(e) => {
          if (newTab) {
            e.preventDefault();
            window.open(url, '_blank', 'noopener,noreferrer');
          }
        }}
      >
        <span className="relative z-10">{name}</span>
        <motion.div
          initial={{ left: 0 }}
          animate={{ left: '-300%' }}
          transition={{
            repeat: Infinity,
            repeatType: 'mirror',
            duration: 4,
            ease: 'linear',
          }}
          className="bg-[linear-gradient(to_right,#1E5D1E,#276C27,#348E38,#50D150)] absolute z-0 inset-0 w-[400%]"
        ></motion.div>
      </button>
    </Link>
  );
};

export default AIButton;
