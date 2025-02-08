import { usePluginData } from "@docusaurus/useGlobalData";
import { GraphInfo, VaultusaurusGlobalData } from "@vaultusaurus/common/types";
import { GraphContext } from "@vaultusaurus/plugin/context";
import styles from "@vaultusaurus/plugin/css/index.module.css";
import { useGraphManager, useHoverManager } from "@vaultusaurus/plugin/hooks";
import {
  FALLBACK_ACTIVE_COLOR,
  FALLBACK_BACKGROUND_COLOR,
  FALLBACK_DEFAULT_COLOR,
} from "@vaultusaurus/plugin/utils";
import { ReactElement } from "react";
import { createPortal } from "react-dom";
import GraphContent from "./GraphContent";

interface ILocalGraph {
  customGraph?: GraphInfo;
  expandable?: boolean;
  enableGlobal?: boolean;
}

export default function VaultusaurusGraph({
  customGraph,
  expandable,
  enableGlobal,
}): ReactElement<ILocalGraph> {
  const globalData = usePluginData(
    "docusaurus-plugin-vaultusaurus"
  ) as VaultusaurusGlobalData;
  const graphInfo: GraphInfo =
    globalData.graphInfo[window.location.pathname] || customGraph;

  if (!graphInfo) {
    return null;
  }
  const inputGraphStyle = globalData.graphStyle;

  const graphManager = useGraphManager(graphInfo);
  const rawLinks = graphInfo?.links || [];
  const expanded = graphManager.expanded;

  return (
    <GraphContext.Provider
      value={{
        hoverManager: useHoverManager(rawLinks),
        graphManager: graphManager,
        graphStyle: {
          activeColor: inputGraphStyle.activeColor || FALLBACK_ACTIVE_COLOR,
          defaultColor: inputGraphStyle.defaultColor || FALLBACK_DEFAULT_COLOR,
          graphBg: inputGraphStyle.graphBg || FALLBACK_BACKGROUND_COLOR,
        },
      }}
    >
      {expanded &&
        createPortal(
          <div
            className={expanded ? styles.modalOverlay : styles.hidden}
            onClick={() => graphManager.setExpanded(false)}
          >
            <GraphContent modal expandable={false} />
          </div>,
          document.body
        )}
      <GraphContent enableGlobal={enableGlobal} expandable={expandable} />
    </GraphContext.Provider>
  );
}
