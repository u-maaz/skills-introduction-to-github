const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const D = __dirname, H = path.join(D, 'html'), O = path.join(D, 'out');
const NAVY = '#0B2A4A', GOLD = '#C9A14A';
const INFO = { phoneIntl: '+249 912 337 952', phoneLocal: '0912337952', addrAr: 'الخرطوم – العمارات، السودان', addrEn: 'Al-Amarat, Khartoum, Sudan', cr: '1176591' };
const A = f => `../assets/${f}`;
const base = `<meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0} html,body{overflow:hidden} :root{--navy:${NAVY};--gold:${GOLD}}
body{font-family:Rubik,Arial,sans-serif;color:var(--navy);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.en{font-family:Rubik,Arial,sans-serif} .ltr{direction:ltr;unicode-bidi:isolate}
</style>`;
const ico = {
  phone: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="${c}" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>`,
  pin: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="${c}" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>`,
  doc: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="${c}" d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V9h5.5L13 3.5zM8 13h8v1.6H8V13zm0 3.4h8V18H8v-1.6z"/></svg>`,
};

// ---------- Business card 90x55mm ----------
const card = `<!doctype html><html dir="rtl">${base}<style>
@page{size:90mm 55mm;margin:0} .pg{width:90mm;height:55mm;position:relative;overflow:hidden;page-break-after:always}
.front{background:var(--navy);display:flex;align-items:center;justify-content:center}
.front img{height:41mm;margin-bottom:1.6mm} .front .bar{position:absolute;bottom:0;left:0;right:0;height:1.6mm;background:var(--gold)}
.front .sw{position:absolute;inset:0;opacity:.08}
.back{background:#fff;padding:7mm 7mm 0 7mm}
.back .logo{position:absolute;left:6mm;top:6mm;width:12mm}
.name{font-size:13pt;font-weight:800;line-height:1.2} .title{font-size:7.5pt;color:var(--gold);font-weight:700;margin-top:.6mm}
.rule{width:12mm;height:.5mm;background:var(--gold);margin:3mm 0 3mm}
.row{display:flex;align-items:center;gap:2.2mm;font-size:7.3pt;font-weight:600;line-height:1.25;margin-bottom:1.5mm}
.row i{width:3.6mm;height:3.6mm;flex:none;display:block;background:var(--navy);border-radius:50%;padding:.75mm}
.row small{font-family:Rubik;font-size:5.8pt;font-weight:500;display:block}
.back .foot{position:absolute;bottom:0;left:0;right:0;height:5.5mm;background:var(--navy);display:flex;align-items:center;justify-content:center;gap:2mm;color:#fff;font-size:6pt;font-weight:700}
.back .foot b{color:var(--gold)}
</style><body>
<div class="pg front"><img src="${A('benefit-logo-stacked-white.png')}"><div class="bar"></div></div>
<div class="pg back"><img class="logo" src="${A('benefit-icon.png')}">
  <div class="name">[اسم الموظف]</div><div class="title">[المسمى الوظيفي]</div>
  <div class="rule"></div>
  <div class="row"><i>${ico.phone('#fff')}</i><span class="ltr en">${INFO.phoneIntl}</span></div>
  <div class="row"><i>${ico.pin('#fff')}</i><span>${INFO.addrAr}<small class="ltr">${INFO.addrEn}</small></span></div>
  <div class="row"><i>${ico.doc('#fff')}</i><span>سجل تجاري: <span class="en">${INFO.cr}</span></span></div>
  <div class="foot">بنفت للسفر والسياحة <b>•</b> <span class="en" style="letter-spacing:.6mm">BENEFIT TRAVEL &amp; TOURISM</span></div>
</div></body></html>`;

