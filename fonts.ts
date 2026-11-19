// fonts.ts — two hand-built fonts (no external font files, Node stdlib only).
// 1) FONT5X7: classic 5x7 bitmap font, each glyph = 7 rows of 5-bit masks.
// 2) STROKE: vector serif font (all-caps + digits), glyphs as polylines on a
//    10-unit cap-height grid. Scales cleanly to any size; serifs added at
//    vertical stem ends.
import { Canvas, type RGB } from "./render.ts";

// ---------------------------------------------------------------- 5x7 font
// Bit 4 = leftmost pixel. Rows top to bottom.
export const FONT5X7: Record<string, number[]> = {
  A: [14, 17, 17, 31, 17, 17, 17],
  B: [30, 17, 17, 30, 17, 17, 30],
  C: [14, 17, 16, 16, 16, 17, 14],
  D: [28, 18, 17, 17, 17, 18, 28],
  E: [31, 16, 16, 30, 16, 16, 31],
  F: [31, 16, 16, 30, 16, 16, 16],
  G: [14, 17, 16, 23, 17, 17, 14],
  H: [17, 17, 17, 31, 17, 17, 17],
  I: [14, 4, 4, 4, 4, 4, 14],
  J: [7, 2, 2, 2, 2, 18, 12],
  K: [17, 18, 20, 24, 20, 18, 17],
  L: [16, 16, 16, 16, 16, 16, 31],
  M: [17, 27, 21, 21, 17, 17, 17],
  N: [17, 17, 25, 21, 19, 17, 17],
  O: [14, 17, 17, 17, 17, 17, 14],
  P: [30, 17, 17, 30, 16, 16, 16],
  Q: [14, 17, 17, 17, 21, 18, 13],
  R: [30, 17, 17, 30, 20, 18, 17],
  S: [15, 16, 16, 14, 1, 1, 30],
  T: [31, 4, 4, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 17, 17, 14],
  V: [17, 17, 17, 17, 17, 10, 4],
  W: [17, 17, 17, 21, 21, 27, 17],
  X: [17, 17, 10, 4, 10, 17, 17],
  Y: [17, 17, 10, 4, 4, 4, 4],
  Z: [31, 1, 2, 4, 8, 16, 31],
  a: [0, 0, 14, 1, 15, 17, 14],
  b: [16, 16, 30, 17, 17, 17, 30],
  c: [0, 0, 14, 17, 16, 17, 14],
  d: [1, 1, 15, 17, 17, 17, 15],
  e: [0, 0, 14, 17, 31, 16, 14],
  f: [12, 9, 8, 30, 8, 8, 8],
  g: [0, 0, 15, 17, 17, 15, 1],
  h: [16, 16, 30, 17, 17, 17, 17],
  i: [4, 0, 12, 4, 4, 4, 14],
  j: [2, 0, 12, 2, 2, 2, 12],
  k: [16, 16, 18, 20, 24, 20, 18],
  l: [12, 4, 4, 4, 4, 4, 14],
  m: [0, 0, 26, 21, 21, 21, 21],
  n: [0, 0, 30, 17, 17, 17, 17],
  o: [0, 0, 14, 17, 17, 17, 14],
  p: [0, 0, 30, 17, 17, 30, 16],
  q: [0, 0, 15, 17, 17, 15, 1],
  r: [0, 0, 22, 25, 16, 16, 16],
  s: [0, 0, 15, 16, 14, 1, 30],
  t: [8, 8, 30, 8, 8, 9, 12],
  u: [0, 0, 17, 17, 17, 19, 15],
  v: [0, 0, 17, 17, 17, 10, 4],
  w: [0, 0, 17, 21, 21, 21, 10],
  x: [0, 0, 17, 10, 4, 10, 17],
  y: [0, 0, 17, 17, 17, 15, 1],
  z: [0, 0, 31, 2, 4, 8, 31],
  "0": [14, 17, 19, 21, 25, 17, 14],
  "1": [4, 12, 4, 4, 4, 4, 14],
  "2": [14, 17, 1, 2, 4, 8, 31],
  "3": [30, 1, 1, 14, 1, 1, 30],
  "4": [2, 6, 10, 18, 31, 2, 2],
  "5": [31, 16, 30, 1, 1, 17, 14],
  "6": [14, 16, 16, 30, 17, 17, 14],
  "7": [31, 1, 2, 2, 4, 4, 4],
  "8": [14, 17, 17, 14, 17, 17, 14],
  "9": [14, 17, 17, 15, 1, 1, 14],
  " ": [0, 0, 0, 0, 0, 0, 0],
  ".": [0, 0, 0, 0, 0, 12, 12],
  ",": [0, 0, 0, 0, 0, 12, 8],
  "'": [4, 4, 8, 0, 0, 0, 0],
  "!": [4, 4, 4, 4, 4, 0, 4],
  "?": [14, 17, 1, 2, 4, 0, 4],
  "-": [0, 0, 0, 14, 0, 0, 0],
  ":": [0, 0, 12, 12, 0, 12, 12],
  ";": [0, 0, 12, 12, 0, 12, 8],
  "(": [2, 4, 8, 8, 8, 4, 2],
  ")": [8, 4, 2, 2, 2, 4, 8],
  "/": [1, 1, 2, 2, 4, 8, 16],
  "%": [25, 26, 2, 4, 8, 22, 19],
  $: [4, 15, 20, 14, 5, 30, 4],
  "€": [14, 17, 16, 28, 16, 17, 14],
  "£": [7, 8, 8, 30, 8, 8, 31],
  "&": [12, 18, 20, 8, 21, 18, 13],
  "·": [0, 0, 0, 12, 12, 0, 0],
  "—": [0, 0, 0, 31, 0, 0, 0],
  "–": [0, 0, 0, 14, 0, 0, 0],
  "×": [0, 0, 17, 10, 4, 10, 17],
  "•": [0, 0, 14, 14, 14, 0, 0],
  '"': [10, 10, 0, 0, 0, 0, 0],
  "+": [0, 4, 4, 31, 4, 4, 0],
  "=": [0, 0, 31, 0, 31, 0, 0],
  ">": [16, 8, 4, 2, 4, 8, 16],
  "<": [1, 2, 4, 8, 4, 2, 1],
  "*": [0, 10, 14, 31, 14, 10, 0],
  "#": [10, 10, 31, 10, 31, 10, 10],
  _: [0, 0, 0, 0, 0, 0, 31],
  "@": [14, 17, 23, 21, 22, 16, 14],
};

