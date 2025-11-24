"use client";

import React, { createContext, useContext, useCallback, useState } from "react";

interface DashboardContextType {
  refreshFiles: () => void;
  setRefreshCallback: (callback: () => void) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [refreshCallback, setRefreshCallbackState] = useState<(() => void) | null>(null);

  const setRefreshCallback = useCallback((callback: () => void) => {
    setRefreshCallbackState(() => callback);
  }, []);

  const refreshFiles = useCallback(() => {
    if (refreshCallback) {
      console.log("[DashboardContext] Triggering file refresh");
      refreshCallback();
    }
  }, [refreshCallback]);

  return (
    <DashboardContext.Provider value={{ refreshFiles, setRefreshCallback }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}