// ---------- DL envelope 220x110mm ----------
const env = `<!doctype html><html dir="rtl">${base}<style>
@page{size:220mm 110mm;margin:0} .pg{width:220mm;height:110mm;position:relative;overflow:hidden;background:#fff}
.logo{position:absolute;right:12mm;top:10mm;width:62mm}
.addr{position:absolute;right:12mm;top:30mm;font-size:8pt;line-height:1.7;font-weight:600}
.addr b{color:var(--gold)}
.to{position:absolute;left:30mm;top:52mm;width:95mm;border-top:.3mm solid var(--gold);padding-top:3mm;font-size:10pt;line-height:2}
.to span{display:block;border-bottom:.2mm dotted var(--navy);height:7mm}
.band{position:absolute;bottom:0;left:0;right:0;height:11mm;background:var(--navy);display:flex;align-items:center;justify-content:space-between;padding:0 12mm;color:#fff;font-size:8pt;font-weight:700}
.band .g{position:absolute;top:-1.4mm;left:0;right:0;height:1.4mm;background:var(--gold)}
.mark{position:absolute;left:-18mm;top:-22mm;width:95mm;opacity:.06}
</style><body><div class="pg">
<img class="mark" src="${A('benefit-icon.png')}">
<img class="logo" src="${A('benefit-logo-horizontal.png')}">
<div class="to"><b>إلى السادة /</b><span></span><span></span><span></span></div>
<div class="band"><div class="g"></div><span>${INFO.addrAr}</span><span class="en ltr">${INFO.phoneIntl}</span><span>سجل تجاري: <span class="en">${INFO.cr}</span></span></div>
</div></body></html>`;

// ---------- Social: avatar 1080, cover 1640x624, post 1080 ----------
const avatar = `<!doctype html>${base}<style>body{width:1080px;height:1080px;background:var(--navy);display:flex;align-items:center;justify-content:center}
img{width:720px}</style><body><img src="${A('benefit-icon-white.png')}"></body>`;
const cover = `<!doctype html><html dir="rtl">${base}<style>body{width:1640px;height:624px;overflow:hidden;background:var(--navy);position:relative;overflow:hidden}
.logo{position:absolute;right:120px;top:150px;width:760px}
.big{position:absolute;left:-60px;top:-120px;width:820px;opacity:.07}
.info{position:absolute;left:120px;top:210px;color:#fff;font-size:30px;font-weight:700;line-height:2.1}
.info b{color:var(--gold);font-family:Rubik;letter-spacing:2px}
.bar{position:absolute;bottom:0;left:0;right:0;height:14px;background:var(--gold)}
</style><body><img class="big" src="${A('benefit-icon-white.png')}"><img class="logo" src="${A('benefit-logo-horizontal-white.png')}">
<div class="info"><div><b class="ltr">${INFO.phoneIntl}</b></div><div>${INFO.addrAr}</div></div><div class="bar"></div></body></html>`;
const post = `<!doctype html><html dir="rtl">${base}<style>body{width:1080px;height:1080px;overflow:hidden;background:#fff;position:relative;overflow:hidden}
.top{position:absolute;top:0;left:0;right:0;height:120px;background:var(--navy);display:flex;align-items:center;justify-content:space-between;padding:0 60px}
.top img{height:78px} .top span{color:var(--gold);font-family:Rubik;font-weight:700;font-size:26px;letter-spacing:2px}
.area{position:absolute;top:120px;bottom:150px;left:0;right:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 90px}
.area h1{font-size:76px;font-weight:800;line-height:1.35} .area p{font-size:34px;color:var(--gold);font-weight:700;margin-top:24px}
.area .rule{width:120px;height:6px;background:var(--gold);margin:34px 0 0}
.bot{position:absolute;bottom:0;left:0;right:0;height:150px;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;gap:40px;font-size:30px;font-weight:700}
.bot b{color:var(--gold)} .bot .g{position:absolute;top:-10px;left:0;right:0;height:10px;background:var(--gold)}
.wm{position:absolute;left:-120px;bottom:60px;width:560px;opacity:.06}
</style><body><img class="wm" src="${A('benefit-icon.png')}">
<div class="top"><img src="${A('benefit-logo-header-white.png')}"><span class="ltr">${INFO.phoneIntl}</span></div>
<div class="area"><h1>[عنوان المنشور هنا]</h1><div class="rule"></div><p>[نص فرعي أو تفاصيل العرض]</p></div>
<div class="bot"><div class="g"></div><span>${INFO.addrAr}</span><b>•</b><span class="en ltr">${INFO.phoneIntl}</span></div></body></html>`;

