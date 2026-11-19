// The World in One Day: 19 November 2026
// A one-page newspaper front page drawn from scratch with Node 22+ stdlib only.
// No network, no fonts, no image libraries: a 5x7 bitmap font and a hand-rolled
// PNG encoder (zlib + CRC32) live in this file. The output is deterministic:
// the same bytes on every run.
//
// Run:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (without MAKEFUN_OUTPUT_DIR it writes to /output, as the grader does.)

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

// ---------------------------------------------------------------------------
// Canvas: a plain RGB buffer, 1024 x 1024
// ---------------------------------------------------------------------------

const W = 1024;
const H = 1024;

type RGB = [number, number, number];

const PAPER: RGB = [248, 243, 232];
const INK: RGB = [28, 26, 23];
const SOFT_INK: RGB = [74, 68, 60];
const RED: RGB = [168, 35, 26];
const BLUE: RGB = [29, 78, 137];
const TEAL: RGB = [15, 118, 110];
const PURPLE: RGB = [107, 33, 168];
const GREEN: RGB = [21, 128, 61];
const INDIGO: RGB = [39, 75, 122];
const RULE: RGB = [28, 26, 23];
const PANEL_BG: RGB = [239, 231, 211];
const WHITE: RGB = [255, 255, 255];

const px = new Uint8Array(W * H * 3);

function setPixel(x: number, y: number, c: RGB): void {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = c[0];
  px[i + 1] = c[1];
  px[i + 2] = c[2];
}

function fillRect(x: number, y: number, w: number, h: number, c: RGB): void {
  const x0 = Math.max(0, x);
  const y0 = Math.max(0, y);
  const x1 = Math.min(W, x + w);
  const y1 = Math.min(H, y + h);
  for (let yy = y0; yy < y1; yy++) {
    for (let xx = x0; xx < x1; xx++) {
      const i = (yy * W + xx) * 3;
      px[i] = c[0];
      px[i + 1] = c[1];
      px[i + 2] = c[2];
    }
  }
}

function hline(x: number, y: number, w: number, c: RGB, thick = 1): void {
  fillRect(x, y, w, thick, c);
}

function vline(x: number, y: number, h: number, c: RGB, thick = 1): void {
  fillRect(x, y, thick, h, c);
}

