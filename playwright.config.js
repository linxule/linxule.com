import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium, defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";

// The browser cache is shared across this machine, and its daily upgrade
// keeps only the build the newest Playwright uses. On 2026-11-13 that removed
// the build this repo's Playwright expected and no suite could start. When the
// expected build is missing, run on the newest headless shell that is
// installed instead; when it is present (CI installs it), change nothing.
function installedChromium() {
  try {
    if (existsSync(chromium.executablePath())) return undefined;
    const cache = process.env.PLAYWRIGHT_BROWSERS_PATH
      || [join(homedir(), "Library/Caches/ms-playwright"), join(homedir(), ".cache/ms-playwright")].find(existsSync);
    const build = name => Number(name.split("-").pop());
    const builds = readdirSync(cache).filter(name => /^chromium_headless_shell-\d+$/.test(name)).sort((x, y) => build(y) - build(x));
    for (const name of builds) {
      for (const dir of readdirSync(join(cache, name))) {
        const exe = join(cache, name, dir, "chrome-headless-shell");
        if (existsSync(exe)) return exe;
      }
    }
  } catch {
    // No cache to read: let Playwright report the missing browser itself.
  }
  return undefined;
}
const fallbackChromium = installedChromium();
const viewports = [
  ["phone", 390, 844],
  ["phone-narrow", 320, 740],
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
    ...(fallbackChromium ? { launchOptions: { executablePath: fallbackChromium } } : {}),
  },
  projects: viewports.map(([name, width, height]) => ({
    name,
    // Making has its own established boundary matrix; phone regressions live
    // in the reading/discovery suites.
    ...(name === "phone" || name === "phone-narrow" ? { testIgnore: "**/making/**" } : {}),
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
