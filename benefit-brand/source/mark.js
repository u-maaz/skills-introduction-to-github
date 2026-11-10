// Shared logo geometry. Two brand colours only.
const NAVY = '#0B2A4A', GOLD = '#C9A14A';
const plane = 'M15,0 C15,-2 12,-2.6 10,-2.6 L3,-2.6 L-5,-14 L-9.5,-14 L-4.5,-2.6 L-11,-2.6 L-14.5,-7.5 L-17.5,-7.5 L-15.5,0 L-17.5,7.5 L-14.5,7.5 L-11,2.6 L-4.5,2.6 L-9.5,14 L-5,14 L3,2.6 L10,2.6 C12,2.6 15,2 15,0 Z';
const swoosh = 'M18,146 Q92,206 160,70 Q96,186 18,146 Z';
function mark(id, navy = NAVY, gold = GOLD) {
  return `
  <defs><mask id="m${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
    <rect width="200" height="200" fill="#fff"/>
    <path d="${swoosh}" fill="#000" stroke="#000" stroke-width="9" stroke-linejoin="round"/>
  </mask></defs>
  <g mask="url(#m${id})" fill="none" stroke="${navy}" stroke-width="21" stroke-linejoin="miter">
    <path d="M62,34 V166"/>
    <path d="M52,44.5 H104 A24.5,24.5 0 0 1 104,93.5 H62"/>
    <path d="M62,93.5 H110 A31,31 0 0 1 110,155.5 H52"/>
  </g>
  <path d="${swoosh}" fill="${gold}"/>
  <path d="${plane}" fill="${gold}" transform="translate(171,49) rotate(-58) scale(1.15)"/>`;
}
module.exports = { NAVY, GOLD, mark };
