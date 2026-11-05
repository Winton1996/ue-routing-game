(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BraessModel = api;
})(typeof self !== 'undefined' ? self : this, function () {
  function calculate(f1, f2, f3, shortcutAvailable) {
    f1 = Number(f1) || 0;
    f2 = Number(f2) || 0;
    f3 = shortcutAvailable ? Number(f3) || 0 : 0;
    const x1 = f1;
    const x2 = f2;
    const x3 = f2 + f3;
    const x4 = f1 + f3;
    const x5 = f3;
    const t1 = 50 + x1;
    const t2 = 50 + x2;
    const t3 = 10 * x3;
    const t4 = 10 * x4;
    const t5 = 10 + x5;
    const c1 = t1 + t4;
    const c2 = t3 + t2;
    const c3 = shortcutAvailable ? t3 + t5 + t4 : null;
    const costs = shortcutAvailable ? [c1, c2, c3] : [c1, c2];
    const flows = shortcutAvailable ? [f1, f2, f3] : [f1, f2];
    const usedCosts = costs.filter((_, i) => flows[i] > 0);
    const total = f1 * c1 + f2 * c2 + (shortcutAvailable ? f3 * c3 : 0);
    const ueGap = usedCosts.length ? Math.max(...usedCosts) - Math.min(...costs) : 0;
    return { f1, f2, f3, x1, x2, x3, x4, x5, t1, t2, t3, t4, t5, c1, c2, c3, total, ueGap };
  }

  function findSystemOptimum(demand) {
    let best = null;
    for (let f1 = 0; f1 <= demand; f1++) {
      for (let f2 = 0; f2 <= demand - f1; f2++) {
        const f3 = demand - f1 - f2;
        const result = calculate(f1, f2, f3, true);
        if (!best || result.total < best.total) best = result;
      }
    }
    return best;
  }

  return { calculate, findSystemOptimum };
});
