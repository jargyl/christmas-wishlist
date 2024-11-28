import { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export default function Tooltip({ text, children, position = 'bottom' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: '-top-10',
    bottom: 'top-full mt-2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className={`absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg ${positionClasses[position]} left-1/2 transform -translate-x-1/2 whitespace-nowrap`}>
          {text}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${position === 'top' ? '-bottom-1' : '-top-1'} left-1/2 -translate-x-1/2`}></div>
        </div>
      )}
    </div>
  );
}