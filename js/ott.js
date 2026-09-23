/* =============================================================================
   ott.js — the OTT calculation engine
   =============================================================================

   THIS IS THE MOST IMPORTANT FILE IN THE PROJECT.

   It contains the official 2025 GPC (Great Pumpkin Commonwealth) math that turns
   three tape measurements into an estimated pumpkin weight. It deliberately
   contains NO screen code, NO buttons, NO colours — only maths. That is what
   makes it safe to test, and easy to reuse later in a phone app.

   RULES FOR ANY AI EDITING THIS PROJECT:
     1. Do not change the numbers in FORMULA unless the grower supplies a newer
        official GPC chart. They are not arbitrary - they are published values.
     2. After ANY change to this file, open tests/test.html in a browser and
        confirm every check still passes. It verifies this code against all 300
        rows of the official published chart.
     3. Do not add DOM / document / window UI code to this file. Put that in
        app.js instead.

   Source of the formula and table:
     2025 GPC OTT Chart for Atlantic Giant Pumpkins
     https://gpc1.org/wp-content/uploads/2025/05/2025-GPC-AG-OTT-Chart.pdf
   ============================================================================= */

(function (global) {
  'use strict';

  /* ---------------------------------------------------------------------------
     The official 2025 GPC formula, printed on the chart PDF itself:

       lbs = ((12.81 / (1 + 6.87 * 2^(-OTT/97)))^3 + (OTT/45.9)^3.014) - 10

     Verified: this reproduces all 300 rows of the published chart exactly when
     rounded to the nearest pound.
     --------------------------------------------------------------------------- */
  var FORMULA = {
    a: 12.81,
    b: 6.87,
    c: 97,
    d: 45.9,
    e: 3.014,
    offset: 10
  };

  /* The inclusive OTT range (inches) actually covered by the published chart.
     Outside this range the formula still produces a number, but it is
     unverified extrapolation - the app says so rather than hiding it. */
  var CHART = {
    name: '2025 GPC OTT Chart for Atlantic Giant Pumpkins',
    year: 2025,
    sourceUrl: 'https://gpc1.org/wp-content/uploads/2025/05/2025-GPC-AG-OTT-Chart.pdf',
    minOtt: 160,
    maxOtt: 539,
    units: { ott: 'inches', weight: 'pounds' }
  };

  var LB_PER_KG = 2.2046226218;

  /* ---------------------------------------------------------------------------
     ottTotal(circumference, sideToSide, endToEnd)

     OTT ("Over The Top") is simply the three tape measurements added together.
       - circumference: around the middle of the pumpkin
       - sideToSide:    ground to ground across the pumpkin, over the top
       - endToEnd:      ground to ground stem-to-blossom, over the top
     All in inches. Returns inches.
     --------------------------------------------------------------------------- */
  function ottTotal(circumference, sideToSide, endToEnd) {
    return num(circumference) + num(sideToSide) + num(endToEnd);
  }

  /* ---------------------------------------------------------------------------
     weightFromOtt(ott) -> pounds (unrounded)

     The raw official calculation. Accepts decimals (e.g. 384.5).
     --------------------------------------------------------------------------- */
  function weightFromOtt(ott) {
    var o = num(ott);
    var f = FORMULA;
    var term1 = Math.pow(f.a / (1 + f.b * Math.pow(2, -o / f.c)), 3);
    var term2 = Math.pow(o / f.d, f.e);
    return term1 + term2 - f.offset;
  }

  /* ---------------------------------------------------------------------------
     estimate(circumference, sideToSide, endToEnd) -> result object

     This is the function the app screen calls. It returns everything the UI
     needs to know, including WHY a result might not be usable, so that app.js
     never has to make judgement calls about the maths.

     Returns:
       {
         ok:            true if a weight could be calculated
         reason:        when ok is false, a plain-English explanation
         ott:           the summed OTT in inches
         lbs:           estimated weight in pounds (rounded, for display)
         lbsExact:      unrounded pounds, if you need precision
         kg:            estimated weight in kilograms (rounded)
         inChartRange:  true if OTT falls inside the published 160-539 inch chart
         rangeNote:     explanation when inChartRange is false
         measurements:  the three cleaned input numbers
       }
     --------------------------------------------------------------------------- */
  function estimate(circumference, sideToSide, endToEnd) {
    var m = [circumference, sideToSide, endToEnd].map(clean);

    if (m.some(function (v) { return v === null; })) {
      return fail('Enter all three measurements.', m);
    }
    if (m.some(function (v) { return v <= 0; })) {
      return fail('Measurements must be greater than zero.', m);
    }
    // A tape measure that reads 5000 inches means a typo, not a world record.
    if (m.some(function (v) { return v > 1000; })) {
      return fail('That measurement looks too large - please check it.', m);
    }

    var ott = m[0] + m[1] + m[2];
    var exact = weightFromOtt(ott);

    if (!isFinite(exact) || exact <= 0) {
      return fail('That OTT is too small to estimate a weight from.', m, ott);
    }

    var inRange = ott >= CHART.minOtt && ott <= CHART.maxOtt;

    return {
      ok: true,
      reason: null,
      /* 3 decimal places, not 2: growers read tape measures in eighths of an
         inch, and an eighth is .125 / .375 / .625 / .875. Rounding to 2 would
         show a genuine 153.875" measurement as 153.88". The weight above is
         calculated from the unrounded sum either way. */
      ott: round(ott, 3),
      lbs: Math.round(exact),
      lbsExact: exact,
      kg: Math.round(exact / LB_PER_KG),
      inChartRange: inRange,
      rangeNote: inRange ? null : (
        ott < CHART.minOtt
          ? 'OTT is below the published chart (' + CHART.minOtt + '"). Small-fruit estimates are less reliable.'
          : 'OTT is above the published chart (' + CHART.maxOtt + '"). This is beyond the charted range.'
      ),
      measurements: { circumference: m[0], sideToSide: m[1], endToEnd: m[2] }
    };
  }

  /* ---------------------------------------------------------------------------
     tableLookup(ott, table) -> pounds, straight from the published chart

     The app uses the formula (above) because it handles decimals exactly. This
     function exists so tests/test.html can prove the formula agrees with the
     published chart, and so a future "show me the chart" screen has something
     to read from. `table` is an object like { "160": 98, "165": 107, ... }.
     Returns null if that OTT is not a row in the chart.
     --------------------------------------------------------------------------- */
  function tableLookup(ott, table) {
    if (!table) return null;
    var key = String(Math.round(num(ott)));
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : null;
  }

  /* ---------------------------- small helpers ------------------------------- */

  // Accepts "384", "384.5", " 384.5 " and commas typed as decimal separators.
  function clean(v) {
    if (v === null || v === undefined) return null;
    var s = String(v).trim().replace(',', '.');
    if (s === '') return null;
    var n = Number(s);
    return isFinite(n) ? n : null;
  }

  function num(v) {
    var n = clean(v);
    return n === null ? NaN : n;
  }

  function round(n, places) {
    var f = Math.pow(10, places);
    return Math.round(n * f) / f;
  }

  function fail(reason, m, ott) {
    return {
      ok: false,
      reason: reason,
      ott: ott === undefined ? null : round(ott, 3),
      lbs: null,
      lbsExact: null,
      kg: null,
      inChartRange: false,
      rangeNote: null,
      measurements: { circumference: m[0], sideToSide: m[1], endToEnd: m[2] }
    };
  }

  /* ------------------------------- exports ---------------------------------- */
  global.OTT = {
    CHART: CHART,
    FORMULA: FORMULA,
    ottTotal: ottTotal,
    weightFromOtt: weightFromOtt,
    estimate: estimate,
    tableLookup: tableLookup,
    clean: clean
  };
})(typeof window !== 'undefined' ? window : this);
