import React, { ReactNode, useState, useEffect } from "react";
import NavigationMenu from "./NavigationMenu";
import { Bell, Search, User, Menu, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import KeyboardShortcutsDialog from "./KeyboardShortcutsDialog";

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const Layout = ({ children, title, subtitle }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [isUserActive, setIsUserActive] = useState<boolean>(true);
  
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Would normally handle search here, but it's hardcoded
    console.log(`Searching for: ${searchTerm}`);
    setSearchTerm("");
  };
  
  // Track user activity for system status visibility (Nielsen's Heuristic #1)
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(new Date());
      setIsUserActive(true);
    };
    
    // Monitor user interactions to update activity status
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    
    // Check if user has been inactive for 5 minutes
    const inactivityCheck = setInterval(() => {
      const now = new Date();
      if (now.getTime() - lastActivity.getTime() > 5 * 60 * 1000) {
        setIsUserActive(false);
      }
    }, 60000);
    
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      clearInterval(inactivityCheck);
    };
  }, [lastActivity]);

  // Handle navigation - Support user control and freedom (Nielsen's Heuristic #3)
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Navigation */}
      <div className={cn("hidden md:block", showMobileMenu ? "w-64" : "w-auto")}>
        <NavigationMenu />
      </div>

      {/* Mobile Navigation Overlay */}
      {showMobileMenu && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleMobileMenu} />
      )}

      {/* Mobile Navigation Drawer */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-background transform transition-transform duration-200 ease-in-out md:hidden",
            showMobileMenu ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">HealthSpectrum</h2>
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-secondary"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <NavigationMenu />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="border-b bg-white">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-2">
              {isMobile && (
                <button 
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}
              
              {/* Back button for user control and freedom (Nielsen's Heuristic #3) */}
              {location.pathname !== "/" && (
                <button 
                  onClick={handleBack}
                  className="p-2 rounded-lg hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary mr-1"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              
              <div className="relative">
                <form onSubmit={handleSearch}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-10 pr-4 py-2 h-10 bg-secondary rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-primary outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search"
                  />
                </form>
              </div>
            </div>
          
            <div className="flex items-center gap-2">
              {/* Improved tooltips for better visibility and feedback (Nielsen's Heuristic #1) */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="p-2 rounded-lg hover:bg-secondary relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label="View notifications"
                    >
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-health-red" aria-hidden="true"></span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="p-2 rounded-lg hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label="View profile"
                    >
                      <User className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Add keyboard shortcuts dialog - for flexibility and efficiency */}
              <KeyboardShortcutsDialog />
            </div>
          </div>
        </header>
        
        {/* System status indicator - Visibility of system status (Nielsen's Heuristic #1) */}
        {!isUserActive && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800">
            <p>You've been inactive for a while. Your session will expire soon.</p>
          </div>
        )}
        
        {/* Page Header */}
        <div className="border-b px-6 py-6 bg-white">
          <h1 className="animate-slide-down font-bold" tabIndex={-1}>
            {title}
          </h1>
          {subtitle && <p className="text-muted-foreground mt-1 animate-slide-down">{subtitle}</p>}
        </div>
        
        {/* Breadcrumbs for navigation context - Match between system and real world (Nielsen's Heuristic #2) */}
        {location.pathname !== "/" && (
          <nav aria-label="Breadcrumb" className="px-6 py-2 bg-white/80 text-sm">
            <ol className="flex items-center space-x-2">
              <li><a href="/" className="text-muted-foreground hover:text-primary">Home</a></li>
              <li className="text-muted-foreground">/</li>
              <li className="text-primary font-medium">{title}</li>
            </ol>
          </nav>
        )}
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto px-4 md:px-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className={cn("py-6 mx-auto", isMobile ? "max-w-full" : "max-w-6xl")}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
