// art.ts — flat-style illustrations for the 13 cards, drawn with primitives.
import { Canvas, hex, type RGB } from "./render.ts";

// ---------- shared helpers ----------
function sky(cv: Canvas, x: number, y: number, w: number, h: number, top: RGB, bot: RGB): void {
  for (let i = 0; i < h; i++) {
    const t = h <= 1 ? 0 : i / (h - 1);
    cv.hline(x, y + i, w, [
      Math.round(top[0] + (bot[0] - top[0]) * t),
      Math.round(top[1] + (bot[1] - top[1]) * t),
      Math.round(top[2] + (bot[2] - top[2]) * t),
    ]);
  }
}

function building(cv: Canvas, x: number, yBase: number, w: number, h: number, c: RGB, lit: RGB): void {
  cv.fillRect(x, yBase - h, w, h, c);
  // a few lit windows
  for (let wy = yBase - h + 4; wy < yBase - 4; wy += 7) {
    for (let wx = x + 3; wx < x + w - 3; wx += 7) {
      if ((wx * 7 + wy * 13) % 5 < 2) cv.fillRect(wx, wy, 2, 3, lit);
    }
  }
}

function flagPole(cv: Canvas, x: number, yBase: number, h: number, c: RGB): void {
  cv.fillRect(x, yBase - h, 2, h, c);
}

// US flag (simplified): red/white stripes + blue canton.
function flagUS(cv: Canvas, x: number, y: number, w: number, h: number): void {
  const stripe = h / 7;
  for (let i = 0; i < 7; i++) {
    cv.fillRect(x, y + i * stripe, w, stripe + 1, i % 2 === 0 ? hex("#b22234") : hex("#ffffff"));
  }
  cv.fillRect(x, y, w * 0.4, stripe * 4, hex("#3c3b6e"));
  cv.fillCircle(x + w * 0.2, y + stripe * 2, 1.5, hex("#ffffff"));
}
// China flag: red + yellow stars.
function flagCN(cv: Canvas, x: number, y: number, w: number, h: number): void {
  cv.fillRect(x, y, w, h, hex("#de2910"));
  cv.fillCircle(x + w * 0.22, y + h * 0.28, Math.max(1.5, h * 0.14), hex("#ffde00"));
  cv.fillCircle(x + w * 0.42, y + h * 0.2, h * 0.07, hex("#ffde00"));
  cv.fillCircle(x + w * 0.48, y + h * 0.38, h * 0.07, hex("#ffde00"));
}
// Russia flag: white/blue/red horizontal.
function flagRU(cv: Canvas, x: number, y: number, w: number, h: number): void {
  cv.fillRect(x, y, w, h / 3 + 1, hex("#ffffff"));
  cv.fillRect(x, y + h / 3, w, h / 3 + 1, hex("#0039a6"));
  cv.fillRect(x, y + (2 * h) / 3, w, h / 3 + 1, hex("#d52b1e"));
}
// France flag: blue/white/red vertical.
function flagFR(cv: Canvas, x: number, y: number, w: number, h: number): void {
  cv.fillRect(x, y, w / 3 + 1, h, hex("#0055a4"));
  cv.fillRect(x + w / 3, y, w / 3 + 1, h, hex("#ffffff"));
  cv.fillRect(x + (2 * w) / 3, y, w / 3 + 1, h, hex("#ef4135"));
}
// Ukraine flag: blue/yellow horizontal.
function flagUA(cv: Canvas, x: number, y: number, w: number, h: number): void {
  cv.fillRect(x, y, w, h / 2 + 1, hex("#005bbb"));
  cv.fillRect(x, y + h / 2, w, h / 2 + 1, hex("#ffd500"));
}

function palm(cv: Canvas, x: number, yBase: number, s: number, c: RGB): void {
  // Trunk (slight lean) + 5 fronds.
  cv.thickLine(x, yBase, x + 2 * s, yBase - 12 * s, c, Math.max(1, 1.5 * s));
  const tx = x + 2 * s;
  const ty = yBase - 12 * s;
  for (let i = 0; i < 5; i++) {
    const a = Math.PI * (0.15 + i * 0.18);
    cv.thickLine(tx, ty, tx + Math.cos(a) * 8 * s, ty - Math.sin(a) * 4 * s + 2 * s, c, Math.max(1, s));
  }
}