// Curly quotes / apostrophes map to straight ones.
function norm5(ch: string): string {
  if (ch === "\u2018" || ch === "\u2019" || ch === "\u02BC") return "'";
  if (ch === "\u201C" || ch === "\u201D") return '"';
  if (ch === "\u2026") return ".";
  return ch;
}

export function draw5x7(
  cv: Canvas,
  text: string,
  x: number,
  y: number,
  color: RGB,
  scale = 1,
  bold = false,
): number {
  // Draws text at top-left (x, y). Returns the x position after the text.
  let cx = x;
  const adv = 6 * scale;
  for (const raw of text) {
    const ch = norm5(raw);
    const g = FONT5X7[ch] ?? FONT5X7["?"];
    for (let r = 0; r < 7; r++) {
      const row = g[r];
      for (let c = 0; c < 5; c++) {
        if (row & (1 << (4 - c))) {
          const px = cx + c * scale;
          const py = y + r * scale;
          if (scale === 1) {
            cv.set(px, py, color);
            if (bold) cv.set(px + 1, py, color);
          } else {
            cv.fillRect(px, py, scale, scale, color);
            if (bold) cv.fillRect(px + 1, py, scale, scale, color);
          }
        }
      }
    }
    cx += adv;
  }
  return cx;
}

export function width5x7(text: string, scale = 1): number {
  if (!text) return 0;
  return text.length * 6 * scale - scale;
}

