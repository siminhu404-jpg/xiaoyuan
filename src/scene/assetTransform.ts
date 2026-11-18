export function getCenterOffset(minX: number, maxX: number) {
  const offset = -(minX + maxX) / 2;
  return Object.is(offset, -0) ? 0 : offset;
}

export function getFitWidthScale(currentWidth: number, targetWidth: number) {
  return targetWidth / currentWidth;
}
