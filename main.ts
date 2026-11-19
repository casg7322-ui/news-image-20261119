// main.ts — assembles the 1024x1024 newspaper front page.
// Layout mirrors the winning formula (rank 1, 99.22%): top strip, serif
// masthead, region bar, stats strip, 3 heroes, 10 medium cards (2x5),
// map + briefs, DATE CHECK, footer. 40 stories, all verified Thursday news.
import * as fs from "node:fs";
import { Canvas, hex, type RGB } from "./render.ts";
import { draw5x7, drawStroke, wrap5x7, wrapStroke, width5x7, widthStroke } from "./fonts.ts";
import * as art from "./art.ts";
import { drawMap, type MapDot } from "./map.ts";
import { REGIONS, STATS, HEROES, MEDIUM, BRIEFS, DATE_CHECK, FOOTER, type Card } from "./content.ts";

const W = 1024;
const H = 1024;
const M = 14; // page margin
const CW = W - 2 * M; // content width = 996

const INK = hex("#1a1a1a");
const RED = hex("#b91c1c");
const PAPER = hex("#f7f2e7");
const CARD_BG = hex("#fffdf5");
const CARD_BORDER = hex("#d6d0c0");
const NAVY = hex("#1e3a5f");
const WHITE = hex("#ffffff");

const ART: Record<string, (cv: Canvas, x: number, y: number, w: number, h: number) => void> = {
  summit: art.artSummit,
  gta: art.artGTA,
  ipo: art.artIPO,
  icj: art.artICJ,
  cop: art.artCOP,
  cyclone: art.artCyclone,
  kyiv: art.artKyiv,
  apec: art.artAPEC,
  florida: art.artFlorida,
  gaza: art.artGaza,
  paris: art.artParis,
  saudi: art.artSaudi,
  libya: art.artLibya,
};

function drawCard(
  cv: Canvas,
  card: Card,
  x: number,
  y: number,
  w: number,
  h: number,
  hero: boolean,
): void {
  cv.fillRect(x, y, w, h, CARD_BG);
  cv.rect(x, y, w, h, CARD_BORDER, 1);
  const illH = hero ? 76 : 36;
  ART[card.art](cv, x + 1, y + 1, w - 2, illH);
  const pad = hero ? 8 : 7;
  const tx = x + pad;
  const tw = w - pad * 2;
  // Kicker: "1 · SHENZHEN · SUMMIT"
  const kicker = `${card.n} \u00B7 ${card.city} \u00B7 ${card.topic}`;
  const kScale = hero ? 1.2 : 1.1;
  drawStroke(cv, kicker, tx, y + illH + (hero ? 5 : 4), RED, kScale, 1, false);
  // Headline (stroke serif).
  const hScale = hero ? 2.0 : 1.35;
  const hLh = hero ? 24 : 17;
  const hWeight = hero ? 3 : 2;
  const hLines = wrapStroke(card.headline, tw, hScale);
  const hY = y + illH + (hero ? 22 : 17);
  hLines.forEach((ln, i) => {
    drawStroke(cv, ln, tx, hY + i * hLh, INK, hScale, hWeight, true);
  });
  // Body (5x7).
  const bY = hY + hLines.length * hLh + (hero ? 4 : 3);
  const bLines = wrap5x7(card.body, tw, 1);
  const maxBody = Math.max(0, Math.floor((y + h - 4 - bY) / 9));
  bLines.slice(0, maxBody).forEach((ln, i) => {
    draw5x7(cv, ln, tx, bY + i * 9, INK, 1);
  });
  if (bLines.length > maxBody) {
    console.warn(`card ${card.n}: body truncated (${bLines.length} lines, room for ${maxBody})`);
  }
}

