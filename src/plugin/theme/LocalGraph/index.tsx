import { usePluginData } from "@docusaurus/useGlobalData";
import { GraphInfo, VaultusaurusGlobalData } from "@vaultusaurus/common/types";
import { GraphContext } from "@vaultusaurus/plugin/context";
import styles from "@vaultusaurus/plugin/css/index.module.css";
import { useHover, useLocalGraph } from "@vaultusaurus/plugin/hooks";
import CollapseIcon from "@vaultusaurus/plugin/resources/CollapseIcon.svg";
import ExpandIcon from "@vaultusaurus/plugin/resources/ExpandIcon.svg";
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
  modal?: boolean;
  modalCloseCallback: () => void;
}

export default function LocalGraph({
  customGraph,
  expandable = true,
  modal = false,
  modalCloseCallback,
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

  const { simulation, expanded, setExpanded } = useLocalGraph(graphInfo);
  const rawLinks = graphInfo?.links || [];

  const defaultColor = inputGraphStyle.defaultColor || FALLBACK_DEFAULT_COLOR;
  const activeColor = inputGraphStyle.activeColor || FALLBACK_ACTIVE_COLOR;

  return (
    <GraphContext.Provider
      value={{
        ...useHover(rawLinks),
        simulation,
        graphStyle: {
          activeColor: activeColor,
          defaultColor: defaultColor,
        },
      }}
    >
      {expanded &&
        createPortal(
          <div className={styles.modalOverlay}>
            <LocalGraph
              modal
              expandable={false}
              modalCloseCallback={() => setExpanded(false)}
            />
          </div>,
          document.body
        )}
      <div
        className={modal ? styles.modalContainer : styles.container}
        style={
          {
            "--graph-bg":
              globalData.graphStyle.graphBg || FALLBACK_BACKGROUND_COLOR,
            "--default-color": defaultColor,
          } as React.CSSProperties
        }
      >
        {!expanded && expandable && (
          <ExpandIcon
            className={styles.actionIcon}
            onClick={() => setExpanded(true)}
          />
        )}
        {modal && (
          <CollapseIcon
            className={styles.actionIcon}
            onClick={() => modalCloseCallback()}
          />
        )}
        <GraphContent info={graphInfo} />
      </div>
    </GraphContext.Provider>
  );
}
