const { chromium } = require('playwright'); const fs=require('fs');
const k = require(__dirname + '/concepts.js');
const b64 = p => fs.readFileSync(p).toString('base64');
const CSS = `@font-face{font-family:IDB;src:url(data:font/otf;base64,${b64('/usr/share/fonts/opentype/inter/InterDisplay-Black.otf')})}
@font-face{font-family:IDBo;src:url(data:font/otf;base64,${b64('/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf')})}
@font-face{font-family:CalBI;src:url(data:font/ttf;base64,${b64('/usr/share/fonts/truetype/crosextra/Caladea-BoldItalic.ttf')})}
html,body{margin:0}svg{display:block;width:1600px;height:900px}`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:900}});
for (const n of ['A','B','C']) { await p.setContent(`<style>${CSS}</style>${k['concept'+n]()}`); await p.evaluate(()=>document.fonts.ready); await p.screenshot({path:`concept-${n}.png`}); }
await b.close();})();
