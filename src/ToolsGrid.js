import { createElement as h } from "react";
import { StickerPeel } from "./StickerPeel.jsx";
import { TOOLS } from "./toolsData.js";
import { useToolTileSize } from "./useToolTileSize.js";

const ASSET_V = "2026-07-28b";

/**
 * Shared 2×4 sticker-peel tools grid.
 */
export function ToolsGrid({ itemClassName = "tools-section__item" }) {
  const tileSize = useToolTileSize();

  return TOOLS.map((tool) =>
    h(
      "div",
      {
        key: tool.id,
        className: itemClassName,
        role: "listitem",
        "aria-label": tool.label,
        "data-cursor-label": tool.label,
        style: { "--tool-tile-size": `${tileSize}px` },
      },
      h(StickerPeel, {
        image: `${tool.image}?v=${ASSET_V}`,
        imageWidth: tileSize,
        imageHeight: tileSize,
        curlRotation: tool.foldDirection,
      })
    )
  );
}
