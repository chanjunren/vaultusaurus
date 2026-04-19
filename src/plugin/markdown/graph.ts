import {
  OBSIDIAN_FILE_ID_PREFIX,
  OBSIDIAN_TAG_ID_PREFIX,
} from "../../common/constants";
import { VaultusaurusPluginOptions } from "../../common/options";
import {
  AdjacencyMap,
  GraphInfo,
  GraphInfoMap,
  GraphNodeInfo,
  GraphNodeLinkInfo,
  ObsidianTagsInfo,
  ObsidianVaultInfo,
} from "../../common/types";

type QueueItem = { node: GraphNodeInfo; distance: number };

class GraphBuilder {
  private readonly visitedDocuments = new Set<string>();
  private readonly visitedTags = new Set<string>();
  private readonly adjacencyMap: AdjacencyMap = {};
  private readonly queue: QueueItem[] = [];
  private readonly nodes: GraphNodeInfo[] = [];
  private readonly links: GraphNodeLinkInfo[] = [];

  constructor(
    seed: GraphNodeInfo,
    private readonly options: VaultusaurusPluginOptions
  ) {
    this.queue.push({ node: seed, distance: 0 });
  }

  hasWork(): boolean {
    return this.queue.length > 0;
  }

  next(): QueueItem {
    return this.queue.shift() as QueueItem;
  }

  alreadyVisited(node: GraphNodeInfo): boolean {
    if (node.type === "DOCUMENT") {
      return this.visitedDocuments.has(node.path as string);
    }
    return this.visitedTags.has(node.label);
  }

  recordNode(node: GraphNodeInfo): void {
    this.nodes.push(node);
    if (node.type === "DOCUMENT") {
      this.visitedDocuments.add(node.path as string);
      return;
    }
    this.visitedTags.add(node.label);
  }

  canExpand(distance: number): boolean {
    const { maxDepth } = this.options;
    return maxDepth === undefined || distance < maxDepth;
  }

  enqueue(node: GraphNodeInfo, distance: number): void {
    this.queue.push({ node, distance });
  }

  isIgnoredTag(tag: string): boolean {
    return this.options.tagsToIgnore?.has(tag) ?? false;
  }

  isIgnoredNote(name: string): boolean {
    return this.options.notesToIgnore?.has(name) ?? false;
  }

  linkNodes(sourceId: string, targetId: string): void {
    if (this.edgeExists(sourceId, targetId)) {
      return;
    }
    this.ensureAdjacency(sourceId);
    this.ensureAdjacency(targetId);
    this.adjacencyMap[sourceId].add(targetId);
    this.adjacencyMap[targetId].add(sourceId);
    this.links.push({ source: sourceId, target: targetId });
  }

  build(): GraphInfo {
    return { nodes: this.nodes, links: this.links };
  }

  private edgeExists(sourceId: string, targetId: string): boolean {
    return (
      (this.adjacencyMap[sourceId]?.has(targetId) ?? false) ||
      (this.adjacencyMap[targetId]?.has(sourceId) ?? false)
    );
  }

  private ensureAdjacency(id: string): void {
    if (!this.adjacencyMap[id]) {
      this.adjacencyMap[id] = new Set();
    }
  }
}

export function buildGraphInfo(
  vault: ObsidianVaultInfo,
  fileName: string,
  tags: ObsidianTagsInfo,
  relativePath: string,
  options: VaultusaurusPluginOptions
): GraphInfo {
  const builder = new GraphBuilder(
    {
      id: `${OBSIDIAN_FILE_ID_PREFIX}__${relativePath}`,
      label: fileName,
      path: relativePath,
      type: "DOCUMENT",
    },
    options
  );

  while (builder.hasWork()) {
    const { node, distance } = builder.next();

    if (builder.alreadyVisited(node)) {
      continue;
    }
    builder.recordNode(node);

    if (!builder.canExpand(distance)) {
      continue;
    }

    expandNode(node, distance + 1, builder, vault, tags);
  }

  return builder.build();
}