// ---------- hero illustrations (large) ----------
export function artSummit(cv: Canvas, x: number, y: number, w: number, h: number): void {
  sky(cv, x, y, w, h, hex("#2c4a6e"), hex("#d8c49a"));
  cv.fillCircle(x + w * 0.78, y + h * 0.32, h * 0.16, hex("#f2d492"));
  const base = y + h;
  const dark = hex("#233247");
  const lit = hex("#ffd97a");
  building(cv, x + w * 0.04, base, w * 0.1, h * 0.55, dark, lit);
  building(cv, x + w * 0.17, base, w * 0.12, h * 0.72, hex("#1d2c40"), lit);
  building(cv, x + w * 0.32, base, w * 0.09, h * 0.5, dark, lit);
  building(cv, x + w * 0.44, base, w * 0.13, h * 0.8, hex("#1d2c40"), lit);
  building(cv, x + w * 0.6, base, w * 0.1, h * 0.6, dark, lit);
  building(cv, x + w * 0.73, base, w * 0.12, h * 0.7, hex("#1d2c40"), lit);
  building(cv, x + w * 0.88, base, w * 0.09, h * 0.5, dark, lit);
  // Three flags on the roofline.
  const fy = y + h * 0.12;
  const fw = w * 0.09;
  const fh = h * 0.2;
  flagPole(cv, x + w * 0.1, fy + fh, h * 0.12, hex("#111111"));
  flagUS(cv, x + w * 0.1 + 2, fy, fw, fh);
  flagPole(cv, x + w * 0.45, fy + fh, h * 0.12, hex("#111111"));
  flagCN(cv, x + w * 0.45 + 2, fy, fw, fh);
  flagPole(cv, x + w * 0.8, fy + fh, h * 0.12, hex("#111111"));
  flagRU(cv, x + w * 0.8 + 2, fy, fw, fh);
}

export function artGTA(cv: Canvas, x: number, y: number, w: number, h: number): void {
  sky(cv, x, y, w, h, hex("#3b1d5e"), hex("#ff7e3d"));
  // Sun setting over the water.
  cv.fillCircle(x + w * 0.5, y + h * 0.62, h * 0.3, hex("#ffd166"));
  cv.fillRect(x, y + h * 0.68, w, h * 0.32, hex("#1d4e6b"));
  // Water glints.
  for (let i = 0; i < 8; i++) {
    const gy = y + h * (0.72 + i * 0.035);
    cv.fillRect(x + w * (0.38 + (i % 3) * 0.08), gy, w * (0.2 - i * 0.015), 2, hex("#ffd166"));
  }
  // Skyline silhouettes.
  const sil = hex("#241238");
  building(cv, x + w * 0.03, y + h * 0.68, w * 0.09, h * 0.3, sil, sil);
  building(cv, x + w * 0.15, y + h * 0.68, w * 0.07, h * 0.42, sil, sil);
  building(cv, x + w * 0.78, y + h * 0.68, w * 0.08, h * 0.36, sil, sil);
  building(cv, x + w * 0.88, y + h * 0.68, w * 0.09, h * 0.26, sil, sil);
  // Palms.
  palm(cv, x + w * 0.28, y + h * 0.68, 1.6, sil);
  palm(cv, x + w * 0.68, y + h * 0.68, 1.4, sil);
}

export function artIPO(cv: Canvas, x: number, y: number, w: number, h: number): void {
  cv.fillRect(x, y, w, h, hex("#0b3d2e"));
  // Grid lines.
  for (let i = 1; i < 5; i++) {
    cv.hline(x, y + (h * i) / 5, w, hex("#14532d"), 1);
  }
  // Candlesticks rising left to right.
  const n = 9;
  for (let i = 0; i < n; i++) {
    const cx = x + (w * (i + 0.7)) / (n + 0.5);
    const bw = w * 0.045;
    const base = y + h * 0.82 - i * h * 0.045;
    const up = i % 3 !== 2;
    const col = up ? hex("#22c55e") : hex("#ef4444");
    const bh = h * (0.08 + ((i * 37) % 10) * 0.008);
    cv.fillRect(cx - bw / 2, base - bh, bw, bh, col);
    cv.fillRect(cx - 1, base - bh - h * 0.05, 2, h * 0.05 + bh + h * 0.03, col);
  }
  // Rising trend line.
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= 10; i++) {
    pts.push([x + (w * i) / 10, y + h * 0.78 - (i * h * 0.05) - Math.sin(i * 1.3) * h * 0.03]);
  }
  for (let i = 0; i + 1 < pts.length; i++) {
    cv.thickLine(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], hex("#fde047"), 2);
  }
  // Arrowhead.
  const [ax, ay] = pts[pts.length - 1];
  cv.fillTriangle(ax, ay - 8, ax + 10, ay + 2, ax - 2, ay + 6, hex("#fde047"));
}

