import React, { useState, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface OnboardingTipProps {
  id: string;
  title: string;
  description: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
}

// This component implements the learnability principle while helping with the match
// between system and real world (Nielsen's Heuristic #2)
const OnboardingTip: React.FC<OnboardingTipProps> = ({
  id,
  title,
  description,
  position = 'bottom',
  children
}) => {
  const [showTip, setShowTip] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  // Check if this tip has been seen before using localStorage
  useEffect(() => {
    const seenTips = JSON.parse(localStorage.getItem('seenTips') || '{}');
    if (!seenTips[id]) {
      // Show tip after a short delay to avoid overwhelming the user
      const timer = setTimeout(() => {
        setShowTip(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [id]);
  
  const handleDismiss = () => {
    setShowTip(false);
    setDismissed(true);
    
    // Mark this tip as seen
    const seenTips = JSON.parse(localStorage.getItem('seenTips') || '{}');
    seenTips[id] = true;
    localStorage.setItem('seenTips', JSON.stringify(seenTips));
  };
  
  // Positioning classes based on the position prop
  const positionClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2'
  };
  
  return (
    <div className="relative inline-block">
      {children}
      
      {!dismissed && (
        <button 
          className={`absolute ${showTip ? 'hidden' : 'block'} -top-1 -right-1 h-5 w-5 rounded-full bg-health-blue text-white flex items-center justify-center text-xs`}
          onClick={() => setShowTip(true)}
          aria-label={`Show tip about ${title}`}
        >
          <HelpCircle className="h-3 w-3" />
        </button>
      )}
      
      {showTip && (
        <div className={`absolute z-50 ${positionClasses[position]} w-64 bg-white rounded-lg shadow-lg border p-4 animate-fade-in`}>
          <button 
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={handleDismiss}
            aria-label="Dismiss tip"
          >
            <X className="h-4 w-4" />
          </button>
          <h4 className="font-medium text-sm mb-1">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      )}
    </div>
  );
};

export default OnboardingTip;
