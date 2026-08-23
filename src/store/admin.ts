"use client";

import { create } from "zustand";
import type { Project } from "./ui";

export type Message = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type Stats = {
  totalMessages: number;
  unreadMessages: number;
  totalProjects: number;
};

type AdminState = {
  messages: Message[];
  stats: Stats | null;
  messagesLoading: boolean;
  projects: Project[];
  projectsLoading: boolean;
  fetchMessages: () => Promise<void>;
  markRead: (id: number, isRead: boolean) => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;
  saveProject: (
    data: Partial<Project> & { id?: number }
  ) => Promise<{ ok: boolean; error?: string }>;
  deleteProject: (id: number) => Promise<void>;
  fetchProjects: () => Promise<void>;
  logout: () => Promise<void>;
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const useAdminStore = create<AdminState>((set, get) => ({
  messages: [],
  stats: null,
  messagesLoading: false,
  projects: [],
  projectsLoading: false,

  fetchMessages: async () => {
    set({ messagesLoading: true });
    try {
      const data = await api<{ messages: Message[]; stats: Stats }>("/api/admin/messages");
      set({ messages: data.messages, stats: data.stats });
    } finally {
      set({ messagesLoading: false });
    }
  },

  markRead: async (id, isRead) => {
    await api(`/api/admin/messages/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isRead }),
    });
    set({
      messages: get().messages.map((m) => (m.id === id ? { ...m, isRead } : m)),
      stats: get().stats
        ? {
            ...get().stats!,
            unreadMessages:
              get().stats!.unreadMessages + (isRead ? -1 : 1),
          }
        : null,
    });
  },

  deleteMessage: async (id) => {
    await api(`/api/admin/messages/${id}`, { method: "DELETE" });
    set({ messages: get().messages.filter((m) => m.id !== id) });
    await get().fetchMessages();
  },

  saveProject: async (data) => {
    try {
      if (data.id) {
        await api(`/api/admin/projects/${data.id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
      } else {
        await api("/api/admin/projects", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }
      await get().fetchProjects();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Failed" };
    }
  },

  deleteProject: async (id) => {
    await api(`/api/admin/projects/${id}`, { method: "DELETE" });
    set({ projects: get().projects.filter((p) => p.id !== id) });
  },

  fetchProjects: async () => {
    set({ projectsLoading: true });
    try {
      const data = await api<{ projects: Project[] }>("/api/admin/projects");
      set({ projects: data.projects });
    } finally {
      set({ projectsLoading: false });
    }
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  },
}));
