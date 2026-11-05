export const CARD_PERSPECTIVE = 900;
export interface Bounds { width: number; height: number; originX: number; originY: number }
interface BoundsInput {
  width: number; height: number; cardDistance: number; verticalDistance: number;
  depth: number; skewAmount: number; visible: number; hoverSpread: number;
  padding?: number; preserveCardSize?: boolean;
}
export const stackBounds = ({
  width,
  height,
  cardDistance,
  verticalDistance,
  depth,
  skewAmount,
  visible,
  hoverSpread,
  padding = 32,
  preserveCardSize = false
}: BoundsInput): Bounds => {
  const slope = Math.tan((skewAmount * Math.PI) / 180);
  const spread = 1 + Math.max(0, hoverSpread);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < visible; i++) {
    const scale = preserveCardSize ? 1 : CARD_PERSPECTIVE / (CARD_PERSPECTIVE + i * depth);
    for (const u of [-width / 2, width / 2]) {
      for (const v of [-height / 2, height / 2]) {
        const x = (i * cardDistance * spread + u) * scale;
        const y = (-i * verticalDistance * spread + v + u * slope) * scale;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }
  return {
    width: Math.ceil(maxX - minX + padding * 2),
    height: Math.ceil(maxY - minY + padding * 2),
    originX: padding - minX,
    originY: padding - minY
  };
};

export function projectCardPose(pose: { x: number; y: number; z: number }, preserveCardSize: boolean) {
  // Counter perspective's shrink and displacement around the front-card origin.
  // The engine still owns depth, rotation, spring motion and layer ordering.
  const scale = preserveCardSize ? Math.max(0.01, 1 - pose.z / CARD_PERSPECTIVE) : 1;
  return { x: pose.x * scale, y: pose.y * scale, scale };
}
