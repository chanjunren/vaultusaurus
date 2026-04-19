import { select } from "d3-selection";
import { zoom, zoomIdentity, type ZoomTransform } from "d3-zoom";
import { useEffect, useState, type RefObject } from "react";

export default function useZoom<T extends Element>(
  container: RefObject<T | null>
) {
  const [transform, setTransform] = useState<string | undefined>();

  const graphZoom = zoom<T, unknown>().on(
    "zoom",
    (e: { transform: ZoomTransform }) => {
      setTransform(e.transform.toString());
    }
  );

  useEffect(() => {
    if (container.current) {
      select<T, unknown>(container.current)
        .call(graphZoom)
        .call(graphZoom.transform, zoomIdentity);
    }
  }, [container]);

  return {
    transform,
  };
}