// ---------- medium-card illustrations (small) ----------
export function artICJ(cv: Canvas, x: number, y: number, w: number, h: number): void {
  sky(cv, x, y, w, h, hex("#dbe7f3"), hex("#f5edd8"));
  const cream = hex("#e8dcc0");
  const col = hex("#8a7a5c");
  // Pediment + columns + base.
  cv.fillTriangle(x + w * 0.1, y + h * 0.45, x + w * 0.5, y + h * 0.12, x + w * 0.9, y + h * 0.45, cream);
  cv.fillRect(x + w * 0.1, y + h * 0.45, w * 0.8, h * 0.08, col);
  for (let i = 0; i < 5; i++) {
    cv.fillRect(x + w * (0.16 + i * 0.15), y + h * 0.53, w * 0.05, h * 0.32, cream);
  }
  cv.fillRect(x + w * 0.08, y + h * 0.85, w * 0.84, h * 0.1, col);
}

export function artCOP(cv: Canvas, x: number, y: number, w: number, h: number): void {
  sky(cv, x, y, w, h, hex("#fde68a"), hex("#fef3c7"));
  cv.fillCircle(x + w * 0.82, y + h * 0.26, h * 0.22, hex("#f59e0b"));
  // Wind turbines.
  const tw = (tx: number, s: number): void => {
    const bx = x + tx;
    const by = y + h * 0.92;
    cv.fillRect(bx, y + h * 0.35, 2, h * 0.57, hex("#475569"));
    const hx = bx + 1;
    const hy = y + h * 0.35;
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
      cv.thickLine(hx, hy, hx + Math.cos(a) * 12 * s, hy + Math.sin(a) * 12 * s, hex("#64748b"), 2);
    }
  };
  tw(w * 0.25, 1);
  tw(w * 0.55, 0.8);
  // Waves.
  cv.fillRect(x, y + h * 0.88, w, h * 0.12, hex("#0e7490"));
  cv.fillRect(x + w * 0.1, y + h * 0.84, w * 0.2, 2, hex("#22d3ee"));
  cv.fillRect(x + w * 0.6, y + h * 0.84, w * 0.25, 2, hex("#22d3ee"));
}

export function artCyclone(cv: Canvas, x: number, y: number, w: number, h: number): void {
  sky(cv, x, y, w, h, hex("#1e3a5f"), hex("#3b6ea5"));
  // Spiral: concentric arcs.
  const cx = x + w * 0.5;
  const cy = y + h * 0.5;
  for (let r = 4; r < h * 0.55; r += 4) {
    const steps = 20;
    for (let i = 0; i < steps; i++) {
      const a0 = (i / steps) * Math.PI * 1.5 + r * 0.15;
      const a1 = ((i + 1) / steps) * Math.PI * 1.5 + r * 0.15;
      cv.line(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r * 0.8, cx + Math.cos(a1) * r, cy + Math.sin(a1) * r * 0.8, hex("#e0f2fe"));
    }
  }
  cv.fillCircle(cx, cy, 3, hex("#f8fafc"));
  // Rain streaks.
  for (let i = 0; i < 12; i++) {
    const rx = x + ((i * 53) % Math.floor(w));
    const ry = y + ((i * 29) % Math.floor(h * 0.7));
    cv.line(rx, ry, rx - 3, ry + 8, hex("#bae6fd"));
  }
}

