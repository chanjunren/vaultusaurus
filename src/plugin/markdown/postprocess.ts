import { PluginContentLoadedActions } from "@docusaurus/types";
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
  VaultusaurusGlobalData,
} from "../../common/types";

export function buildAndSetGlobalData(
  tags: ObsidianTagsInfo,
  vault: ObsidianVaultInfo,
  { setGlobalData }: PluginContentLoadedActions,
  options: VaultusaurusPluginOptions
) {
  const graphInfoMap: { [filePath: string]: GraphInfo } = {};
  Object.keys(vault.documents).forEach(async (fileName) => {
    const relativePath = vault.documents[fileName].relativeFilePath;
    const graphInfo = buildGraphInfo(
      vault,
      fileName,
      tags,
      relativePath,
      options
    );
    graphInfoMap[relativePath] = graphInfo;
  });

  const globalData: VaultusaurusGlobalData = {
    graphInfo: graphInfoMap,
    graphStyle: options.graphStyle || {},
    globalGraphInfo: buildGlobalGraph(graphInfoMap),
  };

  setGlobalData(globalData);
}

function buildGraphInfo(
  vault: ObsidianVaultInfo,
  fileName: string,
  tags: ObsidianTagsInfo,
  relativePath: string,
  options: VaultusaurusPluginOptions
): GraphInfo {
  const visitedDocuments: Set<string> = new Set([]);
  const visitedTags: Set<string> = new Set([]);
  const adjacencyMap: AdjacencyMap = {};
  const tagsToIgnore = new Set(options.ignoredGraphTags || []);

  const queue: GraphNodeInfo[] = [
    {
      id: `${OBSIDIAN_FILE_ID_PREFIX}__${relativePath}`,
      label: fileName,
      path: relativePath,
      type: "DOCUMENT",
    },
  ];

  const nodes: GraphNodeInfo[] = [];
  const links: GraphNodeLinkInfo[] = [];

  while (queue.length !== 0) {
    const currentNode = queue.shift() as GraphNodeInfo;

    if (visited(currentNode, visitedDocuments, visitedTags)) {
      continue;
    }

    nodes.push(currentNode);
    markAsVisited(currentNode, visitedDocuments, visitedTags);

    if (currentNode.type === "DOCUMENT") {
      handleDocumentTags(
        currentNode,
        queue,
        links,
        vault,
        adjacencyMap,
        tagsToIgnore
      );
      handleInternalLinks(currentNode, queue, links, vault, adjacencyMap);
    } else if (currentNode.type === "TAG") {
      handleTaggedDocuments(
        currentNode,
        queue,
        links,
        vault,
        tags,
        adjacencyMap,
        tagsToIgnore
      );
    }
  }
  return {
    nodes,
    links,
  };
}

function visited(
  currentNode: GraphNodeInfo,
  visitedDocuments: Set<string>,
  visitedTags: Set<string>
): boolean {
  return (
    (currentNode.type === "DOCUMENT" &&
      visitedDocuments.has(currentNode.path as string)) ||
    (currentNode.type === "TAG" && visitedTags.has(currentNode.label))
  );
}

function markAsVisited(
  currentNode: GraphNodeInfo,
  visitedDocuments: Set<string>,
  visitedTags: Set<string>
) {
  if (currentNode.type === "DOCUMENT") {
    if (!currentNode.path) {
      console.log("UNDEFINED PATH", currentNode);
    }
    visitedDocuments.add(currentNode.path as string);
  } else if (currentNode.type === "TAG") {
    visitedTags.add(currentNode.label);
  }
}

function edgeExists(
  source: string,
  target: string,
  adjacencyMap: AdjacencyMap
) {
  return (
    (adjacencyMap[source] && adjacencyMap[source].has(target)) ||
    (adjacencyMap[target] && adjacencyMap[target].has(source))
  );
}

function handleLink(
  source: string,
  target: string,
  adjacencyMap: AdjacencyMap,
  links: GraphNodeLinkInfo[]
) {
  if (edgeExists(source, target, adjacencyMap)) {
    return;
  }
  checkAdjacencyMap(source, target, adjacencyMap);
  adjacencyMap[source].add(target);
  adjacencyMap[target].add(source);

  links.push({
    source,
    target,
  });
}

function checkAdjacencyMap(
  source: string,
  target: string,
  adjacencyMap: AdjacencyMap
) {
  if (!adjacencyMap[source]) {
    adjacencyMap[source] = new Set();
  }
  if (!adjacencyMap[target]) {
    adjacencyMap[target] = new Set();
  }
}

function handleDocumentTags(
  currentNode: GraphNodeInfo,
  queue: GraphNodeInfo[],
  links: GraphNodeLinkInfo[],
  vault: ObsidianVaultInfo,
  adjacencyMap: AdjacencyMap,
  tagsToIgnore: Set<string>
) {
  vault.documents[currentNode.label].tags.forEach((tag) => {
    if (tagsToIgnore.has(tag)) {
      return;
    }

    const tagNodeId = `${OBSIDIAN_TAG_ID_PREFIX}__${tag}`;
    queue.push({
      id: tagNodeId,
      label: tag,
      type: "TAG",
    });

    handleLink(currentNode.id, tagNodeId, adjacencyMap, links);
  });
}

function handleInternalLinks(
  currentNode: GraphNodeInfo,
  queue: GraphNodeInfo[],
  links: GraphNodeLinkInfo[],
  vault: ObsidianVaultInfo,
  adjacencyMap: AdjacencyMap
) {
  vault.documents[currentNode.label].relatedDocuments.forEach((document) => {
    const relatedDocumentId = `${OBSIDIAN_FILE_ID_PREFIX}__${vault.documents[document].relativeFilePath}`;

    queue.push({
      id: relatedDocumentId,
      label: document,
      type: "DOCUMENT",
      path: vault.documents[document].relativeFilePath,
    });

    handleLink(currentNode.id, relatedDocumentId, adjacencyMap, links);
  });
}

function handleTaggedDocuments(
  currentNode: GraphNodeInfo,
  queue: GraphNodeInfo[],
  links: GraphNodeLinkInfo[],
  vault: ObsidianVaultInfo,
  tags: ObsidianTagsInfo,
  adjacencyMap: AdjacencyMap,
  tagsToIgnore: Set<string>
) {
  if (tagsToIgnore.has(currentNode.label)) {
    return;
  }

  tags[currentNode.label].linkedDocuments.forEach((linkedDocument) => {
    const linkedDocumentId = `${OBSIDIAN_FILE_ID_PREFIX}__${vault.documents[linkedDocument].relativeFilePath}`;

    queue.push({
      id: linkedDocumentId,
      label: linkedDocument,
      path: vault.documents[linkedDocument].relativeFilePath,
      type: "DOCUMENT",
    });

    handleLink(currentNode.id, linkedDocumentId, adjacencyMap, links);
  });
}

function buildGlobalGraph(graphInfoMap: GraphInfoMap): GraphInfo {
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
