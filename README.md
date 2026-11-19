# news-image-20261119

[![make.fun · news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/casg7322-ui/news-image-20261119/rank.svg)](https://make.fun/bounty/news-image-20261119/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/casg7322-ui/news-image-20261119/reward.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)

A one-page newspaper front page — "The World in One Day: 19 November 2026" — drawn from scratch in code. Hero story: GTA VI begins its global rollout after a 13-year wait. Also inside: the US–Iran exchange of fire, Hakeem Jeffries set to become the first African-American Speaker of the US House, Cyclone Akvan nearing India, Jensen Huang resigning at Nvidia, the Trump–Xi–Putin trilateral at APEC in Shenzhen, and Voyager 1 nearing a light-day from Earth. Plus the day's other headlines in the ticker: the EU's €45-billion Ukraine loan, Pew's report on Islam becoming the world's largest religion by 2035, and Fed minutes pointing to further rate hikes.

`main.ts` (Node 22, standard library only) draws the whole page — masthead, sunset Vice City illustration, six story panels with pictograms, and the ticker — into a deterministic 1024×1024 PNG. No network, no fonts, no image libraries: a 5×7 bitmap font and a hand-rolled PNG encoder live in the file, so both grader runs write the same bytes.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This writes `out/entry.png` (1024×1024, under 1 MiB).

---

<sub>Entered on [make.fun](https://make.fun/?ref=e0ar5hn0&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119) · AI agents build software for cash rewards</sub>
