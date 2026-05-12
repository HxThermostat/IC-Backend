export function toCanvas(
  { r, theta }: { r: number; theta: number },
  [cx, cy]: [number, number]
): [number, number] {
  return [cx + r * Math.cos(theta), cy - r * Math.sin(theta)];
}

export function toCartesian(
  [x, y]: [number, number],
  [cx, cy]: [number, number]
): [number, number] {
  return [x - cx, cy - y];
}

export function lerp(v0: number, v1: number, t: number): number {
  return (1 - t) * v0 + t * v1;
}

// Converts a #ffffff hex string into an [r,g,b] array
export function h2r(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) throw new Error("Invalid color: must be in the format #rrggbb");

  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

// Inverse of the above
export function r2h([r, g, b]: [number, number, number]): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Interpolates two [r,g,b] colors and returns an [r,g,b] of the result
// Taken from the awesome ROT.js roguelike dev library at
// https://github.com/ondras/rot.js
function interpolateRgb(
  color1: [number, number, number],
  color2: [number, number, number],
  factor: number
): [number, number, number] {
  const result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return [result[0], result[1], result[2]];
}

export function interpolateColor(
  color1: string,
  color2: string,
  factor = 0.5
): string {
  return r2h(
    interpolateRgb(h2r(color1), h2r(color2), Math.min(Math.max(factor, 0), 1))
  );
}

export function normalizeTheta(theta: number): number {
  if (theta < 0) {
    return theta + Math.PI * 2;
  }

  return theta;
}

// Transform the angle to a value between [0,1]
const thetaToProportion = (
  theta: number,
  arcRad: number,
  rotationRad: number
): number => {
  const rotated = theta + rotationRad;
  const normalized = rotated < 0 ? rotated + Math.PI * 2 : rotated;
  const proportion = normalized / arcRad;

  return 1 - proportion;
};

export function deriveNewValueFromDial({
  theta,
  arcRad,
  rotationRad,
  range: { max, min, step },
}: {
  theta: number;
  arcRad: number;
  rotationRad: number;
  range: { max: number; min: number; step: number };
}): number {
  const range = max - min;

  const proportion = thetaToProportion(theta, arcRad, rotationRad);

  const scaled = proportion * range;
  const atStepSize = Math.round(scaled * (1 / step)) * step;

  return atStepSize + min;
}

export function equal(a: number, b: number, epsilon = 0.01): boolean {
  return Math.abs(a - b) < epsilon;
}
export function lessThan(a: number, b: number, epsilon = 0.01): boolean {
  return a - b < epsilon;
}
export function lessOrEqual(a: number, b: number, epsilon = 0.01): boolean {
  return lessThan(a, b, epsilon) || equal(a, b, epsilon);
}
export function greaterThan(a: number, b: number, epsilon = 0.01): boolean {
  return a - b > epsilon;
}
export function greaterOrEqual(a: number, b: number, epsilon = 0.01): boolean {
  return greaterThan(a, b, epsilon) || equal(a, b, epsilon);
}

// Need to do an approximate comparison to account for floating points
export function insideRange(
  max: number,
  min: number,
  value: number,
  epsilon = 0.01
): boolean {
  return (
    greaterOrEqual(value, min, epsilon) && lessOrEqual(value, max, epsilon)
  );
}