// ---------- Email signature (portable HTML, inline styles, absolute logo URL to be set by user) ----------
const sig = `<table dir="rtl" cellpadding="0" cellspacing="0" style="font-family:Rubik,Arial,Tahoma,sans-serif;color:${NAVY};font-size:13px;line-height:1.6">
<tr><td style="padding-left:16px;border-left:3px solid ${GOLD};vertical-align:middle"><img src="benefit-icon.png" width="78" height="78" alt="Benefit" style="display:block"></td>
<td style="padding-right:4px;vertical-align:middle">
<div style="font-size:16px;font-weight:bold">[اسم الموظف]</div>
<div style="color:${GOLD};font-weight:bold">[المسمى الوظيفي] — بنفت للسفر والسياحة</div>
<div>هاتف: <span dir="ltr">${INFO.phoneIntl}</span></div>
<div>${INFO.addrAr}</div>
<div style="font-size:11px">سجل تجاري: ${INFO.cr}</div></td></tr></table>`;
const sigPage = `<!doctype html>${base}<body style="padding:30px;background:#fff;width:640px">${sig.replace('benefit-icon.png', A('benefit-icon.png'))}</body>`;

// ---------- Brand guidelines (A4 landscape) ----------
const sw = (name, hex, rgb, cmyk, dark) => `<div class="sw"><div class="chip" style="background:${hex}"></div><div class="sl"><b>${name}</b><span class="en">HEX ${hex}</span><span class="en">RGB ${rgb}</span><span class="en">CMYK ${cmyk}</span></div></div>`;
const gpage = (n, title, enTitle, body) => `<section class="pg"><header><div><h2>${title}</h2><span class="en">${enTitle}</span></div><img src="${A('benefit-logo-header.png')}"></header><div class="bd">${body}</div><footer><span>بنفت للسفر والسياحة — دليل الهوية البصرية</span><span class="en">${String(n).padStart(2,'0')}</span></footer></section>`;
const guide = `<!doctype html><html dir="rtl">${base}<style>
@page{size:297mm 210mm;margin:0} .pg{width:297mm;height:210mm;position:relative;overflow:hidden;page-break-after:always;padding:16mm 18mm}
header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:.6mm solid var(--navy);padding-bottom:4mm;position:relative}
header:after{content:"";position:absolute;bottom:-1.8mm;right:0;width:40mm;height:.6mm;background:var(--gold)}
header h2{font-size:24pt;font-weight:800;line-height:1.1} header span{color:var(--gold);font-weight:700;font-size:9pt;letter-spacing:.8mm} header img{height:13mm}
footer{position:absolute;bottom:9mm;left:18mm;right:18mm;display:flex;justify-content:space-between;font-size:8pt;font-weight:600;border-top:.2mm solid var(--gold);padding-top:2mm}
.bd{padding-top:10mm;height:150mm} p{font-size:11pt;line-height:1.9} h3{font-size:13pt;font-weight:800;margin-bottom:2mm} .gold{color:var(--gold)}
.cover{background:var(--navy);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;padding:0}
.cover img{width:110mm} .cover h1{font-size:30pt;margin-top:10mm;font-weight:800} .cover .en{color:var(--gold);letter-spacing:1.6mm;font-weight:700;font-size:11pt;margin-top:2mm}
.cover .bar{position:absolute;bottom:0;left:0;right:0;height:5mm;background:var(--gold)} .cover .wm{position:absolute;left:-40mm;top:-30mm;width:170mm;opacity:.06}
.grid{display:grid;gap:7mm} .g2{grid-template-columns:1fr 1fr} .g3{grid-template-columns:1fr 1fr 1fr} .g4{grid-template-columns:repeat(4,1fr)}
.box{border:.25mm solid #d9dee5;border-radius:2mm;display:flex;align-items:center;justify-content:center;padding:6mm;position:relative}
.box.dk{background:var(--navy);border-color:var(--navy)} .cap{font-size:9pt;font-weight:700;margin-top:2mm;text-align:center}
.sw{display:flex;gap:6mm;align-items:stretch} .chip{width:62mm;height:62mm;border-radius:2mm}
.sl{display:flex;flex-direction:column;justify-content:center;gap:2mm;font-size:11pt} .sl b{font-size:16pt} .sl span{font-size:10pt;font-weight:600}
.ty{border:.25mm solid #d9dee5;border-radius:2mm;padding:8mm} .ty .s{font-size:44pt;font-weight:800;line-height:1.2} .ty .m{font-size:12pt;margin-top:3mm;line-height:1.8}
.do li{font-size:11pt;line-height:2;margin-right:5mm}
.mock{display:flex;align-items:center;justify-content:center;background:#eef1f5;border-radius:2mm;height:66mm;padding:6mm} .mock img{max-width:100%;max-height:100%;box-shadow:0 1.5mm 4mm rgba(11,42,74,.25)}
</style><body>
<section class="pg cover"><img class="wm" src="${A('benefit-icon-white.png')}"><img src="${A('benefit-logo-stacked-white.png')}"><h1>دليل الهوية البصرية</h1><div class="en">BRAND IDENTITY GUIDELINES</div><div class="bar"></div></section>
${gpage(2,'فكرة الشعار','LOGO CONCEPT',`<div class="grid g2" style="align-items:center"><div class="box" style="height:130mm"><img src="${A('benefit-icon.png')}" style="height:110mm"></div>
<div><h3>حرف <span class="gold">B</span> ومسار الرحلة</h3><p>يقوم الشعار على الحرف الأول من اسم <b>بنفت (Benefit)</b> مرسوماً بخطوط هندسية متينة تعبّر عن الثقة والاستقرار، يعبره مسار طيران ذهبي ينتهي بطائرة في وضع الإقلاع؛ في إشارة إلى الانطلاق والنمو والرحلة نحو الوجهة.</p><br>
<p><b>الكحلي</b> لون الأفق والسماء ليلاً، يرمز إلى الاحترافية والأمان.<br><b class="gold">الذهبي</b> يرمز إلى القيمة والفخامة وجودة الخدمة.</p><br>
<p>الفراغ الفاصل بين المسار والحرف جزء من التصميم ويجب الحفاظ عليه في جميع الاستخدامات.</p></div></div>`)}
${gpage(3,'صيغ الشعار','LOGO VERSIONS',`<div class="grid g2"><div><div class="box" style="height:58mm"><img src="${A('benefit-logo-horizontal.png')}" style="height:42mm"></div><div class="cap">الشعار الأفقي — الاستخدام الرئيسي</div></div>
<div><div class="box dk" style="height:58mm"><img src="${A('benefit-logo-horizontal-white.png')}" style="height:42mm"></div><div class="cap">الشعار الأفقي — على الخلفيات الداكنة</div></div>
<div><div class="box" style="height:58mm"><img src="${A('benefit-logo-stacked.png')}" style="height:50mm"></div><div class="cap">الشعار العمودي</div></div>
<div class="grid g2" style="gap:5mm"><div><div class="box" style="height:58mm"><img src="${A('benefit-icon.png')}" style="height:44mm"></div><div class="cap">الرمز منفرداً</div></div><div><div class="box dk" style="height:58mm"><img src="${A('benefit-icon-white.png')}" style="height:44mm"></div><div class="cap">الرمز على الكحلي</div></div></div></div>`)}
${gpage(4,'الألوان','BRAND COLOURS',`<div class="grid g2" style="margin-top:6mm">${sw('الكحلي — Benefit Navy', NAVY, '11 · 42 · 74', '85 · 43 · 0 · 71')}${sw('الذهبي — Benefit Gold', GOLD, '201 · 161 · 74', '0 · 20 · 63 · 21')}</div>
<p style="margin-top:12mm">الهوية مبنية على <b>لونين فقط</b>. يُستخدم الأبيض كمساحة خلفية. لا تُضاف ألوان أخرى إلى الشعار، ولا يوضع الشعار الملوّن على خلفيات مزدحمة. قيم <span class="en">CMYK</span> تقريبية؛ يُنصح بأخذ بروفة لونية من المطبعة قبل الطباعة النهائية.</p>`)}
${gpage(5,'الخطوط','TYPOGRAPHY',`<div class="grid g2"><div class="ty"><div class="s">بنفت للسفر</div><div class="m"><b class="en">Rubik</b> — الخط الموحّد للهوية بالعربية والإنجليزية: زوايا منحنية ناعمة، غير حادة، وواضح في الطباعة والشاشات.<br>الأوزان: <span class="en">Regular · Medium · SemiBold · Bold · ExtraBold</span></div></div>
<div class="ty" dir="ltr"><div class="s en">BENEFIT</div><div class="m en"><b>Rubik</b> — one family for Arabic &amp; Latin: softly rounded corners, friendly yet professional.<br>Weights: Regular · Medium · SemiBold · Bold · ExtraBold</div></div></div>
<p style="margin-top:8mm">الخط مُضمَّن داخل قالب <b>Word</b>، ومتاح مجاناً من <span class="en">Google Fonts</span>؛ يُنصح بتثبيته على أجهزة الموظفين لضمان التطابق التام.</p>`)}
${gpage(6,'قواعد الاستخدام','USAGE RULES',`<div class="grid g2"><div><h3>مساحة الأمان والحد الأدنى</h3><p>تُترك حول الشعار مساحة فارغة لا تقل عن ارتفاع الجزء العلوي من حرف <span class="en">B</span> من كل الجهات.<br>أقل عرض للشعار الأفقي: <b class="en">35mm</b> طباعةً / <b class="en">140px</b> شاشةً.<br>أقل عرض للرمز منفرداً: <b class="en">10mm</b> / <b class="en">32px</b>.</p></div>
<div><h3>ممنوعات</h3><ul class="do"><li>تغيير ألوان الشعار أو إضافة ألوان جديدة.</li><li>تمديد الشعار أو ضغطه أو تدويره.</li><li>إضافة ظلال أو تدرجات أو حدود.</li><li>إلغاء الفراغ بين مسار الطائرة والحرف.</li><li>وضع الشعار الملوّن على صور أو خلفيات مزدحمة.</li><li>إعادة كتابة الاسم بخط مختلف.</li></ul></div></div>`)}
${gpage(7,'الختم الرسمي','COMPANY STAMP',`<div class="grid g3" style="align-items:center"><div><div class="box" style="height:110mm"><img src="${A('benefit-stamp-navy.png')}" style="height:96mm"></div><div class="cap">نسخة الحبر الواحد — للختم المطاطي / الذاتي التحبير</div></div>
<div><div class="box" style="height:110mm"><img src="${A('benefit-stamp-brand.png')}" style="height:96mm"></div><div class="cap">النسخة الرقمية بلوني الهوية</div></div>
<div><p>قطر الختم المقترح: <b class="en">40–45mm</b>.<br>لون الحبر: الكحلي أو الأزرق الداكن.<br><br>يتضمن الختم: اسم الشركة بالعربية والإنجليزية، الرمز، رقم السجل التجاري <b class="en">${INFO.cr}</b>، والمدينة.<br><br>يُسلَّم ملف <span class="en">SVG</span> لمحل الأختام.</p></div></div>`)}
${gpage(8,'القرطاسية','STATIONERY',`<div class="grid g3"><div><div class="mock"><img src="${A('letterhead-preview.png')}"></div><div class="cap">الورق الرسمي — قالب Word</div></div>
<div><div class="mock" style="flex-direction:column;gap:4mm"><img src="${A('card-front.png')}" style="max-height:27mm"><img src="${A('card-back.png')}" style="max-height:27mm"></div><div class="cap">بطاقة العمل 90×55 مم</div></div>
<div><div class="mock"><img src="${A('envelope.png')}"></div><div class="cap">الظرف DL — 220×110 مم</div></div></div>
<div class="grid g3" style="margin-top:7mm"><div><div class="mock" style="height:52mm"><img src="${A('social-cover.png')}"></div><div class="cap">غلاف وسائل التواصل</div></div>
<div><div class="mock" style="height:52mm"><img src="${A('social-avatar.png')}"></div><div class="cap">الصورة الشخصية للحسابات</div></div>
<div><div class="mock" style="height:52mm"><img src="${A('social-post.png')}"></div><div class="cap">قالب منشور</div></div></div>`)}
${gpage(9,'بيانات الشركة','COMPANY DETAILS',`<div class="grid g2" style="align-items:center"><div style="font-size:14pt;line-height:2.4">
<div><b>الاسم:</b> بنفت للسفر والسياحة</div><div><b class="gold">Name:</b> <span class="en">Benefit Travel &amp; Tourism</span></div>
<div><b>الهاتف:</b> <span class="en ltr">${INFO.phoneIntl}</span> &nbsp;|&nbsp; <span class="en ltr">${INFO.phoneLocal}</span></div><div><b>العنوان:</b> ${INFO.addrAr}</div><div><b>السجل التجاري:</b> <span class="en">${INFO.cr}</span></div></div>
<div class="box" style="height:110mm"><img src="${A('benefit-stamp-brand.png')}" style="height:90mm"></div></div>`)}
</body></html>`;

