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
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
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
  validateOnBlur = true,
  validateOnChange = false,
  autoComplete,
  minLength,
  maxLength,
  min,
  max,
  step,
}) => {
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");
  
  // Validate input value
  const validate = (val: string) => {
    // Check required
    if (required && !val.trim()) {
      setError(`${label} is required`);
      return false;
    }
    
    // Check minimum length
    if (minLength && val.length < minLength) {
      setError(`${label} must be at least ${minLength} characters`);
      return false;
    }
    
    // Check maximum length
    if (maxLength && val.length > maxLength) {
      setError(`${label} cannot exceed ${maxLength} characters`);
      return false;
    }
    
    // Check min/max for number inputs
    if (type === "number") {
      const numVal = Number(val);
      
      if (min !== undefined && numVal < min) {
        setError(`${label} must be at least ${min}`);
        return false;
      }
      
      if (max !== undefined && numVal > max) {
        setError(`${label} cannot exceed ${max}`);
        return false;
      }
    }
    
    // Check pattern
    if (pattern && val) {
      const regex = new RegExp(pattern);
      if (!regex.test(val)) {
        setError(`Please enter a valid ${label.toLowerCase()}`);
        return false;
      }
    }
    
    // Check custom rules
    if (val) {
      for (const rule of validationRules) {
        if (!rule.test(val)) {
          setError(rule.message);
          return false;
        }
      }
    }
    
    // Clear error if validation passes
    setError("");
    return true;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (validateOnChange && touched) {
      validate(newValue);
    }
  };
  
  const handleBlur = () => {
    setFocused(false);
    setTouched(true);
    
    if (validateOnBlur) {
      validate(value);
    }
  };
  
  const handleFocus = () => {
    setFocused(true);
  };
  
  // Determine visual state
  const showValid = touched && !error && value;
  const showError = touched && !!error && !focused;
  
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
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          className={cn(
            "w-full rounded-lg border p-3 pr-10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
            showError 
              ? "border-health-red bg-health-red-light/30" 
              : showValid 
                ? "border-health-green" 
                : "border-gray-200"
          )}
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
          <span>{error}</span>
        </div>
      )}
      
      {type === "password" && value && (
        <div className="mt-1">
          <PasswordStrengthIndicator password={value} />
        </div>
      )}
    </div>
  );
};

// Password strength component
const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = (password: string): { strength: number; feedback: string } => {
    // Simple password strength calculation
    let strength = 0;
    let feedback = "";
    
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    
    switch(strength) {
      case 0:
      case 1:
        feedback = "Very weak";
        break;
      case 2:
        feedback = "Weak";
        break;
      case 3:
        feedback = "Medium";
        break;
      case 4:
        feedback = "Strong";
        break;
      case 5:
        feedback = "Very strong";
        break;
    }
    
    return { strength, feedback };
  };
  
  const { strength, feedback } = getStrength(password);
  const percentage = (strength / 5) * 100;
  
  const colorClass = 
    strength <= 1 ? "bg-health-red" :
    strength <= 2 ? "bg-health-orange" :
    strength <= 3 ? "bg-health-blue" :
    "bg-health-green";
  
  return (
    <div className="space-y-1 text-xs">
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-300`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-muted-foreground">
        Password strength: <span className="font-medium">{feedback}</span>
      </span>
    </div>
  );
};

export default FormFieldWithValidation;
