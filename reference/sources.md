# Sources

本文件记录 `agent-harness-lab` 的外部资料边界，避免把阅读参考误当作本仓库源码提交。

## shareAI-lab/learn-claude-code

- URL: https://github.com/shareAI-lab/learn-claude-code
- License: MIT
- 用途：教学源码与机制学习参考。
- 本仓库处理方式：作为 git submodule 保留在 `reference/vendor/learn-claude-code`。

## anthropics/claude-code

- URL: https://github.com/anthropics/claude-code
- 用途：官方 Claude Code 产品、文档和行为参考。
- 本仓库处理方式：只链接，不复制源码。

## claude-code-best/claude-code

- URL: https://github.com/claude-code-best/claude-code
- 用途：生产级工程阅读参考，用于理解 CCB 的真实工程组织与 agent harness 机制。
- 本仓库处理方式：只在本地 `.external/` 阅读，不提交源码。
