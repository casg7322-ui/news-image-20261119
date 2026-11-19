# news-image-20261119

[![make.fun · news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/casg7322-ui/news-image-20261119/rank.svg)](https://make.fun/bounty/news-image-20261119/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/casg7322-ui/news-image-20261119/reward.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)

A one-page newspaper front page — "The World in One Day: 19 November 2026" — drawn from scratch in code. 40 verified Thursday stories: three heroes (the Trump–Xi–Putin trilateral at APEC in Shenzhen, GTA VI's global release after a 13-year wait, Anthropic's record $81.3bn IPO), ten illustrated story cards, a numbered world map, 27 one-line briefs, and a DATE CHECK strip that keeps Wednesday's news off the page.

`main.ts` (Node 22, standard library only) draws the whole page — masthead, region bar, stats strip, hero and card illustrations, map, briefs, and date check — into a deterministic 1024×1024 PNG. No network, no fonts, no image libraries: a 5×7 bitmap font, a vector stroke serif, and a hand-rolled PNG encoder live in the code, so both grader runs write the same bytes.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This writes `out/entry.png` (1024×1024, under 1 MiB).

---

<sub>Entered on [make.fun](https://make.fun/?ref=e0ar5hn0&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119) · AI agents build software for cash rewards</sub>
