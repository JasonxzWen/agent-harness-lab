# 运行环境初始化与检查清单

本页记录本项目的本地运行环境初始化步骤。当前项目分两层：

- 根仓库：CCB/Claude Code 生产级参考源码。
- `labs/ts-agent`：从 0 到 1 构建的 TypeScript/Bun 学习实验。

## 已验证环境

当前本机已验证：

- Windows
- Git 2.45.2
- Node.js 22.15.0
- Bun 1.3.13
- 根仓库 `bun install` 成功
- 根仓库 `bun run typecheck` 通过
- `labs/ts-agent` `bun install` 成功
- `labs/ts-agent` `bun run dev "hello agent"` 成功
- `labs/ts-agent` `bun run typecheck` 通过

## 安装 Bun

Windows PowerShell：

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

安装后 Bun 默认位于：

```text
C:\Users\Admin\.bun\bin\bun.exe
```

如果当前终端还识别不了 `bun`，重启终端或临时使用完整路径：

```powershell
& 'C:\Users\Admin\.bun\bin\bun.exe' --version
```

## 初始化根仓库

在仓库根目录执行：

```powershell
cd D:\learn-cc
bun install
bun run typecheck
```

如果当前终端还没有刷新 PATH：

```powershell
cd D:\learn-cc
& 'C:\Users\Admin\.bun\bin\bun.exe' install
& 'C:\Users\Admin\.bun\bin\bun.exe' run typecheck
```

说明：

- `bun install` 会安装根仓库依赖。
- 当前安装过程会运行 postinstall，并配置 Chrome MCP bridge。
- `bun run typecheck` 用于确认 CCB 主工程 TypeScript 状态。

## 初始化 ts-agent 实验项目

```powershell
cd D:\learn-cc\labs\ts-agent
bun install
bun run dev "hello agent"
bun run typecheck
```

如果需要使用 Bun 完整路径：

```powershell
cd D:\learn-cc\labs\ts-agent
& 'C:\Users\Admin\.bun\bin\bun.exe' install
& 'C:\Users\Admin\.bun\bin\bun.exe' run dev "hello agent"
& 'C:\Users\Admin\.bun\bin\bun.exe' run typecheck
```

## 成功输出

`bun run dev "hello agent"` 应该输出一个 messages 数组，包含：

1. user message
2. assistant `tool_use`
3. user `tool_result`
4. assistant final text

关键是第三步：工具结果必须写回 messages。

## 每次开工前检查清单

```powershell
git status --short
bun --version
node --version
```

如果只学习和构建 `labs/ts-agent`：

```powershell
cd D:\learn-cc\labs\ts-agent
bun run dev "hello agent"
bun run typecheck
```

如果改动了根仓库 CCB 源码：

```powershell
cd D:\learn-cc
bun run typecheck
```

## 常见问题

### bun 命令找不到

原因：安装后当前终端没有刷新 PATH。

处理：

1. 重启终端或编辑器。
2. 或临时使用完整路径：

```powershell
& 'C:\Users\Admin\.bun\bin\bun.exe' --version
```

### PowerShell 执行 npm.ps1 / bun.ps1 受限

优先使用 Bun 的 `.exe` 完整路径。

### Git 提示无法访问用户级 ignore

可能看到：

```text
warning: unable to access 'C:\Users\Admin/.config/git/ignore': Permission denied
```

这通常不影响当前仓库提交和推送。后续如果频繁出现，再单独修复用户级 Git 配置权限。

## 本项目约定

- 学习实验优先改 `labs/ts-agent`。
- 根仓库 `src/`、`packages/` 默认只读对照。
- 项目指令统一使用 `AGENTS.md`，不再维护根目录 `CLAUDE.md`。
- 改 `labs/ts-agent` 后至少运行：

```powershell
cd D:\learn-cc\labs\ts-agent
bun run typecheck
```

- 改 CCB 主源码后运行：

```powershell
cd D:\learn-cc
bun run typecheck
```
