import React, { createContext, useContext, useReducer, useCallback } from "react";

type Action = {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  data: any;
  undoable: boolean;
  undoFunction?: () => Promise<void> | void;
};

type ActionHistoryState = {
  actions: Action[];
  currentIndex: number;
};

type ActionHistoryAction =
  | { type: "ADD_ACTION"; payload: Action }
  | { type: "UNDO"; payload: string }
  | { type: "CLEAR_HISTORY" };

const initialState: ActionHistoryState = {
  actions: [],
  currentIndex: -1,
};

const actionHistoryReducer = (
  state: ActionHistoryState,
  action: ActionHistoryAction
): ActionHistoryState => {
  switch (action.type) {
    case "ADD_ACTION":
      return {
        ...state,
        actions: [...state.actions, action.payload],
        currentIndex: state.actions.length,
      };
    case "UNDO":
      const actionIndex = state.actions.findIndex(
        (item) => item.id === action.payload
      );
      if (actionIndex === -1) return state;
      
      return {
        ...state,
        currentIndex: actionIndex - 1,
      };
    case "CLEAR_HISTORY":
      return initialState;
    default:
      return state;
  }
};

type ActionHistoryContextType = {
  actions: Action[];
  addAction: (action: Omit<Action, "id" | "timestamp">) => string;
  undoAction: (id: string) => Promise<boolean>;
  clearHistory: () => void;
  canUndo: (id: string) => boolean;
};

const ActionHistoryContext = createContext<ActionHistoryContextType | undefined>(
  undefined
);

export const ActionHistoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(actionHistoryReducer, initialState);

  const addAction = useCallback(
    (action: Omit<Action, "id" | "timestamp">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const timestamp = new Date();
      
      dispatch({
        type: "ADD_ACTION",
        payload: { ...action, id, timestamp },
      });
      
      return id;
    },
    []
  );

  const undoAction = useCallback(
    async (id: string): Promise<boolean> => {
      const action = state.actions.find((a) => a.id === id);
      
      if (!action || !action.undoable || !action.undoFunction) return false;
      
      try {
        await action.undoFunction();
        dispatch({ type: "UNDO", payload: id });
        return true;
      } catch (error) {
        console.error("Failed to undo action:", error);
        return false;
      }
    },
    [state.actions]
  );

  const clearHistory = useCallback(() => {
    dispatch({ type: "CLEAR_HISTORY" });
  }, []);

  const canUndo = useCallback(
    (id: string) => {
      const action = state.actions.find((a) => a.id === id);
      return Boolean(action?.undoable);
    },
    [state.actions]
  );

  return (
    <ActionHistoryContext.Provider
      value={{
        actions: state.actions,
        addAction,
        undoAction,
        clearHistory,
        canUndo,
      }}
    >
      {children}
    </ActionHistoryContext.Provider>
  );
};

export const useActionHistory = (): ActionHistoryContextType => {
  const context = useContext(ActionHistoryContext);
  if (!context) {
    throw new Error(
      "useActionHistory must be used within an ActionHistoryProvider"
    );
  }
  return context;
};
