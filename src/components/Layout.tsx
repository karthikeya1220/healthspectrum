
import React, { ReactNode, useState } from "react";
import NavigationMenu from "./NavigationMenu";
import { Bell, Search, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";

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
  
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Would normally handle search here, but it's hardcoded
    console.log(`Searching for: ${searchTerm}`);
    setSearchTerm("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Navigation */}
      {!isMobile && (
        <div className="w-64 h-full hidden md:block">
          <NavigationMenu />
        </div>
      )}
      
      {/* Mobile Navigation Overlay */}
      {isMobile && showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-background animate-fade-in">
          <div className="absolute top-4 right-4">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-full bg-secondary"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="h-full">
            <NavigationMenu />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 px-4 md:px-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button 
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
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
            <button 
              className="p-2 rounded-lg hover:bg-secondary relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-health-red" aria-hidden="true"></span>
            </button>
            <button 
              className="p-2 rounded-lg hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="View profile"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </header>
        
        {/* Page Header */}
        <div className="border-b px-6 py-6 bg-white">
          <h1 className="animate-slide-down font-bold" tabIndex={-1}>
            {title}
          </h1>
          {subtitle && <p className="text-muted-foreground mt-1 animate-slide-down">{subtitle}</p>}
        </div>
        
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
