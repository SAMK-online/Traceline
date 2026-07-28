"use client";

import { create } from "zustand";

interface WorkspaceState {
  activeUserId: string;
  activeContextId: string;
  setActiveContext: (userId: string, contextId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeUserId: "user-mateo-ruiz",
  activeContextId: "context-mateo-staff",
  setActiveContext: (activeUserId, activeContextId) =>
    set({ activeUserId, activeContextId }),
}));
