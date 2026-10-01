export interface OriginalMarkerPosition {
  x: number;
  y: string;
}

export const ORIGINAL_MARKER_HALF_HEIGHT = 50;
export const ORIGINAL_MARKER_LABEL_OFFSET = 20;
export const ORIGINAL_MARKER_LABEL_HALF_WIDTH = 8;
export const VALUE_LABEL_GAP = 8;

export interface LabelBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

// Process obstacles from left to right so a shift cannot introduce a new overlap
// with a marker that was already checked (including markers on nearby rows).
export function clearOriginalMarkers(
  label: LabelBounds,
  markers: LabelBounds[],
): number {
  const width = label.right - label.left;
  let left = label.left;

  for (const marker of [...markers].sort((a, b) => a.left - b.left)) {
    if (
      label.bottom > marker.top &&
      label.top < marker.bottom &&
      left + width > marker.left - VALUE_LABEL_GAP &&
      left < marker.right + VALUE_LABEL_GAP
    ) {
      left = marker.right + VALUE_LABEL_GAP;
    }
  }

  return left;
}
