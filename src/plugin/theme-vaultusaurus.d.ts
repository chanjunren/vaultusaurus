import { ReactElement } from "react";

declare module "vaultusaurus" {
  import VaultusaurusPluginOptions from "@vaultusaurus/plugin/options";

  export {
    docusaurusPluginVaultusaurus,
    remarkVaultusaurus,
    VaultusaurusPluginOptions,
  };
}

declare module "@theme/LocalGraph" {
  export default function LocalGraph(props: any): ReactElement;
}
