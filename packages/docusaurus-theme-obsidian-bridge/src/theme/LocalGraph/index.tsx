import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";
import { useRef } from "react";
import styles from "../../css/index.module.css";

export default function LocalGraph({ width = 250, height = 250 }) {
  const gx = useRef();
  const pluginData = usePluginData("docusaurus-plugin-obsidian-bridge");
  console.log("CONTEXT", JSON.stringify(useDocusaurusContext()));
  console.log("CURRENT", window.location.pathname);
  // console.log("PLUGIN_DATA", pluginData);

  // const gy = useRef();
  // const x = d3.scaleLinear(
  //   [0, data.length - 1],
  //   [marginLeft, width - marginRight]
  // );
  // const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);
  // const line = d3.line((d, i) => x(i), y);
  // useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
  // useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);
  // // return <div width={width} height={height}></svg>;

  return <svg className={styles.container}></svg>;
}
