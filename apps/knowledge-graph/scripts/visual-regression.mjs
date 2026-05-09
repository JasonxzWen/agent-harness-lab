import { existsSync, mkdirSync } from "node:fs";
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
    const executable =
      process.platform === "win32" && command === "npx" ? "npx.cmd" : command;
    const child = spawn(executable, args, {
      cwd: options.cwd ?? appRoot,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      output += text;
      process.stdout.write(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      output += text;
      process.stderr.write(text);
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0 && !output.includes("### Error")) {
        resolveRun(output);
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

function startStaticServer(port) {
  return spawn("python", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], {
    cwd: distDir,
    stdio: "ignore",
  });
}

async function runPlaywrightCommand(args) {
  return runCommand("npx", [
    "--yes",
    "--package",
    "@playwright/cli",
    "playwright-cli",
    `-s=${sessionName}`,
    ...args,
  ]);
}

async function evalInPage(expression) {
  return runPlaywrightCommand(["eval", expression]);
}

async function screenshot(path) {
  await runPlaywrightCommand(["screenshot", "--filename", path, "--full-page"]);

  if (!existsSync(path)) {
    throw new Error(`Expected screenshot was not written: ${path}`);
  }
}

async function assertNoHorizontalOverflow(label) {
  await evalInPage(
    `(() => { const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth; if (overflow > 2) throw new Error("${label} horizontal overflow: " + overflow + "px"); return overflow; })()`,
  );
}

async function main() {
  if (!existsSync(resolve(distDir, "index.html"))) {
    throw new Error("dist/index.html not found. Run bun run build before visual regression.");
  }

  mkdirSync(outputDir, { recursive: true });
  const desktopPath = resolve(outputDir, "desktop.png");
  const drawerPath = resolve(outputDir, "detail-drawer.png");
  const sourcePreviewPath = resolve(outputDir, "source-preview.png");
  const port = await getFreePort();
  const url = `http://127.0.0.1:${port}`;
  const server = startStaticServer(port);

  try {
    await new Promise((resolveWait) => setTimeout(resolveWait, 800));
    await runPlaywrightCommand(["open", url]);
    await runPlaywrightCommand(["resize", "1365", "900"]);
    await evalInPage("localStorage.clear()");
    await runPlaywrightCommand(["reload"]);
    await assertNoHorizontalOverflow("desktop");
    await screenshot(desktopPath);

    await runPlaywrightCommand(["click", "button[data-route-node-id='agent-loop']"]);
    await assertNoHorizontalOverflow("detail drawer");
    await screenshot(drawerPath);

    await runPlaywrightCommand(["click", "button[aria-controls='detail-fold-references']"]);
    await runPlaywrightCommand(["hover", ".reference-panel li.has-code-preview"]);
    await assertNoHorizontalOverflow("source preview");
    await screenshot(sourcePreviewPath);

    console.log(`Visual regression screenshots written to ${outputDir}`);
  } finally {
    await runPlaywrightCommand(["close"]).catch(() => undefined);
    server.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
