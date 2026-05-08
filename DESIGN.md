# DESIGN.md — Anthropic-style Editorial Minimalism

> 本文档是项目视觉系统的唯一事实源（Single Source of Truth）。
> Codex 和所有协作者必须严格遵守。冲突时以本文档为准。

---

## 1. 风格定位

严格对齐 Anthropic 官网的极简编辑风格。

**关键词（必须命中）**：editorial / restrained / monochrome / asymmetric / publication-like

**禁止词汇（一旦出现立即纠偏）**：handmade / wobbly / warm / playful / sketchy / doodle / textured

整体气质类比：当代研究论文封面 + 出版物 colophon，而非插画或品牌运营页。

---

## 2. Design Tokens

### 2.1 颜色（仅 4 个，绝不扩展）

| Token | 值 | 用途 |
|---|---|---|
| `--color-bg` | `#F0EEE6` | 页面背景米白，全站唯一浅色背景 |
| `--color-ink` | `#141413` | 所有文字、描边、按钮主色 |
| `--color-dark` | `#1E1D1A` | 深色块（Hero 主视觉、Terminal、Featured 卡片） |
| `--color-mute` | `#6B6862` | 次要文字、mono 标签、辅助信息 |

> 任何不在此表内的颜色一律拒绝。出现 `#FF6B35`、`rgb(...)` 硬编码 = 违规。

### 2.2 字体

| Token | 值 | 用途 |
|---|---|---|
| `--font-display` | `"Inter Tight", "Söhne", sans-serif` (Weight 800) | 大标题、Hero |
| `--font-serif` | `"Fraunces", "Tiempos", Georgia, serif` | 长文正文、引言 |
| `--font-mono` | `"JetBrains Mono", "IBM Plex Mono", monospace` | 标签、代码、breadcrumb |
| `--font-zh-display` | `"Source Han Sans", "思源黑体", sans-serif` (Heavy) | 中文大标题 |
| `--font-zh-serif` | `"Source Han Serif", "思源宋体", serif` | 中文正文 |

### 2.3 字号刻度（严格使用，禁止非刻度值）

```
12 / 13 / 14 / 16 / 18 / 24 / 32 / 48 / 64 / 80 / 96
```

> 出现 22px、58px 等非刻度值 = 违规。

### 2.4 间距刻度

```
4 / 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 192
```

### 2.5 圆角

| Token | 值 | 用途 |
|---|---|---|
| `--radius-card` | `12px` | 普通卡片 |
| `--radius-block` | `16px` | Hero 深色块 |
| 其余 | `0` | 默认方角 |

### 2.6 描边

仅 `1px solid var(--color-ink)`。禁止其他粗细。

---

## 3. 实现硬性规则

### 3.1 颜色与背景

1. 全站背景统一 `#F0EEE6`，禁止纹理图、禁止任何渐变。
2. 深色块（`#1E1D1A`）仅允许出现在以下场景：
   - 首页 Hero 主视觉容器
   - Playground 的 Terminal 输出区
   - 列表中的 "featured" / "current" 状态卡片
3. Footer、Sidebar、Modal 背景一律保持 `#F0EEE6`，不要擅自加深色。

### 3.2 几何装饰

抽象几何装饰（Voronoi、点阵、节点图、等高线等）**仅作为深色块内部的背景图**，
不允许散落在浅色区域。

资源位置：`/public/patterns/*.svg`

### 3.3 强调样式

链接和强调统一用**下划线**，禁止用颜色变化：

```css
a {
  color: var(--color-ink);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}
a:hover {
  text-decoration-thickness: 3px;
}
```

### 3.4 严禁清单

| 项目 | 禁止理由 |
|---|---|
| 任何 `box-shadow` | 破坏扁平感 |
| 任何 `linear-gradient` / `radial-gradient` | 破坏纯色基调 |
| 手绘抖动滤镜（SVG `feTurbulence`） | 旧版手绘风遗留，已弃用 |
| 任何图标库（lucide / heroicons / font-awesome） | 全站仅用文字 + 极少数极简箭头 `→` |
| 非 token 颜色 | 见 2.1 |
| 圆形头像、表情符号 | 与气质不符 |

### 3.5 布局原则

- 最大内容宽度 `1200px`
- 左右最小 padding `96px`（移动端 `24px`）
- **非对称布局**：大标题区占 60%、正文区占 25%、留白 15%
- 移动端断点：`md = 768px`，以下切单栏，padding 同步缩到 `24px`

### 3.6 交互状态

| 元素 | Hover | Active |
|---|---|---|
| Link | 下划线加粗 2px → 3px | 同左 |
| Button (primary) | 背景 `#1E1D1A` → `#000000` | 同左 |
| Button (ghost) | 描边 1px → 2px | 同左 |
| Card | 描边 1px → 2px | 同左 |

> 严禁使用 `transform: scale()`、`box-shadow` 实现 hover。

---

## 4. 视觉资产位置

```
/design/
  └── references/        # GPT Image 生成的页面参考图(仅对齐视觉,不要切图)
      ├── hero.png
      ├── courses.png
      ├── reading.png
      ├── playground.png
      └── about.png

/public/
  └── patterns/          # 深色块内的几何装饰素材(SVG 优先)
      ├── voronoi.svg
      ├── halftone.svg
      ├── graph.svg
      ├── contour.svg
      ├── particle.svg
      └── lowpoly.svg
```

---

## 5. 组件清单与改造优先级

按以下顺序推进，前者完成并通过 review 后才能进入下一个：

| 序号 | 组件 | 变体数量 | 备注 |
|---|---|---|---|
| 1 | `Typography` | 6 (H1/H2/H3/body/caption/code) | 先定基础,后续组件复用 |
| 2 | `Button` | 2 (primary 黑底白字 / ghost 描边) | 不要做 secondary、tertiary |
| 3 | `Link` | 1 (统一下划线) | 全站通用 |
| 4 | `Card` | 2 (default 描边 / featured 深色填充) | 不要做更多变体 |
| 5 | `Navigation` | 顶部 nav + breadcrumb | 极简文字链接 |
| 6 | `DarkBlock` | 1 | Hero 主视觉容器,内嵌 patterns |
| 7 | `CodeBlock` | 1 | 浅色描边 + mono 字体 |
| 8 | `Terminal` | 1 | 深色块 + 白色 mono 字体 |

> 任何不在此清单内的组件，需先和我确认后再新建。

---

## 6. 文案规范

- 长文优先用 serif 字体
- 数字、code 标识符、breadcrumb 用 mono
- 标题段允许大胆使用下划线强调关键词（每个标题不超过 2 处下划线）
- 中英文混排时，中英文之间留半角空格

---

## 7. 验收 Checklist（每次 PR 自查）

- [ ] 没有出现 token 外的颜色值
- [ ] 没有 `box-shadow` / `gradient`
- [ ] 字号全部命中刻度
- [ ] 间距全部命中刻度
- [ ] 链接强调用的是下划线而非颜色
- [ ] 深色块没有出现在规定场景之外
- [ ] 没有引入图标库
- [ ] 移动端断点正常切换
- [ ] 视觉与 `/design/references/` 对应参考图气质一致

---

**版本**：v1.0 · 最后更新：2026-05-07
