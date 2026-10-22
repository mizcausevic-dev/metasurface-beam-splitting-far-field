import assert from "node:assert/strict";
import {
  CHAPTERS,
  DURATION_S,
  FPS,
  FRAME_COUNT,
  LAST_FRAME,
  chapterAt,
  clampFrame,
  frameTime,
} from "./timeline.ts";

assert.equal(FPS, 30);
assert.equal(FRAME_COUNT, 1020);
assert.equal(LAST_FRAME, 1019);
assert.equal(DURATION_S, 34);

assert.equal(chapterAt(0).id, "aperture");
assert.equal(chapterAt(149).id, "aperture");
assert.equal(chapterAt(150).id, "phase");
assert.equal(chapterAt(299).id, "phase");
assert.equal(chapterAt(300).id, "propagate");
assert.equal(chapterAt(509).id, "propagate");
assert.equal(chapterAt(510).id, "lobes");
assert.equal(chapterAt(749).id, "lobes");
assert.equal(chapterAt(750).id, "compare");
assert.equal(chapterAt(1019).id, "compare");

assert.equal(CHAPTERS[0].start, 0);
assert.equal(CHAPTERS[1].start, 5 * FPS);
assert.equal(CHAPTERS[2].start, 10 * FPS);
assert.equal(CHAPTERS[3].start, 17 * FPS);
assert.equal(CHAPTERS[4].start, 25 * FPS);

assert.equal(frameTime(0), 0);
assert.equal(frameTime(150), 5);
assert.equal(frameTime(750), 25);
assert.equal(Number(frameTime(1019).toFixed(3)), 33.967);

assert.equal(clampFrame(-4), 0);
assert.equal(clampFrame(5000), 1019);
assert.equal(clampFrame(Number.NaN), 0);

let covered = 0;
for (let f = 0; f < FRAME_COUNT; f += 1) {
  const chapter = chapterAt(f);
  assert.ok(f >= chapter.start && f <= chapter.end);
  covered += 1;
}
assert.equal(covered, FRAME_COUNT);

console.log("timeline.test.ts: 1020 frames, five chapters, clocks aligned");
