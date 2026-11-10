const { chromium } = require('playwright'); const fs = require('fs');
const { stamp } = require('./stamp'); const { NAVY, GOLD } = require('../logo/mark');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const jobs = { 'benefit-stamp-navy': stamp('a', NAVY), 'benefit-stamp-brand': stamp('b', NAVY, GOLD) };
  for (const [n, svg] of Object.entries(jobs)) {
    fs.writeFileSync(`${__dirname}/out/${n}.svg`, svg);
    await p.setContent(`<!doctype html><meta charset=utf-8><style>html,body{margin:0;background:transparent}svg{display:block;width:1200px;height:1200px}</style>${svg}`);
    await p.evaluate(() => document.fonts.ready);
    await (await p.$('svg')).screenshot({ path: `${__dirname}/out/${n}.png`, omitBackground: true });
  }
  await b.close();
})();
