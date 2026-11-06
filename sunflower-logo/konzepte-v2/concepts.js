const fs = require('fs');
const C = { yel:'#FFC400', red:'#E3262E', ink:'#1C1411', cream:'#FFF6E5', crust:'#E8962A', cheese:'#FFD34D', green:'#2F8F4E' };

// ---------- custom monoline lettering (skeletons, cap height 100) ----------
const G = {
  S:{w:60,d:'M57,17 C52,6 42,0 30,0 C13,0 3,10 3,25 C3,47 57,50 57,74 C57,90 45,100 29,100 C15,100 5,93 1,81'},
  U:{w:60,d:'M0,0 V64 A30,36 0 0 0 60,64 V0'},
  N:{w:60,d:'M0,100 V0 L60,100 V0'},
  F:{w:50,d:'M50,0 H0 V100 M0,48 H40'},
  L:{w:48,d:'M0,0 V100 H48'},
  O:{w:66,d:'M33,0 C14,0 0,20 0,50 C0,80 14,100 33,100 C52,100 66,80 66,50 C66,20 52,0 33,0 Z'},
  W:{w:84,d:'M0,0 L18,100 L42,34 L66,100 L84,0'},
  E:{w:50,d:'M50,0 H0 V100 H50 M0,50 H42'},
  R:{w:58,d:'M0,100 V0 H28 C44,0 54,11 54,26 C54,41 44,52 28,52 H0 M28,52 L58,100'},
};
function word(txt, sw, track) {
  let x = sw/2, parts = [];
  for (const ch of txt) { const g = G[ch]; parts.push({ch, x, d:g.d}); x += g.w + sw + track; }
  return { parts, w: x - track - sw/2 + sw/2 };
}
const paths = (wd, attrs, dx=0, dy=0) => wd.parts.map(p => `<path d="${p.d}" transform="translate(${p.x+dx},${dy})" ${attrs}/>`).join('');

// ---------- A: Street-Food-Sticker ----------
function conceptA() {
  const sw = 25, wd = word('SUNFLOWER', sw, 11), W = 1600, H = 900;
  const s = 1.42, ox = (W - wd.w*s)/2 - 30, oy = 255;
  const sk = (c, w, dx=0, dy=0) => paths(wd, `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`, dx, dy);
  // sun burst dot over the word
  let rays=''; for (let i=0;i<12;i++) rays += `<rect x="-7" y="-78" width="14" height="30" rx="7" fill="${C.red}" transform="rotate(${i*30})"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${C.yel}"/>
  <g transform="translate(0,95) rotate(-6 800 450)">
   <g transform="translate(${ox},${oy}) scale(${s})">
     ${sk(C.cream, sw+30)}${sk(C.cream, sw+30, 7, 8)}
     ${sk(C.red, sw, 7, 8)}
     ${sk(C.ink, sw)}
   </g>
   <g transform="translate(${ox + wd.w*s + 45},${oy - 25}) scale(0.85)">
     <circle r="70" fill="${C.cream}"/>${rays}<circle r="38" fill="${C.ink}"/><circle r="16" fill="${C.yel}"/>
   </g>
   <g transform="translate(800,${oy + 100*s + 95})">
     <rect x="-330" y="-48" width="660" height="96" rx="48" fill="${C.ink}"/>
     <text x="0" y="22" text-anchor="middle" font-family="IDB" font-size="60" letter-spacing="14" fill="${C.yel}">LANGENHAGEN</text>
   </g>
   <text x="800" y="${oy + 100*s + 215}" text-anchor="middle" font-family="IDB" font-size="40" letter-spacing="8" fill="${C.ink}">DÖNER · PIZZA · BURGER</text>
  </g></svg>`;
}

