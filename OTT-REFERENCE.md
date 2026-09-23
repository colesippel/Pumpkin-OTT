# The OTT method — where these numbers come from

This is the reference document for the maths. If an AI ever proposes changing
the formula, read this first.

## Taking the three measurements

**OTT** stands for "Over The Top". Three tape measurements, added together:

| Measurement | How to take it |
|---|---|
| **Circumference** | All the way around the widest part of the pumpkin |
| **Side to side** | Ground to ground across the pumpkin, over its highest point |
| **End to end** | Ground to ground stem-to-blossom, over its highest point |

Both over-the-top measurements go **ground to ground**, straight down from the
edges of the fruit, and must pass over the highest point.

```
OTT = circumference + side-to-side + end-to-end
```

All in inches. **Measurement technique matters more than the maths.** The
formula is exact; a tape held at a sloppy angle is not. Inconsistent technique
between measurements is the most common reason a grower's tracked curve looks
wrong.

## The formula

The app uses the formula printed on the official 2025 GPC chart itself:

```
Weight_lbs = ((12.81 / (1 + 6.87 · 2^(−OTT/97)))³ + (OTT/45.9)^3.014) − 10
```

Source: **2025 GPC OTT Chart for Atlantic Giant Pumpkins**
<https://gpc1.org/wp-content/uploads/2025/05/2025-GPC-AG-OTT-Chart.pdf>
(Great Pumpkin Commonwealth; chart credited to Scott Holub.)

### It was verified, not assumed

The published chart lists 300 rows, OTT 160″ to 539″. Every row was checked
against this formula: **300 of 300 match exactly** when rounded to the nearest
pound.

That check isn't a one-off claim in a document — it runs every time you open
`tests/test.html`, against the real chart data in `data/ott_2025.js`. If the
formula and the published chart ever disagree, the test page goes red.

### Why a formula rather than a lookup table

The original brief called for looking up the rounded OTT in the table, with
optional interpolation between rows. The formula is strictly better here:

- **Exact at every row** — verified above, so nothing is lost by using it.
- **Handles decimals natively.** A real OTT is 384.375″, not 384″. The formula
  gives the true value; a table would need interpolation to approximate it.
- **No rounding step to get wrong.** The chart's own step size varies (1″, 2″
  and 5″ in different bands), which makes interpolation fiddlier than it looks.

The 300-row table is still in the project, doing two useful jobs: proving the
formula is right, and standing ready for a future "browse the chart" screen.

## Accuracy — what to tell people

OTT is an **estimate**, not a weight.

- Typically within about **5%** of true weight, per grower guidance.
- One published analysis of the method found roughly **76% of estimates land
  within ±10%**.
- Individual pumpkins vary. Wall thickness, shape and hollowness all push a
  fruit off the average the chart is built from — hence the grower expressions
  "going heavy" and "going light" to the chart.

The app states this in its footer, and that text should stay. A grower who
turns up to a weigh-off expecting the app's number to be the scale's number will
be disappointed roughly a quarter of the time.

## Range covered

The published chart runs **OTT 160″–539″**, corresponding to about
**98 lbs to 3,063 lbs**.

Outside that range the formula still returns a number, and the app shows it with
a visible warning that it's outside the published chart. That was a deliberate
choice: silently extrapolating would look identical to a charted result, and
hiding the number entirely would be unhelpful. Flagging it tells the truth.

## Where the chart comes from

The GPC publishes an updated OTT chart most years, built from weigh-off data
gathered across thousands of fruit. It's the common standard growers use to
compare estimates. Earlier chart generations were built on smaller samples — a
widely circulated 2005 table was based on 1,203 fruit from the 2003 and 2004
seasons — so the charts do shift as more data accumulates. That's the reason the
data files here are named by year rather than something generic.

## Updating to a future year's chart

When the GPC publishes a 2027 chart:

1. Get the new chart PDF and find the formula printed on it.
2. Update the constants in `js/ott.js` (`FORMULA`) and the `CHART` metadata,
   including the valid OTT range.
3. Create `data/ott_2027.js` and `data/ott_2027.json` with the new table.
4. Update the `<script>` tag in `index.html` and the reference in
   `tests/test.html` to point at the new files.
5. Update the `FILES` list in `sw.js` and **bump `CACHE_NAME`**.
6. Open `tests/test.html`. It must be green — that's your proof the new formula
   matches the new published chart.

Keeping the old year's files alongside the new ones is fine, and makes it
possible to show how an estimate would have read under a previous chart.

## Other formulas you may encounter

Several other OTT formulas circulate in the growing community. One commonly
cited pair:

```
OTT method:           lbs = 0.0000795 × OTT^2.76
Circumference method: lbs = 0.001517 × circumference^2.61374
```

These are real and published, but they **do not** reproduce the official 2025
GPC chart. This project deliberately uses the GPC formula, because the GPC chart
is what growers compare against.

The circumference-only formula is genuinely useful for a different job — a quick
daily growth check from a single measurement — and is noted as a possible future
feature in `ROADMAP.md`. If it gets added, it should be clearly labelled as a
different, less accurate method, never mixed into the main estimate.

## Sources

- [2025 GPC OTT Chart for Atlantic Giant Pumpkins (PDF)](https://gpc1.org/wp-content/uploads/2025/05/2025-GPC-AG-OTT-Chart.pdf) — the formula and table this app uses
- [The Great Pumpkin Commonwealth](https://gpc1.org/) — publishes the official charts
- [How to Measure and Estimate the Weight of Your Pumpkin, Bart Toftness](https://www.bigpumpkins.com/viewarticle.asp?id=37&gid=4) — measurement technique and the alternative formulas
- [Estimating Weight of Giant Pumpkins and Squash, January 2005 (PDF)](https://www.bigpumpkins.com/Attachments/2005WeightTables.pdf) — background on how the tables are derived
