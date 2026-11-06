const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path'); const { execSync } = require('child_process');
const OUT = '/home/user/design-resources-for-developers/sunflower-logo';
const B64 = n => fs.readFileSync('/usr/share/fonts/opentype/inter/' + n).toString('base64');
const FONTCSS = `@font-face{font-family:IDB;src:url(data:font/otf;base64,${B64('InterDisplay-Black.otf')})}
@font-face{font-family:IDBo;src:url(data:font/otf;base64,${B64('InterDisplay-Bold.otf')})}`;

const C = { sun:'#FFC21A', amber:'#F39A0B', core:'#2A1712', red:'#D62839', cream:'#FFF8EC', white:'#FFFFFF' };

// ---------- Signet: stylised sunflower ----------
function petal(r0, R, w) {
  const m = r0 + (R - r0) * 0.45;
  return `M0,${-r0} C${w},${-m} ${w*0.55},${-R+w*0.35} 0,${-R} C${-w*0.55},${-R+w*0.35} ${-w},${-m} 0,${-r0}Z`;
}
function signet(cx, cy, R, mode = 'color') {
  // mode: color | mono-dark | mono-light
  const back = mode === 'color' ? C.amber : mode === 'mono-dark' ? C.core : C.white;
  const front = mode === 'color' ? C.sun : mode === 'mono-dark' ? C.core : C.white;
  const coreFill = mode === 'mono-light' ? C.white : C.core;
  const dot = mode === 'color' ? C.sun : mode === 'mono-dark' ? 'var(--bg)' : 'var(--bg)';
  const n = 12, rc = R * 0.40;
  let s = `<g transform="translate(${cx},${cy})">`;
  // back petals (offset), slightly shorter
  for (let i = 0; i < n; i++) s += `<path d="${petal(rc*0.6, R*0.93, R*0.20)}" fill="${back}" transform="rotate(${360/n*i + 180/n})"/>`;
  for (let i = 0; i < n; i++) s += `<path d="${petal(rc*0.6, R, R*0.205)}" fill="${front}" transform="rotate(${360/n*i})"/>`;
  if (mode !== 'color') { // separate core from petals with a gap ring
    s += `<circle r="${rc + R*0.055}" fill="var(--bg)"/>`;
  }
  s += `<circle r="${rc}" fill="${coreFill}"/>`;
  // phyllotaxis seeds
  const N = 34, ga = Math.PI * (3 - Math.sqrt(5)), k = rc * 0.80 / Math.sqrt(N);
  for (let i = 1; i <= N; i++) {
    const r = k * Math.sqrt(i), a = i * ga;
    const dr = rc * (0.035 + 0.035 * i / N);
    s += `<circle cx="${(r*Math.cos(a)).toFixed(2)}" cy="${(r*Math.sin(a)).toFixed(2)}" r="${dr.toFixed(2)}" fill="${mode==='mono-light'?'var(--bg)':dot}" opacity="${mode==='color'?(0.55+0.45*i/N).toFixed(2):1}"/>`;
  }
  return s + '</g>';
}

// ---------- page-side layout (measures text in the browser) ----------
const variants = {
  'sunflower-logo-primary':   { kind:'word', bg:C.cream, ink:C.core, accent:C.red,  mode:'color' },
  'sunflower-logo-white':     { kind:'word', bg:C.white, ink:C.core, accent:C.red,  mode:'color' },
  'sunflower-logo-yellow':    { kind:'word', bg:C.sun,   ink:C.core, accent:C.red,  mode:'mono-dark' },
  'sunflower-logo-dark':      { kind:'word', bg:C.core,  ink:C.white,accent:C.sun,  mode:'color' },
  'sunflower-logo-red':       { kind:'word', bg:C.red,   ink:C.white,accent:C.sun, mode:'color' },
  'sunflower-badge':          { kind:'badge',bg:C.core,  ink:C.sun,  accent:C.white,mode:'color' },
  'sunflower-badge-yellow':   { kind:'badge',bg:C.sun,   ink:C.core, accent:C.red,  mode:'mono-dark' },
  'sunflower-icon':           { kind:'icon', bg:C.core,  mode:'color' },
  'sunflower-icon-yellow':    { kind:'icon', bg:C.sun,   mode:'mono-dark' },
};

