import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, X, Pin, ArrowRight, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface RecentItem {
  id: string;
  title: string;
  subtitle?: string;
  path: string;
  icon?: React.ReactNode;
  timestamp: number;
  type: "appointment" | "medication" | "record" | "doctor" | "other";
  pinned?: boolean; // New field for pinned items
  color?: string; // New field for visual differentiation
}

interface RecentlyViewedProps {
  maxItems?: number;
  className?: string;
  showClearButton?: boolean;
  showPinnedItems?: boolean; // New prop to control pinned items visibility
  layout?: "horizontal" | "vertical"; // New prop for layout flexibility
  showItemActions?: boolean; // New prop to show/hide item actions
  emptyState?: React.ReactNode; // New prop for custom empty state
  onItemClick?: (item: RecentItem) => void; // New callback for item click
  itemClassName?: string; // New prop for custom item styling
}

const STORAGE_KEY = "healthspectrum-recently-viewed";

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  maxItems = 5,
  className,
  showClearButton = true,
  showPinnedItems = true,
  layout = "vertical",
  showItemActions = false,
  emptyState,
  onItemClick,
  itemClassName,
}) => {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const navigate = useNavigate();

  // Enhanced loading of items to handle pinned state
  const loadRecentItems = useCallback(() => {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems) as RecentItem[];
        setRecentItems(parsedItems);
      } catch (error) {
        console.error("Failed to parse recently viewed items:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Load items on mount
  useEffect(() => {
    loadRecentItems();
  }, [loadRecentItems]);

  // Filter and sort items
  const sortedItems = React.useMemo(() => {
    // First sort by pinned status, then by timestamp
    return [...recentItems].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.timestamp - a.timestamp;
    });
  }, [recentItems]);

  const clearRecentItems = () => {
    setRecentItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const togglePinItem = (id: string) => {
    const updatedItems = recentItems.map(item => 
      item.id === id ? { ...item, pinned: !item.pinned } : item
    );
    setRecentItems(updatedItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  };

  const removeItem = (id: string) => {
    const updatedItems = recentItems.filter(item => item.id !== id);
    setRecentItems(updatedItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  };

  const handleItemClick = (item: RecentItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      navigate(item.path);
    }
  };

  // Show custom empty state or null if no items
  if (recentItems.length === 0) {
    return emptyState ? (
      <div className={className}>{emptyState}</div>
    ) : null;
  }

  // Different layouts
  const isHorizontal = layout === "horizontal";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>Recently Viewed</span>
          <Badge variant="secondary" className="ml-1 text-xs">
            {recentItems.length}
          </Badge>
        </h3>
        {showClearButton && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentItems}
                  className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear all items</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className={cn(
        isHorizontal 
          ? "flex gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" 
          : "space-y-1"
      )}>
        {sortedItems
          .slice(0, maxItems)
          .map((item) => (
            <div 
              key={item.id}
              className={cn(
                "group",
                isHorizontal ? "flex-shrink-0 w-52" : "",
                itemClassName
              )}
            >
              <div 
                role="button"
                tabIndex={0}
                className={cn(
                  "flex items-center justify-between rounded-md p-2 transition-colors text-sm",
                  "hover:bg-secondary focus:bg-secondary/80 focus:outline-none",
                  item.pinned && "bg-secondary/50 border-l-2 border-primary",
                  item.color && `border-l-2 border-health-${item.color}`
                )}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemClick(item);
                  }
                }}
                aria-label={`View ${item.title}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {item.icon}
                  <div className="min-w-0 truncate">
                    <span className="font-medium flex items-center gap-1">
                      {item.title}
                      {item.pinned && <Pin className="h-3 w-3 text-primary" />}
                    </span>
                    {item.subtitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimestamp(item.timestamp)}
                  </span>
                  
                  {showItemActions && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100">
                          <ArrowRight className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => togglePinItem(item.id)}>
                          <Pin className="mr-2 h-4 w-4" />
                          {item.pinned ? "Unpin" : "Pin to top"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => removeItem(item.id)} className="text-health-red">
                          <Trash className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      
      {recentItems.length > maxItems && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs text-muted-foreground hover:text-primary"
          onClick={() => navigate("/history")}
        >
          View all recent items
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

// Helper to add items to recently viewed
export const addToRecentlyViewed = (item: Omit<RecentItem, "timestamp">) => {
  const storedItems = localStorage.getItem(STORAGE_KEY);
  let recentItems: RecentItem[] = [];

  if (storedItems) {
    try {
      recentItems = JSON.parse(storedItems) as RecentItem[];
    } catch (error) {
      console.error("Failed to parse recently viewed items:", error);
    }
  }

  // Check if item already exists
  const existingIndex = recentItems.findIndex(
    (recent) => recent.id === item.id && recent.type === item.type
  );

  // Remove existing item if found
  if (existingIndex !== -1) {
    recentItems.splice(existingIndex, 1);
  }

  // Add new item at the beginning with current timestamp
  recentItems.unshift({
    ...item,
    timestamp: Date.now(),
  });

  // Keep only the most recent 20 items
  recentItems = recentItems.slice(0, 20);

  // Save back to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentItems));
};

// Helper to format timestamp
const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return "Just now";
  }
};

// New helper to get recent items
export const getRecentlyViewedItems = (): RecentItem[] => {
  const storedItems = localStorage.getItem(STORAGE_KEY);
  if (storedItems) {
    try {
      return JSON.parse(storedItems) as RecentItem[];
    } catch (error) {
      console.error("Failed to parse recently viewed items:", error);
      return [];
    }
  }
  return [];
};

// New helper to clear all recent items
export const clearAllRecentlyViewedItems = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// New helper to remove a specific item
export const removeRecentlyViewedItem = (id: string): void => {
  const items = getRecentlyViewedItems();
  const updatedItems = items.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
};

// New helper to pin/unpin an item
export const togglePinRecentlyViewedItem = (id: string): void => {
  const items = getRecentlyViewedItems();
  const updatedItems = items.map(item => 
    item.id === id ? { ...item, pinned: !item.pinned } : item
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
};
