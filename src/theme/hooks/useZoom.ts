import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import { MutableRefObject, useEffect, useState } from "react";

export default function useZoom(container: MutableRefObject<HTMLElement>) {
  const [transform, setTransform] = useState<string | undefined>();

  const graphZoom = zoom().on("zoom", (e) => {
    setTransform(e.transform);
  });

  useEffect(() => {
    if (container.current) {
      select(container.current).call(graphZoom).call(graphZoom, zoomIdentity);
    }
  }, [container]);

  return {
    transform,
  };
}
