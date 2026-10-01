import assert from "node:assert/strict";
import test from "node:test";
import {
  clearOriginalMarkers,
  VALUE_LABEL_GAP,
  type LabelBounds,
} from "../src/lib/chart-label-layout";

const label: LabelBounds = { left: 108, right: 148, top: 92, bottom: 108 };

test("bar values clear both the original line and its rotated text", () => {
  for (const left of [100, 130, 145]) {
    const marker = { left, right: left + 29, top: 50, bottom: 150 };
    const shifted = clearOriginalMarkers(label, [marker]);
    assert.ok(shifted >= marker.right + VALUE_LABEL_GAP);
  }
});

test("values stay at their bar ends when there is enough room", () => {
  assert.equal(clearOriginalMarkers(label, []), label.left);
  assert.equal(
    clearOriginalMarkers(label, [
      { left: 10, right: 39, top: 50, bottom: 150 },
      { left: 170, right: 199, top: 50, bottom: 150 },
      { left: 100, right: 129, top: 120, bottom: 220 },
    ]),
    label.left,
  );
});

test("shifting clears subsequent markers, regardless of row order", () => {
  const markers = [
    { left: 160, right: 189, top: 95, bottom: 195 },
    { left: 100, right: 129, top: 50, bottom: 150 },
  ];
  const shifted = clearOriginalMarkers(label, markers);
  assert.equal(shifted, 189 + VALUE_LABEL_GAP);
});

test("negative and right-aligned mobile values use their full text width", () => {
  const marker = { left: 200, right: 229, top: 50, bottom: 150 };
  const rightAligned = { left: 220, right: 270, top: 92, bottom: 108 };
  assert.equal(clearOriginalMarkers(rightAligned, [marker]), 237);
  const negative = { left: -75, right: -25, top: 92, bottom: 108 };
  assert.equal(
    clearOriginalMarkers(negative, [
      { left: -50, right: -21, top: 50, bottom: 150 },
    ]),
    -13,
  );
});
