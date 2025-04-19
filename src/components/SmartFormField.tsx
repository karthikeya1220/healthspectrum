import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, HelpCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
  priority?: number; // Higher priority messages are shown first
}

export interface SmartFormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  pattern?: string;
  patternError?: string;
  validationRules?: ValidationRule[];
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  validateOnMount?: boolean;
  requiredError?: string;
  className?: string;
  showPasswordToggle?: boolean;
  autoFocus?: boolean;
  showSuccessIndicator?: boolean;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  size?: 'default' | 'sm' | 'lg';
}

const SmartFormField: React.FC<SmartFormFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  helpText,
  required = false,
  readOnly = false,
  disabled = false,
  autoComplete,
  maxLength,
  minLength,
  min,
  max,
  step,
  pattern,
  patternError,
  validationRules = [],
  validateOnBlur = true,
  validateOnChange = false,
  validateOnMount = false,
  requiredError,
  className,
  showPasswordToggle = false,
  autoFocus = false,
  showSuccessIndicator = true,
  labelClassName,
  inputClassName,
  errorClassName,
  size = 'default',
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Input type handling for password toggle
  const inputType = type === "password" && showPassword ? "text" : type;
  
  // Validation function
  const validate = (valueToValidate: string): string[] => {
    const newErrors: string[] = [];
    
    // Required check
    if (required && !valueToValidate.trim()) {
      newErrors.push(requiredError || `${label} is required`);
    }
    
    if (valueToValidate) {
      // Length validations
      if (minLength && valueToValidate.length < minLength) {
        newErrors.push(`${label} must be at least ${minLength} characters`);
      }
      
      if (maxLength && valueToValidate.length > maxLength) {
        newErrors.push(`${label} must not exceed ${maxLength} characters`);
      }
      
      // Pattern validation
      if (pattern) {
        const regex = new RegExp(pattern);
        if (!regex.test(valueToValidate)) {
          newErrors.push(patternError || `Please enter a valid ${label.toLowerCase()}`);
        }
      }
      
      // Min/max validation for numeric inputs
      if (type === "number") {
        const numValue = parseFloat(valueToValidate);
        if (!isNaN(numValue)) {
          if (min !== undefined && numValue < parseFloat(min.toString())) {
            newErrors.push(`${label} must be at least ${min}`);
          }
          
          if (max !== undefined && numValue > parseFloat(max.toString())) {
            newErrors.push(`${label} must not exceed ${max}`);
          }
        }
      }
      
      // Custom validation rules
      for (const rule of validationRules) {
        if (!rule.test(valueToValidate)) {
          newErrors.push(rule.message);
        }
      }
    }
    
    // Sort errors by priority if available
    return newErrors.sort((a, b) => {
      const ruleA = validationRules.find(rule => rule.message === a);
      const ruleB = validationRules.find(rule => rule.message === b);
      const priorityA = ruleA?.priority || 0;
      const priorityB = ruleB?.priority || 0;
      return priorityB - priorityA;
    });
  };
  
  // Validate on mount if specified
  useEffect(() => {
    if (validateOnMount) {
      setErrors(validate(value));
      setTouched(true);
    }
  }, []);
  
  // Handle blur event
  const handleBlur = () => {
    setFocused(false);
    setTouched(true);
    
    if (validateOnBlur) {
      setErrors(validate(value));
    }
  };
  
  // Handle focus event
  const handleFocus = () => {
    setFocused(true);
  };
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (validateOnChange && touched) {
      setErrors(validate(newValue));
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
  
  // Visual states
  const isValid = touched && errors.length === 0 && value.trim() !== '';
  const isInvalid = touched && errors.length > 0 && !focused;
  
  // Size classes
  const sizeClasses = {
    sm: "h-8 text-xs px-2",
    default: "h-10 text-sm px-3",
    lg: "h-12 text-base px-4",
  };
  
  // ARIA attributes for better accessibility
  const ariaAttributes = {
    'aria-invalid': isInvalid,
    'aria-required': required,
    'aria-describedby': `${id}-help ${id}-error`,
  };
  
  // Error message for screen readers
  const screenReaderErrorMessage = isInvalid ? (
    <div id={`${id}-error`} className="sr-only" role="alert">
      {errors[0]}
    </div>
  ) : null;
  
  // Help text for screen readers
  const screenReaderHelpText = helpText ? (
    <div id={`${id}-help`} className="sr-only">
      {helpText}
    </div>
  ) : null;
  
  return (
    <div className={cn("mb-4", className)}>
      <label 
        htmlFor={id} 
        className={cn(
          "mb-1 block text-sm font-medium",
          labelClassName
        )}
      >
        {label} {required && <span className="text-health-red">*</span>}
      </label>
      
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          min={min}
          max={max}
          step={step}
          autoFocus={autoFocus}
          className={cn(
            "w-full rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
            sizeClasses[size],
            isInvalid ? "border-health-red bg-health-red-light/10" : 
            isValid && showSuccessIndicator ? "border-health-green" : 
            "border-gray-200",
            showPasswordToggle && "pr-10",
            inputClassName
          )}
          {...ariaAttributes}
        />
        
        {/* Success/Error indicators */}
        {isValid && showSuccessIndicator && (
          <CheckCircle className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-health-green" />
        )}
        
        {isInvalid && (
          <AlertCircle className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-health-red" />
        )}
        
        {/* Password toggle button */}
        {type === "password" && showPasswordToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      
      {/* Help text */}
      {helpText && !isInvalid && (
        <div id={`${id}-help-visible`} className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
          <HelpCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}
      
      {/* Error messages */}
      {isInvalid && errors.length > 0 && (
        <div 
          id={`${id}-error-visible`} 
          className={cn(
            "mt-1 text-xs text-health-red", 
            errorClassName
          )}
          role="alert"
        >
          <div className="flex items-start gap-1">
            <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
            <span>{errors[0]}</span>
          </div>
          
          {/* Show additional errors as a list if there are multiple */}
          {errors.length > 1 && (
            <ul className="ml-4 mt-1 list-disc space-y-1">
              {errors.slice(1).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {/* Character counter for inputs with maxLength */}
      {maxLength && (
        <div className="mt-1 flex justify-end">
          <span className={cn(
            "text-xs",
            value.length > maxLength * 0.8 ? 
              value.length > maxLength ? 
                "text-health-red" : 
                "text-health-orange" : 
              "text-muted-foreground"
          )}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}
      
      {/* Screen reader only content */}
      {screenReaderErrorMessage}
      {screenReaderHelpText}
    </div>
  );
};

export default SmartFormField;
