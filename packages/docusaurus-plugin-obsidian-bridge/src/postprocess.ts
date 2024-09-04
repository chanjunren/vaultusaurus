import { PluginContentLoadedActions } from "@docusaurus/types";
import {
  OBSIDIAN_FILE_ID_PREFIX,
  OBSIDIAN_TAG_ID_PREFIX,
} from "../../docusaurus-obsidian-bridge-common/src/constants";
import {
  AdjcacencyMap,
  GraphInfo,
  GraphNode,
  GraphNodeLink,
  ObsidianTagsInfo,
  ObsidianVaultInfo,
} from "../../docusaurus-obsidian-bridge-common/src/types";

export function postProcess(
  tags: ObsidianTagsInfo,
  vault: ObsidianVaultInfo,
  { setGlobalData }: PluginContentLoadedActions
) {
  const graphInfoMap: { [filePath: string]: GraphInfo } = {};
  Object.keys(vault.documents).forEach(async (fileName) => {
    const relativePath = vault.documents[fileName].relativeFilePath;
    const graphInfo = buildGraphInfo(vault, fileName, tags, relativePath);
    graphInfoMap[relativePath] = graphInfo;
  });

  setGlobalData(graphInfoMap);
}

function buildGraphInfo(
  vault: ObsidianVaultInfo,
  fileName: string,
  tags: ObsidianTagsInfo,
  relativePath: string
): GraphInfo {
  const visitedDocuments: Set<string> = new Set([]);
  const visitedTags: Set<string> = new Set([]);
  const adjacencyMap: AdjcacencyMap = {};

  const queue: GraphNode[] = [
    {
      id: `${OBSIDIAN_FILE_ID_PREFIX}__${relativePath}`,
      label: fileName,
      path: relativePath,
      type: "DOCUMENT",
    },
  ];

  const nodes: GraphNode[] = [];
  const links: GraphNodeLink[] = [];

  while (queue.length !== 0) {
    const currentNode = queue.shift() as GraphNode;

    if (visited(currentNode, visitedDocuments, visitedTags)) {
      continue;
    }

    nodes.push(currentNode);
    markAsVisited(currentNode, visitedDocuments, visitedTags);

    if (currentNode.type === "DOCUMENT") {
      handleDocumentTags(currentNode, queue, links, vault, adjacencyMap);
      handleInternalLinks(currentNode, queue, links, vault, adjacencyMap);
    } else if (currentNode.type === "TAG") {
      handleTaggedDocuments(
        currentNode,
        queue,
        links,
        vault,
        tags,
        adjacencyMap
      );
    }
  }
  return {
    nodes,
    links,
  };
}

function visited(
  currentNode: GraphNode,
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
  currentNode: GraphNode,
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
  adjacencyMap: AdjcacencyMap
) {
  return (
    (adjacencyMap[source] && adjacencyMap[source].has(target)) ||
    (adjacencyMap[target] && adjacencyMap[target].has(source))
  );
}

function handleLink(
  source: string,
  target: string,
  adjacencyMap: AdjcacencyMap,
  links: GraphNodeLink[]
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
  adjacencyMap: AdjcacencyMap
) {
  if (!adjacencyMap[source]) {
    adjacencyMap[source] = new Set();
  }
  if (!adjacencyMap[target]) {
    adjacencyMap[target] = new Set();
  }
}

function handleDocumentTags(
  currentNode: GraphNode,
  queue: GraphNode[],
  links: GraphNodeLink[],
  vault: ObsidianVaultInfo,
  adjacencyMap: AdjcacencyMap
) {
  vault.documents[currentNode.label].tags.forEach((tag) => {
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
  currentNode: GraphNode,
  queue: GraphNode[],
  links: GraphNodeLink[],
  vault: ObsidianVaultInfo,
  adjacencyMap: AdjcacencyMap
) {
  vault.documents[currentNode.label].internalLinks.forEach((internalLink) => {
    const internalLinkId = `${OBSIDIAN_FILE_ID_PREFIX}__${vault.documents[internalLink].relativeFilePath}`;

    queue.push({
      id: internalLinkId,
      label: internalLink,
      type: "DOCUMENT",
      path: vault.documents[internalLink].relativeFilePath,
    });

    handleLink(currentNode.id, internalLinkId, adjacencyMap, links);
  });
}

function handleTaggedDocuments(
  currentNode: GraphNode,
  queue: GraphNode[],
  links: GraphNodeLink[],
  vault: ObsidianVaultInfo,
  tags: ObsidianTagsInfo,
  adjacencyMap: AdjcacencyMap
) {
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