(async () => {
  const pages = { card, envelope: env, 'social-avatar': avatar, 'social-cover': cover, 'social-post': post, 'email-signature': sigPage, guide };
  for (const [n, h] of Object.entries(pages)) fs.writeFileSync(path.join(H, n + '.html'), h);
  fs.writeFileSync(path.join(O, 'email-signature.html'), `<!doctype html><meta charset="utf-8"><body>${sig}</body>`);
  const b = await chromium.launch(); const p = await b.newPage({ deviceScaleFactor: 3 });
  const go = async n => { await p.goto('file://' + path.join(H, n + '.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200); };
  // card
  await go('card'); await p.pdf({ path: path.join(O, 'business-card.pdf'), width: '90mm', height: '55mm', printBackground: true });
  await p.setViewportSize({ width: 400, height: 500 });
  const pg = await p.$$('.pg'); await pg[0].screenshot({ path: path.join(D, 'assets/card-front.png') }); await pg[1].screenshot({ path: path.join(D, 'assets/card-back.png') });
  // envelope
  await go('envelope'); await p.pdf({ path: path.join(O, 'envelope-DL.pdf'), width: '220mm', height: '110mm', printBackground: true });
  await p.setViewportSize({ width: 900, height: 500 }); await (await p.$('.pg')).screenshot({ path: path.join(D, 'assets/envelope.png') });
  for (const [n, w, h] of [['social-avatar', 1080, 1080], ['social-cover', 1640, 624], ['social-post', 1080, 1080]]) {
    await p.setViewportSize({ width: w, height: h }); await go(n); await p.screenshot({ path: path.join(D, 'assets', n + '.png') });
  }
  await p.setViewportSize({ width: 700, height: 200 }); await go('email-signature'); await (await p.$('table')).screenshot({ path: path.join(O, 'email-signature-preview.png') });
  if (process.argv[2] === 'guide') { await go('guide'); await p.pdf({ path: path.join(O, 'Benefit-Brand-Guidelines.pdf'), width: '297mm', height: '210mm', printBackground: true }); }
  await b.close();
})();
