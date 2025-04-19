import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface TourStep {
  target: string; // CSS selector for the element to highlight
  title: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

interface FeatureTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  tourId: string;
}

// This component enhances learnability and follows the match between system
// and real world (Nielsen's Heuristic #2)
const FeatureTour: React.FC<FeatureTourProps> = ({
  steps,
  isOpen,
  onClose,
  onComplete,
  tourId
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  // Find and highlight the target element
  useEffect(() => {
    if (!isOpen) return;
    
    const findTarget = () => {
      const step = steps[currentStep];
      const target = document.querySelector(step.target);
      
      if (target) {
        setTargetElement(target);
        
        // Calculate position
        const rect = target.getBoundingClientRect();
        const stepPosition = step.position || 'bottom';
        
        let top = 0;
        let left = 0;
        
        switch (stepPosition) {
          case 'top':
            top = rect.top - 10 - 130; // Adjust for tooltip height
            left = rect.left + rect.width / 2 - 150; // Center horizontally
            break;
          case 'right':
            top = rect.top + rect.height / 2 - 65; // Center vertically
            left = rect.right + 10;
            break;
          case 'bottom':
            top = rect.bottom + 10;
            left = rect.left + rect.width / 2 - 150; // Center horizontally
            break;
          case 'left':
            top = rect.top + rect.height / 2 - 65; // Center vertically
            left = rect.left - 10 - 300; // Adjust for tooltip width
            break;
        }
        
        // Keep tooltip within viewport
        if (left < 10) left = 10;
        if (left + 300 > window.innerWidth) left = window.innerWidth - 310;
        if (top < 10) top = 10;
        if (top + 130 > window.innerHeight) top = window.innerHeight - 140;
        
        setPosition({ top, left });
        
        // Highlight effect
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('tour-highlight');
      }
    };
    
    findTarget();
    
    return () => {
      if (targetElement) {
        targetElement.classList.remove('tour-highlight');
      }
    };
  }, [isOpen, currentStep, steps]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleClose = () => {
    if (targetElement) {
      targetElement.classList.remove('tour-highlight');
    }
    onClose();
    setCurrentStep(0);
  };
  
  const handleComplete = () => {
    if (targetElement) {
      targetElement.classList.remove('tour-highlight');
    }
    onComplete();
    
    // Mark this tour as completed
    const completedTours = JSON.parse(localStorage.getItem('completedTours') || '{}');
    completedTours[tourId] = true;
    localStorage.setItem('completedTours', JSON.stringify(completedTours));
    
    setCurrentStep(0);
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-50"
        onClick={handleClose}
      />
      
      {/* Tour tooltip */}
      <div 
        className="fixed z-50 w-[300px] bg-white rounded-lg shadow-lg p-4 border animate-fade-in"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        <button 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={handleClose}
          aria-label="Close tour"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="mb-2">
          <span className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        <h3 className="font-medium text-base mb-1">{steps[currentStep].title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{steps[currentStep].content}</p>
        
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
              currentStep === 0 ? 'invisible' : 'text-muted-foreground hover:bg-secondary'
            }`}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          
          <button
            onClick={handleNext}
            className="px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center gap-1"
          >
            {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
            {currentStep < steps.length - 1 ? <ChevronRight className="h-4 w-4" /> : null}
          </button>
        </div>
      </div>
    </>
  );
};

export default FeatureTour;
