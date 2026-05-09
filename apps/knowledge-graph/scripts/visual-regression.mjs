import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDir, "..");
const repoRoot = resolve(appRoot, "../..");
const distDir = resolve(appRoot, "dist");
const outputDir = resolve(repoRoot, "output/playwright/regression");
const sessionName = "knowledge-graph-visual";

function getFreePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close(() => {
        if (!port) {
          reject(new Error("Could not allocate a local port."));
          return;
        }
        resolvePort(port);
      });
    });
    server.on("error", reject);
  });
}

function runCommand(command, args, options = {}) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? appRoot,
      shell: process.platform === "win32",
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolveRun();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

function startStaticServer(port) {
  const child = spawn("python", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], {
    cwd: distDir,
    shell: process.platform === "win32",
    stdio: "ignore",
  });

  return child;
}

async function main() {
  if (!existsSync(resolve(distDir, "index.html"))) {
    throw new Error("dist/index.html not found. Run bun run build before visual regression.");
  }

  mkdirSync(outputDir, { recursive: true });
  const desktopPath = resolve(outputDir, "desktop.png");
  const runCodePaths = [];
  const port = await getFreePort();
  const url = `http://127.0.0.1:${port}`;
  const server = startStaticServer(port);

  async function runPlaywrightSnippet(fileName, code, screenshotPath, snippetSession) {
    const runCodePath = resolve(outputDir, fileName);
    runCodePaths.push(runCodePath);
    writeFileSync(runCodePath, code.trim(), "utf8");

    try {
      await runCommand("npx", [
        "--yes",
        "--package",
        "@playwright/cli",
        "playwright-cli",
        `-s=${snippetSession}`,
        "open",
        url,
      ]);
      await runCommand("npx", [
        "--yes",
        "--package",
        "@playwright/cli",
        "playwright-cli",
        `-s=${snippetSession}`,
        "run-code",
        `--filename=${runCodePath}`,
      ]);

      if (!existsSync(screenshotPath)) {
        throw new Error(`Expected screenshot was not written: ${screenshotPath}`);
      }
    } finally {
      await runCommand("npx", [
        "--yes",
        "--package",
        "@playwright/cli",
        "playwright-cli",
        `-s=${snippetSession}`,
        "close",
      ]).catch(() => undefined);
    }
  }

  const desktopRunCode = `
async (page) => {
  async function assertNoHorizontalOverflow(label) {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 2) {
      throw new Error(label + " horizontal overflow: " + overflow + "px");
    }
  }

  await page.setViewportSize({ width: 1365, height: 768 });
  await page.goto(${JSON.stringify(url)}, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("button[data-node-id='agent-loop']").click();
  await page.locator(".detail-drawer").waitFor({ state: "visible" });
  await page.locator(".quiz-panel").scrollIntoViewIfNeeded();
  await page.locator(".quiz-panel button").first().focus();
  await assertNoHorizontalOverflow("desktop");
  await page.screenshot({ path: ${JSON.stringify(desktopPath)}, fullPage: true });
}`;

  try {
    await new Promise((resolveWait) => setTimeout(resolveWait, 800));
    await runPlaywrightSnippet(
      "visual-regression-desktop.js",
      desktopRunCode,
      desktopPath,
      `${sessionName}-desktop`,
    );
    console.log(`Visual regression screenshots written to ${outputDir}`);
  } finally {
    server.kill();
    for (const runCodePath of runCodePaths) {
      rmSync(runCodePath, { force: true });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
