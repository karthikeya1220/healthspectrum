import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings, Plus, Minus, GripVertical, X } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ActionItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
  color: string;
}

const defaultActions: ActionItem[] = [
  // Default actions here
];

const availableActions: ActionItem[] = [
  // All possible actions here
];

const QuickActions = () => {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  
  useEffect(() => {
    // Load user preferences from localStorage
    const savedActions = localStorage.getItem("quickActions");
    if (savedActions) {
      setActions(JSON.parse(savedActions));
    } else {
      setActions(defaultActions);
    }
  }, []);
  
  useEffect(() => {
    // Save preferences when actions change
    if (actions.length > 0) {
      localStorage.setItem("quickActions", JSON.stringify(actions));
    }
  }, [actions]);
  
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(actions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setActions(items);
  };
  
  const addAction = (action: ActionItem) => {
    if (!actions.some(a => a.id === action.id)) {
      setActions([...actions, action]);
    }
  };
  
  const removeAction = (id: string) => {
    setActions(actions.filter(action => action.id !== id));
  };
  
  if (actions.length === 0) return null;
  
  return (
    <>
      <div className="mb-6 rounded-xl border bg-background p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-medium">Quick Actions</h3>
          <button
            onClick={() => setShowCustomizeDialog(true)}
            className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
            aria-label="Customize quick actions"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {actions.map((action, index) => (
            <Link
              key={action.id}
              to={action.path}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg p-3 text-center transition-all hover:bg-gray-50",
                `bg-${action.color}-50`
              )}
            >
              <div className={cn("mb-2 rounded-full p-2", `bg-${action.color}-100 text-${action.color}-600`)}>
                {action.icon}
              </div>
              <span className="text-xs font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customize Quick Actions</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium">My Actions</h4>
            
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="actions-list">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="mb-4 space-y-2"
                  >
                    {actions.map((action, index) => (
                      <Draggable key={action.id} draggableId={action.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center justify-between rounded-lg border bg-white p-2"
                          >
                            <div className="flex items-center">
                              <div {...provided.dragHandleProps} className="mr-2 cursor-grab p-1">
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>
                              <div className={cn("mr-2 rounded-full p-1", `bg-${action.color}-100 text-${action.color}-600`)}>
                                {action.icon}
                              </div>
                              <span className="text-sm">{action.label}</span>
                            </div>
                            <button
                              onClick={() => removeAction(action.id)}
                              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                              aria-label={`Remove ${action.label}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
            <div className="space-y-4">
              <h4 className="mb-2 text-sm font-medium">Available Actions</h4>
              
              {availableActions
                .filter(action => !actions.some(a => a.id === action.id))
                .map(action => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between rounded-lg border bg-white p-2"
                  >
                    <div className="flex items-center">
                      <div className={cn("mr-2 rounded-full p-1", `bg-${action.color}-100 text-${action.color}-600`)}>
                        {action.icon}
                      </div>
                      <span className="text-sm">{action.label}</span>
                    </div>
                    <button
                      onClick={() => addAction(action)}
                      className="rounded-full p-1 text-health-green hover:bg-gray-100"
                      aria-label={`Add ${action.label}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickActions;