export function artKyiv(cv: Canvas, x: number, y: number, w: number, h: number): void {
  sky(cv, x, y, w, h, hex("#005bbb"), hex("#ffd500"));
  const dark = hex("#1e293b");
  const base = y + h;
  building(cv, x + w * 0.05, base, w * 0.14, h * 0.45, dark, dark);
  building(cv, x + w * 0.24, base, w * 0.12, h * 0.6, dark, dark);
  // Golden dome.
  cv.fillRect(x + w * 0.44, base - h * 0.55, w * 0.16, h * 0.55, dark);
  cv.fillCircle(x + w * 0.52, base - h * 0.55, w * 0.09, hex("#ffd500"));
  cv.fillRect(x + w * 0.515, base - h * 0.78, 2, h * 0.15, hex("#ffd500"));
  building(cv, x + w * 0.66, base, w * 0.13, h * 0.5, dark, dark);
  building(cv, x + w * 0.84, base, w * 0.11, h * 0.38, dark, dark);
  flagUA(cv, x + w * 0.08, y + h * 0.1, w * 0.14, h * 0.22);
}

export function artAPEC(cv: Canvas, x: number, y: number, w: number, h: number): void {
  sky(cv, x, y, w, h, hex("#dbeafe"), hex("#eff6ff"));
  // Globe.
  const cx = x + w * 0.5;
  const cy = y + h * 0.52;
  const r = h * 0.42;
  cv.fillCircle(cx, cy, r, hex("#2563eb"));
  cv.fillCircle(cx - r * 0.3, cy - r * 0.2, r * 0.28, hex("#4ade80"));
  cv.fillCircle(cx + r * 0.35, cy + r * 0.25, r * 0.22, hex("#4ade80"));
  cv.circle(cx, cy, r, hex("#1e40af"), 2);
  // Orbit ring.
  cv.circle(cx, cy, r * 1.25, hex("#93c5fd"), 1);
  // Small flags around.
  flagUS(cv, x + w * 0.06, y + h * 0.12, w * 0.14, h * 0.2);
  flagCN(cv, x + w * 0.8, y + h * 0.12, w * 0.14, h * 0.2);
}

export function artFlorida(cv: Canvas, x: number, y: number, w: number, h: number): void {
  sky(cv, x, y, w, h, hex("#475569"), hex("#94a3b8"));
  // Rain.
  for (let i = 0; i < 16; i++) {
    const rx = x + ((i * 37) % Math.floor(w));
    const ry = y + ((i * 23) % Math.floor(h * 0.6));
    cv.line(rx, ry, rx - 2, ry + 7, hex("#e2e8f0"));
  }
  // House half-submerged.
  const hx = x + w * 0.3;
  const hy = y + h * 0.55;
  cv.fillRect(hx, hy, w * 0.4, h * 0.3, hex("#f1f5f9"));
  cv.fillTriangle(hx - w * 0.03, hy, hx + w * 0.2, hy - h * 0.18, hx + w * 0.43, hy, hex("#b91c1c"));
  // Flood water.
  cv.fillRect(x, y + h * 0.72, w, h * 0.28, hex("#0369a1"));
  cv.fillRect(x + w * 0.05, y + h * 0.78, w * 0.25, 2, hex("#7dd3fc"));
  cv.fillRect(x + w * 0.6, y + h * 0.82, w * 0.3, 2, hex("#7dd3fc"));
  palm(cv, x + w * 0.82, y + h * 0.72, 1, hex("#14532d"));
}

export function artGaza(cv: Canvas, x: number, y: number, w: number, h: number): void {
  sky(cv, x, y, w, h, hex("#e7c989"), hex("#f5e6c4"));
  // Smoke columns.
  cv.fillCircle(x + w * 0.25, y + h * 0.3, h * 0.14, hex("#78716c"));
  cv.fillCircle(x + w * 0.3, y + h * 0.2, h * 0.1, hex("#a8a29e"));
  cv.fillCircle(x + w * 0.7, y + h * 0.35, h * 0.12, hex("#78716c"));
  // Ground.
  cv.fillRect(x, y + h * 0.68, w, h * 0.32, hex("#a1845c"));
  // Yellow Line.
  cv.fillRect(x, y + h * 0.62, w, 3, hex("#facc15"));
  // Tank.
  const tx = x + w * 0.42;
  const ty = y + h * 0.62;
  cv.fillRect(tx, ty - h * 0.16, w * 0.22, h * 0.16, hex("#3f6212"));
  cv.fillRect(tx + w * 0.05, ty - h * 0.26, w * 0.12, h * 0.1, hex("#3f6212"));
  cv.fillRect(tx + w * 0.15, ty - h * 0.24, w * 0.12, 2, hex("#3f6212"));
  for (let i = 0; i < 4; i++) {
    cv.fillCircle(tx + w * (0.03 + i * 0.055), ty - 1, 2.5, hex("#1a2e05"));
  }
}

