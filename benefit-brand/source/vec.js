const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [src, dst] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  for (const f of fs.readdirSync(src).filter(f => f.endsWith('.svg'))) {
    const svg = fs.readFileSync(path.join(src, f), 'utf8');
    const vb = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
    const w = vb[2] * 3, h = vb[3] * 3; // 3x so 1 viewBox unit = 3px
    const body = svg.replace(/<svg /, `<svg style="display:block;width:${w}px;height:${h}px" `);
    await p.setContent(`<!doctype html><meta charset=utf-8><style>@page{margin:0}html,body{margin:0}</style>${body}`);
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: path.join(dst, f.replace('.svg', '.pdf')), width: w + 'px', height: (h + 1) + 'px', printBackground: false, pageRanges: '1' });
  }
  await b.close();
})();
