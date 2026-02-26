"use client";

import { ITEM_ART_MAP } from "./slotArt";

export { ITEM_ART_MAP };

interface ItemArtProps {
  color?: string;
  size?: number;
  className?: string;
}

export default function ItemArt({
  itemId,
  artId,
  color,
  size,
  className,
}: ItemArtProps & { itemId: string; artId?: string }) {
  const ArtComponent = ITEM_ART_MAP[artId ?? ""] ?? ITEM_ART_MAP[itemId];
  if (!ArtComponent) return null;
  return <ArtComponent color={color} size={size} className={className} />;
}
