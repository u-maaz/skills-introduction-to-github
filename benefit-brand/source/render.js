const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const { NAVY, GOLD, mark } = require('./mark');
const out = __dirname;
const font = `<style>
 html,body{margin:0;background:transparent} svg{display:block}</style>`;
const icon = (n=NAVY,g=GOLD)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="1000" height="1000">${mark('i',n,g)}</svg>`;
// horizontal lockup: icon + EN wordmark + AR name
const horiz = (n=NAVY,g=GOLD)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" width="1800" height="600">
 <g>${mark('h',n,g)}</g>
 <text x="214" y="112" font-family="Montserrat, Arial, sans-serif" font-weight="800" font-size="74" letter-spacing="6" fill="${n}">BENEFIT</text>
 <rect x="217" y="128" width="64" height="4" fill="${g}"/>
 <text x="294" y="137" font-family="Montserrat, Arial, sans-serif" font-weight="600" font-size="17.5" letter-spacing="5.2" fill="${g}">TRAVEL &amp; AVIATION</text>
 <text x="214" y="182" font-family="Cairo, Arial, sans-serif" font-weight="700" font-size="30" fill="${n}" direction="ltr">بنفيت للسفر والطيران</text>
</svg>`;
// stacked lockup
const stacked = (n=NAVY,g=GOLD)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 400" width="1320" height="1200">
 <g transform="translate(120,0)">${mark('s',n,g)}</g>
 <text x="220" y="262" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-weight="800" font-size="62" letter-spacing="6" fill="${n}">BENEFIT</text>
 <text x="220" y="296" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-weight="600" font-size="16" letter-spacing="6" fill="${g}">TRAVEL &amp; AVIATION</text>
 <rect x="190" y="314" width="60" height="3" fill="${g}"/>
 <text x="220" y="362" text-anchor="middle" font-family="Cairo, Arial, sans-serif" font-weight="700" font-size="34" fill="${n}">بنفيت للسفر والطيران</text>
</svg>`;
(async()=>{
  const b = await chromium.launch(); const p = await b.newPage();
  const jobs = {
    'benefit-icon': icon(), 'benefit-logo-horizontal': horiz(), 'benefit-logo-stacked': stacked(),
    'benefit-logo-horizontal-white': horiz('#FFFFFF', GOLD),
    'benefit-icon-white': icon('#FFFFFF', GOLD), 'benefit-logo-stacked-white': stacked('#FFFFFF', GOLD),
    'benefit-logo-header-white': horiz('#FFFFFF', GOLD).replace('viewBox="0 0 600 200" width="1800" height="600"','viewBox="4 26 586 156" width="1758" height="468"').replace(/<text x="214" y="182"[^]*?<\/text>/,''),
    'benefit-logo-header': horiz().replace('viewBox="0 0 600 200" width="1800" height="600"','viewBox="4 26 586 156" width="1758" height="468"').replace(/<text x="214" y="182"[^]*?<\/text>/,''),
  };
  for (const [name, svg] of Object.entries(jobs)) {
    fs.writeFileSync(path.join(out, name + '.svg'), svg.replace(/file:\/\/[^)]+\/fonts\//g,''));
    await p.setContent(`<!doctype html><html><head><meta charset="utf-8">${font}</head><body>${svg}</body></html>`);
    await p.evaluate(async()=>{await document.fonts.ready;});
    const el = await p.$('svg');
    await el.screenshot({ path: path.join(out, name + '.png'), omitBackground: true });
  }
  await b.close();
})();