function pageHTML(name, v) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTCSS}
  html,body{margin:0;padding:0;background:transparent} svg{display:block}</style></head>
  <body><svg id="s" xmlns="http://www.w3.org/2000/svg"></svg>
  <script>
  const v=${JSON.stringify(v)}; const SIG=${JSON.stringify({})};
  </script></body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  for (const [name, v] of Object.entries(variants)) {
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${FONTCSS}
      html,body{margin:0;padding:0;background:transparent} svg{display:block}</style></head><body>
      <svg id="m" xmlns="http://www.w3.org/2000/svg" width="4000" height="1000"></svg></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => { await document.fonts.load('200px IDB'); await document.fonts.load('60px IDBo'); });
    // measure helper
    const measure = async (txt, font, size, ls) => page.evaluate(([txt, font, size, ls]) => {
      const svg = document.getElementById('m');
      const t = document.createElementNS('http://www.w3.org/2000/svg','text');
      t.setAttribute('font-family', font); t.setAttribute('font-size', size);
      t.setAttribute('letter-spacing', ls); t.textContent = txt; svg.appendChild(t);
      const b = t.getBBox(); const w = t.getComputedTextLength(); t.remove(); return { w, y: b.y, h: b.height };
    }, [txt, font, size, ls]);

    let W, H, body;
    if (v.kind === 'word') {
      const fs_ = 200, ls = -6, cap = 145; // Inter Display cap height ≈ 0.727em
      const a = await measure('SUNFL', 'IDB', fs_, ls);
      const b = await measure('WER', 'IDB', fs_, ls);
      const R = cap * 0.70, gap = 12;
      const pad = 90, base = pad + cap + 14;
      let x = pad;
      body = `<text x="${x}" y="${base}" font-family="IDB" font-size="${fs_}" letter-spacing="${ls}" fill="${v.ink}">SUNFL</text>`;
      x += a.w + gap + R;
      const sig = { x, y: base - cap/2 };
      x += R + gap + 2;
      body += `<text x="${x}" y="${base}" font-family="IDB" font-size="${fs_}" letter-spacing="${ls}" fill="${v.ink}">WER</text>`;
      const wordW = x + b.w - pad;
      W = wordW + pad*2;
      // sub line
      const subFs = 46, subLs = 21;
      const sub = await measure('LANGENHAGEN', 'IDBo', subFs, subLs);
      const subW = sub.w - subLs;
      const subY = base + 30 + subFs*0.727 + 18;
      const cx = W/2;
      body += `<text x="${cx - subW/2}" y="${subY}" font-family="IDBo" font-size="${subFs}" letter-spacing="${subLs}" fill="${v.accent}">LANGENHAGEN</text>`;
      const lineY = subY - subFs*0.727/2, lw = 6;
      const l1 = pad + 8, l2 = cx - subW/2 - 34, r1 = cx + subW/2 + 34, r2 = W - pad - 8;
      body += `<rect x="${l1}" y="${lineY-lw/2}" width="${l2-l1}" height="${lw}" rx="3" fill="${v.accent}"/>`;
      body += `<rect x="${r1}" y="${lineY-lw/2}" width="${r2-r1}" height="${lw}" rx="3" fill="${v.accent}"/>`;
      H = subY + pad;
      body += SIGNET(sig.x, sig.y, R, v.mode);
    } else if (v.kind === 'badge') {
      W = H = 1000; const cx = 500, cy = 500;
      body = `<circle cx="${cx}" cy="${cy}" r="490" fill="${v.bg}"/>`;
      body += `<circle cx="${cx}" cy="${cy}" r="452" fill="none" stroke="${v.ink}" stroke-width="8"/>`;
      body += `<circle cx="${cx}" cy="${cy}" r="300" fill="none" stroke="${v.ink}" stroke-width="8"/>`;
      const rt = 376 - 0; // text radius (centre line of caps)
      const rT = rt - 31, rB = rt + 21;
      const top = `M ${cx-rT},${cy} A ${rT} ${rT} 0 0 1 ${cx+rT},${cy}`; // baseline for top text (outside of centre)
      const bot = `M ${cx-rB},${cy} A ${rB} ${rB} 0 0 0 ${cx+rB},${cy}`;
      body += `<defs><path id="pt" d="${top}"/><path id="pb" d="${bot}"/></defs>`;
      body += `<text font-family="IDB" font-size="86" letter-spacing="10" fill="${v.ink}" text-anchor="middle"><textPath href="#pt" startOffset="50%" dx="5">SUNFLOWER</textPath></text>`;
      body += `<text font-family="IDBo" font-size="58" letter-spacing="13" fill="${v.accent}" text-anchor="middle"><textPath href="#pb" startOffset="50%" dx="6.5">LANGENHAGEN</textPath></text>`;
      // side stars
      for (const sx of [-1, 1]) body += `<circle cx="${cx + sx*rt}" cy="${cy}" r="12" fill="${v.accent}"/>`;
      body += SIGNET(cx, cy, 240, v.mode);
    } else {
      W = H = 1024;
      body = `<rect width="1024" height="1024" rx="224" fill="${v.bg}"/>` + SIGNET(512, 512, 400, v.mode);
    }
    W = Math.round(W); H = Math.round(H);
    const bgRect = v.kind === 'word' ? `<rect width="${W}" height="${H}" fill="${v.bg}"/>` : '';
    // icon/badge background is part of the art; word marks get a separate transparent version too
    const mk = (withBg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="--bg:${v.bg}">${withBg?bgRect:''}${body}</svg>`;
    const outs = [[name, true]];
    if (v.kind === 'word' && ['sunflower-logo-primary','sunflower-logo-dark','sunflower-logo-yellow'].includes(name)) outs.push([name + '-transparent', false]);
    for (const [fname, withBg] of outs) {
      const svg = mk(withBg);
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${FONTCSS}
        @page{size:${W}px ${H}px;margin:0} html,body{margin:0;padding:0;background:transparent} svg{display:block}</style></head><body>${svg}</body></html>`);
      await page.evaluate(() => document.fonts.ready);
      await page.setViewportSize({ width: W, height: H });
      // PNG @ 2x
      const png = path.join(OUT, 'png', fname + '.png');
      await page.screenshot({ path: png, omitBackground: true, clip: { x:0, y:0, width:W, height:H } });
      // PDF -> outlined SVG
      const pdf = path.join(require('os').tmpdir(), fname + '.pdf');
      await page.pdf({ path: pdf, width: W + 'px', height: H + 'px', printBackground: true, pageRanges: '1' });
      const sp = path.join(OUT, 'svg', fname + '.svg');
      execSync(`pdftocairo -svg "${pdf}" "${sp}"`);
      let sv = fs.readFileSync(sp, 'utf8').replace(/(<svg[^>]*?)width="[\d.]+(?:pt)?" height="[\d.]+(?:pt)?"/, `$1width="${W}" height="${H}"`);
      fs.writeFileSync(sp, sv);
      console.log('done', fname, W, H);
    }
  }
  await browser.close();
})();
function SIGNET(...a){ return signet(...a); }
