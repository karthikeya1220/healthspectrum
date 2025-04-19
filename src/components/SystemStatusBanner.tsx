import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  AlertCircle, 
  ArrowUp, 
  ArrowDown, 
  Wifi, 
  WifiOff,
  RefreshCw 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';

type StatusType = 'operational' | 'maintenance' | 'degraded' | 'outage' | 'offline';

interface SystemStatus {
  status: StatusType;
  message: string;
  lastChecked: Date;
  services: {
    [key: string]: {
      status: StatusType;
      latency?: number;
      message?: string;
    };
  };
}

interface SystemStatusBannerProps {
  className?: string;
  showServices?: boolean;
  onRefresh?: () => void;
  autoRefreshInterval?: number; // in seconds
  showRefreshButton?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export const SystemStatusBanner: React.FC<SystemStatusBannerProps> = ({
  className,
  showServices = false,
  onRefresh,
  autoRefreshInterval = 60,
  showRefreshButton = true,
  collapsible = true,
  defaultExpanded = false,
}) => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Fetch system status
  const fetchStatus = async () => {
    if (!isOnline) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, fetch from API
      // const response = await fetch('/api/system-status');
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData: SystemStatus = {
        status: 'operational',
        message: 'All systems operational',
        lastChecked: new Date(),
        services: {
          'api': { status: 'operational', latency: 85 },
          'database': { status: 'operational', latency: 42 },
          'storage': { status: 'operational', latency: 63 },
          'notifications': { status: 'degraded', message: 'Experiencing delays', latency: 220 },
        }
      };
      
      setStatus(mockData);
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchStatus();
    
    if (autoRefreshInterval > 0) {
      const interval = setInterval(fetchStatus, autoRefreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefreshInterval, isOnline]);
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchStatus();
    if (onRefresh) onRefresh();
  };
  
  // Helper functions
  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-health-green" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-health-blue" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-health-orange" />;
      case 'outage':
        return <AlertCircle className="h-4 w-4 text-health-red" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'operational':
        return 'bg-health-green-light text-health-green border-health-green';
      case 'maintenance':
        return 'bg-health-blue-light text-health-blue border-health-blue';
      case 'degraded':
        return 'bg-health-orange-light text-health-orange border-health-orange';
      case 'outage':
        return 'bg-health-red-light text-health-red border-health-red';
      case 'offline':
        return 'bg-gray-100 text-gray-500 border-gray-300';
    }
  };
  
  // If offline, show offline status
  if (!isOnline) {
    return (
      <div className={cn(
        "flex items-center justify-between rounded-md border p-2 bg-gray-100",
        className
      )}>
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">You're offline</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }
  
  // If no status or loading initial state
  if (!status && isLoading) {
    return (
      <div className={cn(
        "flex items-center justify-center rounded-md border p-2 bg-gray-50",
        className
      )}>
        <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin mr-2" />
        <span className="text-sm">Checking system status...</span>
      </div>
    );
  }
  
  // If no status and not loading
  if (!status) {
    return (
      <div className={cn(
        "flex items-center justify-between rounded-md border p-2 bg-gray-50",
        className
      )}>
        <span className="text-sm text-muted-foreground">System status unavailable</span>
        {showRefreshButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            className="h-7"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-3 w-3 mr-1", isLoading && "animate-spin")} />
            <span className="text-xs">Refresh</span>
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className={className}>
      <div className={cn(
        "rounded-md border p-2",
        getStatusColor(status.status)
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(status.status)}
            <span className="text-sm font-medium">{status.message}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {showRefreshButton && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleRefresh}
                      className="h-7 px-2"
                      disabled={isLoading}
                    >
                      <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="text-xs">Last updated: {status.lastChecked.toLocaleTimeString()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {collapsible && showServices && Object.keys(status.services).length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-7 px-2"
              >
                {isExpanded ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        </div>
        
        {showServices && isExpanded && Object.keys(status.services).length > 0 && (
          <div className="mt-2 pt-2 border-t grid gap-1">
            {Object.entries(status.services).map(([name, serviceStatus]) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(serviceStatus.status)}
                  <span className="capitalize">{name}</span>
                  {serviceStatus.message && (
                    <span className="text-muted-foreground">({serviceStatus.message})</span>
                  )}
                </div>
                {serviceStatus.latency !== undefined && (
                  <span className={cn(
                    "flex items-center",
                    serviceStatus.latency > 200 
                      ? "text-health-orange" 
                      : serviceStatus.latency > 100 
                        ? "text-health-blue" 
                        : "text-health-green"
                  )}>
                    {serviceStatus.latency}ms
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
