declare module "vaultusaurus" {
  import type { LoadContext, Plugin, PluginOptions } from "@docusaurus/types";

  export type GraphStyle = {
    graphBg?: string;
    defaultColor?: string;
    activeColor?: string;
  };

  export type VaultusaurusPluginOptions = {
    tagsToIgnore?: Set<string>;
    notesToIgnore?: Set<string>;
    graphStyle: GraphStyle;
    maxDepth?: number;
  };

  export function docusaurusPluginVaultusaurus(
    context: LoadContext,
    opts: PluginOptions
  ): Promise<Plugin>;

  export const remarkVaultusaurus: (options?: {
    customReplacers?: Array<(tree: unknown) => void>;
  }) => (tree: unknown, file: unknown) => void;
}

declare module "@theme/VaultusaurusGraph" {
  import type { ReactElement } from "react";

  export interface Props {
    customGraph?: unknown;
    expandable?: boolean;
    global?: boolean;
    enableGlobalGraph?: boolean;
    minimizeGraphCallback?: () => void;
  }

  export default function VaultusaurusGraph(props?: Props): ReactElement | null;
}

declare module "@theme/GraphLink" {
  import type { ReactElement } from "react";
  const GraphLink: (props: unknown) => ReactElement | null;
  export default GraphLink;
}

declare module "@theme/GraphNode" {
  import type { ReactElement } from "react";
  const GraphNode: (props: unknown) => ReactElement | null;
  export default GraphNode;
}
