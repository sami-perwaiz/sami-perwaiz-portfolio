import { useEffect, useState } from "react";
import { computeToolTileSize, TOOL_TILE_SIZE_DESKTOP } from "./toolsData.js";

export function useToolTileSize() {
  const [size, setSize] = useState(() =>
    typeof window !== "undefined"
      ? computeToolTileSize(window.innerWidth)
      : TOOL_TILE_SIZE_DESKTOP
  );

  useEffect(() => {
    const update = () => setSize(computeToolTileSize(window.innerWidth));
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}
