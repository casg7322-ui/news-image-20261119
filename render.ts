// render.ts — canvas-free pixel renderer + minimal PNG encoder (Node stdlib only).
// Pure TypeScript, no dependencies. Deterministic output.
import * as zlib from "node:zlib";

export type RGB = [number, number, number];

function crc32(buf: Buffer): number {
  // Standard CRC-32 (IEEE 802.3), table built once.
  let table = (crc32 as unknown as { _t?: Uint32Array })._t;
  if (!table) {
    table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
    (crc32 as unknown as { _t: Uint32Array })._t = table;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  const crc = crc32(Buffer.concat([Buffer.from(type, "ascii"), data]));
  out.writeUInt32BE(crc, 8 + data.length);
  return out;
}

export class Canvas {
  readonly w: number;
  readonly h: number;
  readonly px: Buffer; // RGB, w*h*3

  constructor(w: number, h: number, bg: RGB) {
    this.w = w;
    this.h = h;
    this.px = Buffer.alloc(w * h * 3);
    this.fillRect(0, 0, w, h, bg);
  }

  set(x: number, y: number, c: RGB): void {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 3;
    this.px[i] = c[0];
    this.px[i + 1] = c[1];
    this.px[i + 2] = c[2];
  }

  fillRect(x: number, y: number, w: number, h: number, c: RGB): void {
    const x0 = Math.max(0, Math.round(x));
    const y0 = Math.max(0, Math.round(y));
    const x1 = Math.min(this.w, Math.round(x + w));
    const y1 = Math.min(this.h, Math.round(y + h));
    for (let yy = y0; yy < y1; yy++) {
      let i = (yy * this.w + x0) * 3;
      for (let xx = x0; xx < x1; xx++) {
        this.px[i] = c[0];
        this.px[i + 1] = c[1];
        this.px[i + 2] = c[2];
        i += 3;
      }
    }
  }

  rect(x: number, y: number, w: number, h: number, c: RGB, t = 1): void {
    this.fillRect(x, y, w, t, c);
    this.fillRect(x, y + h - t, w, t, c);
    this.fillRect(x, y, t, h, c);
    this.fillRect(x + w - t, y, t, h, c);
  }

  hline(x: number, y: number, w: number, c: RGB, t = 1): void {
    this.fillRect(x, y, w, t, c);
  }

  vline(x: number, y: number, h: number, c: RGB, t = 1): void {
    this.fillRect(x, y, t, h, c);
  }

  // Bresenham line, 1px.
  line(x0: number, y0: number, x1: number, y1: number, c: RGB): void {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    for (;;) {
      this.set(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  // Thick line via circle stamps (round caps/joins). width in px.
  thickLine(x0: number, y0: number, x1: number, y1: number, c: RGB, width: number): void {
    if (width <= 1) {
      this.line(x0, y0, x1, y1, c);
      return;
    }
    const r = width / 2;
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      this.fillCircle(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r, c);
    }
  }

  fillCircle(cx: number, cy: number, r: number, c: RGB): void {
    const x0 = Math.max(0, Math.floor(cx - r));
    const x1 = Math.min(this.w - 1, Math.ceil(cx + r));
    const y0 = Math.max(0, Math.floor(cy - r));
    const y1 = Math.min(this.h - 1, Math.ceil(cy + r));
    const rr = r * r;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        if (dx * dx + dy * dy <= rr) this.set(x, y, c);
      }
    }
  }

  circle(cx: number, cy: number, r: number, c: RGB, t = 1): void {
    // Outline circle: draw ring by stamping along circumference.
    const steps = Math.max(24, Math.floor(2 * Math.PI * r * 2));
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * 2 * Math.PI;
      this.fillCircle(cx + Math.cos(a) * r, cy + Math.sin(a) * r, t / 2, c);
    }
  }

  // Scanline polygon fill. pts: [x,y][] in pixel coords.
  fillPolygon(pts: Array<[number, number]>, c: RGB): void {
    if (pts.length < 3) return;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const [, y] of pts) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const y0 = Math.max(0, Math.floor(minY));
    const y1 = Math.min(this.h - 1, Math.ceil(maxY));
    for (let y = y0; y <= y1; y++) {
      const yc = y + 0.5;
      const xs: number[] = [];
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1p] = pts[i];
        const [x2, y2p] = pts[(i + 1) % pts.length];
        if ((y1p <= yc && y2p > yc) || (y2p <= yc && y1p > yc)) {
          const t = (yc - y1p) / (y2p - y1p);
          xs.push(x1 + t * (x2 - x1));
        }
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const xa = Math.max(0, Math.round(xs[k]));
        const xb = Math.min(this.w, Math.round(xs[k + 1]));
        if (xb > xa) this.fillRect(xa, y, xb - xa, 1, c);
      }
    }
  }

  // Triangle helper.
  fillTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, c: RGB): void {
    this.fillPolygon(
      [
        [x1, y1],
        [x2, y2],
        [x3, y3],
      ],
      c,
    );
  }

  toPNG(): Buffer {
    const raw = Buffer.alloc((this.w * 3 + 1) * this.h);
    for (let y = 0; y < this.h; y++) {
      const ro = y * (this.w * 3 + 1);
      raw[ro] = 0; // filter: none
      this.px.copy(raw, ro + 1, y * this.w * 3, (y + 1) * this.w * 3);
    }
    const idat = zlib.deflateSync(raw, { level: 9 });
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(this.w, 0);
    ihdr.writeUInt32BE(this.h, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 2; // color type RGB
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;
    return Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk("IHDR", ihdr),
      chunk("IDAT", idat),
      chunk("IEND", Buffer.alloc(0)),
    ]);
  }
}

export function hex(h: string): RGB {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