// ---------- B: Pizza-Sonnenblume ----------
function pizzaFlower(R) {
  const n = 10, r0 = R*0.30, half = 15*Math.PI/180;
  let s = '';
  for (let i=0;i<n;i++) {
    const a = i*360/n;
    const tip = -r0, xR = R*Math.sin(half), yR = -R*Math.cos(half);
    const crustIn = R*0.84, xi = crustIn*Math.sin(half), yi = -crustIn*Math.cos(half);
    s += `<g transform="rotate(${a})">
      <path d="M0,${tip} L${xR},${yR} A${R},${R} 0 0 0 ${-xR},${yR} Z" fill="${C.crust}" stroke="${C.ink}" stroke-width="${R*0.035}" stroke-linejoin="round"/>
      <path d="M0,${tip} L${xi},${yi} A${crustIn},${crustIn} 0 0 0 ${-xi},${yi} Z" fill="${C.cheese}"/>
      <circle cx="${-R*0.06}" cy="${-R*0.52}" r="${R*0.065}" fill="${C.red}"/>
      <circle cx="${R*0.08}" cy="${-R*0.70}" r="${R*0.055}" fill="${C.red}"/>
      <path d="M0,${tip} L${xR},${yR} A${R},${R} 0 0 0 ${-xR},${yR} Z" fill="none" stroke="${C.ink}" stroke-width="${R*0.035}" stroke-linejoin="round"/>
    </g>`;
  }
  s += `<circle r="${r0*1.05}" fill="${C.ink}"/>`;
  const N=21, ga=Math.PI*(3-Math.sqrt(5)), k=r0*0.78/Math.sqrt(N);
  for (let i=1;i<=N;i++){const r=k*Math.sqrt(i),a=i*ga; s+=`<circle cx="${(r*Math.cos(a)).toFixed(1)}" cy="${(r*Math.sin(a)).toFixed(1)}" r="${(r0*0.07).toFixed(1)}" fill="${C.yel}"/>`;}
  return s;
}
function conceptB() {
  const W=1600,H=900;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${C.cream}"/>
   <g transform="translate(800,0)">
     <path d="M0,300 C-8,410 8,500 0,590" fill="none" stroke="${C.green}" stroke-width="20" stroke-linecap="round"/>
     <path d="M0,580 C-40,530 -110,530 -140,555 C-100,600 -40,605 0,580 Z" fill="${C.green}"/>
     <path d="M2,530 C40,480 110,480 140,505 C100,550 42,555 2,530 Z" fill="${C.green}"/>
   </g>
   <g transform="translate(800,240)">${pizzaFlower(185)}</g>
   <text x="800" y="745" text-anchor="middle" font-family="CalBI" font-size="165" fill="${C.red}" letter-spacing="-2">Sunflower</text>
   <g transform="translate(800,822)">
     <rect x="-520" y="-3" width="140" height="6" rx="3" fill="${C.ink}"/><rect x="380" y="-3" width="140" height="6" rx="3" fill="${C.ink}"/>
     <text x="0" y="15" text-anchor="middle" font-family="IDBo" font-size="40" letter-spacing="10" fill="${C.ink}">PIZZA · DÖNER · BURGER</text>
   </g></svg>`;
}

// ---------- C: Retro-Sonnenaufgang ----------
function conceptC() {
  const W=1600,H=900, cx=800, cy=360, R=250;
  let rays=''; const n=14;
  for (let i=0;i<n;i++){ const a0=Math.PI+i*Math.PI/n, a1=a0+Math.PI/n;
    rays+=`<path d="M${cx},${cy} L${cx+R*Math.cos(a0)},${cy+R*Math.sin(a0)} A${R},${R} 0 0 1 ${cx+R*Math.cos(a1)},${cy+R*Math.sin(a1)} Z" fill="${i%2?C.yel:'#FFB000'}"/>`; }
  const sw=24, wd=word('SUNFLOWER', sw, 10), s=1.32, ox=cx-wd.w*s/2, oy=cy+45;
  const sk=(c,w,dx=0,dy=0)=>paths(wd,`fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`,dx,dy);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${C.ink}"/>
   <defs><clipPath id="half"><rect x="0" y="0" width="${W}" height="${cy}"/></clipPath></defs>
   <g clip-path="url(#half)">${rays}<circle cx="${cx}" cy="${cy}" r="105" fill="${C.red}"/></g>
   <rect x="${cx-R-40}" y="${cy}" width="${2*R+80}" height="12" rx="6" fill="${C.yel}"/>
   <g transform="translate(${ox},${oy}) scale(${s})">${sk(C.ink, sw+26)}${sk(C.cream, sw)}</g>
   <g transform="translate(${cx},${cy+290})">
     <path d="M-380,-48 H380 L350,0 L380,48 H-380 L-350,0 Z" fill="${C.red}"/>
     <text x="0" y="20" text-anchor="middle" font-family="IDB" font-size="56" letter-spacing="16" fill="${C.cream}">LANGENHAGEN</text>
   </g>
   <text x="${cx}" y="${cy+410}" text-anchor="middle" font-family="IDBo" font-size="36" letter-spacing="9" fill="${C.yel}">„EINMAL ESSEN, NIE WIEDER VERGESSEN“</text>
  </svg>`;
}
module.exports = { conceptA, conceptB, conceptC, C, word, paths, pizzaFlower };
