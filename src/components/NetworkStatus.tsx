import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [slowConnection, setSlowConnection] = useState(false);
  const [visible, setVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setVisible(true);
      toast({
        title: "You're back online",
        description: "Your connection has been restored.",
        variant: "default",
      });
      setTimeout(() => setVisible(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setVisible(true);
    };

    const checkConnectionSpeed = async () => {
      try {
        const startTime = Date.now();
        const response = await fetch('/api/ping', { method: 'GET', cache: 'no-cache' });
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        if (duration > 2000) {
          setSlowConnection(true);
          setVisible(true);
        } else {
          setSlowConnection(false);
          if (!isOnline) setVisible(true);
          else setVisible(false);
        }
      } catch (error) {
        console.error('Connection check failed:', error);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const intervalId = setInterval(checkConnectionSpeed, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [isOnline, toast]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border px-4 py-2 shadow-md animate-fade-in",
        isOnline ? slowConnection ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      )}
    >
      {!isOnline ? (
        <>
          <WifiOff className="h-4 w-4 text-health-red" />
          <span className="text-sm">You're offline. Some features may be unavailable.</span>
        </>
      ) : slowConnection ? (
        <>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span className="text-sm">Slow connection detected.</span>
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4 text-health-green" />
          <span className="text-sm">Connected</span>
        </>
      )}
    </div>
  );
};

export default NetworkStatus;
