const ARC_FILL = 0.73;
const ARC_GAP = 1 - ARC_FILL;

export const ARC_RAD = 2 * Math.PI * ARC_FILL;
export const ROTATION = 90 - 360 * ARC_GAP + (360 * ARC_GAP) / 2;
export const ROTATION_RAD = ROTATION * (Math.PI / 180);

export const ARC_WIDTH = 58;

export const CURSOR_WIDTH = 58;

export const GLOW_BLEED = 40;
