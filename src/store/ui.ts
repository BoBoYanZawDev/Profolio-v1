"use client";

import { create } from "zustand";

export type Project = {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  tech: string;
  demoUrl: string | null;
  repoUrl: string | null;
  accent: string;
  featured: boolean;
  sortOrder: number;
};

type UIState = {
  menuOpen: boolean;
  loaded: boolean;
  projects: Project[];
  projectsStatus: "idle" | "loading" | "ready" | "error";
  toggleMenu: () => void;
  closeMenu: () => void;
  setLoaded: (v: boolean) => void;
  fetchProjects: () => Promise<void>;
};

export const useUIStore = create<UIState>((set, get) => ({
  menuOpen: false,
  loaded: false,
  projects: [],
  projectsStatus: "idle",
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
  closeMenu: () => set({ menuOpen: false }),
  setLoaded: (v) => set({ loaded: v }),
  fetchProjects: async () => {
    if (get().projectsStatus === "loading") return;
    set({ projectsStatus: "loading" });
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      set({ projects: data.projects ?? [], projectsStatus: "ready" });
    } catch {
      set({ projectsStatus: "error" });
    }
  },
}));
