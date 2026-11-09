
const DEFAULTS = {ath:80000, tp:0.02, l2start:0.30, minGold:0.01, spread:200,
  L1:{cap:100000, slots:15, grid:0.02}, L2:{cap:100000, slots:6, grid:0.03}};
const r6 = x => Math.round(x*1e6)/1e6;
const floorGold = (x, step) => Math.floor(x/step + 1e-9) * step;
const fix2 = x => Math.round(x*100)/100;
function layerInfo(state, n){
  const p = state.params, L = p['L'+n];
  const mine = state.lots.filter(l => l.layer === n);
  const open = mine.filter(l => l.status === 'OPEN');
  const realized = mine.filter(l => l.status === 'CLOSED').reduce((s,l)=> s + (l.K - l.D), 0);
  const invested = open.reduce((s,l)=> s + l.D, 0);
  return {n, L, open, held: open.length, realized, cap: L.cap + realized, invested, slots: L.slots};
}
function analyze(state, bid, ask){
  const p = state.params;
  const dd = 1 - bid/p.ath;
  const out = {dd, layers:{}, sells:[], buys:[], issues:[]};
  for (const n of [1,2]){
    const li = layerInfo(state, n);
    let level = 0;
    if (n === 1 && dd < p.l2start) level = Math.min(Math.floor(r6(dd/li.L.grid)), li.slots);
    if (n === 2 && dd >= p.l2start) level = Math.min(Math.floor(r6((dd - p.l2start)/li.L.grid)), li.slots);
    let need = Math.max(0, Math.min(level - li.held, li.slots - li.held));
    let size = li.slots > li.held ? (li.cap - li.invested)/(li.slots - li.held) : 0;
    let gold = ask > 0 ? fix2(floorGold(size/ask, p.minGold)) : 0;
    const nextBuy = li.held >= li.slots ? null :
      Math.round(n === 1 ? p.ath*(1 - (li.held+1)*li.L.grid) : p.ath*(1 - p.l2start - (li.held+1)*li.L.grid));
    out.layers[n] = {...li, level, need, size, gold, nextBuy};
    if (need > 0) out.buys.push({layer:n, count:need, gold, money: fix2(gold*ask), short: gold < p.minGold});
    if (li.held > li.slots) out.issues.push('Layer '+n+': ไม้ที่ถืออยู่เกินจำนวนช่อง');
  }
  state.lots.filter(l => l.status === 'OPEN').forEach(l => {
    const buyPrice = l.D / l.O, tp = buyPrice*(1+p.tp);
    l.tpPrice = Math.round(tp*100)/100;
    if (bid >= tp - 1e-9) out.sells.push({lot:l, profit: fix2(l.O*bid - l.D), money: fix2(l.O*bid)});
  });
  const opens = state.lots.filter(l => l.status === 'OPEN');
  out.nextTP = opens.length ? Math.min(...opens.map(l => l.D/l.O*(1+p.tp))) : null;
  const closed = state.lots.filter(l => l.status === 'CLOSED');
  const realized = closed.reduce((s,l)=> s + (l.K - l.D), 0);
  const unreal = opens.reduce((s,l)=> s + (l.O*bid - l.D), 0);
  const capTotal = p.L1.cap + p.L2.cap + realized;
  const invested = opens.reduce((s,l)=> s + l.D, 0);
  const goldValue = opens.reduce((s,l)=> s + l.O*bid, 0);
  const wins = closed.filter(l => l.K - l.D > 0).length;
  const days = closed.map(l => (new Date(l.sellDate) - new Date(l.date))/86400000);
  out.stats = {realized:fix2(realized), unreal:fix2(unreal), total:fix2(realized+unreal),
    equity: fix2(capTotal - invested + goldValue), start: p.L1.cap + p.L2.cap,
    sold: closed.length, held: opens.length, winRate: closed.length ? wins/closed.length : null,
    avgProfit: closed.length ? fix2(realized/closed.length) : null,
    avgDays: closed.length ? days.reduce((a,b)=>a+b,0)/closed.length : null};
  return out;
}
function sanePricePerBaht(p, money, gold){
  if (!(gold > 0) || !(money > 0)) return false;
  const r = money/gold; return r >= p.ath*0.3 && r <= p.ath*1.05;
}