// Bresenham line, for palm fronds, rocket fins, antennae.
function line(x0: number, y0: number, x1: number, y1: number, c: RGB, thick = 1): void {
  let dx = Math.abs(x1 - x0);
  let dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  let x = x0;
  let y = y0;
  for (;;) {
    fillRect(x, y, thick, thick, c);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
}

function fillCircle(cx: number, cy: number, r: number, c: RGB): void {
  for (let dy = -r; dy <= r; dy++) {
    const dx = Math.floor(Math.sqrt(r * r - dy * dy));
    fillRect(cx - dx, cy + dy, dx * 2 + 1, 1, c);
  }
}

// Circle outline by sampling angles (good enough at these sizes).
function circleOutline(cx: number, cy: number, r: number, c: RGB, dot = 2): void {
  for (let a = 0; a < 360; a += 2) {
    const rad = (a * Math.PI) / 180;
    fillRect(
      Math.round(cx + r * Math.cos(rad)),
      Math.round(cy + r * Math.sin(rad)),
      dot,
      dot,
      c,
    );
  }
}

// Filled triangle (scanline fill between the two edges).
function fillTriangle(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  c: RGB,
): void {
  const minY = Math.min(y0, y1, y2);
  const maxY = Math.max(y0, y1, y2);
  for (let y = minY; y <= maxY; y++) {
    const xs: number[] = [];
    const edges: Array<[number, number, number, number]> = [
      [x0, y0, x1, y1],
      [x1, y1, x2, y2],
      [x2, y2, x0, y0],
    ];
    for (const [ax, ay, bx, by] of edges) {
      if ((ay <= y && by > y) || (by <= y && ay > y)) {
        xs.push(ax + ((y - ay) * (bx - ax)) / (by - ay));
      }
    }
    if (xs.length >= 2) {
      const lo = Math.floor(Math.min(...xs));
      const hi = Math.ceil(Math.max(...xs));
      fillRect(lo, y, hi - lo + 1, 1, c);
    }
  }
}

// ---------------------------------------------------------------------------
// 5x7 bitmap font. Each glyph is 7 rows; each row is a 5-bit number, bit 4
// (value 16) is the leftmost pixel. All copy is uppercase by design, in the
// manner of a classic front page.
// ---------------------------------------------------------------------------

const FONT: Record<string, number[]> = {
  A: [14, 17, 17, 31, 17, 17, 17],
  B: [30, 17, 17, 30, 17, 17, 30],
  C: [14, 17, 16, 16, 16, 17, 14],
  D: [30, 17, 17, 17, 17, 17, 30],
  E: [31, 16, 16, 30, 16, 16, 31],
  F: [31, 16, 16, 30, 16, 16, 16],
  G: [14, 17, 16, 23, 17, 17, 15],
  H: [17, 17, 17, 31, 17, 17, 17],
  I: [14, 4, 4, 4, 4, 4, 14],
  J: [7, 2, 2, 2, 2, 18, 12],
  K: [17, 18, 20, 24, 20, 18, 17],
  L: [16, 16, 16, 16, 16, 16, 31],
  M: [17, 27, 21, 21, 17, 17, 17],
  N: [17, 25, 21, 19, 17, 17, 17],
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
  '0': [14, 17, 19, 21, 25, 17, 14],
  '1': [4, 12, 4, 4, 4, 4, 14],
  '2': [14, 17, 1, 6, 8, 16, 31],
  '3': [31, 2, 4, 2, 1, 17, 14],
  '4': [2, 6, 10, 18, 31, 2, 2],
  '5': [31, 16, 30, 1, 1, 17, 14],
  '6': [6, 8, 16, 30, 17, 17, 14],
  '7': [31, 1, 2, 4, 8, 8, 8],
  '8': [14, 17, 17, 14, 17, 17, 14],
  '9': [14, 17, 17, 15, 1, 2, 12],
  ' ': [0, 0, 0, 0, 0, 0, 0],
  '.': [0, 0, 0, 0, 0, 12, 12],
  ',': [0, 0, 0, 0, 12, 4, 8],
  ':': [0, 12, 12, 0, 12, 12, 0],
  ';': [0, 12, 12, 0, 12, 4, 8],
  '!': [4, 4, 4, 4, 4, 0, 4],
  '?': [14, 17, 1, 6, 4, 0, 4],
  '-': [0, 0, 0, 14, 0, 0, 0],
  '(': [2, 4, 8, 8, 8, 4, 2],
  ')': [8, 4, 2, 2, 2, 4, 8],
  "'": [4, 4, 8, 0, 0, 0, 0],
  '/': [1, 1, 2, 4, 8, 16, 16],
  '"': [10, 10, 10, 0, 0, 0, 0],
  '=': [0, 0, 31, 0, 31, 0, 0],
  '+': [0, 4, 4, 31, 4, 4, 0],
  '*': [0, 4, 21, 14, 21, 4, 0],
  '%': [25, 25, 2, 4, 8, 19, 19],
  '&': [12, 18, 20, 8, 21, 18, 13],
  '•': [0, 0, 14, 14, 14, 0, 0],
};

const CHAR_ADVANCE = 6; // 5 px glyph + 1 px gap, before scaling

function textWidth(text: string, scale: number): number {
  if (text.length === 0) return 0;
  return text.length * CHAR_ADVANCE * scale - scale;
}

function drawChar(ch: string, x: number, y: number, scale: number, c: RGB): void {
  const glyph = FONT[ch] ?? FONT[' '];
  for (let row = 0; row < 7; row++) {
    const bits = glyph[row];
    for (let col = 0; col < 5; col++) {
      if (bits & (16 >> col)) {
        fillRect(x + col * scale, y + row * scale, scale, scale, c);
      }
    }
  }
}

// Draw one line of text. align: 'left' | 'center' (centered on cx).
function drawText(
  text: string,
  x: number,
  y: number,
  scale: number,
  c: RGB,
  align: 'left' | 'center' = 'left',
  cx = 0,
): void {
  let startX = x;
  if (align === 'center') startX = cx - Math.floor(textWidth(text, scale) / 2);
  for (let i = 0; i < text.length; i++) {
    drawChar(text[i], startX + i * CHAR_ADVANCE * scale, y, scale, c);
  }
}

// Greedy word wrap to a maximum number of characters per line.
function wrap(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur === '') {
      cur = w;
    } else if (cur.length + 1 + w.length <= maxChars) {
      cur += ' ' + w;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur !== '') lines.push(cur);
  return lines;
}

