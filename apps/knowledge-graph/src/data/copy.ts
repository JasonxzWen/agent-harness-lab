import type { KnowledgeNode } from "../types/graph";

export type NodeDisplayCopy = {
  title: string;
  summary: string;
};

export type NodeDetailCopy = {
  shortExplanation: string;
  misconception: string;
  compare: {
    teachingVersion: string;
    productionVersion: string;
  };
};

export const nodeDisplayCopy: Record<string, NodeDisplayCopy> = {
  message: {
    title: "消息 Message",
    summary: "保存对话和工具结果，供下一轮模型读取。",
  },
  "system-prompt": {
    title: "系统提示 System Prompt",
    summary: "告诉模型角色、规则、记忆和任务边界。",
  },
  "agent-loop": {
    title: "Agent 循环 Agent Loop",
    summary: "让模型思考、调用工具、再读取结果。",
  },
  "model-adapter": {
    title: "模型适配器 Model Adapter",
    summary: "让 loop 不绑死在某个模型 provider 上。",
  },
  "tool-use": {
    title: "工具调用 Tool Use",
    summary: "模型请求执行工具，harness 负责校验和执行。",
  },
  "tool-result-write-back": {
    title: "工具结果写回 Tool Result Write-back",
    summary: "把工具输出写回消息，让模型继续判断。",
  },
  "tool-registry": {
    title: "工具注册表 Tool Registry",
    summary: "记录工具名称、参数、说明和执行函数。",
  },
  "tool-schema": {
    title: "工具参数 Schema",
    summary: "检查模型给出的 JSON 参数是否可用。",
  },
  "tool-context": {
    title: "工具上下文 Tool Context",
    summary: "告诉模型有哪些工具，以及怎么调用。",
  },
  "read-file": {
    title: "读取文件 read_file",
    summary: "在允许的目录里读取项目文件。",
  },
  "write-file-list-files": {
    title: "写入 / 列文件",
    summary: "在允许的目录里写文件、列文件。",
  },
  "run-shell": {
    title: "执行命令 run_shell",
    summary: "执行安全命令，高风险命令先拦住。",
  },
  "todo-write": {
    title: "计划写入 TodoWrite",
    summary: "把多步骤任务写成明确的待办列表。",
  },
  "todo-read": {
    title: "计划读取 TodoRead",
    summary: "读取当前待办，方便继续或总结任务。",
  },
  "task-state": {
    title: "任务状态 Task State",
    summary: "记录任务进度、恢复点和负责人。",
  },
  "project-rules": {
    title: "项目规则 Project Rules",
    summary: "把仓库规则放进模型上下文。",
  },
  memory: {
    title: "记忆 Memory",
    summary: "保存长期偏好和项目事实。",
  },
  skills: {
    title: "技能 Skills",
    summary: "按任务加载专门说明，不一次性全塞进 prompt。",
  },
  compact: {
    title: "压缩 Compact",
    summary: "对话太长时，保留关键状态继续做。",
  },
  "context-budget": {
    title: "上下文预算 Context Budget",
    summary: "选择哪些历史、规则和记忆进入当前请求。",
  },
  permissions: {
    title: "权限 Permissions",
    summary: "对工具动作做允许、询问或拒绝。",
  },
  "policy-presets": {
    title: "权限预设 Policy Presets",
    summary: "把常用权限组合成几个清楚模式。",
  },
  "approval-request": {
    title: "审批请求 Approval Request",
    summary: "高风险动作先暂停，等用户确认。",
  },
  "approval-store": {
    title: "审批记录 Approval Store",
    summary: "保存已批准动作，减少重复确认。",
  },
  "path-guard": {
    title: "路径守卫 Path Guard",
    summary: "限制文件工具只能访问允许目录。",
  },
  "bun-runtime": {
    title: "Bun 运行时 Bun Runtime",
    summary: "运行 TypeScript 实验和前端构建。",
  },
  "vite-react-shell": {
    title: "前端壳 Vite React Shell",
    summary: "承载这个公开展示站点。",
  },
  "demo-commands": {
    title: "演示命令 Demo Commands",
    summary: "每个机制都配一条可运行命令。",
  },
  subagents: {
    title: "子代理 Subagents",
    summary: "把子任务放进独立上下文。",
  },
  "background-tasks": {
    title: "后台任务 Background Tasks",
    summary: "让长任务在后台跑，完成后写回结果。",
  },
  "worktree-isolation": {
    title: "工作树隔离 Worktree Isolation",
    summary: "避免多个 agent 改同一份文件。",
  },
  mcp: {
    title: "模型上下文协议 MCP",
    summary: "把外部工具接入同一个工具流程。",
  },
  "plugin-loader": {
    title: "插件加载 Plugin Loader",
    summary: "读取插件配置，并注册新工具。",
  },
  "memory-hygiene": {
    title: "记忆治理 Memory Hygiene",
    summary: "定期清理 memory，减少无用信息。",
  },
};

