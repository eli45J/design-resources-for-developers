const { COL, wordmark, flower } = require(__dirname + '/logo.js');
const f = n => +n.toFixed(2);
// palettes for the sunflower "O"
const onWhite = { petal: COL.petal, crust: COL.black, sauce: COL.red, dot: COL.white, gap: COL.white };
const onYellow = { petal: COL.black, crust: COL.black, sauce: COL.red, dot: COL.yellow, gap: COL.yellow };
const mono = (ink, bg) => ({ petal: ink, crust: ink, sauce: null, dot: bg, gap: bg });

const V = {
  1: { style:'round', t:26, tag:'bullets' },
  2: { style:'point', t:29, tag:'bar', gaps:{ SU:9, UN:9, NF:10, FL:3, LO:2, OW:1, WE:5, ER:9 } },
  3: { style:'scallop', t:23, tag:'lines', gaps:{ SU:14, UN:14, NF:15, FL:8, LO:6, OW:5, WE:10, ER:14 } },
};

function lockup(id, bg, opts={}) {
  const v = V[id], ink = opts.ink || COL.black;
  const pal = opts.pal || (bg === COL.yellow ? onYellow : onWhite);
  const wm = wordmark({ t:v.t, style:v.style, ink, pal, gaps:v.gaps });
  const S = 1.5, pad = 110, W = Math.round(wm.w*S + pad*2);
  const top = 100, capH = 100*S;
  let tag = '', H;
  const tagTxt = (y, size, ls, fill, bullet) =>
    `<text class="tag" x="${W/2}" y="${y}" text-anchor="middle" font-family="IDB" font-size="${size}" letter-spacing="${ls}" fill="${fill}">DÖNER<tspan fill="${bullet}" dx="${ls}">•</tspan><tspan dx="${ls}">PIZZA</tspan><tspan fill="${bullet}" dx="${ls}">•</tspan><tspan dx="${ls}">BURGER</tspan></text>`;
  let acc = opts.accent || COL.red;
  if (v.tag === 'bar' && acc === ink) acc = bg;
  if (v.tag === 'bullets') { tag = tagTxt(top+capH+86, 38, 11, ink, acc); H = top+capH+86+90; }
  if (v.tag === 'bar') {
    const by = top+capH+34, bh = 62;
    tag = `<rect x="${pad}" y="${by}" width="${W-2*pad}" height="${bh}" fill="${ink}"/>` + tagTxt(by+44, 34, 12, bg, acc); H = by+bh+100; }
  if (v.tag === 'lines') {
    const y = top+capH+80, lw = 150;
    tag = tagTxt(y, 34, 10, ink, acc)
      + `<rect class="tl" x="0" y="${y-16}" width="56" height="8" fill="${ink}"/><rect class="tr" x="0" y="${y-16}" width="56" height="8" fill="${ink}"/>`;
    H = y + 100; }
  return { W, H, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${opts.transparent ? '' : `<rect width="${W}" height="${H}" fill="${bg}"/>`}
    <g transform="translate(${pad},${top}) scale(${S})">${wm.svg}</g>${tag}</svg>` };
}
function avatar(id, bg, size=1000) {
  const v = V[id], pal = bg === COL.yellow ? onYellow : onWhite;
  return { W:size, H:size, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
   <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${bg}"/><g transform="translate(${size/2},${size/2})">${flower(v.style, size*0.36, pal)}</g></svg>` };
}
module.exports = { V, lockup, avatar, COL, mono };
