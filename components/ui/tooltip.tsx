import type React from 'react';

interface TooltipProps {
  content: string;
  isVisible: boolean;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, isVisible, children }) => {
  return (
    <div className="relative flex items-center">
      {children}

      {isVisible && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap z-10">
          {content}
        </div>
      )}
    </div>
  );
};