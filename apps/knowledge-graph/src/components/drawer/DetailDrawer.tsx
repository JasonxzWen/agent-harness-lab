import { useEffect, useMemo, useRef, useState } from "react";
import { getNodeDetailCopy, getNodeDisplayCopy } from "../../data/copy";
import { knowledgeNodes, themeLabels } from "../../data/knowledgeGraph";
import type {
  KnowledgeNode,
  ProgressStatus,
  SourceReference,
} from "../../types/graph";
import { CommandBlock } from "../ui/CommandBlock";

type DetailDrawerProps = {
  interactionState: "selected" | "parked";
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

type DetailGroupId =
  | "quiz"
  | "references"
  | "commands"
  | "misconception"
  | "compare";

function getReferenceBoundary(reference: SourceReference): string {
  if (reference.codePreview) {
    return "hover / focus 显示本仓库短摘录。";
  }

  if (reference.kind === "ccb-source-mapping") {
    return "只显示对照路径，不展开 CCB 正文。";
  }

  if (reference.kind === "external-link") {
    return "只显示外部地址，不复制网页正文。";
  }

  return "只显示本仓库路径，不展开文档正文。";
}

type QuizResult = "idle" | "correct" | "incorrect";

type QuizOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export function DetailDrawer({
  interactionState,
  node,
  progressStatus,
  onClose,
  onProgressChange,
}: DetailDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [copiedReferenceId, setCopiedReferenceId] = useState<string | null>(null);
  const [selectedQuizOptionId, setSelectedQuizOptionId] = useState<string | null>(
    null,
  );
  const [quizResult, setQuizResult] = useState<QuizResult>("idle");
  const [activeDetailGroupId, setActiveDetailGroupId] =
    useState<DetailGroupId | null>(null);
  const displayCopy = getNodeDisplayCopy(node);
  const detailCopy = getNodeDetailCopy(node);
  const sourceReferences = [
    ...node.labFiles,
    ...node.ccbMappings,
    ...node.externalLinks,
  ];
  const firstSourcePath = sourceReferences[0]?.target ?? "查看本节点源码引用";
  const primarySourceReference =
    sourceReferences.find((reference) => reference.codePreview) ??
    sourceReferences[0] ??
    null;
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
  const quizOptions = useMemo<QuizOption[]>(() => {
    const otherNodes = knowledgeNodes
      .filter((candidate) => candidate.id !== node.id)
      .sort((a, b) => a.id.localeCompare(b.id));
    const firstIndex = node.id.length % otherNodes.length;
    const distractors = [
      otherNodes[firstIndex],
      otherNodes[(firstIndex + 7) % otherNodes.length],
    ].filter((candidate): candidate is KnowledgeNode => Boolean(candidate));
    const options = [
      {
        id: node.id,
        text: detailCopy.why,
        isCorrect: true,
      },
      ...distractors.map((candidate) => ({
        id: candidate.id,
        text: getNodeDetailCopy(candidate).why,
        isCorrect: false,
      })),
    ];
    const offset = node.id.charCodeAt(0) % options.length;

    return [...options.slice(offset), ...options.slice(0, offset)];
  }, [detailCopy.why, node.id]);
  const referenceGroups = useMemo(
    () =>
      Object.entries(referenceLabels)
        .map(([kind, label]) => ({
          kind: kind as SourceReference["kind"],
          label,
          references: sourceReferences.filter((reference) => reference.kind === kind),
        }))
        .filter((group) => group.references.length > 0),
    [sourceReferences],
  );

  function copyReferenceTarget(reference: SourceReference) {
    void navigator.clipboard
      ?.writeText(reference.target)
      .catch(() => undefined);
    setCopiedReferenceId(reference.id);
  }

  function chooseQuizOption(option: QuizOption) {
    setSelectedQuizOptionId(option.id);

    if (option.isCorrect) {
      setQuizResult("correct");
      onProgressChange("reviewed");
      return;
    }

    setQuizResult("incorrect");
  }

  function toggleDetailGroup(groupId: DetailGroupId) {
    setActiveDetailGroupId((current) => (current === groupId ? null : groupId));
  }

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, [node.id]);

  useEffect(() => {
    setCopiedReferenceId(null);
    setSelectedQuizOptionId(null);
    setQuizResult("idle");
    setActiveDetailGroupId(null);
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
      data-interaction-state={interactionState}
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

      {primarySourceReference ? (
        <section className="primary-source-card" aria-label="主要源码入口">
          <span>CODE</span>
          <strong>{primarySourceReference.title}</strong>
          <code>{primarySourceReference.target}</code>
          <p>{getReferenceBoundary(primarySourceReference)}</p>
          {primarySourceReference.codePreview ? (
            <pre>
              <code>
                {primarySourceReference.codePreview.lines.join("\n")}
              </code>
            </pre>
          ) : null}
        </section>
      ) : null}

      <section className="detail-fold-stack" aria-label="更多详情分组">
        <article
          className="detail-fold-card"
          data-open={activeDetailGroupId === "quiz"}
        >
          <button
            aria-controls="detail-fold-quiz"
            aria-expanded={activeDetailGroupId === "quiz"}
            className="detail-fold-marker"
            type="button"
            onClick={() => toggleDetailGroup("quiz")}
          >
            <span>QUIZ</span>
            <strong>测验</strong>
            <small>选出这个机制的 why。</small>
          </button>
          <div className="detail-fold-body" id="detail-fold-quiz">
            <section className="detail-section quiz-panel" aria-label="节点测验">
              <div>
                <span>QUIZ</span>
                <h3>先解决什么问题？</h3>
                <p>答对后，本节点会标记为已复盘。</p>
              </div>
              <div className="quiz-options">
                {quizOptions.map((option) => {
                  const isSelected = selectedQuizOptionId === option.id;
                  const state =
                    isSelected && option.isCorrect
                      ? "correct"
                      : isSelected
                        ? "incorrect"
                        : "idle";

                  return (
                    <button
                      data-state={state}
                      key={option.id}
                      type="button"
                      onClick={() => chooseQuizOption(option)}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
              <p className="quiz-feedback" role="status">
                {quizResult === "correct"
                  ? "答对了，已标记为已复盘。"
                  : quizResult === "incorrect"
                    ? "不对，回到 WHY 再看一遍。"
                    : "未作答。"}
              </p>
            </section>
          </div>
        </article>

        <article
          className="detail-fold-card"
          data-open={activeDetailGroupId === "references"}
        >
          <button
            aria-controls="detail-fold-references"
            aria-expanded={activeDetailGroupId === "references"}
            className="detail-fold-marker"
            type="button"
            onClick={() => toggleDetailGroup("references")}
          >
            <span>SOURCE</span>
            <strong>引用和源码</strong>
            <small>{sourceReferences.length} 条引用，lab 可预览。</small>
          </button>
          <div className="detail-fold-body" id="detail-fold-references">
            <section className="detail-section reference-panel" aria-label="引用面板">
              <h3>引用面板</h3>
              <div>
                {referenceGroups.map((group) => (
                  <section key={group.kind} aria-label={group.label}>
                    <h4>{group.label}</h4>
                    <ul>
                      {group.references.map((reference) => (
                        <li
                          className={
                            reference.codePreview ? "has-code-preview" : undefined
                          }
                          key={reference.id}
                          tabIndex={reference.codePreview ? 0 : undefined}
                        >
                          <div>
                            <span>{reference.title}</span>
                            <strong>{referenceLabels[reference.kind]}</strong>
                          </div>
                          <code>{reference.target}</code>
                          {reference.note ? <p>{reference.note}</p> : null}
                          <p className="source-boundary-note">
                            {getReferenceBoundary(reference)}
                          </p>
                          {reference.codePreview ? (
                            <aside
                              aria-label={`${reference.title} 源码短预览`}
                              className="source-code-preview"
                            >
                              <span>CODE PREVIEW</span>
                              <strong>
                                {reference.target}:{reference.codePreview.startLine}
                              </strong>
                              <pre>
                                <code>
                                  {reference.codePreview.lines.join("\n")}
                                </code>
                              </pre>
                            </aside>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => copyReferenceTarget(reference)}
                          >
                            {copiedReferenceId === reference.id ? "已复制" : "复制路径"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </section>
          </div>
        </article>

        <article
          className="detail-fold-card"
          data-open={activeDetailGroupId === "commands"}
        >
          <button
            aria-controls="detail-fold-commands"
            aria-expanded={activeDetailGroupId === "commands"}
            className="detail-fold-marker"
            type="button"
            onClick={() => toggleDetailGroup("commands")}
          >
            <span>RUN</span>
            <strong>Bun 命令</strong>
            <small>{node.demoCommands.length} 条可运行命令。</small>
          </button>
          <div className="detail-fold-body" id="detail-fold-commands">
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
          </div>
        </article>

        <article
          className="detail-fold-card"
          data-open={activeDetailGroupId === "misconception"}
        >
          <button
            aria-controls="detail-fold-misconception"
            aria-expanded={activeDetailGroupId === "misconception"}
            className="detail-fold-marker"
            type="button"
            onClick={() => toggleDetailGroup("misconception")}
          >
            <span>CHECK</span>
            <strong>常见误解</strong>
            <small>先排除一个错误理解。</small>
          </button>
          <div className="detail-fold-body" id="detail-fold-misconception">
            <section className="detail-section">
              <h3>常见误解</h3>
              <p>{detailCopy.misconception}</p>
            </section>
          </div>
        </article>

        <article
          className="detail-fold-card"
          data-open={activeDetailGroupId === "compare"}
        >
          <button
            aria-controls="detail-fold-compare"
            aria-expanded={activeDetailGroupId === "compare"}
            className="detail-fold-marker"
            type="button"
            onClick={() => toggleDetailGroup("compare")}
          >
            <span>COMPARE</span>
            <strong>教学版 vs 生产版</strong>
            <small>看本仓库和生产系统差异。</small>
          </button>
          <div className="detail-fold-body" id="detail-fold-compare">
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
          </div>
        </article>
      </section>
    </aside>
  );
}
