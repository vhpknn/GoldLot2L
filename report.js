/* report.js : รายงานรายสัปดาห์ / รายเดือน + กราฟ
   ที่อยู่ไฟล์: goldlot/report.js (โฟลเดอร์เดียวกับ index.html)
   ต้องโหลดก่อน script หลักใน index.html (ฟังก์ชันอ่านค่า S, A, today, save ตอนถูกเรียก) */
const RPT = {period: 'week'};
const RC = {l1: '#1f6fb2', l2: '#e67e22', cum: '#1b7f3b', eq: '#b8860b', cap: '#888888', grid: '#e5dfcf'};

function pad2(n){ return String(n).padStart(2, '0'); }
function parseD(s){ const a = s.split('-').map(Number); return new Date(Date.UTC(a[0], a[1]-1, a[2])); }
function isoD(dt){ return dt.getUTCFullYear() + '-' + pad2(dt.getUTCMonth()+1) + '-' + pad2(dt.getUTCDate()); }
function weekKey(s){ const d = parseD(s); const dow = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - dow); return isoD(d); }
function monthKey(s){ return s.slice(0, 7); }
function periodKey(s, period){ return period === 'month' ? monthKey(s) : weekKey(s); }
function periodLabel(k, period){
  const a = k.split('-');
  return period === 'month' ? a[1] + '/' + a[0] : a[2] + '/' + a[1];
}
function nextKey(k, period){
  if (period === 'month'){ let y = +k.slice(0,4), m = +k.slice(5,7) + 1; if (m > 12){ m = 1; y++; } return y + '-' + pad2(m); }
  const d = parseD(k); d.setUTCDate(d.getUTCDate() + 7); return isoD(d);
}

function buildRows(state, period){
  const map = {};
  const get = k => map[k] || (map[k] = {key:k, label:periodLabel(k, period), sold:0, profit:0, p1:0, p2:0,
    wins:0, days:0, bought:0, capAdd:0, capRed:0});
  (state.lots || []).forEach(l => {
    if (l.date) get(periodKey(l.date, period)).bought++;
    if (l.status === 'CLOSED' && l.sellDate){
      const r = get(periodKey(l.sellDate, period)), pf = l.K - l.D;
      r.sold++; r.profit += pf;
      if (l.layer === 1) r.p1 += pf; else r.p2 += pf;
      if (pf > 0) r.wins++;
      r.days += Math.max(0, (parseD(l.sellDate) - parseD(l.date)) / 864e5);
    }
  });
  (state.capLog || []).forEach(e => {
    if (!e.date) return;
    const r = get(periodKey(e.date, period));
    if (e.type === 'add') r.capAdd += e.amount;
    if (e.type === 'reduce') r.capRed += e.amount;
  });
  const keys = Object.keys(map).sort();
  if (!keys.length) return [];
  const out = []; let k = keys[0], guard = 0;
  while (k <= keys[keys.length-1] && guard++ < 600){ out.push(get(k)); k = nextKey(k, period); }
  out.forEach(r => { r.winRate = r.sold ? r.wins / r.sold : null; r.avgDays = r.sold ? r.days / r.sold : null; });
  return out;
}

function cumPoints(state){
  const byDate = {};
  (state.lots || []).filter(l => l.status === 'CLOSED' && l.sellDate).forEach(l => {
    byDate[l.sellDate] = (byDate[l.sellDate] || 0) + (l.K - l.D);
  });
  let c = 0;
  return Object.keys(byDate).sort().map(d => { c += byDate[d]; return {t: parseD(d).getTime(), v: Math.round(c*100)/100}; });
}

function recordSnapshot(){
  const pr = priceNow();
  if (!pr.ok || !A || pr.bid < S.params.ath * 0.3 || pr.ask < pr.bid) return;
  S.snaps = S.snaps || [];
  const d = today(), eq = A.stats.equity, cap = A.capital.current;
  const last = S.snaps[S.snaps.length - 1];
  if (last && last.d === d){
    if (last.eq === eq && last.cap === cap) return;
    last.eq = eq; last.cap = cap; last.bid = pr.bid;
  } else S.snaps.push({d, bid: pr.bid, eq, cap});
  save();
}