export const nodeDetailCopy: Record<string, NodeDetailCopy> = {
  message: {
    shortExplanation: "消息保存用户输入、模型输出和工具结果，是下一轮推理的输入。",
    misconception: "它不是聊天气泡，而是 loop 每一步都要读取的状态。",
    compare: {
      teachingVersion: "用 union type 表示 user、assistant、tool_use、tool_result。",
      productionVersion: "还要处理流式输出、重试、压缩、持久化和 UI 渲染。",
    },
  },
  "system-prompt": {
    shortExplanation: "系统提示把角色、项目规则、记忆和任务边界放进请求。",
    misconception: "它不是一段固定模板，项目上下文变化时也会变化。",
    compare: {
      teachingVersion: "从项目文件和 memory 组装一段可读 prompt。",
      productionVersion: "按优先级合并多层指令，并受 token 和安全规则限制。",
    },
  },
  "agent-loop": {
    shortExplanation: "Agent Loop 负责观察、决策、调用工具，再写回结果。",
    misconception: "loop 不是模型本身，而是包住模型和工具的控制流程。",
    compare: {
      teachingVersion: "fake model 发起一次工具调用，写回结果后结束。",
      productionVersion: "要处理流式响应、取消、重试、权限、压缩和后台事件。",
    },
  },
  "model-adapter": {
    shortExplanation: "模型适配器让 loop 依赖统一接口，而不是绑定单个 provider。",
    misconception: "适配器只有保护 loop 合约时才有价值，不是为了多包一层。",
    compare: {
      teachingVersion: "定义 Model interface，再提供 fake 和 scripted model。",
      productionVersion: "还要处理模型路由、元数据、流式协议、重试和用量记录。",
    },
  },
  "tool-use": {
    shortExplanation: "工具调用是模型发出的结构化请求，harness 负责校验和执行。",
    misconception: "它不是任意执行代码，而是受 schema 和权限限制的合约。",
    compare: {
      teachingVersion: "按工具名和 input object 路由到本地 registry。",
      productionVersion: "还要接入审批、UI 状态、流式结果、取消和安全记录。",
    },
  },
  "tool-result-write-back": {
    shortExplanation: "工具结果写回把执行结果放回消息，让模型继续判断。",
    misconception: "只打印工具输出不够，模型必须在下一轮收到这个观察。",
    compare: {
      teachingVersion: "把成功结果或结构化错误追加到 messages。",
      productionVersion: "还要配合 UI、重试、安全停止和 context compaction。",
    },
  },
  "tool-registry": {
    shortExplanation: "工具注册表记录工具名、说明、参数和执行函数。",
    misconception: "它不只是一个 map，还承载验证、描述和执行策略。",
    compare: {
      teachingVersion: "用小型 dispatch map 注册 echo 和文件工具。",
      productionVersion: "覆盖内置工具、插件、权限、UI 元数据和动态可用状态。",
    },
  },
  "tool-schema": {
    shortExplanation: "工具 schema 在运行时检查模型给出的 JSON 参数。",
    misconception: "TypeScript 类型不会自动校验模型生成的 JSON。",
    compare: {
      teachingVersion: "手写 validator，返回清楚的 schema 错误。",
      productionVersion: "把模型 schema、运行时校验、产品交互和权限信息连起来。",
    },
  },
  "tool-context": {
    shortExplanation: "工具上下文告诉模型有哪些工具、参数是什么、何时使用。",
    misconception: "工具说明不是装饰文档，它会直接影响模型行为。",
    compare: {
      teachingVersion: "把本地 registry 格式化成一段短 prompt。",
      productionVersion: "要在大量工具、上下文预算和动态可用状态之间取舍。",
    },
  },
  "read-file": {
    shortExplanation: "read_file 让 agent 在允许目录内读取项目文件。",
    misconception: "读文件也需要路径规则，不是访问整台机器。",
    compare: {
      teachingVersion: "只通过 workspace-bounded helper 读取文件。",
      productionVersion: "还要处理二进制、预览、路径规范化和 UI 报告。",
    },
  },
  "write-file-list-files": {
    shortExplanation: "write_file 和 list_files 证明 harness 能有边界地改本地状态。",
    misconception: "没有 workspace 边界的写工具不是能力，是风险。",
    compare: {
      teachingVersion: "只在 labs/ts-agent/workspace 里写入和列文件。",
      productionVersion: "还要配合 diff、审批、撤销预期和 ignore 规则。",
    },
  },
  "run-shell": {
    shortExplanation: "run_shell 执行命令，但必须先判断命令风险。",
    misconception: "shell 权限不是一个开关，不同命令有不同影响范围。",
    compare: {
      teachingVersion: "只允许一组安全 demo 命令。",
      productionVersion: "要分类命令、请求审批、流式输出，并遵守 sandbox 策略。",
    },
  },
  "todo-write": {
    shortExplanation: "TodoWrite 把多步骤意图写成结构化计划状态。",
    misconception: "它不是 UI 清单，而是 agent 可观察的计划协议。",
    compare: {
      teachingVersion: "保存小型 todo list，并保证只有一个 in-progress。",
      productionVersion: "要处理任务状态、UI 展示、中断和恢复。",
    },
  },
  "todo-read": {
    shortExplanation: "TodoRead 读取当前计划，让 agent 能继续、恢复或总结。",
    misconception: "计划状态不能只写一次，后续步骤也要能读到。",
    compare: {
      teachingVersion: "读取 workspace/todos.json 并返回结构化 todo。",
      productionVersion: "要和运行状态、UI 进度和恢复逻辑一起工作。",
    },
  },
  "task-state": {
    shortExplanation: "任务状态记录比 todo 更长的工作生命周期。",
    misconception: "todo 和 task 会重叠，但 task 需要生命周期和归属。",
    compare: {
      teachingVersion: "展示 loop 停止原因和计划不变量。",
      productionVersion: "要协调持久任务、多 agent、后台执行和用户可见进度。",
    },
  },
  "project-rules": {
    shortExplanation: "项目规则把仓库约定放进上下文，约束 agent 行为。",
    misconception: "规则文件不是事实仓库，太杂会干扰当前任务。",
    compare: {
      teachingVersion: "读取 PROJECT.md 并写入简短 prompt section。",
      productionVersion: "要合并多层指令，并处理优先级、可信度和作用范围。",
    },
  },
  memory: {
    shortExplanation: "Memory 保存长期偏好和项目事实，按需放进后续请求。",
    misconception: "memory 必须有范围和维护，越多不代表越好。",
    compare: {
      teachingVersion: "加载一个小型 memory.md 文件。",
      productionVersion: "要在来源、相关性、新鲜度和隐私之间做筛选。",
    },
  },
  skills: {
    shortExplanation: "Skills 是按任务加载的专门说明，不该启动时全塞进 prompt。",
    misconception: "加载所有 skill 会浪费上下文，并让行为边界变模糊。",
    compare: {
      teachingVersion: "先作为计划中的上下文机制记录。",
      productionVersion: "通过元数据发现、选择和注入，保持 prompt 只含当前需要内容。",
    },
  },
  compact: {
    shortExplanation: "Compact 在上下文变长时保存关键状态，让任务继续。",
    misconception: "它不是聊天摘要，而是下一段工作可接上的交接材料。",
    compare: {
      teachingVersion: "生成一个简单的上下文摘要 demo。",
      productionVersion: "要保留决策、工具观察、安全状态和未完成任务。",
    },
  },
  "context-budget": {
    shortExplanation: "上下文预算迫使 harness 选择当前最该进入请求的内容。",
    misconception: "更多上下文不一定更好，相关内容比数量重要。",
    compare: {
      teachingVersion: "展示小型选择和摘要边界。",
      productionVersion: "要结合 token 计算、相关性选择和压缩触发条件。",
    },
  },
  permissions: {
    shortExplanation: "权限层决定工具动作允许、拒绝，还是需要用户审批。",
    misconception: "权限不是让模型自觉遵守，而是运行时强制执行。",
    compare: {
      teachingVersion: "把文件和 shell 动作分成 allow、ask、deny。",
      productionVersion: "要结合 sandbox、审批 UI、命令分析和持久决策。",
    },
  },
  "policy-presets": {
    shortExplanation: "权限预设把常用安全规则组合成清楚的运行模式。",
    misconception: "preset 不是随手拼布尔值，而是一组一致的操作边界。",
    compare: {
      teachingVersion: "定义 safe、workspace-write-approved 和 shell-approved。",
      productionVersion: "要接入产品设置、sandbox 行为和 prompt 可见约束。",
    },
  },
  "approval-request": {
    shortExplanation: "审批请求在高风险动作前暂停，并让用户做明确决定。",
    misconception: "审批最安全的形态是具体、窄范围、可理解。",
    compare: {
      teachingVersion: "对风险动作返回结构化 ask result。",
      productionVersion: "要连接中断、UI 审查、命令详情和持久权限。",
    },
  },
  "approval-store": {
    shortExplanation: "审批记录保存用户批准过的边界，减少重复确认。",
    misconception: "持久审批必须有范围，过宽就接近默认全放行。",
    compare: {
      teachingVersion: "为 demo workflow 保存简单 approval record。",
      productionVersion: "要按命令、workspace、用户意图和安全策略设定范围。",
    },
  },
  "path-guard": {
    shortExplanation: "路径守卫把文件访问限制在预期 workspace 内。",
    misconception: "只检查字符串 `..` 不够，必须解析绝对路径后比较。",
    compare: {
      teachingVersion: "拒绝 lab workspace 外的路径。",
      productionVersion: "要处理 symlink、平台差异、ignore 规则和写入范围。",
    },
  },
  "bun-runtime": {
    shortExplanation: "Bun 是本仓库运行 TypeScript 实验和前端脚本的默认工具。",
    misconception: "这个 repo 不能按 Node-only 项目处理。",
    compare: {
      teachingVersion: "直接运行 .ts 文件和 package scripts。",
      productionVersion: "真实系统可能支持多 runtime，但本地学习 harness 先用 Bun。",
    },
  },
  "vite-react-shell": {
    shortExplanation: "Vite React Shell 是这个公开作品的前端入口。",
    misconception: "展示应用放在 apps/knowledge-graph，不放进 lab 实验目录。",
    compare: {
      teachingVersion: "用静态 Vite app 渲染 typed graph data。",
      productionVersion: "还要有路由、搜索、持久化、可访问性和部署检查。",
    },
  },
  "demo-commands": {
    shortExplanation: "演示命令把每个机制连接到可运行的 lab 行为。",
    misconception: "学习节点如果没有命令，就很难证明机制真的跑通。",
    compare: {
      teachingVersion: "每个节点给一条聚焦 Bun 命令。",
      productionVersion: "验证会扩展到自动测试、CI 检查和视觉回归。",
    },
  },
  subagents: {
    shortExplanation: "Subagents 把有边界的子任务交给隔离消息上下文。",
    misconception: "subagent 不是自动变强，关键是边界和返回摘要。",
    compare: {
      teachingVersion: "计划实现一个独立 message loop。",
      productionVersion: "要管理任务 prompt、工具权限、上下文隔离、进度和取消。",
    },
  },
  "background-tasks": {
    shortExplanation: "后台任务记录长任务进度，不阻塞主对话 loop。",
    misconception: "后台任务不是第二个主 loop，而是受管理的执行通道。",
    compare: {
      teachingVersion: "计划用 JSONL event log 和 task runner 表达。",
      productionVersion: "要处理生命周期、观察写回、进程控制和用户可见状态。",
    },
  },
  "worktree-isolation": {
    shortExplanation: "工作树隔离避免多个 agent 同时改同一批文件。",
    misconception: "并行 agent 先需要隔离和协议，再谈更多自主动作。",
    compare: {
      teachingVersion: "计划实现简化 workspace manager。",
      productionVersion: "要协调分支、文件归属、合并、清理和任务路由。",
    },
  },
  mcp: {
    shortExplanation: "MCP 让外部能力以工具形式进入同一条 harness 流程。",
    misconception: "MCP 不替代 Agent Loop，它只是把能力接入 loop。",
    compare: {
      teachingVersion: "计划做 lite manifest 和外部工具注册。",
      productionVersion: "要处理 server 发现、传输、认证、schema、错误和审批。",
    },
  },
  "plugin-loader": {
    shortExplanation: "插件加载器读取插件元数据，并把能力注册成工具。",
    misconception: "插件仍然需要 schema、权限、执行和结果写回规则。",
    compare: {
      teachingVersion: "计划做 manifest-driven registration 实验。",
      productionVersion: "要处理插件解析、版本、信任、配置和运行错误。",
    },
  },
  "memory-hygiene": {
    shortExplanation: "记忆治理定期清理、限定和更新 memory。",
    misconception: "memory 会变旧；没有维护路径，就会污染上下文。",
    compare: {
      teachingVersion: "用小型 memory 文件和 summary demo 表达。",
      productionVersion: "要处理时效、相关性、用户偏好、隐私和压缩。",
    },
  },
};

export function getNodeDisplayCopy(node: KnowledgeNode): NodeDisplayCopy {
  return nodeDisplayCopy[node.id] ?? { title: node.title, summary: node.summary };
}

export function getNodeDetailCopy(node: KnowledgeNode): NodeDetailCopy {
  return (
    nodeDetailCopy[node.id] ?? {
      shortExplanation: node.summary,
      misconception: node.misconceptions[0] ?? "先看源码路径，再用命令验证。",
      compare: node.compare,
    }
  );
}
