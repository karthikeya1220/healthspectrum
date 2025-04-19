import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Calendar,
  CircleHelp,
  ClipboardList,
  Home,
  LifeBuoy,
  Pill,
  Search,
  Settings,
  User,
} from "lucide-react";

const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Go to Home</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/appointments"))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Appointments</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/medications"))}>
            <Pill className="mr-2 h-4 w-4" />
            <span>Medications</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/records"))}>
            <ClipboardList className="mr-2 h-4 w-4" />
            <span>Medical Records</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Support">
          <CommandItem onSelect={() => runCommand(() => navigate("/emergency"))}>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Emergency</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/help-support"))}>
            <CircleHelp className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/profile"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandMenu;
