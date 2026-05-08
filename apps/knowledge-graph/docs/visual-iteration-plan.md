# 知识图谱视觉迭代计划

状态：当前站点已完成 M6 增强。

## 当前决定

- 首页直接进入知识图谱，不做 landing page。
- 首屏保留深色机制图和右侧详情区域。
- 颜色、字号、间距继续遵守 `DESIGN.md`。
- 不使用图标库、阴影、渐变和 token 外颜色。
- 页面文案必须短、具体、少抽象词。

## 已完成

- 图谱数据已接入：34 个节点、35 条关系、4 条路径。
- 主画布支持拖拽、缩放、搜索、主题筛选和路径模式。
- 布局支持紧凑和分层切换，不新增 D3 依赖。
- 节点 hover 显示摘要，click 打开详情。
- 详情抽屉包含 why / what / how 可视化卡片、引用面板、Bun 命令和节点测验。
- progress 支持 localStorage、导入和导出。
- Playwright 视觉回归输出桌面和移动端截图。

## 保留检查项

- 桌面和窄屏截图都要检查。
- 标题、按钮和节点文字不能溢出。
- 筛选区、画布和详情不能互相挤压。
- hover / focus / active / click 反馈必须清楚。
- 未实现入口必须显示“暂未实现”；当前页面入口均已实现。

## 验证命令

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run visual:regression
```
