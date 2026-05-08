import { useState } from "react";

type CommandBlockProps = {
  command: string;
};

type CopyState = "idle" | "copied" | "failed";

async function writeTextToClipboard(text: string) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the legacy copy path for restricted browser contexts.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Copy command failed");
  }
}

export function CommandBlock({ command }: CommandBlockProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  async function copyCommand() {
    try {
      await writeTextToClipboard(command);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState("idle"), 1600);
    }
  }

  const buttonLabel =
    copyState === "copied" ? "已复制" : copyState === "failed" ? "手动复制" : "复制命令";

  return (
    <div className="command-block">
      <code>{command}</code>
      <button
        aria-label={`复制命令：${command}`}
        aria-live="polite"
        data-copy-state={copyState}
        type="button"
        onClick={copyCommand}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
