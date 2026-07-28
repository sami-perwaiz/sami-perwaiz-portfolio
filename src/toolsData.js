export const TOOL_TILE_SIZE = 200;

/** Desktop tile size — unchanged at 1025px+. */
export const TOOL_TILE_SIZE_DESKTOP = 200;

/**
 * Fit sticker tiles to the active grid column width (tablet/mobile only).
 * Desktop always returns 200px for pixel-perfect layout.
 */
export function computeToolTileSize(viewportWidth = 1440) {
  if (viewportWidth >= 1025) return TOOL_TILE_SIZE_DESKTOP;

  if (viewportWidth >= 768) {
    const pagePad = Math.min(56, Math.max(32, viewportWidth * 0.05));
    const colGap = Math.max(14, Math.min(22, viewportWidth * 0.018));
    const contentWidth = Math.min(1280, viewportWidth - pagePad * 2);
    const tile = Math.floor((contentWidth - colGap * 3) / 4);
    return Math.max(132, Math.min(176, tile));
  }

  const pagePad = Math.min(40, Math.max(20, viewportWidth * 0.05));
  const colGap = Math.max(14, Math.min(24, viewportWidth * 0.04));
  const contentWidth = viewportWidth - pagePad * 2;
  const tile = Math.floor((contentWidth - colGap) / 2);
  return Math.max(120, Math.min(172, tile));
}

export const TOOLS = [
  {
    id: "figma",
    label: "Figma",
    image: "/assets/tools/figma-tile.png",
    foldDirection: 240,
  },
  {
    id: "framer",
    label: "Framer",
    image: "/assets/tools/framer-tile.png",
    foldDirection: 60,
  },
  {
    id: "cursor",
    label: "Cursor",
    image: "/assets/tools/cursor-tile.png",
    foldDirection: 120,
  },
  {
    id: "claude",
    label: "Claude",
    image: `/assets/tools/claude-tile.png`,
    foldDirection: 300,
  },
  {
    id: "lovable",
    label: "Lovable",
    image: "/assets/tools/lovable-tile.png",
    foldDirection: 180,
  },
  {
    id: "canva",
    label: "Canva",
    image: "/assets/tools/canva-tile.png",
    foldDirection: 0,
  },
  {
    id: "gemini",
    label: "Gemini",
    image: "/assets/tools/gemini-tile.png",
    foldDirection: 90,
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    image: "/assets/tools/chatgpt-tile.png",
    foldDirection: 270,
  },
];
