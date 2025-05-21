import { ManualLayout } from "../types/ManualLayout";

const STORAGE_KEY = "manual-layout";

export function saveLayout(layout: ManualLayout) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
}

export function loadLayout(): ManualLayout | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearLayout() {
  localStorage.removeItem(STORAGE_KEY);
}