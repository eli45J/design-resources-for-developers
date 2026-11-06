const { chromium } = require('playwright'); const fs = require('fs');
const D = __dirname + '/out/png/';
const im = n => 'data:image/png;base64,' + fs.readFileSync(D + n + '.png').toString('base64');
const font = 'data:font/otf;base64,' + fs.readFileSync('/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf').toString('base64');
const names = { 1:'Runde Blütenblätter', 2:'Spitze Blütenblätter + Balken', 3:'Wellenrand-Blüte' };
const block = id => { const n = `sunflower-v${id}`; return `
<section><header><span>0${id}</span>${names[id]}</header>
 <div class=grid>
  <div class="p white"><img src="${im(n+'-weiss')}"></div>
  <div class="p"><img src="${im(n+'-gelb')}"></div>
  <div class="p white small"><img src="${im(n+'-einfarbig-schwarz')}"></div>
  <div class="p small" style="background:#111"><img src="${im(n+'-einfarbig-weiss')}"></div>
 </div>
 <div class=av><img src="${im(n+'-profilbild')}" style="width:160px"><img src="${im(n+'-profilbild')}" style="width:80px"><img src="${im(n+'-profilbild')}" style="width:40px"><img src="${im(n+'-profilbild')}" style="width:24px"><em>Profilbild in 160 / 80 / 40 / 24 px</em></div>
</section>`; };
const html = `<style>@font-face{font-family:I;src:url(${font})}
body{margin:0;background:#ECECEA;font-family:I;color:#111;width:1800px;padding:56px;box-sizing:border-box}
h1{font-size:30px;margin:0 0 40px;font-weight:700}
section{margin-bottom:56px}header{font-size:22px;margin-bottom:16px;display:flex;gap:14px;align-items:baseline}header span{color:#E1251B}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.p{background:#FFD400;display:grid;place-items:center}.p.white{background:#fff}
.p img{width:100%;display:block}.p.small img{width:72%}
.av{display:flex;gap:28px;align-items:center;margin-top:16px;background:#fff;padding:20px 28px}.av em{font-style:normal;color:#777;font-size:17px;margin-left:auto}</style>
<h1>SUNFLOWER Langenhagen · Logo-Varianten</h1>${block(1)}${block(2)}${block(3)}`;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:1800,height:900} });
 await p.setContent(html); await p.evaluate(()=>document.fonts.ready);
 await p.screenshot({ path: process.argv[2], fullPage: true }); await b.close(); })();
