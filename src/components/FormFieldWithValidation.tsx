import React, { useState } from "react";
import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFieldWithValidationProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  pattern?: string;
  validationRules?: {
    test: (value: string) => boolean;
    message: string;
  }[];
  value: string;
  onChange: (value: string) => void;
}

const FormFieldWithValidation: React.FC<FormFieldWithValidationProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  helpText,
  required = false,
  pattern,
  validationRules = [],
  value,
  onChange,
}) => {
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  
  // Process validation rules
  let isValid = true;
  let errorMessage = "";
  
  if (touched && !focused) {
    // Check required
    if (required && !value.trim()) {
      isValid = false;
      errorMessage = `${label} is required`;
    }
    
    // Check pattern
    if (isValid && pattern && value) {
      const regex = new RegExp(pattern);
      if (!regex.test(value)) {
        isValid = false;
        errorMessage = `Please enter a valid ${label.toLowerCase()}`;
      }
    }
    
    // Check custom rules
    if (isValid && value) {
      for (const rule of validationRules) {
        if (!rule.test(value)) {
          isValid = false;
          errorMessage = rule.message;
          break;
        }
      }
    }
  }
  
  // Determine visual state
  const showValid = touched && isValid && value;
  const showError = touched && !isValid && !focused;
  
  return (
    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="mb-1 block text-sm font-medium"
      >
        {label} {required && <span className="text-health-red">*</span>}
      </label>
      
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          onFocus={() => setFocused(true)}
          onKeyDown={() => {
            if (!touched) setTouched(true);
          }}
          className={cn(
            "w-full rounded-lg border p-3 pr-10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
            showError ? "border-health-red bg-health-red-light/30" : 
            showValid ? "border-health-green" : "border-gray-200"
          )}
          placeholder={placeholder}
          aria-invalid={showError}
          aria-describedby={`${id}-help ${id}-error`}
        />
        
        {showValid && (
          <CheckCircle className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-health-green" />
        )}
        
        {showError && (
          <AlertCircle className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-health-red" />
        )}
      </div>
      
      {helpText && !showError && (
        <div id={`${id}-help`} className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
          <HelpCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}
      
      {showError && (
        <div id={`${id}-error`} className="mt-1 flex items-start gap-1 text-xs text-health-red">
          <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default FormFieldWithValidation;
