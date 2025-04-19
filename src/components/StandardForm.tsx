import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useStatus } from "@/contexts/StatusContext";

interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "textarea" | "select" | "checkbox" | "radio" | "date";
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: string | number | boolean;
  min?: number;
  max?: number;
  pattern?: string;
  autoComplete?: string;
  helpText?: string;
}

interface StandardFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
  successMessage?: string;
  errorMessage?: string;
  resetOnSuccess?: boolean;
}

export const StandardForm: React.FC<StandardFormProps> = ({
  fields,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  onCancel,
  className,
  successMessage = "Form submitted successfully",
  errorMessage = "There was an error submitting the form",
  resetOnSuccess = true,
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const { showStatus, isLoading, setIsLoading } = useStatus();
  
  // Initialize form data with default values
  React.useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialData[field.id] = field.defaultValue;
      } else if (field.type === 'checkbox') {
        initialData[field.id] = false;
      } else {
        initialData[field.id] = '';
      }
    });
    setFormData(initialData);
  }, [fields]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : value;
    
    setFormData((prev) => ({ ...prev, [id]: newValue }));
    setTouched((prev) => ({ ...prev, [id]: true }));
    
    // Validate field on change
    validateField(id, newValue);
  };

  const validateField = (id: string, value: any) => {
    const field = fields.find((f) => f.id === id);
    if (!field) return;

    let error = '';

    if (field.required && (value === '' || value === null || value === undefined)) {
      error = `${field.label} is required`;
    } else if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Please enter a valid email address';
    } else if (field.min !== undefined && Number(value) < field.min) {
      error = `Value must be at least ${field.min}`;
    } else if (field.max !== undefined && Number(value) > field.max) {
      error = `Value cannot exceed ${field.max}`;
    } else if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
      error = `Please enter a valid ${field.label.toLowerCase()}`;
    }

    setErrors((prev) => ({
      ...prev,
      [id]: error,
    }));

    return error === '';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const value = formData[field.id];
      if (!validateField(field.id, value)) {
        isValid = false;
        newErrors[field.id] = errors[field.id] || `Invalid ${field.label}`;
      }
    });

    setErrors(newErrors);
    
    // Mark all fields as touched
    const newTouched: Record<string, boolean> = {};
    fields.forEach((field) => {
      newTouched[field.id] = true;
    });
    setTouched(newTouched);

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showStatus("Please fix the errors in the form", "error");
      return;
    }
    
    try {
      setIsLoading(true);
      await onSubmit(formData);
      showStatus(successMessage, "success");
      
      if (resetOnSuccess) {
        // Reset form to default values
        const initialData: Record<string, any> = {};
        fields.forEach((field) => {
          if (field.defaultValue !== undefined) {
            initialData[field.id] = field.defaultValue;
          } else if (field.type === 'checkbox') {
            initialData[field.id] = false;
          } else {
            initialData[field.id] = '';
          }
        });
        setFormData(initialData);
        setTouched({});
        setErrors({});
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showStatus(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <label
            htmlFor={field.id}
            className="block text-sm font-medium"
          >
            {field.label}
            {field.required && <span className="text-health-red ml-0.5">*</span>}
          </label>

          {field.type === "textarea" ? (
            <textarea
              id={field.id}
              value={formData[field.id] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              className={cn(
                "w-full min-h-[100px] rounded-md border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                errors[field.id] && touched[field.id] ? "border-health-red bg-health-red-light/30" : "border-input bg-transparent"
              )}
            />
          ) : field.type === "select" ? (
            <select
              id={field.id}
              value={formData[field.id] || ""}
              onChange={handleChange}
              required={field.required}
              className={cn(
                "w-full rounded-md border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                errors[field.id] && touched[field.id] ? "border-health-red bg-health-red-light/30" : "border-input bg-transparent"
              )}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={field.id}
                checked={formData[field.id] || false}
                onChange={handleChange}
                required={field.required}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              {field.helpText && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {field.helpText}
                </span>
              )}
            </div>
          ) : (
            <input
              type={field.type}
              id={field.id}
              value={formData[field.id] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              min={field.min}
              max={field.max}
              pattern={field.pattern}
              autoComplete={field.autoComplete}
              className={cn(
                "w-full rounded-md border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                errors[field.id] && touched[field.id] ? "border-health-red bg-health-red-light/30" : "border-input bg-transparent"
              )}
            />
          )}

          {errors[field.id] && touched[field.id] ? (
            <p className="text-xs text-health-red">{errors[field.id]}</p>
          ) : field.helpText && field.type !== "checkbox" ? (
            <p className="text-xs text-muted-foreground">{field.helpText}</p>
          ) : null}
        </div>
      ))}

      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
