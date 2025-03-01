
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Moon, 
  Smartphone, 
  Shield, 
  Laptop, 
  Languages,
  MoveRight,
  CreditCard,
  Cloud
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4" id={title.toLowerCase().replace(/\s+/g, '-')}>
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}

const SettingsItem = ({ icon, title, description, action, onClick }: SettingsItemProps) => {
  return (
    <div 
      className="p-4 rounded-lg border bg-white hover:border-primary/20 hover:bg-secondary/20 cursor-pointer flex items-center justify-between transition-colors focus-within:ring-2 focus-within:ring-primary/50"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`${title} settings`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-secondary text-foreground">
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      
      <div>
        {action || <MoveRight className="h-5 w-5 text-muted-foreground" />}
      </div>
    </div>
  );
};

interface ToggleSettingProps {
  title: string;
  description?: string;
  enabled: boolean;
  onChange: () => void;
  id: string;
}

const ToggleSetting = ({ title, description, enabled, onChange, id }: ToggleSettingProps) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-white focus-within:ring-2 focus-within:ring-primary/50">
      <div className="flex-1 pr-4">
        <h3 className="font-medium">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      
      <button 
        id={id}
        onClick={onChange}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          enabled ? "bg-primary" : "bg-muted"
        )}
        aria-checked={enabled}
        role="switch"
        aria-label={`${title} toggle`}
      >
        <span className="sr-only">{title}</span>
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
};

const Settings = () => {
  const isMobile = useIsMobile();
  // Hardcoded toggle states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  
  return (
    <Layout 
      title="Settings" 
      subtitle="Manage your account and application preferences"
    >
      <div className="max-w-3xl mx-auto animate-fade-in">
        {!isMobile && (
          <nav className="mb-6 bg-secondary/50 p-3 rounded-lg" aria-label="Settings navigation">
            <ul className="flex flex-wrap gap-4 text-sm">
              <li><a href="#account" className="text-primary hover:underline">Account</a></li>
              <li><a href="#notifications" className="text-primary hover:underline">Notifications</a></li>
              <li><a href="#appearance" className="text-primary hover:underline">Appearance</a></li>
              <li><a href="#privacy-&-security" className="text-primary hover:underline">Privacy & Security</a></li>
              <li><a href="#devices-&-integration" className="text-primary hover:underline">Devices & Integration</a></li>
            </ul>
          </nav>
        )}
        
        <SettingsSection title="Account">
          <SettingsItem 
            icon={<User className="h-5 w-5" />}
            title="Personal Information"
            description="Update your name, contact details, and date of birth"
          />
          <SettingsItem 
            icon={<CreditCard className="h-5 w-5" />}
            title="Billing & Subscription"
            description="Manage your payment methods and subscription plan"
          />
          <SettingsItem 
            icon={<Lock className="h-5 w-5" />}
            title="Security & Password"
            description="Update your password and security settings"
          />
        </SettingsSection>
        
        <SettingsSection title="Notifications">
          <ToggleSetting
            id="push-notifications"
            title="Push Notifications"
            description="Receive alerts for appointments, medications, and health updates"
            enabled={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
          <SettingsItem 
            icon={<Bell className="h-5 w-5" />}
            title="Notification Preferences"
            description="Choose which types of notifications to receive"
          />
        </SettingsSection>
        
        <SettingsSection title="Appearance">
          <ToggleSetting
            id="dark-mode"
            title="Dark Mode"
            description="Switch between light and dark themes"
            enabled={darkModeEnabled}
            onChange={() => setDarkModeEnabled(!darkModeEnabled)}
          />
          <SettingsItem 
            icon={<Globe className="h-5 w-5" />}
            title="Language"
            description="Change the application language"
            action={<span className="text-sm text-muted-foreground">English</span>}
          />
        </SettingsSection>
        
        <SettingsSection title="Privacy & Security">
          <ToggleSetting
            id="biometric-auth"
            title="Biometric Authentication"
            description="Use Face ID or fingerprint to secure your account"
            enabled={biometricsEnabled}
            onChange={() => setBiometricsEnabled(!biometricsEnabled)}
          />
          <ToggleSetting
            id="location-services"
            title="Location Services"
            description="Allow the app to access your location for nearby services"
            enabled={locationEnabled}
            onChange={() => setLocationEnabled(!locationEnabled)}
          />
          <SettingsItem 
            icon={<Shield className="h-5 w-5" />}
            title="Privacy Settings"
            description="Manage how your data is used and shared"
          />
          <SettingsItem 
            icon={<Cloud className="h-5 w-5" />}
            title="Data & Storage"
            description="Manage your data and storage usage"
          />
        </SettingsSection>
        
        <SettingsSection title="Devices & Integration">
          <SettingsItem 
            icon={<Smartphone className="h-5 w-5" />}
            title="Connected Devices"
            description="Manage your connected health devices and wearables"
          />
          <SettingsItem 
            icon={<Laptop className="h-5 w-5" />}
            title="Third-Party Services"
            description="Connect to other health services and apps"
          />
        </SettingsSection>
        
        <div className="flex justify-center mt-12 mb-6">
          <button 
            className="text-sm text-health-red hover:underline px-4 py-2 rounded-lg hover:bg-health-red/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-health-red/50"
            aria-label="Sign out of your account"
          >
            Sign Out
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
