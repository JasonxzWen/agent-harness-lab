export type Theme =
  | "foundation"
  | "tool-system"
  | "planning"
  | "context"
  | "safety"
  | "runtime"
  | "multi-agent"
  | "extension"
  | "dream";

export type LearningPathId =
  | "beginner"
  | "context"
  | "safety"
  | "advanced";

export type ProgressStatus =
  | "not-started"
  | "learning"
  | "implemented"
  | "reviewed";

export type ReferenceKind =
  | "local-doc"
  | "lab-source"
  | "ccb-source-mapping"
  | "external-link";

export type SourceReference = {
  id: string;
  kind: ReferenceKind;
  title: string;
  target: string;
  note?: string;
};

export type KnowledgeNode = {
  id: string;
  title: string;
  theme: Theme;
  layer: number;
  tags: string[];
  summary: string;
  prerequisites: string[];
  recommendedNext: string[];
  labFiles: SourceReference[];
  ccbMappings: SourceReference[];
  externalLinks: SourceReference[];
  misconceptions: string[];
  demoCommands: string[];
  compare: {
    teachingVersion: string;
    productionVersion: string;
  };
};

export type KnowledgeEdge = {
  id: string;
  source: string;
  target: string;
  relation: "prerequisite" | "extends" | "contrasts" | "runtime-flow";
};

export type LearningPath = {
  id: LearningPathId;
  title: string;
  summary: string;
  nodeIds: string[];
};
