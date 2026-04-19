import {
  OBSIDIAN_INTERNAL_LINK_REGEX,
  OBSIDIAN_TAG_REGEX,
} from "../../common/constants";
import { ObsidianTagsInfo, ObsidianVaultInfo } from "../../common/types";
import { buildBaseMetadata } from "./utils";

export class DocumentIndexer {
  constructor(
    private readonly vault: ObsidianVaultInfo,
    private readonly tags: ObsidianTagsInfo,
    private readonly fileName: string
  ) {}

  recordTag(tag: string): void {
    this.ensureTagRegistry(tag);
    this.tags[tag].linkedDocuments.push(this.fileName);
    this.vault.documents[this.fileName].tags.push(tag);
  }

  recordWikilink(targetName: string): void {
    this.ensureDocument(targetName);
    this.linkDocuments(this.fileName, targetName);
    this.linkDocuments(targetName, this.fileName);
  }

  private ensureTagRegistry(tag: string): void {
    if (!this.tags[tag]) {
      this.tags[tag] = { linkedDocuments: [] };
    }
  }

  private ensureDocument(name: string): void {
    if (!this.vault.documents[name]) {
      this.vault.documents[name] = buildBaseMetadata();
    }
  }

  private linkDocuments(source: string, target: string): void {
    const related = this.vault.documents[source].relatedDocuments;
    if (!related.has(target)) {
      related.add(target);
    }
  }
}

export function scanTags(text: string, indexer: DocumentIndexer): void {
  for (const match of text.matchAll(OBSIDIAN_TAG_REGEX)) {
    const tag = match[0].slice(1);
    indexer.recordTag(tag);
  }
}

export function scanWikilinks(text: string, indexer: DocumentIndexer): void {
  for (const match of text.matchAll(OBSIDIAN_INTERNAL_LINK_REGEX)) {
    const target = match[0].slice(2, -2);
    indexer.recordWikilink(target);
  }
}