// ---------------------------------------------------------------------------
// PNG encoder: IHDR + IDAT (zlib, filter 0) + IEND. No ancillary chunks, so
// the output depends only on the pixels.
// ---------------------------------------------------------------------------

const CRC_TABLE: Uint32Array = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type 2 = RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const stride = W * 3;
  const raw = Buffer.alloc(H * (stride + 1));
  for (let y = 0; y < H; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    raw.set(px.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  }
  const idat = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------------------
// Layout: a newspaper front page, 1024 x 1024, margins 32 px.
//   Masthead .................... y   30 - 132
//   Hero (headline + illustration + standfirst) y 146 - 500
//   "Also in the world today" .... y  524
//   Six story panels, 2 x 3 ..... y  556 - 930
//   "Also today" ticker ......... y  950 - 996
// ---------------------------------------------------------------------------

const MARGIN = 32;
const CONTENT_W = W - MARGIN * 2; // 960

function drawMasthead(): void {
  // Double border around the whole page.
  fillRect(8, 8, W - 16, 3, RULE);
  fillRect(8, H - 11, W - 16, 3, RULE);
  fillRect(8, 8, 3, H - 16, RULE);
  fillRect(W - 11, 8, 3, H - 16, RULE);
  hline(16, 16, W - 32, RULE);
  hline(16, H - 17, W - 32, RULE);
  vline(16, 16, H - 32, RULE);
  vline(W - 17, 16, H - 32, RULE);

  // Kicker above the nameplate.
  drawText("ONE DAY - ONE PAGE - THE WORLD'S NEWS", 0, 30, 2, SOFT_INK, 'center', W / 2);

  // Nameplate.
  drawText('THE WORLD IN ONE DAY', 0, 52, 7, INK, 'center', W / 2);

  // Dateline, flanked by rules.
  const date = 'THURSDAY, 19 NOVEMBER 2026';
  const dw = textWidth(date, 2);
  const cx = W / 2;
  hline(MARGIN, 115, cx - dw / 2 - MARGIN - 16, RULE);
  hline(cx + dw / 2 + 16, 115, W - MARGIN - (cx + dw / 2 + 16), RULE);
  drawText(date, 0, 108, 2, INK, 'center', cx);

  // Thick rule under the masthead.
  fillRect(MARGIN, 128, CONTENT_W, 4, RULE);
  hline(MARGIN, 136, CONTENT_W, RULE);
}

// --- Hero illustration: a Vice City sunset ---------------------------------
// Sky bands, low sun, dark skyline, water, two palm silhouettes.

function drawHeroArt(x: number, y: number, w: number, h: number): void {
  const skyH = Math.floor(h * 0.72); // sky + skyline
  const waterY = y + skyH;
  const waterH = h - skyH;

  // Sunset bands, dusk purple down to amber at the horizon.
  const bands: Array<[number, RGB]> = [
    [0.0, [59, 42, 107]],
    [0.25, [150, 52, 96]],
    [0.55, [222, 96, 63]],
    [0.8, [242, 166, 90]],
  ];
  for (let i = 0; i < bands.length; i++) {
    const y0 = y + Math.floor(bands[i][0] * skyH);
    const y1 = i + 1 < bands.length ? y + Math.floor(bands[i + 1][0] * skyH) : y + skyH;
    fillRect(x, y0, w, y1 - y0, bands[i][1]);
  }

  // Low sun, pale gold.
  fillCircle(x + Math.floor(w * 0.78), y + Math.floor(skyH * 0.42), 30, [255, 223, 138]);
  fillCircle(x + Math.floor(w * 0.78), y + Math.floor(skyH * 0.42), 22, [255, 233, 168]);

  // Skyline silhouettes, base at the waterline.
  const base = y + skyH;
  const buildings: Array<[number, number, number]> = [
    // [x offset, width, height]
    [6, 42, 62],
    [56, 26, 104],
    [90, 54, 48],
    [152, 30, 88],
    [190, 46, 54],
    [244, 28, 112],
    [280, 50, 66],
    [338, 26, 94],
    [372, 42, 50],
    [422, 30, 80],
    [460, 48, 56],
    [514, 14, 92],
  ];
  for (const [bx, bw, bh] of buildings) {
    fillRect(x + bx, base - bh, bw, bh, [36, 26, 51]);
    // Lit windows.
    for (let wy = base - bh + 8; wy < base - 8; wy += 14) {
      for (let wx = x + bx + 6; wx < x + bx + bw - 6; wx += 12) {
        if ((wx * 7 + wy * 13) % 3 === 0) fillRect(wx, wy, 4, 5, [255, 209, 102]);
      }
    }
  }

  // Water: deep teal with lighter streaks.
  fillRect(x, waterY, w, waterH, [20, 96, 110]);
  for (let i = 0; i < 5; i++) {
    const sy = waterY + 6 + i * 9;
    const sx = x + ((i * 137) % (w - 120));
    hline(sx, sy, 60 + ((i * 53) % 70), [64, 160, 175]);
  }

  // Palm silhouettes: leaning trunks, fronds drawn in two segments so they
  // arch down from the crown instead of radiating straight out.
  const palm: RGB = [26, 18, 38];
  const crown1: [number, number] = [56, y + 34];
  line(46, waterY, 52, y + 90, palm, 3);
  line(52, y + 90, crown1[0], crown1[1], palm, 3);
  const fronds1: Array<[[number, number], [number, number]]> = [
    [[34, y + 44], [20, y + 62]],
    [[36, y + 54], [26, y + 74]],
    [[80, y + 42], [96, y + 58]],
    [[78, y + 52], [88, y + 72]],
    [[54, y + 12], [50, y + 2]],
  ];
  for (const [mid, tip] of fronds1) {
    line(crown1[0], crown1[1], mid[0], mid[1], palm, 3);
    line(mid[0], mid[1], tip[0], tip[1], palm, 3);
  }
  const crown2: [number, number] = [x + w - 38, y + 56];
  line(x + w - 30, waterY, x + w - 34, y + 100, palm, 3);
  line(x + w - 34, y + 100, crown2[0], crown2[1], palm, 3);
  const fronds2: Array<[[number, number], [number, number]]> = [
    [[x + w - 62, y + 66], [x + w - 78, y + 82]],
    [[x + w - 58, y + 84], [x + w - 68, y + 104]],
    [[x + w - 14, y + 64], [x + w - 2, y + 80]],
    [[x + w - 18, y + 82], [x + w - 10, y + 100]],
    [[x + w - 40, y + 36], [x + w - 44, y + 20]],
  ];
  for (const [mid, tip] of fronds2) {
    line(crown2[0], crown2[1], mid[0], mid[1], palm, 3);
    line(mid[0], mid[1], tip[0], tip[1], palm, 3);
  }
}

function drawHero(): void {
  drawText('GAMES - AFTER A 13-YEAR WAIT', MARGIN, 146, 2, RED);

  // Two-line headline, scale 5.
  drawText('GTA VI ROLLS OUT', MARGIN, 166, 5, INK);
  drawText('AROUND THE WORLD', MARGIN, 203, 5, INK);

  // Illustration, left; standfirst, right.
  const artX = MARGIN;
  const artY = 252;
  const artW = 528;
  const artH = 188;
  drawHeroArt(artX, artY, artW, artH);

  const capLines = wrap(
    "VICE CITY, IN GTA VI - THE GAME RETURNS TO ITS SUN-SOAKED HOME AFTER 13 YEARS.",
    44,
  );
  let cy = 448;
  for (const ln of capLines) {
    drawText(ln, artX, cy, 2, SOFT_INK);
    cy += 17;
  }

  const tx = 580;
  const tw = W - MARGIN - tx; // 412
  const maxChars = Math.floor(tw / 12); // scale 2 -> 12 px per char
  const para1 = wrap(
    'GAMERS STEP INTO VICE CITY AS THE LONG-AWAITED SEQUEL BEGINS ITS GLOBAL ROLLOUT, 13 YEARS AFTER GTA V.',
    maxChars,
  );
  const para2 = wrap(
    'AP AND THE ECONOMIST REPORT LONG QUEUES AND RECORD DEMAND AS THE GAME ARRIVES ON CONSOLES WORLDWIDE.',
    maxChars,
  );
  let ty = 252;
  for (const ln of para1) {
    drawText(ln, tx, ty, 2, INK);
    ty += 17;
  }
  ty += 10;
  for (const ln of para2) {
    drawText(ln, tx, ty, 2, SOFT_INK);
    ty += 17;
  }

  // Rule under the hero.
  hline(MARGIN, 512, CONTENT_W, RULE);
}

// --- Small pictograms for the six panels (64 x 64 box) ----------------------

type IconFn = (x: number, y: number, c: RGB) => void;

function iconRocket(x: number, y: number, c: RGB): void {
  // Missile rising: body, nose cone, fins, flame.
  fillRect(x + 28, y + 12, 8, 26, c);
  fillTriangle(x + 28, y + 12, x + 36, y + 12, x + 32, y + 2, c);
  fillTriangle(x + 28, y + 38, x + 20, y + 48, x + 28, y + 44, c);
  fillTriangle(x + 36, y + 38, x + 44, y + 48, x + 36, y + 44, c);
  fillTriangle(x + 29, y + 38, x + 35, y + 38, x + 32, y + 54, [242, 166, 90]);
  fillRect(x + 30, y + 20, 4, 6, WHITE);
}

function iconCapitol(x: number, y: number, c: RGB): void {
  // Dome + columns.
  fillCircle(x + 32, y + 22, 12, c);
  fillRect(x + 20, y + 22, 24, 4, c);
  fillRect(x + 30, y + 6, 4, 8, c);
  fillRect(x + 14, y + 26, 36, 3, c);
  for (let i = 0; i < 5; i++) fillRect(x + 15 + i * 7, y + 32, 3, 14, c);
  fillRect(x + 12, y + 46, 40, 4, c);
  fillRect(x + 10, y + 50, 44, 4, c);
}

function iconCyclone(x: number, y: number, c: RGB): void {
  // Spiral storm: concentric arcs, tightening to the eye.
  circleOutline(x + 32, y + 32, 24, c);
  circleOutline(x + 30, y + 32, 17, c);
  circleOutline(x + 34, y + 32, 10, c);
  fillCircle(x + 32, y + 32, 4, c);
  fillRect(x + 8, y + 8, 10, 3, c);
  fillRect(x + 46, y + 52, 10, 3, c);
}

function iconChip(x: number, y: number, c: RGB): void {
  // Microchip: body, die, pins on four sides.
  fillRect(x + 18, y + 18, 28, 28, c);
  fillRect(x + 26, y + 26, 12, 12, WHITE);
  for (let i = 0; i < 4; i++) {
    const p = 20 + i * 8;
    fillRect(x + p, y + 10, 3, 8, c);
    fillRect(x + p, y + 46, 3, 8, c);
    fillRect(x + 10, y + p, 8, 3, c);
    fillRect(x + 46, y + p, 8, 3, c);
  }
}

function iconGlobe(x: number, y: number, c: RGB): void {
  // Globe: outline, equator, meridians.
  circleOutline(x + 32, y + 32, 22, c);
  hline(x + 10, y + 32, 44, c, 2);
  vline(x + 32, y + 10, 44, c, 2);
  line(x + 14, y + 20, x + 50, y + 20, c, 2);
  line(x + 14, y + 44, x + 50, y + 44, c, 2);
}

function iconSatellite(x: number, y: number, c: RGB): void {
  // Satellite: bus, two solar panels, dish.
  fillRect(x + 28, y + 26, 12, 12, c);
  fillRect(x + 8, y + 28, 16, 8, c);
  fillRect(x + 44, y + 28, 16, 8, c);
  line(x + 32, y + 26, x + 32, y + 12, c, 2);
  fillCircle(x + 32, y + 10, 4, c);
  line(x + 40, y + 38, x + 50, y + 48, c, 2);
  fillCircle(x + 52, y + 50, 4, c);
}

// --- Story panels -----------------------------------------------------------

interface Panel {
  kicker: string;
  headline: string;
  body: string;
  accent: RGB;
  icon: IconFn;
}

const PANELS: Panel[] = [
  {
    kicker: 'MIDDLE EAST',
    headline: 'US AND IRAN TRADE FIRE AGAIN',
    body: 'US STRUCK A MISSILE SITE ON QESHM ISLAND AFTER IRAN HIT A US RADAR BASE IN BAHRAIN, THEN A US BASE IN KUWAIT.',
    accent: RED,
    icon: iconRocket,
  },
  {
    kicker: 'WASHINGTON',
    headline: 'JEFFRIES SET TO MAKE HISTORY',
    body: 'DEMOCRATS NOMINATE HAKEEM JEFFRIES FOR SPEAKER, THE FIRST AFRICAN-AMERICAN IN THE JOB, AFTER RECORD SENATE GAINS.',
    accent: BLUE,
    icon: iconCapitol,
  },
  {
    kicker: 'INDIA',
    headline: 'CYCLONE AKVAN NEARS INDIA',
    body: 'THE STORM IS EXPECTED TO CROSS THE COAST BETWEEN MACHILIPATNAM AND PURI AS INDIA BRACES FOR HEAVY RAIN AND WINDS.',
    accent: TEAL,
    icon: iconCyclone,
  },
  {
    kicker: 'TECHNOLOGY',
    headline: 'HUANG RESIGNS AT NVIDIA',
    body: 'HUANG STEPS DOWN AT NVIDIA. ACTING CEO COLETTE KRESS PROMISES EARLIER PAY RAISES AND HALTS H-SERIES SALES TO CHINA.',
    accent: PURPLE,
    icon: iconChip,
  },
  {
    kicker: 'DIPLOMACY',
    headline: 'TRUMP, XI, PUTIN TO MEET',
    body: 'THE THREE LEADERS MEET FOR TRILATERAL TALKS AT APEC IN SHENZHEN, WITH TRADE AND SECURITY ON THE AGENDA.',
    accent: GREEN,
    icon: iconGlobe,
  },
  {
    kicker: 'SPACE',
    headline: 'VOYAGER 1 NEARS A LIGHT-DAY',
    body: "NASA'S PIONEER PROBE IS BELIEVED TO HAVE REACHED A LIGHT-DAY FROM EARTH, WITH CONFIRMATION EXPECTED TODAY.",
    accent: INDIGO,
    icon: iconSatellite,
  },
];

function drawPanel(p: Panel, x: number, y: number, w: number, h: number): void {
  fillRect(x, y, w, h, PANEL_BG);
  fillRect(x, y, w, 4, p.accent);
  hline(x, y + h - 1, w, RULE);

  // Icon box, left.
  const ix = x + 10;
  const iy = y + 14;
  fillRect(ix, iy, 64, 64, PAPER);
  hline(ix, iy, 64, p.accent, 2);
  hline(ix, iy + 63, 64, p.accent, 2);
  vline(ix, iy, 64, p.accent, 2);
  vline(ix + 63, iy, 64, p.accent, 2);
  p.icon(ix, iy, p.accent);

  // Text, right of the icon.
  const tx = x + 84;
  const textW = x + w - 10 - tx;
  const maxChars = Math.floor(textW / 12); // scale 2
  let ty = y + 12;
  drawText(p.kicker, tx, ty, 2, p.accent);
  ty += 19;
  const headLines = wrap(p.headline, maxChars);
  for (const ln of headLines) {
    drawText(ln, tx, ty, 2, INK);
    ty += 16;
  }
  ty += 4;
  const bodyLines = wrap(p.body, maxChars);
  for (const ln of bodyLines) {
    drawText(ln, tx, ty, 2, SOFT_INK);
    ty += 15;
  }
}

function drawPanels(): void {
  drawText('ALSO IN THE WORLD TODAY', 0, 524, 3, INK, 'center', W / 2);
  const headerW = textWidth('ALSO IN THE WORLD TODAY', 3);
  const cx = W / 2;
  hline(MARGIN, 532, cx - headerW / 2 - MARGIN - 16, RULE);
  hline(cx + headerW / 2 + 16, 532, W - MARGIN - (cx + headerW / 2 + 16), RULE);

  const gap = 16;
  const colW = Math.floor((CONTENT_W - gap) / 2); // 472
  const rowH = 118;
  const rowGap = 10;
  const y0 = 556;
  for (let i = 0; i < PANELS.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    drawPanel(
      PANELS[i],
      MARGIN + col * (colW + gap),
      y0 + row * (rowH + rowGap),
      colW,
      rowH,
    );
  }
}

// --- "Also today" ticker ----------------------------------------------------

function drawTicker(): void {
  hline(MARGIN, 940, CONTENT_W, RULE);
  const lines = [
    'ALSO TODAY: EU PROPOSES A 45-BILLION-EURO LOAN FOR UKRAINE, TO BE REPAID',
    "AFTER RUSSIA PAYS REPARATIONS - PEW: ISLAM TO BE THE WORLD'S LARGEST RELIGION",
    'BY 2035 - FED MINUTES POINT TO FURTHER RATE HIKES',
  ];
  let ty = 950;
  for (const ln of lines) {
    drawText(ln, MARGIN, ty, 2, INK);
    ty += 16;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  fillRect(0, 0, W, H, PAPER);
  drawMasthead();
  drawHero();
  drawPanels();
  drawTicker();

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'entry.png'), encodePNG());
}

main();
