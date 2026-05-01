"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ViewMode = "full" | "overview";

interface ViewContextType {
  view: ViewMode;
  setView: (v: ViewMode) => void;
}

const ViewContext = createContext<ViewContextType>({
  view: "full",
  setView: () => {},
});

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewMode>("full");
  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  return useContext(ViewContext);
}