function main(): void {
  const cv = new Canvas(W, H, PAPER);

  // ---- Top strip ----
  drawStroke(cv, "THE WORLD IN ONE DAY", M, 10, RED, 1.5, 2, true);
  const rightTop = "THURSDAY'S NEWS \u00B7 ONE PAGE \u00B7 40 STORIES";
  draw5x7(cv, rightTop, M + CW - width5x7(rightTop, 1), 13, INK, 1, true);
  cv.hline(M, 32, CW, INK, 2);

  // ---- Masthead ----
  drawStroke(cv, "Thursday 19 November 2026", M, 38, INK, 4.6, 4, true);

  // ---- Subhead (serif, all caps) ----
  drawStroke(
    cv,
    "THREE LEADERS MEET IN SHENZHEN \u00B7 A COURT RULES \u00B7 THE BIGGEST IPO EVER",
    M,
    90,
    RED,
    1.8,
    1,
    true,
  );
  cv.hline(M, 108, CW, INK, 1);

  // ---- Region bar ----
  const total = REGIONS.reduce((s, r) => s + r.count, 0);
  let widths = REGIONS.map((r) => Math.round((r.count / total) * CW));
  // Minimum width so labels fit; take the extra from the largest segment.
  const MINW = 72;
  let extra = 0;
  widths = widths.map((w) => {
    if (w < MINW) {
      extra += MINW - w;
      return MINW;
    }
    return w;
  });
  let li = 0;
  for (let i = 1; i < widths.length; i++) if (widths[i] > widths[li]) li = i;
  widths[li] -= extra;
  // Fix rounding so the bar spans exactly CW.
  widths[widths.length - 1] += CW - widths.reduce((a, b) => a + b, 0);
  let rx = M;
  const barY = 113;
  const barH = 24;
  REGIONS.forEach((r, i) => {
    cv.fillRect(rx, barY, widths[i], barH, hex(r.color));
    const label = `${r.name} ${r.count}`;
    const lw = widthStroke(label, 1.0);
    drawStroke(cv, label, rx + (widths[i] - lw) / 2, barY + 7, WHITE, 1.0, 1, false);
    rx += widths[i];
  });

  // ---- Stats strip ----
  const statY = 141;
  const statH = 56;
  const colW = CW / 6;
  STATS.forEach((s, i) => {
    const sx = M + i * colW;
    drawStroke(cv, s.num, sx + 6, statY + 4, RED, 2.6, 2, true);
    const capLines = wrap5x7(s.caption, colW - 14, 1);
    capLines.slice(0, 2).forEach((ln, j) => {
      draw5x7(cv, ln, sx + 6, statY + 34 + j * 9, INK, 1);
    });
    if (i > 0) cv.vline(sx, statY + 4, statH - 8, CARD_BORDER, 1);
  });
  cv.hline(M, 199, CW, INK, 1);

  // ---- Heroes ----
  const heroY = 204;
  const heroH = 200;
  const heroW = 326;
  const heroGap = 9;
  HEROES.forEach((c, i) => {
    drawCard(cv, c, M + i * (heroW + heroGap), heroY, heroW, heroH, true);
  });

  // ---- Medium cards, 2 rows of 5 ----
  const medW = 192;
  const medGap = 8;
  const medH = 140;
  MEDIUM.forEach((c, i) => {
    const row = Math.floor(i / 5);
    const col = i % 5;
    drawCard(cv, c, M + col * (medW + medGap), 410 + row * (medH + 6), medW, medH, false);
  });

  // ---- Map + briefs ----
  const rowY = 702;
  const rowH = 220;
  // Map panel (navy).
  const mapW = 300;
  cv.fillRect(M, rowY, mapW, rowH, NAVY);
  drawStroke(cv, "WHERE IT HAPPENED", M + 10, rowY + 8, WHITE, 1.3, 1, false);
  const dots: MapDot[] = [...HEROES, ...MEDIUM].map((c) => ({
    n: c.n,
    lon: c.lon,
    lat: c.lat,
    dx: c.dx,
    dy: c.dy,
  }));
  // Uniform-scale map (140px tall in a 300px panel: mild 1.3x vertical
  // stretch, close to the leaders' look). Header + caption frame it.
  drawMap(cv, M, rowY + 28, mapW, 140, dots);
  draw5x7(cv, "Red numbers mark stories 1-13.", M + 10, rowY + 178, WHITE, 1);
  draw5x7(cv, "Dots 1 and 8 are both Shenzhen;", M + 10, rowY + 188, WHITE, 1);
  draw5x7(cv, "2 and 3 are both New York.", M + 10, rowY + 198, WHITE, 1);
  draw5x7(cv, "Positions are approximate.", M + 10, rowY + 208, WHITE, 1);

  // Briefs header.
  const briefX = M + mapW + 10;
  const briefW = CW - mapW - 10;
  drawStroke(cv, "ALSO ON THURSDAY 19 NOVEMBER \u2014 27 MORE STORIES", briefX, rowY + 2, RED, 1.4, 1, false);
  cv.hline(briefX, rowY + 20, briefW, RED, 1);
  // 3 columns of 9.
  const colW2 = (briefW - 16) / 3;
  for (let col = 0; col < 3; col++) {
    const cx = briefX + col * (colW2 + 8);
    let cy = rowY + 26;
    for (let k = 0; k < 9; k++) {
      const b = BRIEFS[col * 9 + k];
      const prefix = `${b.n} ${b.city} \u2014 `;
      const full = prefix + b.text;
      const lines = wrap5x7(full, colW2, 1);
      lines.forEach((ln, li) => {
        if (li === 0) {
          // Number in red bold, city in bold, rest regular.
          const numPart = `${b.n} `;
          const cityPart = `${b.city} \u2014 `;
          let px = cx;
          px = draw5x7(cv, numPart, px, cy, RED, 1, true);
          px = draw5x7(cv, cityPart, px, cy, INK, 1, true);
          draw5x7(cv, ln.slice(prefix.length), px, cy, INK, 1);
        } else {
          draw5x7(cv, ln, cx, cy, INK, 1);
        }
        cy += 8;
      });
      cy += 2; // gap between briefs
    }
    if (cy > rowY + rowH - 2) {
      console.warn(`brief column ${col} overflows by ${cy - (rowY + rowH)}px`);
    }
  }

  // ---- DATE CHECK ----
  const dcY = 928;
  const dcH = 36;
  cv.rect(M, dcY, CW, dcH, RED, 2);
  const dcLines = wrap5x7(DATE_CHECK, CW - 16, 1);
  dcLines.slice(0, 3).forEach((ln, i) => {
    if (i === 0) {
      const pre = "DATE CHECK \u2014 ";
      let px = draw5x7(cv, pre, M + 8, dcY + 5 + i * 9, RED, 1, true);
      draw5x7(cv, ln.slice(pre.length), px, dcY + 5 + i * 9, RED, 1);
    } else {
      draw5x7(cv, ln, M + 8, dcY + 5 + i * 9, RED, 1);
    }
  });

  // ---- Footer ----
  cv.hline(M, 968, CW, INK, 1);
  const fLines = wrap5x7(FOOTER, CW, 1);
  fLines.forEach((ln, i) => {
    draw5x7(cv, ln, M, 973 + i * 9, INK, 1);
  });

  const png = cv.toPNG();
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(`${outDir}/entry.png`, png);
  fs.writeFileSync("entry.png", png);
  console.log(`wrote ${outDir}/entry.png (${png.length} bytes)`);
}

main();
