# Bun 学习笔记

Bun 在本项目中负责运行 TypeScript、管理依赖、测试和打包。

## 常用命令

```bash
bun run src/main.ts
bun test
bun install
```

## 需要理解

- Bun 可以直接执行 TypeScript。
- `package.json` 的 `scripts` 可以用 `bun run` 执行。
- CCB 使用 `Bun.build()` 构建 CLI 产物。
