const fs = require('fs');
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ShadingType, VerticalAlign, PageNumber, TableLayoutType } = d;
const NAVY = '0B2A4A', GOLD = 'C9A14A', WHITE = 'FFFFFF';
const AR = { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial', eastAsia: 'Arial' };
const LOGO = fs.readFileSync(process.argv[2]);
const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };
const W = 9906; // A4 content width with 1000 DXA side margins

const r = (text, o = {}) => new TextRun({ text, font: AR, rightToLeft: true, color: NAVY, size: 20, ...o });
const en = (text, o = {}) => new TextRun({ text, font: AR, color: NAVY, size: 18, ...o });
const P = (children, o = {}) => new Paragraph({ bidirectional: true, alignment: AlignmentType.START, spacing: { after: 0, line: 264 }, children, ...o });

// ---------- HEADER ----------
const header = new Header({ children: [
  new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [5106, 4800], borders: noBorders,
    visuallyRightToLeft: true, layout: TableLayoutType.FIXED,
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 5106, type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [
        P([r('بنفيت للسفر والطيران', { bold: true, size: 32 })]),
        P([en('BENEFIT TRAVEL & AVIATION CO.', { size: 16, bold: true, characterSpacing: 30, color: GOLD })], { bidirectional: false, alignment: AlignmentType.RIGHT, spacing: { before: 80, after: 60 } }),
        P([r('سجل تجاري: ', { size: 16, bold: true }), en('1176591', { size: 16 }),
           r('   |   ', { size: 16, color: GOLD }),
           r('الخرطوم – العمارات، السودان', { size: 16 })]),
      ]}),
      new TableCell({ width: { size: 4800, type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [
        new Paragraph({ bidirectional: true, alignment: AlignmentType.END, children: [ new ImageRun({ type: 'png', data: LOGO, transformation: { width: 230, height: 61 },
          altText: { title: 'Benefit logo', description: 'Benefit Travel & Aviation logo', name: 'logo' } }) ] }),
      ]}),
    ]})],
  }),
  // double rule: thick navy + thin gold
  new Paragraph({ spacing: { before: 100, after: 0, line: 40, lineRule: 'exact' }, border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: NAVY, space: 0 } }, children: [] }),
  new Paragraph({ spacing: { before: 0, after: 0, line: 60, lineRule: 'exact' }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 2 } }, children: [] }),
]});

// ---------- FOOTER ----------
const fcol = (label, lines, w) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: noBorders,
  margins: { top: 40, bottom: 40, left: 80, right: 80 },
  children: [ P([r(label, { bold: true, size: 15, color: GOLD })], { alignment: AlignmentType.CENTER }),
    ...lines.map(l => P(Array.isArray(l) ? [r(l[0], { size: 15, bold: true }), en(l[1], { size: 15 })] : [r(l, { size: 15 })], { alignment: AlignmentType.CENTER })) ] });
const fw = [3302, 3302, 3302];
const footer = new Footer({ children: [
  new Paragraph({ spacing: { before: 0, after: 0, line: 40, lineRule: 'exact' }, border: { top: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 1 } }, children: [] }),
  new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: fw, borders: noBorders, visuallyRightToLeft: true, layout: TableLayoutType.FIXED,
    rows: [ new TableRow({ children: [
      fcol('العنوان', ['الخرطوم – العمارات', ['', 'Al-Amarat, Khartoum, Sudan']], fw[0]),
      fcol('التواصل', [['هاتف: ', '+249 912 337 952'], ['', '0912337952']], fw[1]),
      fcol('السجل التجاري', [['', '1176591'], ['', 'C.R. No. 1176591']], fw[2]),
    ]})] }),
  new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { before: 100, after: 0 },
    shading: { type: ShadingType.CLEAR, fill: NAVY, color: 'auto' },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: NAVY, space: 3 }, bottom: { style: BorderStyle.SINGLE, size: 4, color: NAVY, space: 3 } },
    children: [ r('بنفيت للسفر والطيران', { color: WHITE, bold: true, size: 15 }), r('   •   ', { color: GOLD, size: 15 }),
      r('صفحة ', { color: WHITE, size: 15 }), new TextRun({ children: [PageNumber.CURRENT], color: WHITE, size: 15, font: AR, bold: true }),
      r(' من ', { color: WHITE, size: 15 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], color: WHITE, size: 15, font: AR, bold: true }),
      r('   •   ', { color: GOLD, size: 15 }), new TextRun({ text: 'BENEFIT TRAVEL & AVIATION', color: WHITE, size: 14, font: AR, characterSpacing: 20 }) ] }),
]});

// ---------- BODY (letter placeholders) ----------
const meta = (label, val) => P([r(label, { bold: true }), en(val, { size: 20 })], { spacing: { after: 40 } });
const body = [
  new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [4953, 4953], borders: noBorders, visuallyRightToLeft: true,
    rows: [ new TableRow({ children: [
      new TableCell({ width: { size: 4953, type: WidthType.DXA }, borders: noBorders, children: [ meta('الرقم: ', 'BT-2026-000'), meta('التاريخ: ', '2026/00/00') ] }),
      new TableCell({ width: { size: 4953, type: WidthType.DXA }, borders: noBorders, children: [ meta('المرفقات: ', '—') ] }),
    ]})] }),
  P([], { spacing: { after: 240 } }),
  P([r('السادة / [اسم الجهة]                                                                المحترمين', { bold: true, size: 24 })], { spacing: { after: 120 } }),
  P([r('السلام عليكم ورحمة الله وبركاته،', { size: 22 })], { spacing: { after: 200 } }),
  P([r('الموضوع: ', { bold: true, size: 24, color: GOLD }), r('[اكتب موضوع الخطاب هنا]', { bold: true, size: 24 })], { alignment: AlignmentType.CENTER, spacing: { after: 240 } }),
  P([r('[نص الخطاب: تتشرف شركة بنفيت للسفر والطيران بأن تتقدم إليكم بخالص التحية والتقدير، وتود أن تحيطكم علمًا بـ ... اكتب هنا محتوى الخطاب بشكل واضح ومختصر، مع ذكر التفاصيل والمواعيد والمرجعيات ذات العلاقة.]', { size: 22 })], { alignment: AlignmentType.BOTH, spacing: { after: 200, line: 360 } }),
  P([r('[فقرة إضافية عند الحاجة.]', { size: 22 })], { alignment: AlignmentType.BOTH, spacing: { after: 200, line: 360 } }),
  P([r('وتفضلوا بقبول فائق الاحترام والتقدير،', { size: 22 })], { spacing: { before: 120, after: 600 } }),
  P([r('[الاسم]', { bold: true, size: 22 })], { alignment: AlignmentType.END }),
  P([r('[المسمى الوظيفي]', { size: 20, color: GOLD })], { alignment: AlignmentType.END }),
  P([r('التوقيع: ...........................', { size: 20 })], { alignment: AlignmentType.END, spacing: { before: 200 } }),
];

const doc = new Document({
  creator: 'Benefit Travel & Aviation', title: 'Benefit Letterhead',
  styles: { default: { document: { run: { font: AR, size: 22, color: NAVY, rightToLeft: true }, paragraph: { bidirectional: true } } } },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 2150, bottom: 1900, left: 1000, right: 1000, header: 450, footer: 380 } } },
    headers: { default: header }, footers: { default: footer }, children: body }],
});
Packer.toBuffer(doc).then(b => fs.writeFileSync(process.argv[3], b));
