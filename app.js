/* =============================================================================
   app.js — connects the screen to the calculation engine
   =============================================================================

   This file does exactly three things:
     1. reads the three input boxes
     2. asks js/ott.js for an estimate
     3. writes the answer onto the screen

   All of the actual maths lives in js/ott.js. Please keep it that way - it is
   what lets tests/test.html prove the numbers are right without needing a
   browser window, and what makes a future phone app easy to build.

   RULE FOR ANY AI EDITING THIS FILE: no formulas here. If you catch yourself
   typing a multiplication involving 12.81, 6.87, 97 or 45.9, you are in the
   wrong file.
   ============================================================================= */

(function () {
  'use strict';

  /* Grab the bits of the page we need, once, up front. */
  var el = {
    form:        document.getElementById('measure-form'),
    circ:        document.getElementById('circumference'),
    side:        document.getElementById('side-to-side'),
    end:         document.getElementById('end-to-end'),
    ottTotal:    document.getElementById('ott-total'),
    result:      document.getElementById('result'),
    weightLbs:   document.getElementById('weight-lbs'),
    weightKg:    document.getElementById('weight-kg'),
    message:     document.getElementById('result-message'),
    clear:       document.getElementById('clear')
  };

  var EMPTY = '—'; // an em dash, shown when there is nothing to show yet

  /* ---------------------------------------------------------------------------
     update() - runs on every keystroke
     --------------------------------------------------------------------------- */
  function update() {
    var result = window.OTT.estimate(el.circ.value, el.side.value, el.end.value);

    /* The OTT total is useful even before all three boxes are filled, so show
       the sum of whatever has been typed so far. */
    showRunningOtt();

    if (!result.ok) {
      // Nothing typed yet is a normal starting state, not an error to shout about.
      var nothingTyped = !el.circ.value && !el.side.value && !el.end.value;
      render({
        lbs: EMPTY,
        kg: '',
        message: nothingTyped ? 'Enter your three measurements.' : result.reason,
        state: nothingTyped ? '' : 'is-error'
      });
      return;
    }

    render({
      lbs: formatNumber(result.lbs),
      kg: formatNumber(result.kg) + ' kg',
      message: result.inChartRange
        ? 'Based on the official 2025 GPC chart.'
        : result.rangeNote,
      state: result.inChartRange ? '' : 'is-warning'
    });
  }

  /* Sum whatever numbers are currently in the boxes, ignoring empty ones. */
  function showRunningOtt() {
    var values = [el.circ.value, el.side.value, el.end.value]
      .map(window.OTT.clean)
      .filter(function (v) { return v !== null && v > 0; });

    if (!values.length) {
      el.ottTotal.textContent = EMPTY;
      return;
    }

    var sum = values.reduce(function (a, b) { return a + b; }, 0);
    el.ottTotal.textContent = formatNumber(round3(sum));
  }

  /* ---------------------------------------------------------------------------
     render() - the only function that touches the result panel
     --------------------------------------------------------------------------- */
  function render(view) {
    el.weightLbs.textContent = view.lbs;
    el.weightKg.textContent = view.kg;
    el.message.textContent = view.message;
    el.result.className = 'result' + (view.state ? ' ' + view.state : '');
  }

  /* "2,650" reads faster than "2650" at a glance in a field.
     maximumFractionDigits keeps eighth-inch measurements intact (153.875)
     while not padding whole numbers with pointless zeros (385 not 385.000). */
  function formatNumber(n) {
    try {
      return n.toLocaleString('en-US', { maximumFractionDigits: 3 });
    } catch (e) {
      return String(n);
    }
  }

  /* Three decimals, because a tape measure reads in eighths of an inch. */
  function round3(n) {
    return Math.round(n * 1000) / 1000;
  }

  /* ---------------------------------------------------------------------------
     Wiring
     --------------------------------------------------------------------------- */

  // 'input' fires on every keystroke, paste and spinner click - unlike 'change',
  // which only fires when the box loses focus. That's what makes it feel instant.
  [el.circ, el.side, el.end].forEach(function (input) {
    input.addEventListener('input', update);
  });

  // The inputs sit in a <form> for good keyboard behaviour, but there is nothing
  // to submit - pressing Enter should just close the phone keyboard.
  el.form.addEventListener('submit', function (event) {
    event.preventDefault();
    document.activeElement && document.activeElement.blur();
  });

  el.clear.addEventListener('click', function () {
    el.circ.value = '';
    el.side.value = '';
    el.end.value = '';
    update();
    el.circ.focus();
  });

  // Draw the starting state.
  update();

  /* ---------------------------------------------------------------------------
     Offline support

     Registering the service worker is what lets the app open with no signal.
     It is wrapped in a check because file:// (double-clicking index.html) does
     not allow service workers - the app still works, it just isn't installable
     until it's served over http. See HOSTING.md.
     --------------------------------------------------------------------------- */
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (err) {
        console.warn('Offline support unavailable:', err);
      });
    });
  }
})();