export function artParis(cv: Canvas, x: number, y: number, w: number, h: number): void {
  sky(cv, x, y, w, h, hex("#bfdbfe"), hex("#eff6ff"));
  // Eiffel Tower (stylised lattice triangle).
  const cx = x + w * 0.5;
  const base = y + h * 0.95;
  const top = y + h * 0.08;
  const iron = hex("#4b5563");
  cv.thickLine(cx - w * 0.16, base, cx, top, iron, 3);
  cv.thickLine(cx + w * 0.16, base, cx, top, iron, 3);
  cv.hline(cx - w * 0.11, base - h * 0.3, w * 0.22, iron, 2);
  cv.hline(cx - w * 0.07, base - h * 0.55, w * 0.14, iron, 2);
  cv.hline(cx - w * 0.03, base - h * 0.75, w * 0.06, iron, 2);
  flagFR(cv, x + w * 0.06, y + h * 0.12, w * 0.16, h * 0.22);
  flagFR(cv, x + w * 0.78, y + h * 0.12, w * 0.16, h * 0.22);
}

export function artSaudi(cv: Canvas, x: number, y: number, w: number, h: number): void {
  sky(cv, x, y, w, h, hex("#fdba74"), hex("#ffedd5"));
  cv.fillCircle(x + w * 0.78, y + h * 0.28, h * 0.18, hex("#fff7ed"));
  // Desert ground.
  cv.fillRect(x, y + h * 0.68, w, h * 0.32, hex("#d6a860"));
  // Low dune ridge.
  cv.fillTriangle(x, y + h * 0.68, x + w * 0.3, y + h * 0.52, x + w * 0.6, y + h * 0.68, hex("#c99a52"));
  // Skyline.
  const dark = hex("#78350f");
  building(cv, x + w * 0.08, y + h * 0.72, w * 0.1, h * 0.3, dark, dark);
  building(cv, x + w * 0.22, y + h * 0.72, w * 0.08, h * 0.42, dark, dark);
  // Green all-clear check.
  cv.fillCircle(x + w * 0.55, y + h * 0.4, h * 0.24, hex("#16a34a"));
  cv.thickLine(x + w * 0.5, y + h * 0.4, x + w * 0.54, y + h * 0.47, hex("#ffffff"), 3);
  cv.thickLine(x + w * 0.54, y + h * 0.47, x + w * 0.61, y + h * 0.31, hex("#ffffff"), 3);
}

export function artLibya(cv: Canvas, x: number, y: number, w: number, h: number): void {
  sky(cv, x, y, w, h, hex("#1e3a5f"), hex("#2d5a87"));
  // Sea.
  cv.fillRect(x, y + h * 0.6, w, h * 0.4, hex("#0c4a6e"));
  // Cargo ship.
  const sx = x + w * 0.15;
  const sy = y + h * 0.6;
  cv.fillRect(sx, sy - h * 0.08, w * 0.55, h * 0.12, hex("#7f1d1d"));
  cv.fillRect(sx + w * 0.08, sy - h * 0.22, w * 0.12, h * 0.14, hex("#f59e0b"));
  cv.fillRect(sx + w * 0.22, sy - h * 0.22, w * 0.12, h * 0.14, hex("#22c55e"));
  cv.fillRect(sx + w * 0.36, sy - h * 0.22, w * 0.12, h * 0.14, hex("#3b82f6"));
  cv.fillRect(sx + w * 0.44, sy - h * 0.34, w * 0.06, h * 0.12, hex("#e5e7eb"));
  // Seized crates on the dock.
  cv.fillRect(x + w * 0.78, y + h * 0.5, w * 0.14, h * 0.14, hex("#a16207"));
  cv.fillRect(x + w * 0.8, y + h * 0.38, w * 0.1, h * 0.12, hex("#a16207"));
  // Red X over crates.
  cv.thickLine(x + w * 0.76, y + h * 0.34, x + w * 0.94, y + h * 0.62, hex("#ef4444"), 2);
  cv.thickLine(x + w * 0.94, y + h * 0.34, x + w * 0.76, y + h * 0.62, hex("#ef4444"), 2);
}
