
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Pill, 
  FileText, 
  Phone, 
  Settings, 
  HelpCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

const NavItem = ({ icon, label, href, isActive }: NavItemProps) => {
  return (
    <Link 
      to={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isActive 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <div className="w-5 h-5" aria-hidden="true">{icon}</div>
      <span>{label}</span>
    </Link>
  );
};

const NavigationMenu = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" strokeWidth={1.5} />, label: "Dashboard", href: "/" },
    { icon: <Calendar className="w-5 h-5" strokeWidth={1.5} />, label: "Appointments", href: "/appointments" },
    { icon: <Pill className="w-5 h-5" strokeWidth={1.5} />, label: "Medications", href: "/medications" },
    { icon: <FileText className="w-5 h-5" strokeWidth={1.5} />, label: "Medical Records", href: "/records" },
    { icon: <Phone className="w-5 h-5" strokeWidth={1.5} />, label: "Emergency", href: "/emergency" },
  ];
  
  const secondaryNavItems = [
    { icon: <Settings className="w-5 h-5" strokeWidth={1.5} />, label: "Settings", href: "/settings" },
    { icon: <HelpCircle className="w-5 h-5" strokeWidth={1.5} />, label: "Help & Support", href: "/help" },
  ];

  return (
    <nav className="h-full flex flex-col py-6 bg-sidebar border-r" aria-label="Main Navigation">
      <div className="px-6 mb-8">
        <h1 className="text-xl font-semibold flex items-center">
          <span className="bg-primary h-6 w-6 inline-flex items-center justify-center text-white rounded mr-2 text-sm">H</span>
          HealthSpectrum
        </h1>
      </div>
      
      <div className="flex-1 flex flex-col justify-between px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={
                item.href === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(item.href)
              }
            />
          ))}
        </div>
        
        <div className="space-y-1 mt-8">
          {secondaryNavItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={currentPath.startsWith(item.href)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;
