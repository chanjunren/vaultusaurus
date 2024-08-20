const INFO_OPTIONS: Set<string> = new Set([
  "note",
  "seealso",
  "abstract",
  "summary",
  "tldr",
  "info",
  "todo",
  "hint",
  "important",
]);

const TIP_OPTIONS: Set<string> = new Set([
  "tip",
  "success",
  "check",
  "done",
  "question",
  "help",
  "faq",
]);

const NOTE_OPTIONS: Set<string> = new Set(["example", "quote", "cite"]);

const WARNING_OPTIONS: Set<string> = new Set([
  "warning",
  "caution",
  "attention",
]);

const DANGER_OPTIONS: Set<string> = new Set([
  "failure",
  "fail",
  "missing",
  "danger",
  "error",
  "bug",
]);

export const ADMONITION_OPTIONS: Set<string> = new Set([
  ...INFO_OPTIONS,
  ...TIP_OPTIONS,
  ...NOTE_OPTIONS,
  ...WARNING_OPTIONS,
  ...DANGER_OPTIONS,
]);

export function docusaurusAdmonition(node?: string): string {
  if (TIP_OPTIONS.has(node)) {
    return "tip";
  } else if (NOTE_OPTIONS.has(node)) {
    return "note";
  } else if (WARNING_OPTIONS.has(node)) {
    return "warning";
  } else if (DANGER_OPTIONS.has(node)) {
    return "danger";
  }
  return "info";
}

export const OBSIDIAN_ADMONITIONS: Set<string> = new Set(
  Array.from(ADMONITION_OPTIONS).map((option) => `ad-${option}`)
);
