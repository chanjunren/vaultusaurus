import { DocumentInfo } from "@vaultusaurus/common/types";

export function buildBaseMetadata(): DocumentInfo {
  return {
    tags: [],
    relatedDocuments: new Set(),
  };
}
