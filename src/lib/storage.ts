// ============================================================================
// Carbon Compass — LocalStorage Persistence
// ============================================================================
// NOTE: No sensitive data (auth tokens, PII) is stored in localStorage.
// Only carbon assessment preferences and action history are persisted.

import type { CarbonState } from './types';

const STORAGE_KEY = 'carbon-compass-state';

/**
 * Save state to localStorage (SSR-safe)
 */
export function saveState(state: CarbonState): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Storage full or unavailable — fail silently
  }
}

/**
 * Load state from localStorage (SSR-safe)
 */
export function loadState(): CarbonState | null {
  if (typeof window === 'undefined') return null;
  try {
    const serialized = window.localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as CarbonState;
  } catch {
    return null;
  }
}

/**
 * Clear all persisted state
 */
export function clearState(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Fail silently
  }
}

/**
 * Check if state exists in localStorage
 */
export function hasPersistedState(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY) !== null;
}