function rptCtx(cv, h){
  const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1, w = cv.clientWidth || 320;
  cv.width = w * dpr; cv.height = h * dpr; cv.style.height = h + 'px';
  const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
  return {c, w, h};
}
function fmtK(v){ const a = Math.abs(v); return a >= 1000 ? (v/1000).toFixed(a >= 10000 ? 0 : 1) + 'k' : String(Math.round(v)); }
function emptyChart(c, w, h){ c.fillStyle = '#888'; c.font = '14px sans-serif'; c.textAlign = 'center'; c.fillText('ยังไม่มีข้อมูล', w/2, h/2); }
function axisY(c, w, h, m, lo, hi){
  c.strokeStyle = RC.grid; c.fillStyle = '#666'; c.font = '11px sans-serif'; c.textAlign = 'right'; c.lineWidth = 1;
  for (let i = 0; i <= 4; i++){
    const v = lo + (hi - lo) * i / 4, y = m.t + (h - m.t - m.b) * (1 - i/4);
    c.beginPath(); c.moveTo(m.l, y); c.lineTo(w - m.r, y); c.stroke();
    c.fillText(fmtK(v), m.l - 4, y + 4);
  }
}
function drawLine(cv, series, xFmt){
  const {c, w, h} = rptCtx(cv, 170), m = {l:44, r:8, t:8, b:22};
  const all = []; series.forEach(s => s.pts.forEach(p => all.push(p)));
  if (!all.length){ emptyChart(c, w, h); return; }
  let t0 = Math.min(...all.map(p => p.t)), t1 = Math.max(...all.map(p => p.t));
  let lo = Math.min(...all.map(p => p.v)), hi = Math.max(...all.map(p => p.v));
  if (hi === lo){ hi += 1; lo -= 1; }
  const pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
  if (t1 === t0){ t1 += 864e5; t0 -= 864e5; }
  axisY(c, w, h, m, lo, hi);
  const X = t => m.l + (w - m.l - m.r) * (t - t0) / (t1 - t0), Y = v => m.t + (h - m.t - m.b) * (1 - (v - lo) / (hi - lo));
  series.forEach(s => {
    c.strokeStyle = s.color; c.fillStyle = s.color; c.lineWidth = 2; c.beginPath();
    s.pts.forEach((p, i) => { if (i) c.lineTo(X(p.t), Y(p.v)); else c.moveTo(X(p.t), Y(p.v)); });
    c.stroke();
    if (s.pts.length <= 40) s.pts.forEach(p => { c.beginPath(); c.arc(X(p.t), Y(p.v), 2.5, 0, 6.283); c.fill(); });
  });
  c.fillStyle = '#666'; c.font = '11px sans-serif'; c.textAlign = 'left'; c.fillText(xFmt(t0), m.l, h - 6);
  c.textAlign = 'right'; c.fillText(xFmt(t1), w - m.r, h - 6);
}
function drawBars(cv, rows){
  const {c, w, h} = rptCtx(cv, 170), m = {l:44, r:8, t:8, b:22};
  if (!rows.length){ emptyChart(c, w, h); return; }
  let hi = Math.max(0, ...rows.map(r => Math.max(0, r.p1) + Math.max(0, r.p2)));
  let lo = Math.min(0, ...rows.map(r => Math.min(0, r.p1) + Math.min(0, r.p2)));
  if (hi === lo) hi = 1;
  axisY(c, w, h, m, lo, hi);
  const Y = v => m.t + (h - m.t - m.b) * (1 - (v - lo) / (hi - lo));
  const slot = (w - m.l - m.r) / rows.length, bw = Math.max(2, Math.min(28, slot * 0.7));
  rows.forEach((r, i) => {
    const x = m.l + slot * i + (slot - bw) / 2; let up = 0, dn = 0;
    [[r.p1, RC.l1], [r.p2, RC.l2]].forEach(([v, col]) => {
      c.fillStyle = col;
      if (v >= 0){ c.fillRect(x, Y(up + v), bw, Y(up) - Y(up + v)); up += v; }
      else { c.fillRect(x, Y(dn), bw, Y(dn + v) - Y(dn)); dn += v; }
    });
  });
  c.strokeStyle = '#444'; c.lineWidth = 1; c.beginPath(); c.moveTo(m.l, Y(0)); c.lineTo(w - m.r, Y(0)); c.stroke();
  c.fillStyle = '#666'; c.font = '11px sans-serif'; c.textAlign = 'center';
  const every = Math.ceil(rows.length / 6);
  rows.forEach((r, i) => { if (i % every === 0) c.fillText(r.label, m.l + slot * i + slot / 2, h - 6); });
}

