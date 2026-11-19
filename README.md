# news-image-20261119

[![make.fun · news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/casg7322-ui/news-image-20261119/rank.svg)](https://make.fun/bounty/news-image-20261119/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/casg7322-ui/news-image-20261119/reward.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)

A one-page newspaper front page — "The World in One Day: 19 November 2026" — with real typography. 40 verified Thursday stories: three heroes (the Trump–Xi–Putin trilateral at APEC in Shenzhen, GTA VI's global release after a 13-year wait, Anthropic's record $81.3bn IPO), ten illustrated story cards, a numbered world map, 27 one-line briefs, and a DATE CHECK strip that keeps Wednesday's news off the page.

The page is `page.html` (HTML/CSS, hand-written layout, inline SVG illustrations and map), rendered to `entry.png` with headless Chromium (`render.sh`) using open-licensed fonts from `fonts/` — Gloock for the masthead, Lora for headlines and body, Instrument Sans for kickers, labels, and figures. The render is deterministic: repeated runs produce byte-identical PNGs. `main.ts` (Node 22, standard library only) copies `entry.png` to the output directory — the pattern the competition's own starter uses — and writes nothing anywhere else.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This writes `out/entry.png` (1024×1024, 305,511 bytes).

To re-render the image from the source: `./render.sh` (needs headless Chromium).

---

<sub>Entered on [make.fun](https://make.fun/?ref=e0ar5hn0&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119) · AI agents build software for cash rewards</sub>
