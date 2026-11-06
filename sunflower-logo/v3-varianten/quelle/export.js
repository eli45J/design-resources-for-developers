const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os'); const { execSync } = require('child_process');
const { lockup, avatar, COL, mono, V } = require(__dirname + '/variants.js');
const OUT = process.argv[2]; fs.mkdirSync(OUT + '/svg', {recursive:true}); fs.mkdirSync(OUT + '/png', {recursive:true});
const b64 = p => fs.readFileSync(p).toString('base64');
const CSS = `@font-face{font-family:IDB;src:url(data:font/otf;base64,${b64('/usr/share/fonts/opentype/inter/InterDisplay-Black.otf')})} html,body{margin:0;background:transparent}svg{display:block}`;
const FIX = () => { for (const svg of document.querySelectorAll('svg')) { const t = svg.querySelector('.tag'); if (!t) continue; const bb = t.getBBox();
  const l = svg.querySelector('.tl'), r = svg.querySelector('.tr'); if (l) { l.setAttribute('x', bb.x - 28 - 56); r.setAttribute('x', bb.x + bb.width - 6 + 28); } } };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ deviceScaleFactor: 2 });
  const out = async (o, name) => {
    await p.setViewportSize({ width:o.W, height:o.H });
    await p.setContent(`<style>${CSS} @page{size:${o.W}px ${o.H}px;margin:0}</style>${o.svg}`);
    await p.evaluate(() => document.fonts.ready); await p.evaluate(FIX);
    await p.screenshot({ path: `${OUT}/png/${name}.png`, omitBackground: true });
    const pdf = path.join(os.tmpdir(), name + '.pdf');
    await p.pdf({ path: pdf, width: o.W+'px', height: o.H+'px', printBackground: true, pageRanges: '1' });
    const sp = `${OUT}/svg/${name}.svg`; execSync(`pdftocairo -svg "${pdf}" "${sp}"`);
    fs.writeFileSync(sp, fs.readFileSync(sp,'utf8').replace(/(<svg[^>]*?)width="[\d.]+(?:pt)?" height="[\d.]+(?:pt)?"/, `$1width="${o.W}" height="${o.H}"`));
  };
  for (const id of [1,2,3]) {
    const n = `sunflower-v${id}`;
    await out(lockup(id, COL.white), `${n}-weiss`);
    await out(lockup(id, COL.yellow), `${n}-gelb`);
    await out(lockup(id, COL.white, { pal: mono(COL.black, COL.white), accent: COL.black }), `${n}-einfarbig-schwarz`);
    await out(lockup(id, COL.black, { ink: COL.white, pal: mono(COL.white, COL.black), accent: COL.white }), `${n}-einfarbig-weiss`);
    await out(avatar(id, COL.yellow), `${n}-profilbild`);
  }
  await b.close();
})();
