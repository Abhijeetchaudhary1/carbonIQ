import { test, expect } from '@playwright/test';

// ============================================================================
// Security Tests — Headers, CORS, and API Protection
// ============================================================================

test.describe('Security Headers', () => {
  test('response includes X-Content-Type-Options', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    expect(headers?.['x-content-type-options']).toBe('nosniff');
  });

  test('response includes X-Frame-Options', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    expect(headers?.['x-frame-options']).toBe('DENY');
  });

  test('response includes Referrer-Policy', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    expect(headers?.['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });

  test('response includes Strict-Transport-Security', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    expect(headers?.['strict-transport-security']).toContain('max-age=');
  });

  test('response includes Content-Security-Policy', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    expect(headers?.['content-security-policy']).toContain("default-src 'self'");
  });

  test('response includes Permissions-Policy', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    expect(headers?.['permissions-policy']).toContain('camera=()');
  });
});

test.describe('API Security', () => {
  test('GET /api/submissions requires admin key', async ({ request }) => {
    const response = await request.get('/api/submissions');
    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
  });

  test('GET /api/submissions rejects invalid key', async ({ request }) => {
    const response = await request.get('/api/submissions?key=wrong-key');
    expect(response.status()).toBe(401);
  });

  test('POST /api/submissions validates required fields', async ({ request }) => {
    const response = await request.post('/api/submissions', {
      data: { sessionId: 'test' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response.status()).toBe(400);
  });

  test('POST /api/submissions validates sessionId format', async ({ request }) => {
    const response = await request.post('/api/submissions', {
      data: {
        sessionId: '<script>alert("xss")</script>',
        assessmentData: {},
        carbonResults: {},
      },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response.status()).toBe(400);
  });
});
