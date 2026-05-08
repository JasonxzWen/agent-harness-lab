import { useEffect, useRef } from "react";
import { getNodeDetailCopy, getNodeDisplayCopy } from "../../data/copy";
import { themeLabels } from "../../data/knowledgeGraph";
import type {
  KnowledgeNode,
  ProgressStatus,
  SourceReference,
} from "../../types/graph";
import { CommandBlock } from "../ui/CommandBlock";

type DetailDrawerProps = {
  node: KnowledgeNode;
  progressStatus: ProgressStatus;
  onClose: () => void;
  onProgressChange: (status: ProgressStatus) => void;
};

const referenceLabels: Record<SourceReference["kind"], string> = {
  "local-doc": "本仓库文档",
  "lab-source": "实验源码",
  "ccb-source-mapping": "CCB 对照路径",
  "external-link": "外部链接",
};

const progressLabels = {
  "not-started": "未开始",
  learning: "学习中",
  implemented: "已实现",
  reviewed: "已复盘",
} satisfies Record<ProgressStatus, string>;

const progressOptions: ProgressStatus[] = [
  "not-started",
  "learning",
  "implemented",
  "reviewed",
];

export function DetailDrawer({
  node,
  progressStatus,
  onClose,
  onProgressChange,
}: DetailDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const displayCopy = getNodeDisplayCopy(node);
  const detailCopy = getNodeDetailCopy(node);
  const sourceReferences = [...node.labFiles, ...node.ccbMappings];
  const firstSourcePath = sourceReferences[0]?.target ?? "查看本节点源码引用";
  const firstCommand =
    node.demoCommands[0] ??
    "Set-Location D:\\agent-harness-lab\\apps\\knowledge-graph; bun run build";
  const visualSteps = [
    {
      label: "WHY",
      title: "先判断问题",
      text: detailCopy.why,
    },
    {
      label: "WHAT",
      title: "确认机制",
      text: detailCopy.shortExplanation,
    },
    {
      label: "HOW",
      title: "回到仓库",
      text: firstSourcePath,
    },
  ];

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, [node.id]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <aside
      aria-labelledby="detail-drawer-title"
      className="detail-drawer"
      id="node-detail-drawer"
      role="dialog"
    >
      <div className="detail-drawer-header">
        <div>
          <span>{themeLabels[node.theme]}</span>
          <h2 id="detail-drawer-title">{displayCopy.title}</h2>
        </div>
        <button
          aria-label="关闭详情"
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
        >
          关闭
        </button>
      </div>

      <section
        aria-label={`${displayCopy.title} why what how 可视化路径`}
        className="learning-visual"
      >
        <ol>
          {visualSteps.map((step) => (
            <li key={step.label}>
              <span>{step.label}</span>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="progress-editor" aria-label="节点学习进度">
        <div>
          <span>PROGRESS</span>
          <strong>{progressLabels[progressStatus]}</strong>
        </div>
        <div>
          {progressOptions.map((status) => (
            <button
              data-active={progressStatus === status}
              key={status}
              type="button"
              onClick={() => onProgressChange(status)}
            >
              {progressLabels[status]}
            </button>
          ))}
        </div>
      </section>

      <section className="learning-frame" aria-label="why what how 学习卡片">
        <article>
          <span>WHY</span>
          <h3>为什么需要</h3>
          <p>{detailCopy.why}</p>
        </article>
        <article>
          <span>WHAT</span>
          <h3>它是什么</h3>
          <p>{detailCopy.shortExplanation}</p>
        </article>
        <article>
          <span>HOW</span>
          <h3>如何实现</h3>
          <p>
            先看 <code>{firstSourcePath}</code>，再运行下面的 Bun 命令。
          </p>
        </article>
      </section>

      <section className="detail-section">
        <h3>源码路径</h3>
        <ul className="source-list">
          {sourceReferences.map((reference) => (
            <li key={reference.id}>
              <span>{referenceLabels[reference.kind]}</span>
              <code>{reference.target}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className="detail-section">
        <h3>Bun 命令</h3>
        <div className="command-list">
          {[
            firstCommand,
            ...node.demoCommands.filter((command) => command !== firstCommand),
          ].map((command) => (
            <CommandBlock command={command} key={command} />
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h3>常见误解</h3>
        <p>{detailCopy.misconception}</p>
      </section>

      <section className="detail-section compare-section">
        <h3>教学版 vs 生产版</h3>
        <dl>
          <div>
            <dt>教学版</dt>
            <dd>{detailCopy.compare.teachingVersion}</dd>
          </div>
          <div>
            <dt>生产版</dt>
            <dd>{detailCopy.compare.productionVersion}</dd>
          </div>
        </dl>
      </section>
    </aside>
  );
}
