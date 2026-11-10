const { mark, NAVY, GOLD } = require('../logo/mark');
// ink: single colour for a real rubber stamp; gold: second colour for digital (two-colour) version
function stamp(id, ink = NAVY, accent = ink) {
  const star = (x, y) => `<path d="M${x},${y-7} L${x+2},${y-2} L${x+7},${y} L${x+2},${y+2} L${x},${y+7} L${x-2},${y+2} L${x-7},${y} L${x-2},${y-2} Z" fill="${accent}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <path id="top${id}" d="M 50,200 A 150,150 0 0 1 350,200"/>
    <path id="bot${id}" d="M 36,200 A 164,164 0 0 0 364,200"/>
  </defs>
  <circle cx="200" cy="200" r="192" fill="none" stroke="${ink}" stroke-width="7"/>
  <circle cx="200" cy="200" r="181" fill="none" stroke="${ink}" stroke-width="1.6"/>
  <circle cx="200" cy="200" r="124" fill="none" stroke="${ink}" stroke-width="1.6"/>
  <circle cx="200" cy="200" r="118" fill="none" stroke="${accent}" stroke-width="3.5" stroke-dasharray="1 7" stroke-linecap="round"/>
  <text font-family="Cairo" font-weight="800" font-size="30" fill="${ink}"><textPath href="#top${id}" startOffset="50%" text-anchor="middle">بنفيت للسفر والطيران</textPath></text>
  <text font-family="Montserrat" font-weight="700" font-size="18.5" letter-spacing="3.2" fill="${ink}"><textPath href="#bot${id}" startOffset="50%" text-anchor="middle">BENEFIT TRAVEL &amp; AVIATION</textPath></text>
  ${star(36, 200)}${star(364, 200)}
  <g transform="translate(142,104) scale(0.58)">${mark('st' + id, ink, accent)}</g>
  <rect x="146" y="232" width="108" height="1.6" fill="${accent}"/>
  <text x="200" y="262" text-anchor="middle" font-family="Cairo" font-weight="700" font-size="21" fill="${ink}">س.ت: 1176591</text>
  <text x="200" y="290" text-anchor="middle" font-family="Cairo" font-weight="700" font-size="17" fill="${accent}">الخرطوم – السودان</text>
</svg>`;
}
module.exports = { stamp };