function expandNode(
  node: GraphNodeInfo,
  nextDistance: number,
  builder: GraphBuilder,
  vault: ObsidianVaultInfo,
  tags: ObsidianTagsInfo
): void {
  if (node.type === "DOCUMENT") {
    expandDocumentTags(node, nextDistance, builder, vault);
    expandInternalLinks(node, nextDistance, builder, vault);
    return;
  }
  if (node.type === "TAG") {
    expandTaggedDocuments(node, nextDistance, builder, vault, tags);
  }
}

function expandDocumentTags(
  node: GraphNodeInfo,
  nextDistance: number,
  builder: GraphBuilder,
  vault: ObsidianVaultInfo
): void {
  vault.documents[node.label].tags.forEach((tag) => {
    if (builder.isIgnoredTag(tag)) {
      return;
    }
    const tagId = `${OBSIDIAN_TAG_ID_PREFIX}__${tag}`;
    builder.enqueue({ id: tagId, label: tag, type: "TAG" }, nextDistance);
    builder.linkNodes(node.id, tagId);
  });
}

function expandInternalLinks(
  node: GraphNodeInfo,
  nextDistance: number,
  builder: GraphBuilder,
  vault: ObsidianVaultInfo
): void {
  vault.documents[node.label].relatedDocuments.forEach((relatedDoc) => {
    if (builder.isIgnoredNote(relatedDoc)) {
      return;
    }
    const relatedPath = vault.documents[relatedDoc].relativeFilePath;
    const relatedId = `${OBSIDIAN_FILE_ID_PREFIX}__${relatedPath}`;
    builder.enqueue(
      {
        id: relatedId,
        label: relatedDoc,
        path: relatedPath,
        type: "DOCUMENT",
      },
      nextDistance
    );
    builder.linkNodes(node.id, relatedId);
  });
}

function expandTaggedDocuments(
  node: GraphNodeInfo,
  nextDistance: number,
  builder: GraphBuilder,
  vault: ObsidianVaultInfo,
  tags: ObsidianTagsInfo
): void {
  if (builder.isIgnoredTag(node.label)) {
    return;
  }
  tags[node.label].linkedDocuments.forEach((linkedDoc) => {
    if (builder.isIgnoredNote(linkedDoc)) {
      return;
    }
    const linkedPath = vault.documents[linkedDoc].relativeFilePath;
    const linkedId = `${OBSIDIAN_FILE_ID_PREFIX}__${linkedPath}`;
    builder.enqueue(
      {
        id: linkedId,
        label: linkedDoc,
        path: linkedPath,
        type: "DOCUMENT",
      },
      nextDistance
    );
    builder.linkNodes(node.id, linkedId);
  });
}

export function buildGlobalGraph(graphInfoMap: GraphInfoMap): GraphInfo {
  const nodes: GraphNodeInfo[] = [];
  const links: GraphNodeLinkInfo[] = [];

  const processedNodes: Set<string> = new Set();
  const processedLinks: { [key: string]: Set<string> } = {};

  function nodeProcessed(node: GraphNodeInfo): boolean {
    const processed = processedNodes.has(node.id);
    if (!processed) {
      processedNodes.add(node.id);
    }
    return processed;
  }

  function linkProcessed(link: GraphNodeLinkInfo): boolean {
    if (!processedLinks[link.source]) {
      processedLinks[link.source] = new Set();
    }
    const processed = processedLinks[link.source].has(link.target);
    if (!processed) {
      processedLinks[link.source].add(link.target);
    }
    return processed;
  }

  for (const graphInfo of Object.values(graphInfoMap)) {
    for (const node of graphInfo.nodes) {
      if (!nodeProcessed(node)) {
        nodes.push(node);
      }
    }

    for (const link of graphInfo.links) {
      if (!linkProcessed(link)) {
        links.push(link);
      }
    }
  }

  return { nodes, links };
}
