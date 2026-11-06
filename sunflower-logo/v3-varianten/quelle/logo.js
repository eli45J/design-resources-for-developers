// SUNFLOWER – constructed geometric wordmark. Cap height = 100 units.
const COL = { yellow:'#FFD400', petal:'#FFB000', black:'#111111', red:'#E1251B', white:'#FFFFFF' };
const f = n => +n.toFixed(2);
const rect = (x,y,w,h,c) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${c}"/>`;
const poly = (pts,c) => `<polygon points="${pts.map(p=>p.map(f).join(',')).join(' ')}" fill="${c}"/>`;
const stroke = (d,t,c) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${f(t)}" stroke-linecap="butt" stroke-linejoin="miter"/>`;
const diag = (xt, xb, d, y0, y1, c) => poly([[xt-d/2,y0],[xt+d/2,y0],[xb+d/2,y1],[xb-d/2,y1]], c);

function glyphs(t) {
  const h = t*0.9;                       // horizontal bars slightly lighter than stems
  return {
    S: c => { const W = 76, cx = W/2, k = t*0.94;
      const top = { rx:(W-k)/2-1.5, ry:(50-k/2+1)/2 }; top.cy = -1.5 + k/2 + top.ry;
      const bot = { rx:(W-k)/2, ry:(101.5-k/2-(top.cy+top.ry))/2 }; bot.cy = top.cy+top.ry+bot.ry;
      const P=(e,a)=>[cx+e.rx*Math.cos(a*Math.PI/180), e.cy+e.ry*Math.sin(a*Math.PI/180)];
      const a=P(top,-38), b=P(top,90), e=P(bot,145);
      return { w:W, svg: stroke(`M${f(a[0])},${f(a[1])} A${f(top.rx)},${f(top.ry)} 0 1 0 ${f(b[0])},${f(b[1])} A${f(bot.rx)},${f(bot.ry)} 0 1 1 ${f(e[0])},${f(e[1])}`, k, c) }; },
    U: c => { const W = 80, y = 56, ry = 100 + 1.5 - t/2 - y;
      return { w:W, svg: rect(0,0,t,y+0.5,c)+rect(W-t,0,t,y+0.5,c)+stroke(`M${t/2},${y} A${(W-t)/2},${f(ry)} 0 0 0 ${W-t/2},${y}`, t, c) }; },
    N: c => { const W = 82, d = t*1.25;
      return { w:W, svg: rect(0,0,t,100,c)+rect(W-t,0,t,100,c)+poly([[0,0],[d,0],[W,100],[W-d,100]],c) }; },
    F: c => { const W = 58; return { w:W, svg: rect(0,0,t,100,c)+rect(0,0,W,h,c)+rect(0,43,W-7,h,c) }; },
    L: c => { const W = 55; return { w:W, svg: rect(0,0,t,100,c)+rect(0,100-h,W,h,c) }; },
    W: c => { const W = 128, d = t*1.12, q = W/4;
      return { w:W, svg: diag(d/2, q, d, 0,100,c)+diag(W/2, q, d,0,100,c)+diag(W/2, 3*q, d,0,100,c)+diag(W-d/2, 3*q, d,0,100,c) }; },
    E: c => { const W = 58; return { w:W, svg: rect(0,0,t,100,c)+rect(0,0,W,h,c)+rect(0,50-h/2,W-5,h,c)+rect(0,100-h,W,h,c) }; },
    R: c => { const W = 74, by = 58, tb = h, r = (by - tb)/2, bx = W - 6 - tb/2 - r - 4;
      return { w:W, svg: rect(0,0,t,100,c)+stroke(`M0,${tb/2} H${f(bx)} A${f(r)},${f(r)} 0 0 1 ${f(bx)},${f(by-tb/2)} H0`, tb, c)
        + diag(bx+2, W - t*0.55, t*1.12, by - tb*0.6, 100, c) }; },
  };
}

// ---------- the sunflower / pizza "O" (outer radius 1) ----------
function flower(style, R, pal) {
  // pal: {petal, crust, sauce, dot}
  let s = '';
  if (style === 'round') {          // 12 short capsule petals
    const n = 12, r0 = 0.66*R, w = 0.25*R;
    for (let i=0;i<n;i++) s += `<rect x="${f(-w/2)}" y="${f(-R)}" width="${f(w)}" height="${f(R-r0+w/2)}" rx="${f(w/2)}" fill="${pal.petal}" transform="rotate(${i*360/n})"/>`;
  } else if (style === 'point') {   // 14 short triangular petals
    const n = 14, r0 = 0.60*R, hw = Math.tan(Math.PI/n)*r0*0.98;
    for (let i=0;i<n;i++) s += `<polygon points="${f(-hw)},${f(-r0+1)} ${f(hw)},${f(-r0+1)} 0,${f(-R)}" fill="${pal.petal}" transform="rotate(${i*360/n})"/>`;
  } else {                          // 'scallop': 10 overlapping circles
    const n = 10, rc = 0.27*R, rr = R - rc;
    for (let i=0;i<n;i++) { const a = i*2*Math.PI/n; s += `<circle cx="${f(rr*Math.sin(a))}" cy="${f(-rr*Math.cos(a))}" r="${f(rc)}" fill="${pal.petal}"/>`; }
    s += `<circle r="${f(rr)}" fill="${pal.petal}"/>`;
  }
  const rCenter = style==='round' ? 0.56*R : style==='point' ? 0.55*R : 0.56*R;
  if (style !== 'round' && pal.gap) s += `<circle r="${f(rCenter + 0.06*R)}" fill="${pal.gap}"/>`;
  s += `<circle r="${f(rCenter)}" fill="${pal.crust}"/>`;
  if (pal.sauce) s += `<circle r="${f(rCenter*0.76)}" fill="${pal.sauce}"/>`;
  // toppings / seeds: 1 + 6, slightly irregular so it reads as pizza, not a pattern
  const dots = [[0,0,0.15],[0.47,-20,0.12],[0.50,45,0.11],[0.46,105,0.12],[0.50,165,0.11],[0.47,225,0.12],[0.50,290,0.11]];
  for (const [rr,a,dr] of dots) { const A=a*Math.PI/180; s += `<circle cx="${f(rCenter*rr*Math.sin(A))}" cy="${f(-rCenter*rr*Math.cos(A))}" r="${f(rCenter*dr)}" fill="${pal.dot}"/>`; }
  return s;
}

// ---------- lockup ----------
function wordmark({ t=26, style, ink, pal, gaps, oScale=1.14 }) {
  const G = glyphs(t), letters = ['S','U','N','F','L','O','W','E','R'];
  const sp = Object.assign({ SU:11, UN:11, NF:12, FL:5, LO:3, OW:2, WE:7, ER:11 }, gaps||{});
  let x = 0, out = '', prev = null, oD = 100*oScale;
  for (const ch of letters) {
    if (prev) x += sp[prev+ch];
    if (ch === 'O') { out += `<g transform="translate(${f(x+oD/2)},50)">${flower(style, oD/2, pal)}</g>`; x += oD; }
    else { const g = G[ch](ink); out += `<g transform="translate(${f(x)},0)">${g.svg}</g>`; x += g.w; }
    prev = ch;
  }
  return { svg: out, w: x };
}
module.exports = { COL, wordmark, flower };
