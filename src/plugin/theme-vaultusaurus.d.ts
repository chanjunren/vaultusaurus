import VaultusaurusPluginOptions from "@vaultusaurus/plugin/options";
import { ReactElement } from "react";

declare module "vaultusaurus" {
  export {
    docusaurusPluginVaultusaurus,
    remarkVaultusaurus,
    VaultusaurusPluginOptions,
  };
}

declare module "@theme/LocalGraph" {
  export default function VaultusaurusGraph(props: any): ReactElement;
}
