import React, { useState, createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckSquare, Loader2, Trash, X } from "lucide-react";

// Context for managing selected items
interface BatchSelectionContextType {
  selectedItems: string[];
  isSelectionMode: boolean;
  toggleItem: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  setSelectionMode: (active: boolean) => void;
  isSelected: (id: string) => boolean;
}

const BatchSelectionContext = createContext<BatchSelectionContextType | undefined>(
  undefined
);

export const BatchSelectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectionMode, setSelectionMode] = useState(false);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = (ids: string[]) => {
    setSelectedItems(ids);
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const isSelected = (id: string) => {
    return selectedItems.includes(id);
  };

  return (
    <BatchSelectionContext.Provider
      value={{
        selectedItems,
        isSelectionMode,
        toggleItem,
        selectAll,
        clearSelection,
        setSelectionMode,
        isSelected,
      }}
    >
      {children}
    </BatchSelectionContext.Provider>
  );
};

export const useBatchSelection = (): BatchSelectionContextType => {
  const context = useContext(BatchSelectionContext);
  if (!context) {
    throw new Error(
      "useBatchSelection must be used within a BatchSelectionProvider"
    );
  }
  return context;
};

// Selectable Item Wrapper
interface SelectableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const SelectableItem: React.FC<SelectableItemProps> = ({
  id,
  children,
  className,
}) => {
  const { isSelectionMode, toggleItem, isSelected } = useBatchSelection();

  if (!isSelectionMode) {
    return <>{children}</>;
  }

  const selected = isSelected(id);

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "absolute -left-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded border bg-white",
          selected
            ? "border-primary bg-primary text-white"
            : "border-gray-300"
        )}
        onClick={(e) => {
          e.stopPropagation();
          toggleItem(id);
        }}
      >
        {selected && <CheckSquare className="h-4 w-4" />}
      </div>
      <div className={cn(selected && "opacity-80")}>{children}</div>
    </div>
  );
};

// Batch Actions Bar
interface BatchActionBarProps {
  actions: {
    label: string;
    icon?: React.ReactNode;
    onClick: (ids: string[]) => Promise<void> | void;
    variant?: "default" | "destructive";
  }[];
  totalItems: number;
  onSelectAll: () => void;
  onCancel: () => void;
  className?: string;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  actions,
  totalItems,
  onSelectAll,
  onCancel,
  className,
}) => {
  const { selectedItems, clearSelection } = useBatchSelection();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (
    action: (ids: string[]) => Promise<void> | void
  ) => {
    setIsProcessing(true);
    try {
      await action(selectedItems);
      clearSelection();
    } catch (error) {
      console.error("Batch action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedItems.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t bg-background py-2 px-4 shadow-lg animate-in slide-in-from-bottom-5",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">
          {selectedItems.length} of {totalItems} selected
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
          disabled={selectedItems.length === totalItems}
        >
          Select All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearSelection();
            onCancel();
          }}
          className="gap-1"
        >
          <X className="h-4 w-4" />
          <span>Cancel</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "default"}
            size="sm"
            onClick={() => handleAction(action.onClick)}
            disabled={isProcessing}
            className="gap-1"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              action.icon
            )}
            <span>{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
