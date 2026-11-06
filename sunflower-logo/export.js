// Renders every svg/*.svg to png/*.png (2000 px wide, transparent where the SVG has no background)
// and preview.html to preview.png. Needs Playwright + Chromium.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = path.join(__dirname, 'svg'), out = path.join(__dirname, 'png');
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 2000, height: 200 } });
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg'))) {
    const w = f.includes('icon') ? 1024 : 2000;
    await p.setContent(`<body style="margin:0;background:transparent"><img id=i style="width:${w}px;display:block" src="data:image/svg+xml;base64,${fs.readFileSync(path.join(dir, f)).toString('base64')}"></body>`);
    await (await p.$('#i')).screenshot({ path: path.join(out, f.replace('.svg', '.png')), omitBackground: true });
  }
  const q = await b.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
  await q.goto('file://' + path.join(__dirname, 'preview.html'));
  await q.screenshot({ path: path.join(__dirname, 'preview.png'), fullPage: true });
  await b.close();
})();
