// ============================================================================
// Carbon Compass — Input Validation Utilities
// ============================================================================
// Centralized input validation and sanitization for API routes.
// Prevents injection attacks and ensures data integrity.

/**
 * Sanitize a string by removing HTML tags and trimming whitespace.
 * Prevents XSS when user-generated content is echoed back.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')          // strip HTML tags
    .replace(/[<>"'`]/g, '')          // strip dangerous characters
    .trim()
    .slice(0, 1000);                  // cap length
}

/**
 * Validate a session ID format.
 * Must be a non-empty alphanumeric string with dashes, max 128 chars.
 */
export function isValidSessionId(id: unknown): id is string {
  if (typeof id !== 'string') return false;
  if (id.length === 0 || id.length > 128) return false;
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

/**
 * Validate a positive number within a range.
 */
export function isValidNumber(value: unknown, min = 0, max = 100000): value is number {
  if (typeof value !== 'number') return false;
  if (!Number.isFinite(value)) return false;
  return value >= min && value <= max;
}

/**
 * Validate that a value is one of allowed enum strings.
 */
export function isValidEnum<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value);
}

/**
 * Validate an ISO date string.
 */
export function isValidISODate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const parsed = Date.parse(value);
  return !isNaN(parsed);
}

/**
 * Validate an array with a maximum length.
 */
export function isValidArray(value: unknown, maxLength = 1000): value is unknown[] {
  return Array.isArray(value) && value.length <= maxLength;
}