function drawReport(){
  const el = document.getElementById('rptBody'); if (!el) return;
  const rows = buildRows(S, RPT.period);
  const tot = rows.reduce((a, r) => ({sold:a.sold + r.sold, profit:a.profit + r.profit, p1:a.p1 + r.p1, p2:a.p2 + r.p2,
    wins:a.wins + r.wins, days:a.days + r.days, bought:a.bought + r.bought, add:a.add + r.capAdd, red:a.red + r.capRed}),
    {sold:0, profit:0, p1:0, p2:0, wins:0, days:0, bought:0, add:0, red:0});
  const cls = v => v >= 0 ? 'ok' : 'bad';
  const tr = rows.slice().reverse().map(r => `<tr><td>${r.label}</td><td>${r.sold}</td><td class="${cls(r.profit)}">${fmt0(r.profit)}</td>
    <td>${fmt0(r.p1)}</td><td>${fmt0(r.p2)}</td><td>${r.winRate == null ? '-' : fmt0(r.winRate * 100) + '%'}</td>
    <td>${r.avgDays == null ? '-' : fmt(r.avgDays, 1)}</td><td>${r.bought}</td><td>${(r.capAdd - r.capRed) ? fmt0(r.capAdd - r.capRed) : '-'}</td></tr>`).join('');
  el.innerHTML = `<div class="row"><button class="${RPT.period === 'week' ? '' : 'b-gray'}" id="rptWeek">รายสัปดาห์</button>
    <button class="${RPT.period === 'month' ? '' : 'b-gray'}" id="rptMonth">รายเดือน</button></div>
    <div class="small" style="margin-top:6px">${RPT.period === 'week' ? 'สัปดาห์เริ่มวันจันทร์ (แสดงวันที่เริ่มสัปดาห์ วัน/เดือน)' : 'แสดง เดือน/ปี'} นับกำไรตามวันที่ขาย เฉพาะไม้ที่ขายแล้ว</div>
    <table style="margin-top:8px"><tr><td>รวมทุกช่วง</td><td class="${cls(tot.profit)}"><b>${fmt0(tot.profit)}</b></td></tr>
    <tr><td>ขาย ${tot.sold} ไม้ (L1 ${fmt0(tot.p1)} / L2 ${fmt0(tot.p2)})</td><td>อัตราชนะ ${tot.sold ? fmt0(tot.wins / tot.sold * 100) + '%' : '-'}</td></tr></table>
    <div class="grp">กำไรรายช่วง (น้ำเงิน L1 / ส้ม L2)</div><canvas id="rptBar" class="rptc"></canvas>
    <div class="grp">กำไรสะสม (ไม้ที่ขายแล้ว)</div><canvas id="rptCum" class="rptc"></canvas>
    <div class="grp">มูลค่าพอร์ต (เหลือง) เทียบทุนรวม (เทา)</div><canvas id="rptEq" class="rptc"></canvas>
    <div class="small">กราฟพอร์ตเริ่มเก็บข้อมูลตั้งแต่วันที่อัปเดตแอป วันที่ไม่ได้กรอกราคาจะไม่มีจุด</div>
    <div class="tblwrap"><table><tr><th>ช่วง</th><th>ขาย</th><th>กำไร</th><th>L1</th><th>L2</th><th>ชนะ</th><th>ถือ(วัน)</th><th>ซื้อ</th><th>ทุน±</th></tr>${tr || '<tr><td colspan="9" class="small">ยังไม่มีข้อมูล</td></tr>'}</table></div>
    <button class="b-green" id="rptCsv">📄 ส่งออกรายงาน (CSV)</button>`;
  document.getElementById('rptWeek').onclick = () => { RPT.period = 'week'; drawReport(); };
  document.getElementById('rptMonth').onclick = () => { RPT.period = 'month'; drawReport(); };
  document.getElementById('rptCsv').onclick = exportReportCsv;
  drawBars(document.getElementById('rptBar'), rows);
  const dfmt = t => { const d = new Date(t); return pad2(d.getUTCDate()) + '/' + pad2(d.getUTCMonth()+1); };
  drawLine(document.getElementById('rptCum'), [{color: RC.cum, pts: cumPoints(S)}], dfmt);
  const sn = S.snaps || [];
  drawLine(document.getElementById('rptEq'), [
    {color: RC.cap, pts: sn.map(p => ({t: parseD(p.d).getTime(), v: p.cap}))},
    {color: RC.eq, pts: sn.map(p => ({t: parseD(p.d).getTime(), v: p.eq}))}], dfmt);
}

function exportReportCsv(){
  const rows = buildRows(S, RPT.period);
  const head = ['period_start', 'sold', 'profit', 'profit_L1', 'profit_L2', 'win_rate_pct', 'avg_hold_days', 'bought', 'capital_added', 'capital_reduced'];
  const body = rows.map(r => [r.key, r.sold, r.profit, r.p1, r.p2, r.winRate == null ? '' : Math.round(r.winRate * 100),
    r.avgDays == null ? '' : Math.round(r.avgDays * 10) / 10, r.bought, r.capAdd, r.capRed]);
  dl('goldlot-report-' + RPT.period + '-' + today() + '.csv', '\uFEFF' + [head].concat(body).map(r => r.join(',')).join('\n'), 'text/csv');
}
