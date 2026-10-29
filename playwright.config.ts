import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: 2,
  timeout: 45_000,
  use: { baseURL: 'http://127.0.0.1:4178', browserName: 'chromium', channel: 'chrome', headless: true, trace: 'retain-on-failure', reducedMotion: 'reduce' },
  webServer: { command: 'npm run dev -- --port 4178 --strictPort', url: 'http://127.0.0.1:4178', reuseExistingServer: !process.env.CI },
})
