"use client";

import { create } from "zustand";

export type ContactStatus = "idle" | "sending" | "success" | "error";

type ContactState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  error: string | null;
  setField: (field: "name" | "email" | "subject" | "message", value: string) => void;
  submit: () => Promise<void>;
  reset: () => void;
};

export const useContactStore = create<ContactState>((set, get) => ({
  name: "",
  email: "",
  subject: "",
  message: "",
  status: "idle",
  error: null,
  setField: (field, value) => set({ [field]: value } as Partial<ContactState>),
  submit: async () => {
    const { name, email, subject, message } = get();
    if (!name.trim() || !email.trim() || !message.trim()) {
      set({ status: "error", error: "Please fill in your name, email and message." });
      return;
    }
    set({ status: "sending", error: null });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong. Try again.");
      }
      set({
        status: "success",
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      set({
        status: "error",
        error: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  },
  reset: () => set({ status: "idle", error: null }),
}));
