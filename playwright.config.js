import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
const viewports = [
  ["mobile-boundary", 768, 900],
  ["book-boundary", 769, 900],
  ["book-narrow", 800, 900],
  ["book-900", 900, 900],
  ["normal-entry", 900, 700],
  ["book-901", 901, 900],
  ["book-entry", 901, 700],
  ["desktop", 1440, 900],
  ["desktop-wide", 1920, 900],
  ["landscape-phone", 844, 390],
  ["short-900", 900, 500],
  ["short-901", 901, 500],
  ["short-desktop", 1024, 600],
  ["short-wide", 1366, 600],
];

export default defineConfig({
  testDir: "./tests",
  outputDir: "test-results",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "dot" : "line",
  use: {
    baseURL,
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  projects: viewports.map(([name, width, height]) => ({
    name,
    use: { viewport: { width, height } },
  })),
  webServer: process.env.PLAYWRIGHT_NO_WEBSERVER
    ? undefined
    : {
        command: "bun run serve:built",
        url: `${baseURL}/making/`,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
});
