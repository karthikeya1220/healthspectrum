import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

interface ShortcutProps {
  keys: string[];
  description: string;
}

const Shortcut: React.FC<ShortcutProps> = ({ keys, description }) => {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm">{description}</span>
      <div className="flex gap-1">
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <kbd className="px-2 py-1 bg-secondary rounded-md text-xs font-mono">
              {key}
            </kbd>
            {index < keys.length - 1 && <span className="mx-1">+</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

interface KeyboardShortcutsDialogProps {
  trigger?: React.ReactNode;
}

// This component enhances flexibility and efficiency of use (Nielsen's Heuristic #7)
const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({ 
  trigger = (
    <button 
      className="p-2 rounded-lg hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="Keyboard shortcuts"
    >
      <Keyboard className="h-5 w-5" />
    </button>
  ) 
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Navigation</h3>
            <div className="space-y-1 border-t">
              <Shortcut keys={["/"]} description="Search" />
              <Shortcut keys={["G", "H"]} description="Go to Home" />
              <Shortcut keys={["G", "M"]} description="Go to Medications" />
              <Shortcut keys={["G", "A"]} description="Go to Appointments" />
              <Shortcut keys={["G", "R"]} description="Go to Records" />
              <Shortcut keys={["G", "S"]} description="Go to Settings" />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Actions</h3>
            <div className="space-y-1 border-t">
              <Shortcut keys={["E"]} description="Emergency" />
              <Shortcut keys={["N"]} description="New Item / Add" />
              <Shortcut keys={["Esc"]} description="Close Dialog / Cancel" />
              <Shortcut keys={["Ctrl", ","]} description="Settings" />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Accessibility</h3>
            <div className="space-y-1 border-t">
              <Shortcut keys={["Alt", "1"]} description="Skip to Content" />
              <Shortcut keys={["?"]} description="Show this dialog" />
              <Shortcut keys={["F1"]} description="Get Help" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsDialog;