// Word-wrap for the 5x7 font. Returns lines that fit maxWidth px.
export function wrap5x7(text: string, maxWidth: number, scale = 1): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const trial = cur ? cur + " " + w : w;
    if (width5x7(trial, scale) <= maxWidth) {
      cur = trial;
    } else {
      if (cur) lines.push(cur);
      // If a single word is too long, hard-split it.
      if (width5x7(w, scale) > maxWidth) {
        const maxChars = Math.max(1, Math.floor((maxWidth + scale) / (6 * scale)));
        let rest = w;
        while (width5x7(rest, scale) > maxWidth) {
          lines.push(rest.slice(0, maxChars));
          rest = rest.slice(maxChars);
        }
        cur = rest;
      } else {
        cur = w;
      }
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ------------------------------------------------------------ stroke font
export interface StrokeGlyph {
  w: number;
  strokes: Array<Array<[number, number]>>;
  dots?: Array<[number, number, number]>; // x, y, radius (grid units)
}

const S = (w: number, strokes: number[][][], dots?: number[][]): StrokeGlyph => ({
  w,
  strokes: strokes as Array<Array<[number, number]>>,
  dots: dots as Array<[number, number, number]> | undefined,
});

export const STROKE: Record<string, StrokeGlyph> = {
  A: S(7, [[[0, 0], [3.5, 10], [7, 0]], [[1.3, 3.5], [5.7, 3.5]]]),
  B: S(6.5, [[[0, 0], [0, 10]], [[0, 10], [4, 10], [6, 8.2], [6, 6.5], [4, 5], [0, 5]], [[0, 5], [4.2, 5], [6.5, 3.5], [6.5, 1.5], [4, 0], [0, 0]]]),
  C: S(6.5, [[[6.5, 8], [5, 10], [2, 10], [0, 8], [0, 2], [2, 0], [5, 0], [6.5, 2]]]),
  D: S(7, [[[0, 0], [0, 10]], [[0, 10], [4, 10], [7, 8], [7, 2], [4, 0], [0, 0]]]),
  E: S(6, [[[0, 0], [0, 10]], [[0, 10], [6, 10]], [[0, 5], [4.5, 5]], [[0, 0], [6, 0]]]),
  F: S(6, [[[0, 0], [0, 10]], [[0, 10], [6, 10]], [[0, 5], [4.5, 5]]]),
  G: S(7, [[[6.5, 8], [5, 10], [2, 10], [0, 8], [0, 2], [2, 0], [5, 0], [6.5, 2], [6.5, 4.5], [4, 4.5]]]),
  H: S(7, [[[0, 0], [0, 10]], [[7, 0], [7, 10]], [[0, 5], [7, 5]]]),
  I: S(3, [[[1.5, 0], [1.5, 10]]]),
  J: S(5.5, [[[4.5, 10], [4.5, 2], [3, 0], [1, 0], [0, 1.5]]]),
  K: S(7, [[[0, 0], [0, 10]], [[7, 10], [0.8, 4.5], [7, 0]]]),
  L: S(6, [[[0, 10], [0, 0], [6, 0]]]),
  M: S(8.5, [[[0, 0], [0, 10], [4.25, 3], [8.5, 10], [8.5, 0]]]),
  N: S(7, [[[0, 0], [0, 10], [7, 0], [7, 10]]]),
  O: S(7.5, [[[3.75, 10], [6.5, 8.5], [7.5, 5], [6.5, 1.5], [3.75, 0], [1, 1.5], [0, 5], [1, 8.5], [3.75, 10]]]),
  P: S(6.5, [[[0, 0], [0, 10]], [[0, 10], [4, 10], [6.5, 8], [6.5, 6], [4, 4.5], [0, 4.5]]]),
  Q: S(7.5, [[[3.75, 10], [6.5, 8.5], [7.5, 5], [6.5, 1.5], [3.75, 0], [1, 1.5], [0, 5], [1, 8.5], [3.75, 10]], [[4.5, 3.5], [7.5, -1]]]),
  R: S(7, [[[0, 0], [0, 10]], [[0, 10], [4, 10], [6.5, 8], [6.5, 6], [4, 4.5], [0, 4.5]], [[4, 4.5], [7, 0]]]),
  S: S(6.5, [[[6, 8.5], [4.5, 10], [2, 10], [0.5, 8], [1, 6], [3, 5], [5.5, 4], [6, 2], [4.5, 0], [2, 0], [0.5, 1.5]]]),
  T: S(7, [[[0, 10], [7, 10]], [[3.5, 10], [3.5, 0]]]),
  U: S(7, [[[0, 10], [0, 2], [1.5, 0], [5.5, 0], [7, 2], [7, 10]]]),
  V: S(7, [[[0, 10], [3.5, 0], [7, 10]]]),
  W: S(9.5, [[[0, 10], [2.2, 0], [4.75, 7], [7.3, 0], [9.5, 10]]]),
  X: S(7, [[[0, 0], [7, 10]], [[7, 0], [0, 10]]]),
  Y: S(7, [[[0, 10], [3.5, 5], [7, 10]], [[3.5, 5], [3.5, 0]]]),
  Z: S(6.5, [[[0, 10], [6.5, 10], [0, 0], [6.5, 0]]]),
  "0": S(6.5, [[[3.25, 10], [5.5, 8.5], [6.5, 5], [5.5, 1.5], [3.25, 0], [1, 1.5], [0, 5], [1, 8.5], [3.25, 10]]]),
  "1": S(6.5, [[[2, 8], [4.5, 10], [4.5, 0]], [[2.5, 0], [6.5, 0]]]),
  "2": S(6.5, [[[1, 8.5], [2.5, 10], [4.5, 10], [6, 8], [6, 6], [0, 0], [6.5, 0]]]),
  "3": S(6.5, [[[1, 9], [2.5, 10], [4.5, 10], [6, 8.5], [5, 6.5], [3, 5.5], [5, 4.5], [6, 3], [5, 0.5], [3, 0], [1, 1]]]),
  "4": S(6.5, [[[4.5, 10], [0, 3], [6.5, 3]], [[4.5, 10], [4.5, 0]]]),
  "5": S(6.5, [[[6, 10], [1, 10], [1, 5.5], [4.5, 5.5], [6, 4], [6, 2], [4.5, 0], [2, 0], [0.5, 1.5]]]),
  "6": S(6.5, [[[6, 8], [4.5, 10], [2, 10], [0.5, 8], [0, 5], [1, 1.5], [3, 0], [5, 1], [6, 3], [5.5, 5], [3.5, 5.5], [1.5, 4.5]]]),
  "7": S(6.5, [[[0, 10], [6.5, 10], [3, 0]]]),
  "8": S(6.5, [[[3.25, 10], [5.5, 8.5], [5.5, 6.5], [3.25, 5], [1, 6.5], [1, 8.5], [3.25, 10]], [[3.25, 5], [6, 3.5], [6, 1.5], [3.25, 0], [0.5, 1.5], [0.5, 3.5], [3.25, 5]]]),
  "9": S(6.5, [[[1, 2], [2.5, 0], [5, 0], [6.5, 2], [6, 5], [5, 8.5], [3, 10], [1, 9], [0.5, 7], [1.5, 5], [3.5, 4.5], [5.5, 5.5]]]),
  " ": S(3.5, []),
  ".": S(2.5, [], [[1.2, 0.8, 1.1]]),
  ",": S(3, [[[1.8, 0], [1, -2]]], [[1.5, 0.8, 1.1]]),
  "'": S(2.5, [[[1.5, 10], [0.8, 7.5]]]),
  "!": S(3, [[[1.5, 10], [1.5, 3]]], [[1.5, 0.8, 1.1]]),
  "?": S(6, [[[1, 8], [2, 10], [4.5, 10], [6, 8], [5.5, 6], [3.5, 4.5], [3.5, 2.5]]], [[3.5, 0.8, 1.1]]),
  "-": S(5, [[[0, 4.5], [5, 4.5]]]),
  ":": S(3, [], [[1.5, 7, 1.1], [1.5, 1.5, 1.1]]),
  ";": S(3, [[[1.8, 0], [1, -2]]], [[1.5, 7, 1.1], [1.5, 1.5, 1.1]]),
  "(": S(4, [[[3.5, 10], [1.5, 7.5], [1, 5], [1.5, 2.5], [3.5, 0]]]),
  ")": S(4, [[[0.5, 10], [2.5, 7.5], [3, 5], [2.5, 2.5], [0.5, 0]]]),
  "/": S(6, [[[1, 0], [5.5, 10]]]),
  "%": S(8, [[[1, 0], [7, 10]]], [[2, 8, 1.4], [6, 2, 1.4]]),
  $: S(6.5, [[[6, 8.5], [4.5, 10], [2, 10], [0.5, 8], [1, 6], [3, 5], [5.5, 4], [6, 2], [4.5, 0], [2, 0], [0.5, 1.5]], [[3.25, -1], [3.25, 11]]]),
  "€": S(7, [[[6.5, 8], [5, 10], [2, 10], [0, 8], [0, 2], [2, 0], [5, 0], [6.5, 2]], [[0, 6.5], [5.5, 6.5]], [[0, 3.5], [5.5, 3.5]]]),
  "£": S(6, [[[5.5, 9], [2, 10], [0.5, 8], [1, 5], [0, 2], [0, 0]], [[0, 3.5], [5, 3.5]], [[0, 0], [5.5, 0]]]),
  "·": S(3, [], [[1.5, 5, 1.1]]),
  "—": S(9, [[[0, 5], [9, 5]]]),
  "–": S(6, [[[0, 5], [6, 5]]]),
  "×": S(6, [[[1, 2], [5, 8]], [[5, 2], [1, 8]]]),
  "•": S(3, [], [[1.5, 3.5, 1.6]]),
  '"': S(5, [[[1, 10], [0.5, 8]], [[3.5, 10], [3, 8]]]),
  "+": S(6, [[[3, 1], [3, 9]], [[1, 5], [5, 5]]]),
  "=": S(6, [[[0.5, 7], [5.5, 7]], [[0.5, 3], [5.5, 3]]]),
  "&": S(7, [[[5, 8], [4, 10], [2, 10], [0.5, 8], [1, 6], [3, 5], [5, 4], [6, 2], [5, 0], [3, 0], [1, 1.5]], [[6, 8], [1, 0]]]),
  "*": S(6, [[[3, 9], [3, 3]], [[0.5, 7.5], [5.5, 4.5]], [[5.5, 7.5], [0.5, 4.5]]]),
};

function strokeGlyph(ch: string): StrokeGlyph {
  const up = ch.toUpperCase();
  return STROKE[up] ?? STROKE["?"];
}

export function widthStroke(text: string, scale: number): number {
  let w = 0;
  for (const ch of text) {
    w += (strokeGlyph(ch).w + 0.9) * scale;
  }
  return w - 0.9 * scale;
}

// Draw stroke text. (x, y) = top-left of cap-height box. scale = px per grid
// unit. weight = stroke width in px (defaults to ~0.5*scale, min 1).
// serif = add serif ticks at vertical stem ends.
export function drawStroke(
  cv: Canvas,
  text: string,
  x: number,
  y: number,
  color: RGB,
  scale: number,
  weight?: number,
  serif = true,
): number {
  const w = weight ?? Math.max(1, Math.round(scale * 0.45));
  const serifLen = 1.5 * scale;
  let cx = x;
  const baseY = y + 10 * scale; // baseline
  for (const ch of text) {
    const g = strokeGlyph(ch);
    for (const poly of g.strokes) {
      for (let i = 0; i + 1 < poly.length; i++) {
        const [x1, y1] = poly[i];
        const [x2, y2] = poly[i + 1];
        cv.thickLine(cx + x1 * scale, baseY - y1 * scale, cx + x2 * scale, baseY - y2 * scale, color, w);
      }
      // Serifs at polyline ends when the end segment is mostly vertical.
      if (serif && poly.length >= 2 && serifLen >= 2) {
        const ends: Array<{ p: [number, number]; q: [number, number] }> = [
          { p: poly[0], q: poly[1] },
          { p: poly[poly.length - 1], q: poly[poly.length - 2] },
        ];
        for (const { p, q } of ends) {
          const dx = Math.abs(p[0] - q[0]);
          const dy = Math.abs(p[1] - q[1]);
          if (dy > 0.1 && dx / dy < 0.45) {
            const px = cx + p[0] * scale;
            const py = baseY - p[1] * scale;
            cv.thickLine(px - serifLen / 2, py, px + serifLen / 2, py, color, Math.max(1, w * 0.8));
          }
        }
      }
    }
    for (const [dx, dy, r] of g.dots ?? []) {
      cv.fillCircle(cx + dx * scale, baseY - dy * scale, Math.max(0.8, r * scale * 0.8), color);
    }
    cx += (g.w + 0.9) * scale;
  }
  return cx;
}

// Word-wrap for the stroke font.
export function wrapStroke(text: string, maxWidth: number, scale: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const wd of words) {
    const trial = cur ? cur + " " + wd : wd;
    if (widthStroke(trial, scale) <= maxWidth) {
      cur = trial;
    } else {
      if (cur) lines.push(cur);
      cur = wd;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}
