import React from 'react';
import { motion } from 'framer-motion';

interface AngularButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

const AngularButton: React.FC<AngularButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'px-4 py-2 text-white font-medium transition-colors duration-200 focus:outline-none';
  
  const variantClasses = {
    primary: 'bg-black hover:bg-gray-800',
    secondary: 'bg-gray-700 hover:bg-gray-600',
    danger: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
    >
      {children}
    </motion.button>
  );
};

export default AngularButton;