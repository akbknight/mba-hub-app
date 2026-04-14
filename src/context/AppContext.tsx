"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type TabState = "Dashboard" | "My Matches" | "Study Groups" | "Social";

export interface StudentProfile {
  id: string;
  name: string;
  role: string;
  university: string;
  degree: string;
  tags: string[];
  avatar: string;
  distance: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  userEmail: string;
  setUserEmail: (val: string) => void;
  activeTab: TabState;
  setActiveTab: (val: TabState) => void;
  activeMatch: StudentProfile | null;
  setActiveMatch: (val: StudentProfile | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabState>("Dashboard");
  const [activeMatch, setActiveMatch] = useState<StudentProfile | null>(null);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userEmail,
        setUserEmail,
        activeTab,
        setActiveTab,
        activeMatch,
        setActiveMatch
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
